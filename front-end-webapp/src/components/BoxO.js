import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { getTotalUsers,getTotalabco,getTotalInfOffres, getTotalOffres, getTotalTranaCommission,getTotalSignalement} from '../services/pub2winService';
import Loading from './Loading';
import Error from './Error';
import { errorData } from '../data/dummy';


const BoxO = () => {

    const [selectedCard, setSelectedCard] = useState(0);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      setLoading(true);
      Promise.all([
        getTotalUsers(),
        getTotalabco(),
        getTotalInfOffres(),
        getTotalOffres(),
        getTotalTranaCommission(),
        getTotalSignalement()
      ])
        .then(([usersResponse, abcoResponse, InfOffresRes,OffreResponse, TrTotalRes,TSRes]) => {

          const newCards = [];
          
          if (usersResponse.success) {
            newCards.push({
              title: usersResponse.message,
              description: usersResponse.count
            });
          }
          
          if (abcoResponse.success) {
            newCards.push({
              title: abcoResponse.message,
              description: abcoResponse.count
            });
          }  
          
          if (InfOffresRes.success) {
            newCards.push({
              title: InfOffresRes.message,
              description: InfOffresRes.count
            });
          } 

          if (OffreResponse.success) {
            newCards.push({
              title: OffreResponse.message,
              description: OffreResponse.count
            });
          } 

          if (TrTotalRes.success) {
            newCards.push({
              title: TrTotalRes.message,
              description: `${TrTotalRes.totalCommission} euro`
            });
          } 
          
          if (TSRes.success) {
            newCards.push({
              title: TSRes.message,
              description: TSRes.count
            });
          } 

          setCards(prevCards => [...prevCards, ...newCards]);
        })
        .catch(error => {
          setError(error);
          console.error("Erreur lors de la récupération des données:", error);
        }).finally(() => {
          setLoading(false);
        });
    }, []);


    if (loading) {
        return <Loading />;
      }
      
      if (error) {
        return <Error error={errorData.data} />
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
                backgroundColor: index % 2 === 0 ? '#f5f9ff' : 'white', // Alternance de couleurs comme dans votre image
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
    
}


export default BoxO;