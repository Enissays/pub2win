  import React, { createContext, useState, useContext, useEffect } from 'react';
  import { getAIDE } from '../services/pub2winService';

  // Création du contexte
  const AideContext = createContext();

  // Création d'un hook personnalisé pour utiliser ce contexte
  export const useAide = () => useContext(AideContext);

  // Provider du contexte qui sera utilisé pour envelopper l'application
  export const AideProvider = ({ children }) => {
    const [aide, setAide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [formValues, setFormValues] = useState({
      email: '',
      telephone: '',
      facebook_url: '',
      instagram_url: '',
      twitter_url: ''
    });

    // Fonction pour charger les données
    const loadAideData = () => {
      setLoading(true);
      getAIDE()
        .then(response => {
          if (response.success) {
            setAide(response.data);
            setFormValues({
              email: response.data.email || '',
              telephone: response.data.telephone || '',
              facebook_url: response.data.facebook_url || '',
              instagram_url: response.data.instagram_url || '',
              twitter_url: response.data.twitter_url || ''
            });
          } else {
            setError("Impossible de récupérer les données");
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération de l'aide:", error);
          setError("Une erreur est survenue lors de la récupération des données");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // Charger les données au premier rendu
    useEffect(() => {
      loadAideData();
    }, []);

    // Fonction pour gérer le changement de valeur d'un champ
    const handleFieldChange = (e, field) => {
      setFormValues({
        ...formValues,
        [field]: e.target.value
      });
    };

    // Fonction pour sauvegarder la valeur d'un champ
    const handleSaveField = (field) => {
      if (aide) {
        const updatedAide = { ...aide };
        updatedAide[field] = formValues[field];
        setAide(updatedAide);
      }
    };

    // Exposer les valeurs et fonctions via le contexte
    const value = {
      aide,
      loading,
      error,
      formValues,
      setFormValues,
      handleFieldChange,
      handleSaveField,
      refresh: loadAideData
    };

    return <AideContext.Provider value={value}>{children}</AideContext.Provider>;
  };

  export { AideContext as default };