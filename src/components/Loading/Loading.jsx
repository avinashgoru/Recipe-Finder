/**
 * Loading Component
 *
 * WHY IT EXISTS: Users need visual feedback that something is happening.
 * Without a loading indicator, users think the app is broken and click again.
 *
 * We use a CSS-only skeleton-style spinner — no library needed.
 * Skeleton loading (bonus feature) would show ghost card shapes instead.
 *
 * ACCESSIBILITY: aria-live="polite" tells screen readers to announce
 * the loading message without interrupting what they're reading.
 */

import './Loading.css';

function Loading({ message = 'Finding delicious recipes...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__spinner-wrapper">
        {/* Outer ring */}
        <div className="loading__ring loading__ring--outer" />
        {/* Inner ring — spins opposite direction */}
        <div className="loading__ring loading__ring--inner" />
        {/* Center icon */}
        <span className="loading__icon" aria-hidden="true">🍽️</span>
      </div>
      <p className="loading__text">{message}</p>
      <p className="loading__subtext">Fetching from TheMealDB API...</p>
    </div>
  );
}

export default Loading;
