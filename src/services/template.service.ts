// Сервис работы с генерацией документов (Template Service)
//
// ВАЖНО: здесь описаны фронтовые вызовы «ручек». Реальные эндпоинты
// реализует backend. Сейчас всё замокано для разработки UI.
//
// Архитектура API (асинхронная):
// 1) Ручка запуска генерации
//    Метод: POST /api/tpl/{code}/run
//    Headers: Authorization: Bearer {JWT_TOKEN}
//    Content-Type: multipart/form-data
//    Form fields:
//      - files[]: File (0..N)
//      - instruction?: string
//    Response: 202 Accepted { job_id: string }
//    Ошибки: 400 | 413 | 415 | 422 | 429 | 500
//
// 2) Ручка статуса задачи
//    Метод: GET /api/tpl/jobs/{job_id}/status
//    Response: { status: 'queued'|'processing'|'succeeded'|'failed', progress?: number, error_code?: string, error_message?: string }
//
// 3) Ручки скачивания результата (бинарём)
//    Вариант A (рекомендуемый): отдельные урлы по форматам
//      - GET /api/tpl/jobs/{job_id}/result/docx -> binary (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
//      - GET /api/tpl/jobs/{job_id}/result/pdf  -> binary (application/pdf)
//    Вариант B: GET /api/tpl/jobs/{job_id}/result -> JSON { download_urls: { docx: string, pdf: string } }
//
// В этом файле мы реализуем фронтовые вызовы и моки без base64.

export type TemplateJobStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

export interface RunTemplateParams {
  files: File[];
  instruction?: string;
}

export interface RunTemplateResponse {
  job_id: string;
}

export interface TemplateStatusResponse {
  status: TemplateJobStatus;
  progress?: number; // 0..1
  error_code?: string;
  error_message?: string;
}

// ===== Моки (in-memory) =====
// Храним состояние задач и подготовленные Blob-файлы результата
const mockJobs = new Map<string, {
  status: TemplateJobStatus;
  progress: number;
  // результат появится при succeeded
  result?: { docx: Blob; pdf: Blob; filenames: { docx: string; pdf: string } };
}>();

// Генерация псевдо-DOCX/PDF blob (пустышки). Для UI этого достаточно
const createMockDocx = (title: string) => new Blob([
  `Fake DOCX content for: ${title} (this is a mock file, replace with backend binary)`
], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

const createMockPdf = (title: string) => new Blob([
  `%PDF-1.4\n% Fake PDF for: ${title} (mock).\n`,
], { type: 'application/pdf' });

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Ручка запуска генерации документа (Ручка)
 * 
 * Пользователь: на странице плашки загружает файлы/вводит инструкции и жмёт «Сгенерировать документ»
 * Backend: POST /api/tpl/{code}/run (multipart/form-data)
 * Response: 202 { job_id }
 */
export const runTemplate = async (code: string, params: RunTemplateParams): Promise<RunTemplateResponse> => {
  // TODO: Реализация реального запроса
  // const form = new FormData();
  // params.files.forEach((f) => form.append('files[]', f));
  // if (params.instruction) form.append('instruction', params.instruction);
  // const response = await fetch(`/api/tpl/${code}/run`, { method: 'POST', body: form, headers: { Authorization: `Bearer ${storage.getToken()}` } });
  // if (response.status !== 202) throw new Error('Не удалось запустить генерацию');
  // return response.json();

  // Мок: создаём задачу, эмулируем прогресс и финальный результат
  // Используем параметры, чтобы не ругался линтер и чтобы имитировать нагрузку
  const inputsCount = (params.files?.length ?? 0) + (params.instruction ? 1 : 0);
  const jobId = `j_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${inputsCount}`;
  mockJobs.set(jobId, { status: 'queued', progress: 0 });

  // Эмулируем работу в фоне
  void (async () => {
    const job = mockJobs.get(jobId);
    if (!job) return;
    job.status = 'processing';
    job.progress = 0.05;
    for (let i = 0; i < 10; i += 1) {
      await delay(300);
      const current = mockJobs.get(jobId);
      if (!current || current.status === 'failed') return;
      current.progress = Math.min(0.95, (current.progress ?? 0) + 0.09);
    }
    // Успех — пробуем подложить реальные примеры, если есть в проекте
    let docx: Blob;
    let pdf: Blob;
    try {
      const sampleDocxUrl = new URL('../../sample_word_ai.docx', import.meta.url).href;
      const samplePdfUrl = new URL('../../sample_pdf_ai.pdf', import.meta.url).href;
      const [docxRes, pdfRes] = await Promise.all([
        fetch(sampleDocxUrl),
        fetch(samplePdfUrl),
      ]);
      if (docxRes.ok && pdfRes.ok) {
        [docx, pdf] = await Promise.all([docxRes.blob(), pdfRes.blob()]);
      } else {
        const title = code;
        docx = createMockDocx(title);
        pdf = createMockPdf(title);
      }
    } catch {
      const title = code;
      docx = createMockDocx(title);
      pdf = createMockPdf(title);
    }
    mockJobs.set(jobId, {
      status: 'succeeded',
      progress: 1,
      result: {
        docx,
        pdf,
        filenames: {
          docx: `${code}.docx`,
          pdf: `${code}.pdf`,
        },
      },
    });
  })();

  return { job_id: jobId };
};

/**
 * Ручка получения статуса (Ручка)
 * 
 * Backend: GET /api/tpl/jobs/{job_id}/status
 */
export const getTemplateJobStatus = async (jobId: string): Promise<TemplateStatusResponse> => {
  // TODO: Реализация реального запроса
  // const response = await fetch(`/api/tpl/jobs/${jobId}/status`, { headers: { Authorization: `Bearer ${storage.getToken()}` } });
  // return response.json();

  // Мок
  await delay(150);
  const job = mockJobs.get(jobId);
  if (!job) return { status: 'failed', error_code: 'NOT_FOUND', error_message: 'Job not found' };
  return { status: job.status, progress: job.progress };
};

/**
 * Ручка скачивания результата (Ручка)
 * 
 * В реальном API лучше иметь два эндпоинта: /result/docx и /result/pdf.
 * Здесь возвращаем Blob требуемого формата.
 */
export const downloadTemplateResult = async (
  jobId: string,
  format: 'docx' | 'pdf'
): Promise<{ blob: Blob; filename: string }> => {
  // TODO: Реальный запрос
  // const endpoint = `/api/tpl/jobs/${jobId}/result/${format}`;
  // const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${storage.getToken()}` } });
  // if (!response.ok) throw new Error('Не удалось скачать результат');
  // const blob = await response.blob();
  // const disposition = response.headers.get('Content-Disposition');
  // const filename = disposition ? parseFilename(disposition) : `document.${format}`;
  // return { blob, filename };

  // Мок
  await delay(150);
  const job = mockJobs.get(jobId);
  if (!job || job.status !== 'succeeded' || !job.result) {
    throw new Error('Результат ещё не готов');
  }
  const { result } = job;
  return format === 'docx'
    ? { blob: result.docx, filename: result.filenames.docx }
    : { blob: result.pdf, filename: result.filenames.pdf };
};

// Вспомогательная утилита для триггера скачивания файла в браузере
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};


