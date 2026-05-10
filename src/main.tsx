import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import StorePage from './components/StorePage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tienda" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </HelmetProvider>
  </React.StrictMode>,
)
