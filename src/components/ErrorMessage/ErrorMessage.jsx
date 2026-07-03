/**
 * ErrorMessage Component
 *
 * WHY IT EXISTS: Network requests fail. APIs go down. Users type nonsense.
 * A professional app never shows a blank screen or a cryptic console error —
 * it shows a friendly, clear error message with guidance.
 *
 * PROP: message — the specific error text from the hook
 *
 * ACCESSIBILITY: role="alert" makes screen readers announce this immediately.
 */

import './ErrorMessage.css';

function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <div className="error-message__icon" aria-hidden="true">⚠️</div>
      <h3 className="error-message__title">Oops! Something went wrong</h3>
      <p className="error-message__text">{message}</p>
      <p className="error-message__hint">
        💡 Check your internet connection or try again in a moment.
      </p>
    </div>
  );
}

export default ErrorMessage;
