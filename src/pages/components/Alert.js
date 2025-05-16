import { useEffect } from "react";

const bgColors = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  warning: "bg-yellow-600 text-black",
};

export default function Alert({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      onClick={onClose}
      className={`
        fixed top-5 left-1/2 transform -translate-x-1/2
        px-6 py-3 rounded shadow-lg
        text-white font-semibold cursor-pointer
        select-none
        z-[9999]
        ${bgColors[type] || bgColors.info}
        max-w-md w-full
        text-center
      `}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
}
