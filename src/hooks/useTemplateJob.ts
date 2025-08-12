import { useEffect, useRef, useState } from 'react';
import { getTemplateJobStatus, downloadTemplateResult } from '@/services/template.service';
import type { TemplateJobStatus } from '@/services/template.service';

export interface UseTemplateJobOptions {
  pollInitialIntervalMs?: number; // первые N сек опрашиваем чаще
  pollLaterIntervalMs?: number;
  initialPhaseSeconds?: number; // длительность «частой» фазы
  overallTimeoutMs?: number; // общий тайм-аут задачи
}

export interface UseTemplateJobState {
  status: TemplateJobStatus;
  progress?: number;
  error?: string;
  downloadDocx: () => Promise<void>;
  downloadPdf: () => Promise<void>;
}

const defaultOptions: UseTemplateJobOptions = {
  pollInitialIntervalMs: 2000,
  pollLaterIntervalMs: 5000,
  initialPhaseSeconds: 20,
  overallTimeoutMs: 5 * 60 * 1000,
};

export function useTemplateJob(jobId: string | null, opts?: UseTemplateJobOptions): UseTemplateJobState {
  const options = { ...defaultOptions, ...(opts ?? {}) };
  const [status, setStatus] = useState<TemplateJobStatus>('queued');
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setStatus('queued');
    setProgress(undefined);
    setError(undefined);
    startTimeRef.current = Date.now();

    const tick = async () => {
      if (!jobId) return;
      try {
        const res = await getTemplateJobStatus(jobId);
        setStatus(res.status);
        setProgress(res.progress);
        if (res.status === 'failed') {
          setError(res.error_message || 'Ошибка генерации');
          return; // остановим опрос
        }
        if (res.status === 'succeeded') {
          return; // остановим опрос, результат готов
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка статуса');
        return; // остановим опрос
      }

      const elapsedMs = Date.now() - (startTimeRef.current ?? Date.now());
      if (elapsedMs > (options.overallTimeoutMs ?? 0)) {
        setError('Превышен тайм-аут ожидания');
        return; // остановим опрос
      }

      const inInitialPhase = elapsedMs < (options.initialPhaseSeconds ?? 0) * 1000;
      const nextDelay = inInitialPhase ? (options.pollInitialIntervalMs ?? 2000) : (options.pollLaterIntervalMs ?? 5000);
      timerRef.current = window.setTimeout(tick, nextDelay);
    };

    tick();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [jobId]);

  const downloadDocx = async () => {
    if (!jobId) return;
    const { blob, filename } = await downloadTemplateResult(jobId, 'docx');
    // Проксируем скачивание — утилита уже вызывается в сервисе downloadBlob при необходимости
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!jobId) return;
    const { blob, filename } = await downloadTemplateResult(jobId, 'pdf');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return { status, progress, error, downloadDocx, downloadPdf };
}


