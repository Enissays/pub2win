import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider, CircularProgress, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { AttractiveButton, BoxAide,AideService, Loading, Error, BoxVide } from '../components';
import { useAide } from '../contexts/AideContext';
import { updateAIDE } from '../services/pub2winService';
import { errorData } from '../data/dummy';

const Customers = () => {
  // Utiliser le contexte partagé au lieu de gérer l'état localement
  const { aide, loading, error ,formValues, handleFieldChange, handleSaveField, refreshData } = useAide();
  
  // État pour suivre quel champ est en cours d'édition
  const [editingField, setEditingField] = useState('');

  useEffect(() => { 
      // Fetch admin data when component mounts
      refreshData();
    }, []);

  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error error={errorData.data} />
  }


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Informations de contact
      </Typography>
      
      {/* Section d'introduction attrayante */}
      
      <AideService  
        des="Bienvenue, cher administrateur ! Cet espace vous permet de visualiser les informations de contact actuelles de pub2win, ainsi vous permettra d'actualiser ces données dès que nécessaire."
      />

      {aide ? (
        <>
      <Card elevation={3} sx={{ borderRadius: '16px' }}>
        <CardContent>
          <Grid container spacing={3} direction="column">
            {/* Email */}
            {aide?.email && (
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
                  handleSaveField={(field) => {
                    handleSaveField(field);
                    setEditingField('');
                  }}
                />
              </Grid>
            )}
            
            {/* Téléphone */}
            {aide?.telephone && (
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
                  handleSaveField={(field) => {
                    handleSaveField(field);
                    setEditingField('');
                  }}
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
            {aide?.facebook_url && (
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
                  handleSaveField={(field) => {
                    handleSaveField(field);
                    setEditingField('');
                  }}
                />
              </Grid>
            )}
            
            {/* Instagram */}
            {aide?.instagram_url && (
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
                  handleSaveField={(field) => {
                    handleSaveField(field);
                    setEditingField('');
                  }}
                />
              </Grid>
            )}
            
            {/* Twitter */}
            {aide?.twitter_url && (
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
                  handleSaveField={(field) => {
                    handleSaveField(field);
                    setEditingField('');
                  }}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <AttractiveButton func={updateAIDE} formValues={formValues} title={"Mettre à jour les informations"}/>
      </>
          ): <BoxVide Title={"Aucune information de contact trouvée"} des={"Les informations de contact de pub2win apparaîtront ici."}/>}
    </div>
  );
};

export default Customers;