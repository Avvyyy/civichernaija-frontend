export type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

let toastId = 0;

export const useToast = () => {
  const toasts = useState<ToastItem[]>('app-toasts', () => []);

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    globalThis.setTimeout(() => removeToast(id), 3500);
    return id;
  };

  const success = (message: string) => addToast(message, 'success');
  const error = (message: string) => addToast(message, 'error');
  const info = (message: string) => addToast(message, 'info');

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  };
};
