// BoxO.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useDashboard } from '../contexts/DashboardContext';
import Loading from './Loading';
import Error from './Error';
import { errorData } from '../data/dummy';

const BoxO = () => {
  const { cards, loading, error, selectedCard, setSelectedCard } = useDashboard();

  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error error={errorData.data} />;
  }

  return (
    <Box sx={{ padding: '0 24px', width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Card 
            key={index} 
            elevation={1}
            sx={{ 
              borderRadius: '8px',
              height: '100%',
              transition: 'all 0.3s ease',
              backgroundColor: index % 2 === 0 ? '#f5f9ff' : 'white',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? '' : undefined}
              sx={{
                height: '100%',
                padding: 2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
                '&[data-active]': {
                  backgroundColor: 'rgba(25, 118, 210, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  },
                },
              }}
            >
              <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 8px' }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                  {card.title}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default BoxO;