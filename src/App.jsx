import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import useBookmarks from './hooks/useBookmarks';
import Header from './components/Header/Header';
import Loading from './components/Loading/Loading';
import './App.css';

// Lazy load routes for code splitting
const Home = lazy(() => import('./pages/Home'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));

function AnimatedRoutes({ bookmarkHook }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<div className="page-wrapper"><Loading /></div>}>
              <Home bookmarkHook={bookmarkHook} />
            </Suspense>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <Suspense fallback={<div className="page-wrapper"><Loading /></div>}>
              <RecipeDetails bookmarkHook={bookmarkHook} />
            </Suspense>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <Suspense fallback={<div className="page-wrapper"><Loading /></div>}>
              <Bookmarks bookmarkHook={bookmarkHook} />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div className="page-wrapper"><Loading /></div>}>
              <Home bookmarkHook={bookmarkHook} />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const bookmarkHook = useBookmarks();

  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#ffffff',
            color: '#1e293b',
            fontWeight: '500',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      <Header bookmarkCount={bookmarkHook.bookmarks.length} />
      <AnimatedRoutes bookmarkHook={bookmarkHook} />
    </BrowserRouter>
  );
}

export default App;
