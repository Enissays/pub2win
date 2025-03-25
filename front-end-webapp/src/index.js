import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AideProvider } from './contexts/AideContext';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>

    <AideProvider>

      <App />

    </AideProvider>
      
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
