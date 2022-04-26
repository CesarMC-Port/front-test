import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './rutas/App';
import HttpsRedirect from 'react-https-redirect';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HttpsRedirect>
    <App />
  </HttpsRedirect>
);

reportWebVitals();
