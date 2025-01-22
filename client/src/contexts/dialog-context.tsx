"use client";

import React, {
  ComponentClass,
  createContext,
  createElement,
  FC,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ToastProps } from "@/components/ui/toast";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ModalProps {
  size?: "default" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const buttonVariants = cva("max-h-[90vw]", {
  variants: {
    size: {
      default: "",
      sm: "min-w-[320px] max-w-[320px]",
      md: "min-w-[490px] max-w-[490px]",
      lg: "min-w-[700px] max-w-[800px]",
      xl: "min-w-[900px] max-w-[1000px]",
      "2xl": "min-w-[1100px] max-w-[1200px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface DialogProps<Params extends object = object>
  extends Pick<ModalProps, "size"> {
  title?: string;
  message?: string | ReactNode;
  params?: Params;
  handleAccept?: (data?: FieldValues) => Promise<void>;
  customComponent?: FunctionComponent<Params> | ComponentClass<Params>;
}

type ToastOptions = Omit<ToastProps, "id"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export interface DialogContextProps {
  open: (config: Omit<DialogProps, "customComponent" | "params">) => void;
  openConfirm: (config: Omit<DialogProps, "customComponent">) => void;
  openDeleteConfirm: (config: Pick<DialogProps, "handleAccept">) => void;
  openCustomComponent: <Props extends object = object>(
    component: FunctionComponent<Props> | FC<Props>,
    config: Omit<DialogProps<Props>, "message" | "customComponent">
  ) => void;
  close: () => void;
  closeAndEmit: (toastOptions?: ToastOptions, data?: FieldValues) => void;
}

export const DialogContext = createContext<DialogContextProps>(
  {} as DialogContextProps
);

export function DialogContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [modalProps, setModalProps] = useState<
    Omit<DialogProps, "customComponent"> & { custom?: boolean }
  >();
  const [customComponent, setCustomComponent] = useState<ReactNode | null>(
    null
  );
  const [modalSize, setModalSize] = useState<ModalProps["size"]>("default");
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleOpen = (
    config: Omit<DialogProps, "customComponent" | "params">
  ) => {
    setModalProps(config);
    setIsOpen(true);
  };

  const handleOpenDeleteConfirm = (config: {
    handleAccept?: (data?: FieldValues) => Promise<void>;
  }) => {
    setModalProps({
      message: "Tem a certeza que deseja excluir?",
      title: "Confirma Deletar",
      handleAccept: config.handleAccept,
    });
    setModalSize("default");
    setIsOpen(true);
  };

  const handleOpenCustomComponent = <Props extends object = object>(
    component: FunctionComponent<Props>,
    config: Omit<DialogProps<Props>, "message" | "customComponent">
  ) => {
    setModalProps({
      ...config,
      custom: true,
      params: config.params as object,
      title: config.title,
      handleAccept: config.handleAccept,
    });

    setModalSize(config?.size ?? "md");
    setCustomComponent(createElement(component, config.params));
    setIsOpen(true);
  };

  const handleOpenConfirm = <Props extends object = object>(
    config: Omit<DialogProps<Props>, "customComponent">
  ) => {
    setModalProps({
      ...config,
    });
    setModalSize(config.size ?? "default");
    setIsOpen(true);
  };

  const handleClose = async (
    toastOptions?: ToastOptions,
    data?: FieldValues
  ) => {
    try {
      setSendingRequest(true);
      await modalProps?.handleAccept?.(data);
      setIsOpen(false);
      setModalProps({} as DialogProps);
      setCustomComponent(null);
      if (toastOptions) toast(toastOptions);
      setSendingRequest(false);
    } catch {}
  };

  const close = () => {
    setIsOpen(false);
    setModalProps({} as DialogProps);
    setCustomComponent(null);
  };

  return (
    <DialogContext.Provider
      value={{
        open: handleOpen,
        openConfirm: handleOpenConfirm,
        openDeleteConfirm: handleOpenDeleteConfirm,
        openCustomComponent: handleOpenCustomComponent,
        close: close,
        closeAndEmit: handleClose,
      }}
    >
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          data-size={modalSize}
          className={cn(buttonVariants({ size: modalSize }))}
        >
          {modalProps?.custom ? (
            customComponent
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{modalProps?.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  {modalProps?.message}
                </DialogDescription>
              </DialogHeader>
              <div>{modalProps?.message}</div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleClose()} disabled={sendingRequest}>
                  Confirmar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const dialogContext = useContext(DialogContext);

  if (!dialogContext) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return dialogContext;
}
