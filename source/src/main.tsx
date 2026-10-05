import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startScrollFade } from '@/lib/scrollFade'

// Fonts: Fraunces, Public Sans and Noto Nastaliq Urdu are self-hosted woff2 files declared in
// src/fonts/fontface.css and imported by index.css, so they load with the stylesheet, not the script.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// D-151: fade the right edge of a scroller only while it actually overflows.
startScrollFade()
