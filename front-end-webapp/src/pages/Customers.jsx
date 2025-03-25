import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider, CircularProgress, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { getAIDE } from '../services/pub2winService';
import { AttractiveButton, BoxAide} from '../components';


const Customers = () => {
  const [aide, setAide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour suivre quel champ est en cours d'édition
  const [editingField, setEditingField] = useState('');
  
  // État pour stocker les valeurs modifiées
  const [formValues, setFormValues] = useState({
    email: '',
    telephone: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: ''
  });

  // Fonction pour gérer le changement de valeur d'un champ
  const handleFieldChange = (e, field) => {
    setFormValues({
      ...formValues,
      [field]: e.target.value
    });
  };

  // Fonction pour sauvegarder la valeur d'un champ
  const handleSaveField = (field) => {
    const updatedAide = { ...aide };
    updatedAide[field] = formValues[field];
    setAide(updatedAide);
    setEditingField('');
  };

  useEffect(() => {
    setLoading(true);
    getAIDE()
      .then(response => {
        if (response.success) {
          setAide(response.data);
          // Initialiser formValues avec les données actuelles
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
        console.error("Erreur lors de la récupération des données:", error);
        setError("Une erreur est survenue lors de la récupération des données");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl flex justify-center items-center" style={{ minHeight: '300px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error || !aide) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Typography color="error" variant="h6" align="center">
          {error || "Aucune donnée disponible"}
        </Typography>
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Informations de contact
      </Typography>
      
      {/* Section d'introduction attrayante */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, #4dabf5 0%, #2196f3 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 60, mr: 3 }} />
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            À votre service !
          </Typography>
          <Typography variant="body1">
            Bienvenue, cher administrateur ! Cet espace vous permet de visualiser les informations de contact actuelles de pub2win, ainsi vous permettra d'actualiser ces données dès que nécessaire.
          </Typography>
        </Box>
      </Paper>
      
      <Card elevation={3} sx={{ borderRadius: '16px' }}>
        <CardContent>
          <Grid container spacing={3} direction="column">
            {/* Email */}
            {aide.email && (
              <Grid item>
                <BoxAide 
                  icon={<EmailIcon fontSize="large" />}
                  title="Email"
                  field="email"
                  value={aide.email}
                  color="#1976d2"
                  url={`https://mail.google.com/mail/?view=cm&fs=1&to=${aide.email}`}
                  formValues={formValues}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}
            
            {/* Téléphone */}
            {aide.telephone && (
              <Grid item>
                <BoxAide 
                  icon={<PhoneIcon fontSize="large" />}
                  title="Téléphone"
                  field="telephone"
                  value={aide.telephone}
                  color="#4caf50"
                  url={`tel:${aide.telephone}`}
                  formValues={formValues}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}
            
            <Grid item>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Réseaux sociaux
              </Typography>
            </Grid>
            
            {/* Facebook */}
            {aide.facebook_url && (
              <Grid item>
                <BoxAide 
                  icon={<FacebookIcon fontSize="large" />}
                  title="Facebook"
                  field="facebook_url"
                  value={aide.facebook_url}
                  color="#4267B2"
                  url={`https://facebook.com/${aide.facebook_url}`}
                  formValues={formValues}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}
            
            {/* Instagram */}
            {aide.instagram_url && (
              <Grid item>
                <BoxAide 
                  icon={<InstagramIcon fontSize="large" />}
                  title="Instagram"
                  field="instagram_url"
                  value={aide.instagram_url}
                  color="#C13584"
                  url={`https://www.instagram.com/${aide.instagram_url}`}
                  formValues={formValues}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}
            
            {/* Twitter */}
            {aide.twitter_url && (
              <Grid item>
                <BoxAide 
                  icon={<TwitterIcon fontSize="large" />}
                  title="Twitter"
                  field="twitter_url"
                  value={aide.twitter_url}
                  color="#1DA1F2"
                  url={`https://x.com/${aide.twitter_url}`}
                  formValues={formValues}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <AttractiveButton formValues={formValues} />
    </div>
  );
};

export default Customers;