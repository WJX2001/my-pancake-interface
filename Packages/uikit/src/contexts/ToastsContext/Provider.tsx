import useIsWindowVisible from '@/Packages/hooks/useIsWindowVisible';
import {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { ExternalToast, ToastT, toast as sonnerToast } from 'sonner';
import { ToastContextApi } from './types';

export const ToastsContext = createContext<ToastContextApi | undefined>(
  undefined,
);

const toasts = new Map<
  string | number,
  { component: ReactElement; externalData?: ExternalToast }
>();

export const ToastsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isWindowVisible = useIsWindowVisible();

  const deleteCallback = useCallback((toast: ToastT) => {
    toasts.delete(toast.id);
  }, []);

  useEffect(() => {
    if (isWindowVisible) {
      toasts.forEach((data, key) => {
        if (data.externalData?.duration === Infinity) {
          sonnerToast.custom(() => data.component, {
            ...data.externalData,
            id: key,
            duration: 6000,
            onDismiss: deleteCallback,
            onAutoClose: deleteCallback,
          });
        }
      });
    }
  }, [isWindowVisible, deleteCallback]);

  const clear = useCallback(() => {
    toasts.clear();
    sonnerToast.dismiss();
  }, []);
  const remove = useCallback((id: string | number) => {
    toasts.delete(id);
    sonnerToast.dismiss(id);
  }, []);

  const providerValue = useMemo(() => {
    return { clear, remove };
  }, [clear, remove]);

  return (
    <ToastsContext.Provider value={providerValue}>
      {children}
    </ToastsContext.Provider>
  );
};
