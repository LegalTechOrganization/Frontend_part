import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, FileText, Image, Trash2, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { runTemplate } from '@/services/template.service';
import { useTemplateJob } from '@/hooks/useTemplateJob';
import { useToast } from '@/components/Toast';

// Типы для файлов
interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  file: File;
}

// Маппинг ID документов к их названиям (И.п.)
const documentTitles: Record<string, string> = {
  'pretension': 'Досудебная претензия по договору поставки',
  'lawsuit': 'Исковое заявление о взыскании задолженности',
  'employment-contract': 'Трудовой договор',
  'supply-contract': 'Договор поставки',
  'response': 'Отзыв на исковое заявление',
  'protocol': 'Протокол собрания участников ООО',
  'consumer-claim': 'Претензия по защите прав потребителей',
  'service-contract': 'Договор оказания услуг',
  'dismissal-order': 'Приказ об увольнении',
  'share-sale': 'Договор купли-продажи доли в ООО',
  'refund-claim': 'Претензия по возврату денежных средств',
  'additional-agreement': 'Дополнительное соглашение к договору',
  'extension-request': 'Ходатайство о продлении срока',
  'lease-agreement': 'Договор аренды нежилого помещения',
  'execution-request': 'Заявление о выдаче исполнительного листа'
};

// Маппинг фраз в В.п. (для корректного: «Сгенерируй мне …»)
const documentAccusative: Record<string, string> = {
  'pretension': 'досудебную претензию по договору поставки',
  'lawsuit': 'исковое заявление о взыскании задолженности',
  'employment-contract': 'трудовой договор',
  'supply-contract': 'договор поставки',
  'response': 'отзыв на исковое заявление',
  'protocol': 'протокол собрания участников ООО',
  'consumer-claim': 'претензию по защите прав потребителей',
  'service-contract': 'договор оказания услуг',
  'dismissal-order': 'приказ об увольнении',
  'share-sale': 'договор купли-продажи доли в ООО',
  'refund-claim': 'претензию по возврату денежных средств',
  'additional-agreement': 'дополнительное соглашение к договору',
  'extension-request': 'ходатайство о продлении срока',
  'lease-agreement': 'договор аренды нежилого помещения',
  'execution-request': 'заявление о выдаче исполнительного листа'
};

const DocumentEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [instructions, setInstructions] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const { status, progress, error, downloadDocx, downloadPdf } = useTemplateJob(jobId);
  const { showToast } = useToast();

  const documentTitle = documentId ? documentTitles[documentId] || 'Неизвестный документ' : 'Документ';

  // Обработка загрузки файлов
  const handleFileUpload = useCallback((uploadedFiles: FileList | File[]) => {
    const fileArray = Array.from(uploadedFiles);
    const validFiles = fileArray.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/heic',
        'image/heif',
        'text/plain'
      ];
      return validTypes.includes(file.type) || 
             file.name.toLowerCase().endsWith('.pdf') ||
             file.name.toLowerCase().endsWith('.doc') ||
             file.name.toLowerCase().endsWith('.docx') ||
             file.name.toLowerCase().endsWith('.txt');
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  // Drag & Drop обработчики
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // Удаление файла
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  // Очистка всех данных
  const handleClear = useCallback(() => {
    files.forEach(file => URL.revokeObjectURL(file.url));
    setFiles([]);
    setInstructions('');
    setJobId(null);
  }, [files]);

  // Генерация документа
  const handleGenerate = useCallback(async () => {
    if (!documentId) return;
    try {
      setIsGenerating(true);
      setJobId(null);
      const res = await runTemplate(documentId, { files: files.map(f => f.file), instruction: instructions || undefined });
      setJobId(res.job_id);
    } catch (e) {
      showToast({ variant: 'error', title: 'Не удалось запустить генерацию', description: e instanceof Error ? e.message : 'Попробуйте ещё раз' });
      setIsGenerating(false);
    }
  }, [documentId, files, instructions, showToast]);

  // Авто-снятие флага isGenerating, когда задача завершилась (успех/ошибка)
  useEffect(() => {
    if (!jobId) return;
    if (status === 'succeeded') {
      setIsGenerating(false);
    } else if (status === 'failed') {
      setIsGenerating(false);
      showToast({ variant: 'error', title: 'Генерация не удалась', description: error || 'Попробуйте позже' });
    }
  }, [jobId, status, error, showToast]);

  // Получение иконки для типа файла
  const getFileIcon = (type: string, name: string) => {
    if (type.startsWith('image/') || name.toLowerCase().match(/\.(png|jpg|jpeg|heic|heif)$/)) {
      return <Image size={20} className="text-blue-500" />;
    }
    return <FileText size={20} className="text-gold" />;
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Заголовок с кнопкой назад */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 bg-white border border-gold/20 rounded-2xl flex items-center justify-center hover:bg-gold/5 transition-colors"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        
        <div>
          <h1 className="text-3xl font-playfair font-semibold text-ink">{documentTitle}</h1>
          <p className="text-ink/60">Загрузите документы и дайте инструкции для генерации</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Область загрузки файлов */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag & Drop зона */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ${
              isDragOver
                ? 'border-gold bg-gold/5'
                : 'border-ink/20 hover:border-gold/50 hover:bg-gold/5'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={24} className="text-gold" />
              </div>
              
              <h3 className="text-xl font-playfair font-semibold text-ink mb-2">
                Загрузите файлы
              </h3>
              
              <p className="text-ink/60 mb-4">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic,.heif,.txt"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-sm text-ink/40">
                Поддерживаемые форматы: PDF, DOC, DOCX, PNG, JPG, JPEG, HEIC, HEIF, TXT
              </div>
            </div>
          </div>

          {/* Список загруженных файлов */}
          {files.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-ink/5">
              <h4 className="text-lg font-playfair font-semibold text-ink mb-4">
                Загруженные файлы ({files.length})
              </h4>
              
              <div className="space-y-3">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-ink/5 rounded-xl"
                  >
                    {getFileIcon(file.type, file.name)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink truncate">{file.name}</div>
                      <div className="text-sm text-ink/60">{formatFileSize(file.size)}</div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Панель инструкций и действий */}
        <div className="space-y-6">
          {/* Текстовые инструкции */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-ink/5">
            <h4 className="text-lg font-playfair font-semibold text-ink mb-4">
              Дополнительные инструкции
            </h4>
            
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Опишите особые требования к документу, укажите специфические детали или дайте дополнительные инструкции для ИИ..."
              className="w-full h-32 p-4 border border-ink/20 rounded-xl resize-none focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Кнопки действий */}
          <div className="space-y-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (files.length === 0 && !instructions.trim())}
              className="w-full bg-gold hover:bg-gold/90 text-paper py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating || (jobId && (status === 'queued' || status === 'processing')) ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                  {status === 'processing' && typeof progress === 'number'
                    ? `Обработка... ${(progress * 100).toFixed(0)}%`
                    : 'Генерирую документ...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Сгенерировать документ
                </div>
              )}
            </Button>

            {/* Блок скачивания результатов после успеха */}
            {jobId && status === 'succeeded' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={downloadDocx} className="w-full bg-ink text-white hover:bg-ink/90 py-3 rounded-xl shadow-lg">Скачать DOCX</Button>
                <Button onClick={downloadPdf} className="w-full bg-ink text-white hover:bg-ink/90 py-3 rounded-xl shadow-lg">Скачать PDF</Button>
              </div>
            )}
            
            <Button
              onClick={handleClear}
              disabled={files.length === 0 && !instructions.trim()}
              variant="outline"
              className="w-full border-2 border-ink/20 text-ink hover:bg-ink/5 py-4 text-lg font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <Trash2 size={20} />
                Стереть все
              </div>
            </Button>
          </div>

          {/* Информация */}
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-4 text-center">
            <p className="text-sm text-ink/70">
              Загрузите документы или дайте текстовые инструкции для генерации {documentTitle.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Подсказка про чат и интеграцию с агентом */}
      <div className="mt-6">
        <div className="bg-white border border-gold/20 rounded-3xl p-6 shadow-lg">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-ink/80">
              Вы можете сгенерировать этот документ прямо в модуле чатов. Просто попросите AI‑агента: <span className="font-semibold">“Сгенерируй мне {documentAccusative[documentId || ''] ?? 'документ'}”</span> — и он запустит эту плашку автоматически.
            </div>
            <button
              onClick={async () => {
                const { storage } = await import('@/utils/storage');
                const token = storage.getToken();
                if (!token) {
                  window.location.assign('/login');
                  return;
                }
                const CHAT_URL = (import.meta as any).env?.VITE_CHAT_URL ?? '/chat';
                window.location.assign(CHAT_URL);
              }}
              className="mt-5 inline-flex items-center gap-3 bg-gold text-white px-8 py-4 rounded-full shadow-xl hover:bg-gold/90 transition-all"
            >
              <MessageCircle size={20} />
              Перейти в Чаты
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentEditor;