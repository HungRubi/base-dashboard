import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster, TooltipProvider } from '@medusajs/ui'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { NavProvider } from './context/NavContext'
import './index.css'
import App from './App.tsx'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <NavProvider>
        <BrowserRouter>
          <TooltipProvider>
            <App />
            <Toaster />
          </TooltipProvider>
        </BrowserRouter>
      </NavProvider>
    </Provider>
  </StrictMode>,
)
