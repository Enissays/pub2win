// contexts/ServerStatusContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // remplace cette URL par ton endpoint de test (même un /ping suffit)
        await axios.get('http://localhost:5000/');
        setServerDown(false);
      } catch (error) {
        setServerDown(true);
      }
    };

    checkServer(); // test au démarrage
    const interval = setInterval(checkServer, 10000); // toutes les 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverDown }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);
