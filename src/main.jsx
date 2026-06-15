import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AudienceProvider } from './context/AudienceContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AudienceProvider>
        <App />
      </AudienceProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
