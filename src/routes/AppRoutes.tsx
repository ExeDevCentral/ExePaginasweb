import React, { useEffect, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import App from '../App'
import StorePage from '../components/store/StorePage'
import Login from '../pages/Login'
import QuoteBuilder from '../components/QuoteBuilder/QuoteBuilder'
import Dashboard from '../pages/Dashboard'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'
import NotFound from '../pages/NotFound'
import AuthCallback from '../pages/AuthCallback'
import { AuthGuard } from '../core/auth/AuthGuard'
import { resetScrollToTop } from '../components/shared/ScrollProvider'
import CanvasPreview from '../__canvas_preview__'

const pageTransition = {
  initial: { opacity: 0.7, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0.7, y: -4 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return
      }
    }
    resetScrollToTop()
  }, [pathname, hash])
  return null
}

function AnimatedPage({ children }: { readonly children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function AppRoutes() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <App />
                </AnimatedPage>
              }
            />
            <Route
              path="/tienda"
              element={
                <AnimatedPage>
                  <StorePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/cotizador"
              element={
                <AnimatedPage>
                  <QuoteBuilder />
                </AnimatedPage>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <AnimatedPage>
                    <Dashboard />
                  </AnimatedPage>
                </AuthGuard>
              }
            />
            <Route
              path="/auth/callback"
              element={
                <AnimatedPage>
                  <AuthCallback />
                </AnimatedPage>
              }
            />
            <Route
              path="/privacidad"
              element={
                <AnimatedPage>
                  <PrivacyPolicy />
                </AnimatedPage>
              }
            />
            <Route
              path="/terminos"
              element={
                <AnimatedPage>
                  <TermsOfService />
                </AnimatedPage>
              }
            />
            <Route
              path="*"
              element={
                <AnimatedPage>
                  <NotFound />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <CanvasPreview />
    </>
  )
}
