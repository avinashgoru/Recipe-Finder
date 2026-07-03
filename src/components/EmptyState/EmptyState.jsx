/**
 * EmptyState Component
 *
 * WHY IT EXISTS: "Empty states" are one of the most overlooked UI elements.
 * When there's nothing to show, a blank screen feels broken.
 * A good empty state guides the user on what to do next.
 *
 * This is a GENERIC, REUSABLE component — we pass different props
 * to make it serve different use cases:
 *   - Initial welcome state
 *   - No search results state
 *   - Empty bookmarks state
 *
 * REACT CONCEPT: Flexible, reusable components via props.
 * One component, three different appearances — that's the power of props.
 *
 * PROPS:
 * - emoji: big visual indicator
 * - title: primary message
 * - message: supporting explanation
 * - children: optional extra content (like a button)
 */

import './EmptyState.css';

function EmptyState({ emoji = '🍽️', title, message, children }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__emoji" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {/* children prop lets parents inject extra JSX (e.g. a button) */}
      {children && <div className="empty-state__action">{children}</div>}
    </div>
  );
}

export default EmptyState;
