import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted variable fonts (upright + italic for Fraunces; weight/optical axes).
import '@fontsource-variable/fraunces/index.css'
import '@fontsource-variable/fraunces/standard-italic.css'
import '@fontsource-variable/inter/index.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
