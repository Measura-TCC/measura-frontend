import { toast as toastify } from "react-toastify";

interface ToastOptions {
  message: string;
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const useToast = () => {
  const success = ({
    message,
    duration = 3000,
    position = "top-right",
  }: ToastOptions) => {
    toastify.success(message, {
      position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const error = ({
    message,
    duration = 5000,
    position = "top-right",
  }: ToastOptions) => {
    toastify.error(message, {
      position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const warning = ({
    message,
    duration = 4000,
    position = "top-right",
  }: ToastOptions) => {
    toastify.warning(message, {
      position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const info = ({
    message,
    duration = 3000,
    position = "top-right",
  }: ToastOptions) => {
    toastify.info(message, {
      position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return {
    success,
    error,
    warning,
    info,
  };
};
