interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4 relative">
      {error}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
};
