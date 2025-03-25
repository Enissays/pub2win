import React, { useEffect, useState, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { Paper, Typography, Box } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const AideService=({des})=>{
    return(
        <div>
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
            {des}
          </Typography>
        </Box>
      </Paper>
        </div>
    );
}

export default AideService;