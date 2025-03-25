import { Button } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { updateAIDE } from '../services/pub2winService';

const AttractiveButton = ({ formValues }) => {
    const [updating, setUpdating] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await updateAIDE(formValues);
            setNotification({
                open: true,
                message: 'Informations de contact mises à jour avec succès !',
                severity: 'success'
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            setNotification({
                open: true,
                message: 'Erreur lors de la mise à jour des informations',
                severity: 'error'
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<UpdateIcon />} 
                onClick={handleUpdate}
                disabled={updating}
                sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                    }
                }}
            >
                {updating ? 'Mise à jour en cours...' : 'Mettre à jour les informations'}
            </Button>

            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AttractiveButton;