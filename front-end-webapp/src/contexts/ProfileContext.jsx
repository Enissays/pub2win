// ProfileContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAdminInformation, updateUser } from '../services/pub2winService';
import Swal from 'sweetalert2';

// Création du contexte
const ProfileContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useProfileContext = () => useContext(ProfileContext);

// Fournisseur du contexte
export const ProfileProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});
  
  // Charger les données de l'admin au chargement initial
  useEffect(() => { 
    fetchAdminData();
  }, []);

  // Fonction pour récupérer les données de l'admin
  const fetchAdminData = () => {
    setLoading(true);
    getAdminInformation()
      .then(response => {
        if (response.success) {
          setAdmin(response.data);
          setFormValues(response.data);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des informations:", error);
        setError("Erreur de connexion au serveur");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Mettre à jour un champ spécifique
  const updateField = (field, value) => {
    // Mettre à jour formValues d'abord
    const updatedFormValues = {
      ...formValues,
      [field]: value
    };
    setFormValues(updatedFormValues);
    
    if (!admin || !admin.username) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de mettre à jour le profil: aucun utilisateur connecté',
        confirmButtonText: 'OK'
      });
      return Promise.reject("Aucun utilisateur connecté");
    }
    
    // Extraire le nom d'utilisateur
    const { username } = admin;
    
    // Créer l'objet de mise à jour avec uniquement le champ modifié
    const updateData = { [field]: value };
    
    // Afficher l'état de chargement
    setLoading(true);
    
    // Appeler updateUser avec le nom d'utilisateur et les données de mise à jour
    return updateUser(username, updateData)
      .then(response => {
        if (response.success) {
          // Mettre à jour admin
          setAdmin(prev => ({
            ...prev,
            [field]: value
          }));
          
          Swal.fire({
            icon: 'success',
            title: 'Mise à jour réussie',
            text: `Le champ ${field} a été mis à jour avec succès.`,
            showConfirmButton: false,
            timer: 1500
          });
          
          return response;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Échec de la mise à jour',
            text: response.message || 'Une erreur est survenue lors de la mise à jour.',
            confirmButtonText: 'OK'
          });
          
          throw new Error(response.message || 'Échec de la mise à jour');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la communication avec le serveur.',
          confirmButtonText: 'OK'
        });
        
        console.error("Erreur lors de la mise à jour:", error);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Gérer les changements de champs pour les formulaires
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Rafraîchir les données du profil
  const refreshProfile = () => {
    return fetchAdminData();
  };

  // Valeur du contexte
  const contextValue = {
    admin,
    loading,
    error,
    updateField,
    setAdmin,       // ✅ Ajoutez ces fonctions au contexte
    setLoading,     // ✅ si vous avez besoin que les composants les utilisent
    setError,
    refreshProfile  // Une fonction pour rafraîchir le profil
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};