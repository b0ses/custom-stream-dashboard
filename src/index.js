import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './js/App';
import registerServiceWorker from './js/registerServiceWorker';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
registerServiceWorker();