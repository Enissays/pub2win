import React from 'react';
import ReactDOM from 'react-dom';

import './/css/index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AideProvider } from './contexts/AideContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { DashboardProvider } from './contexts/DashboardContext';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>

    <DashboardProvider>

    <ProfileProvider>

      <AideProvider>

        <App />

      </AideProvider>
      
    </ProfileProvider>
    
    </DashboardProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
