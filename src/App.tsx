import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'

// Legal pages are light and rarely visited → load them on demand.
const Legal = lazy(() => import('./pages/Legal'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Legal slug="terms" />} />
          <Route path="/privacy" element={<Legal slug="privacy" />} />
          {/* unknown paths → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
