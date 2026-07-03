/**
 * main.jsx — Application Entry Point
 *
 * WHY IT EXISTS: This is where React "mounts" onto the real HTML page.
 * It connects our React component tree (starting from <App />) to the
 * actual <div id="root"> element in public/index.html.
 *
 * React.StrictMode: A development tool that:
 * - Detects potential problems in your code
 * - Warns about deprecated APIs
 * - Intentionally double-invokes some functions to catch side effects
 * - ONLY runs in development, not in production
 *
 * BEGINNER MISTAKE: Editing main.jsx when it doesn't need to be changed.
 * Keep this file simple — it just mounts the app.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Find the <div id="root"> in index.html and mount React there
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
