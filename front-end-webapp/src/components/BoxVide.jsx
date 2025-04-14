import { Box, Typography } from "@mui/material"

const BoxVide = ({Title,des}) => {
    return(
     <Box
        sx={{ 
            textAlign: 'center', 
            py: 6, 
            px: 3, 
            borderRadius: 2, 
            bgcolor: '#f5f5f5', 
            border: '1px dashed #ccc'
            }}
    >
        <Typography variant="h6" color="text.secondary" gutterBottom>
            {Title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
            {des}
        </Typography>
    </Box>
    )
};

export default BoxVide;