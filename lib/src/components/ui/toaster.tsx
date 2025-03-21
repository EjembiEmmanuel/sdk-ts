"use client";

import { useToast } from "@lib/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="h-fit border-[#1C182B] bg-[#b5abdf] backdrop-blur-lg"
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-[#1C182B]">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-[#1C182B]">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
