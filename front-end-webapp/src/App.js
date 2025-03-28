import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor,FAQ } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import MonProfile from './pages/MonProfile';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent
              content="Settings"
              position="Top"
            >
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>

            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white" style={{ zIndex: 999 }}>
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
            }
          >
            <div 
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scroll > 10 
                  ? 'bg-white/70 dark:bg-main-dark-bg/70 backdrop-blur-md shadow-md' 
                  : 'bg-main-bg dark:bg-main-dark-bg'
              } w-full`}
              style={{ 
                paddingLeft: activeMenu ? '18rem' : '0',
              }}
            >
              {/* Ajustement du conteneur de la navbar pour s'assurer que tout le contenu est visible */}
              <div className="w-full h-full overflow-visible">
                <Navbar />
              </div>
            </div>
            {/* Augmentation du padding-top pour donner plus d'espace à la barre de navigation */}
            <div style={{ paddingTop: '80px' }}>
              {themeSettings && (<ThemeSettings />)}

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={(<Ecommerce />)} />
                <Route path="/pub2win" element={(<Ecommerce />)} />

                {/* pages  */}
                <Route path="/GesComptes" element={<Orders />} />
                <Route path="/signalement" element={<Employees />} />
                <Route path="/AIDE" element={<Customers />} />
                <Route path="/FAQ" element={<FAQ/>} />
                <Route path="/GesOffres" element={<Customers />} />

                {/* charts  */}
                <Route path="/mon-profile" element={<MonProfile />} />
                <Route path="/bar" element={<Bar />} />

              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;