import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//
import App from './App';
import React from 'react';

// ----------------------------------------------------------------------

const root = document.getElementById('root');
ReactDOM.render(
<React.StrictMode>
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
</React.StrictMode>,
    root
);
