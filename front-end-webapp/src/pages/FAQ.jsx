import React, { useEffect, useState } from "react";
import { getAllQuestionReponse, createAnswer, getAdminInformation, deleteById } from "../services/pub2winService";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress, TextField, Button, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AideService, BoxVide, Loading } from "../components";
import Swal from "sweetalert2";
import Error from "../components/Error";
import { errorData } from "../data/dummy";

const FAQ = () => {
  const [questionReponse, setQuestionReponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [newResponse, setNewResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState({ show: false, type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idAmdin,setIdAdmin]=useState();
  const [error,setError]=useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchIdAdmin();
  }, []);

  const fetchIdAdmin = () => {
    getAdminInformation()
      .then(response => {
        if (response.success) {
            setIdAdmin(response.data._id);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des questions/réponses:", error);
        setError("Une erreur est survenue lors de la récupération des données");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const fetchQuestions = () => {
    setIsLoading(true);
    getAllQuestionReponse()
      .then(response => {
        if (response.success) {
          setQuestionReponse(response.data);
        }
      })
      .catch(error => {
        console.log("Erreur lors de la récupération des questions/réponses:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAccordionChange = (id) => (event, isExpanded) => {
    setExpandedId(isExpanded ? id : null);
    // Réinitialiser le formulaire de réponse quand on change d'accordéon
    setNewResponse("");
    setResponseStatus({ show: false, type: "", message: "" });
  };

  const handleResponseSubmit = async (questionId) => {
    if (!newResponse.trim()) {
      setResponseStatus({
        show: true,
        type: "error",
        message: "Veuillez saisir une réponse avant d'envoyer."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createAnswer(idAmdin, questionId, newResponse);
      
      if (response.success) {
        setResponseStatus({
          show: true,
          type: "success",
          message: "Réponse publiée avec succès!"
        });
        setNewResponse("");
        
        // Rafraîchir les questions pour afficher la nouvelle réponse
        fetchQuestions();
      } else {
        setResponseStatus({
          show: true,
          type: "error",
          message: response.message || "Échec de l'envoi de la réponse."
        });
      }
    } catch (error) {
      setResponseStatus({
        show: true,
        type: "error",
        message: "Une erreur est survenue lors de l'envoi de la réponse."
      });
      console.error("Erreur lors de l'envoi de la réponse:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    setIsSubmitting(true);
    try {
      const response = await deleteById(questionId);
      
      if (response.success) {
        Swal.fire({
            title: 'Succès!',
            text: 'Question Supprimée!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        setNewResponse("");
        
        // Rafraîchir les questions pour afficher la nouvelle réponse
        fetchQuestions();
      } else {
        setResponseStatus({
          show: true,
          type: "error",
          message: response.message || "Échec de l'envoi de la réponse."
        });
      }
    } catch (error) {
      setResponseStatus({
        show: true,
        type: "error",
        message: "Une erreur est survenue lors de la suppression."
      });
      console.error("Erreur lors de l'envoi de la suppression:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error error={errorData.data} />
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <AideService des={"Cet espace vous permet de consulter et répondre aux questions posées par les utilisateurs. Pour ajouter une nouvelle réponse à une question, cliquez sur la question puis utilisez le formulaire de réponse. Vous pouvez fournir plusieurs réponses à une même question si nécessaire."} />

      {questionReponse && questionReponse.length > 0 ? (
        questionReponse.map((item) => (
          <Accordion
            key={item.question._id}
            expanded={expandedId === item.question._id}
            onChange={handleAccordionChange(item.question._id)}
            sx={{
              mb: 2,
              borderRadius: '8px',
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              bgcolor: 'white'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${item.question._id}-content`}
              id={`panel-${item.question._id}-header`}
              sx={{
                borderRadius: '8px',
                backgroundColor: 'white',
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>{item.question.content}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {item.answers.length > 0 ? (
                item.answers.map((answer, index) => (
                  <Box key={answer._id} sx={{ mb: index < item.answers.length - 1 ? 2 : 0 }}>
                    <Typography>
                      {answer.content}
                    </Typography>
                    {index < item.answers.length - 1 && (
                      <Box sx={{ my: 1, height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Cette question n'a pas encore reçu de réponse.
                </Typography>
              )}

              {/* Formulaire pour ajouter une réponse */}
              <Box sx={{ mt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)', pt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Ajouter une réponse
                </Typography>
                
                {responseStatus.show && (
                  <Alert 
                    severity={responseStatus.type} 
                    sx={{ mb: 2 }}
                    onClose={() => setResponseStatus({ ...responseStatus, show: false })}
                  >
                    {responseStatus.message}
                  </Alert>
                )}
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Partagez votre réponse à cette question..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{display: 'flex', justifyContent: 'space-between', width: 'auto'}}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleResponseSubmit(item.question._id)}
                    disabled={isSubmitting}
                    sx={{ 
                      textTransform: 'none',
                      bgcolor: '#0052cc',
                      '&:hover': { bgcolor: '#0043a4' },
                      borderRadius: '4px'
                    }}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteQuestion(item.question._id)}
                    disabled={isSubmitting}
                    sx={{ 
                      textTransform: 'none',
                      bgcolor: '#d32f2f',
                      '&:hover': { bgcolor: '#b71c1c' },
                      borderRadius: '4px'
                    }}
                  >
                    {isSubmitting ? "Suppression..." : "Supprimer"}
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : <BoxVide Title={"Aucune question n'a été posée pour le moment"} des={"Les questions posées par les utilisateurs apparaîtront ici"}/>}
    </div>
  );
};

export default FAQ;