import { useState, useEffect } from "react";

const ErrorDisplay = ({ message, onDismiss }: any) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="error-display">
      <div className="error-content">
        <span className="error-message">{message}</span>
        <div className="error-progress"></div>
      </div>
    </div>
  );
};

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const showError = (message: any) => {
    setErrorMessage(message);
  };
  const dismissError = () => {
    setErrorMessage(null);
  };

  return {
    ErrorDisplay: () => (
      <ErrorDisplay message={errorMessage} onDismiss={dismissError} />
    ),
    showError,
    dismissError,
  };
};

export default ErrorDisplay;
