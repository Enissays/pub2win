import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider, CircularProgress, Paper, TextField, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Pour la date d'inscription
import EmailIcon from '@mui/icons-material/Email';          // Pour l'email
import PersonIcon from '@mui/icons-material/Person';        // Pour le nom
import BadgeIcon from '@mui/icons-material/Badge';          // Pour le prénom
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import { getAdminInformation, updateUser } from '../services/pub2winService';
import { AideService, AttractiveButton, BoxAide2, BoxVide, Error, Loading } from '../components';
import Swal from 'sweetalert2';
import { RiLockPasswordFill } from 'react-icons/ri';
import { errorData } from '../data/dummy';
import { useProfileContext } from '../contexts/ProfileContext';

const MonProfile = () => {
  // État pour les données administrateur
  const { admin, loading, error, updateField, refreshProfile, setLoading, setAdmin} = useProfileContext();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // État pour suivre quel champ est en cours d'édition
  const [editingField, setEditingField] = useState('');
  
  // État pour les valeurs des formulaires
  const [formValues, setFormValues] = useState({});
  const [password,setPassword]=useState();
  useEffect(() => { 
    // Fetch admin data when component mounts
    refreshProfile();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveFieldPassword =(field, value)  =>{
    setPassword(value);
    console.log(password);
  }

  const handleSaveField = (field, value) => {
    // Mettre à jour formValues d'abord
    const updatedFormValues = {
      ...formValues,
      [field]: value
    };
    setFormValues(updatedFormValues);
    // Extraire le nom d'utilisateur et les données à mettre à jour
    const { username } = admin; // Obtenir le nom d'utilisateur de l'admin actuel
    
    // Créer l'objet de mise à jour avec uniquement le champ modifié
    const updateData = { [field]: value };
    
    // Afficher l'état de chargement
    setLoading(true);
    
    // Appeler updateUser avec le nom d'utilisateur et les données de mise à jour
    updateUser(username, updateData)
      .then(response => {
        if (response.success) {
          // Mettre à jour admin
          setAdmin(prev => ({
            ...prev,
            [field]: value
          }));
          
          // Réinitialiser le champ d'édition
          setEditingField('');
          
          // Afficher un SweetAlert de succès
          Swal.fire({
            icon: 'success',
            title: 'Mise à jour réussie',
            text: `Le champ ${field} a été mis à jour avec succès.`,
            showConfirmButton: false,
            timer: 1500
          });
          
          console.log("Mise à jour réussie:", response);
        } else {
          // Afficher un SweetAlert d'erreur
          Swal.fire({
            icon: 'error',
            title: 'Échec de la mise à jour',
            text: response.message || 'Une erreur est survenue lors de la mise à jour.',
            confirmButtonText: 'OK'
          });
          
          console.error("Échec de la mise à jour:", response.message);
        }
      })
      .catch(error => {
        // Afficher un SweetAlert d'erreur en cas d'exception
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la communication avec le serveur.',
          confirmButtonText: 'OK'
        });
        
        console.error("Erreur lors de la mise à jour:", error);
      })
      .finally(() => {
        setLoading(false);
      });
};


  if (loading) {
    return <Loading />;
  }
  console.log("error: ",typeof error);
  if (error) {
    return <Error error={errorData.data} />
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <AideService des={"Mon Profile"}/>

      {admin ? (
        <>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Profil Administrateur
      </Typography>
      
      <Card elevation={3} sx={{ borderRadius: '16px' }}>
        <CardContent>
          <Grid container spacing={3} direction="column">
            {/* Email */}
            {admin?.email && (
              <Grid item>
                <BoxAide2
                icon={<EmailIcon sx={{ color: '#1976d2', mr: 2 }} />}
                  title="Email"
                  field="email"
                  value={admin.email}
                  color="#1976d2"
                  url={`mailto:${admin.email}`}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}
            
            {/* Nom */}
            {admin?.nom && (
              <Grid item>
                <BoxAide2 
                icon={<PersonIcon sx={{ color: '#4caf50', mr: 2 }} />}
                  title="Nom"
                  field="nom"
                  value={admin.nom}
                  color="#4caf50"
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}

            {/* Prénom */}
            {admin?.prenom && (
              <Grid item>
                <BoxAide2 
                icon={<BadgeIcon sx={{ color: '#4267B2', mr: 2 }} />}
                  title="Prénom"
                  field="prenom"
                  value={admin.prenom}
                  color="#4267B2"
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveField}
                />
              </Grid>
            )}

            {/* Username */}
            {admin?.password_hash && (
              <Grid item>
                <BoxAide2 
                  icon={<RiLockPasswordFill style={{ color: '#C13584', marginRight: 8 }} />}
                  title="Nouveau mot de passe"
                  field="password"
                  value=""
                  color="#C13584"
                  editingField={editingField}
                  setEditingField={setEditingField}
                  handleFieldChange={handleFieldChange}
                  handleSaveField={handleSaveFieldPassword}
                  type="password"
                  saved={true}
                />
              </Grid>
              )}

              {admin?.password_hash && (
                <Grid item>
                  <BoxAide2 
                    icon={<RiLockPasswordFill style={{ color: '#C13584', marginRight: 8 }} />}
                    title="Confirmer le mot de passe"
                    field="confirmPassword"
                    value=""
                    color="#C13584"
                    editingField={editingField}
                    setEditingField={setEditingField}
                    handleFieldChange={handleFieldChange}
                    handleSaveField={(field, value) => {
                      // Vérifier que les mots de passe correspondent
                      if (value !== password) {
                        Swal.fire({
                          icon: 'error',
                          title: 'Les mots de passe ne correspondent pas',
                          text: 'Veuillez vous assurer que les deux mots de passe sont identiques.',
                          confirmButtonText: 'OK'
                        });
                        return;
                      }
                      
                      // Si les mots de passe correspondent, mettre à jour avec le nouveau mot de passe
                      handleSaveField('password_hash', value);
                    }}
                    type="password"
                  />
                </Grid>
              )}
            
            {/* Date d'inscription */}
            {admin?.date_inscription && (
              <Grid item>
                <BoxAide2 
                  icon={<CalendarTodayIcon sx={{ color: '#1DA1F2', mr: 2 }} />}
                  title="Date d'inscription"
                  field="date_inscription"
                  value={new Date(admin.date_inscription).toLocaleDateString()}
                  color="#1DA1F2"
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
      </>
      ) : <BoxVide Title={"Aucune information de contact trouvée"} des={"Les informations de contact de pub2win apparaîtront ici."}/>}
    </div>
  );
};

export default MonProfile;  