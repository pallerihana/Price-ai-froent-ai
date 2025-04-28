import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CompareProvider } from './assets/pages/CompareContext.jsx'
import { BookingProvider } from './assets/pages/BookingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <BookingProvider>
      <CompareProvider>
        <App />
      </CompareProvider>
      </BookingProvider>
    </BrowserRouter>
  </StrictMode>
)
