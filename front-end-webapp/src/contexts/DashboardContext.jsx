// DashboardContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTotalUsers, getTotalabco, getTotalInfOffres, getTotalOffres, getTotalTranaCommission, getTotalSignalement } from '../services/pub2winService';

// Création du contexte
const DashboardContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useDashboard = () => useContext(DashboardContext);

// Fournisseur du contexte
export const DashboardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(0);

  // Fonction pour charger les données du tableau de bord
  const loadDashboardData = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      getTotalUsers(),
      getTotalabco(),
      getTotalInfOffres(),
      getTotalOffres(),
      getTotalTranaCommission(),
      getTotalSignalement()
    ])
      .then(([usersResponse, abcoResponse, InfOffresRes, OffreResponse, TrTotalRes, TSRes]) => {
        const newCards = [];
        
        if (usersResponse.success) {
          newCards.push({
            title: usersResponse.message,
            description: usersResponse.count
          });
        }
        
        if (abcoResponse.success) {
          newCards.push({
            title: abcoResponse.message,
            description: abcoResponse.count
          });
        }  
        
        if (InfOffresRes.success) {
          newCards.push({
            title: InfOffresRes.message,
            description: InfOffresRes.count
          });
        } 

        if (OffreResponse.success) {
          newCards.push({
            title: OffreResponse.message,
            description: OffreResponse.count
          });
        } 

        if (TrTotalRes.success) {
          newCards.push({
            title: TrTotalRes.message,
            description: `${TrTotalRes.totalCommission} euro`
          });
        } 
        
        if (TSRes.success) {
          newCards.push({
            title: TSRes.message,
            description: TSRes.count
          });
        } 

        setCards(newCards);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des données:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Charger les données au chargement initial
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Valeur du contexte
  const contextValue = {
    cards,
    loading,
    error,
    selectedCard,
    setSelectedCard,
    refreshDashboard: loadDashboardData
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};