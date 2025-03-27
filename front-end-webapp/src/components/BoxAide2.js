import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Composant BoxAide2 amélioré avec les concepts de BoxAide
const BoxAide2 = ({ icon, title, field, value, color, url, editingField, setEditingField, handleSaveField }) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const isEditing = editingField === field;

  const handleEdit = () => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setInputValue(value);
    setEditingField('');
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    handleSaveField(field, inputValue);
  };

  // Style avancé avec effet de survol
  const contactInfoStyle = {
    p: 2,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 2,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    mb: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  };

  return (
    <Box sx={contactInfoStyle}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {url ? (
            <IconButton
              href={url}
              target={url && url.includes('http') ? "_blank" : "_self"}
              aria-label={title}
              sx={{ color: color, mr: 1 }}
            >
              {icon}
            </IconButton>
          ) : (
            <Box sx={{ color: color, mr: 2 }}>
              {icon}
            </Box>
          )}
          
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            
            {!isEditing && (
              <Typography variant="body1" component="div">
                {value}
              </Typography>
            )}
          </Box>
        </Box>
        
        {!isEditing && (
          <IconButton onClick={handleEdit} size="small" sx={{ color: '#757575' }}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      
      {isEditing && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, ml: 6, width: '100%' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={handleChange}
            autoFocus
            sx={{ mb: 1 }}
          />
          <IconButton onClick={handleSave} color="primary" size="small">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancel} color="error" size="small">
            <CancelIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default BoxAide2;