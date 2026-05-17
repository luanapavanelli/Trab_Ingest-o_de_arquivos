import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css' // Ou './styles/theme.css' se você copiar os nossos estilos
import App from './app/App' // O caminho para onde você guardou o App.tsx que fizemos

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)