import useIsWindowVisible from '@/Packages/hooks/useIsWindowVisible';
import { ReactElement, useCallback, useEffect } from 'react';
import { ExternalToast, ToastT, toast as sonnerToast } from 'sonner';

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
};
