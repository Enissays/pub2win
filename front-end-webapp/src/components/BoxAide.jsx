import React from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const BoxAide = ({ 
  icon, 
  title, 
  field, 
  value, 
  color, 
  url, 
  formValues, 
  editingField, 
  setEditingField, 
  handleFieldChange, 
  handleSaveField 
}) => {
  const contactInfoStyle = {
    padding: '16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  };

  return (
    <Box sx={contactInfoStyle}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            href={url}
            target={url && url.includes('http') ? "_blank" : "_self"}
            aria-label={title}
            sx={{ color: color, mr: 1 }}
          >
            {icon}
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Box>
        
        <IconButton 
          onClick={() => setEditingField(field)}
          sx={{ color: '#757575' }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      
      {editingField === field ? (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, ml: 6 }}>
          <TextField
            fullWidth
            value={formValues[field] || ''}
            onChange={(e) => handleFieldChange(e, field)}
            size="small"
            autoFocus
          />
          <IconButton 
            onClick={() => handleSaveField(field)} 
            color="primary"
          >
            <SaveIcon />
          </IconButton>
          <IconButton 
            onClick={() => setEditingField('')} 
            color="error"
          >
            <CancelIcon />
          </IconButton>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default BoxAide;