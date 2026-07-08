import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { LocaleProvider } from './i18n/index.jsx';
import './styles/global.css';

/**
 * initialLocale: in AEM you'd derive it from the language copy path (e.g. /es or /en)
 * or from Accept-Language. Here we start in 'es'.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider initialLocale="es">
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
