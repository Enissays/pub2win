import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AideProvider } from './contexts/AideContext';
import { ProfileProvider } from './contexts/ProfileContext';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>

    <ProfileProvider>

      <AideProvider>

        <App />

      </AideProvider>
      
    </ProfileProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
