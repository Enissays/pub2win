import React, { useEffect, useState } from "react";
import { createNotification, getAllSignalemntUsers } from "../services/pub2winService";
import { AideService, Error, Loading } from "../components";
import { Typography } from "@mui/material";
import Swal from "sweetalert2";
import { errorData } from "../data/dummy";


const Signalement = () =>{
    const [usersSignalement,setUsersSignalement]=useState([]);
    const [getDayOfBTemp,setGetDayOfBTemp]=useState(7);
    const [warningType, setWarningType] = useState(null);
    const [temporaryBlockDays, setTemporaryBlockDays] = useState(7);
    const [commentaire, setCommentaire] = useState('');
    const [openDetailsId, setOpenDetailsId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const warningMessages = {
      firstWarning: "Vous êtes averti",
      temporaryBlock: `Votre compte est bloqué temporairement pour ${temporaryBlockDays} jours.`,
      permanentBlock: "Votre compte a été définitivement bloqué"
    };
    

    useEffect(() => {
      setLoading(true);
      // Mettre à jour commentaire quand warningType change
      const initialMessage = 
        warningType === 'firstWarning' 
          ? warningMessages.firstWarning 
          : warningType === 'temporaryBlock'
          ? warningMessages.temporaryBlock 
          : warningMessages.permanentBlock;
      
      setCommentaire(initialMessage);
    }, [warningType]);


    const handleWarning = (type) => {
      setWarningType(type);
    };
  
    const handleSend = (e) => {

      
      createNotification(openDetailsId, {
        type: warningType,
        content: commentaire,
        ...(warningType === 'temporaryBlock' && { days: temporaryBlockDays })
      }).then(response => {
        if (response.data) {
          Swal.fire({
            title: 'Succès!',
            text: 'Votre avis a été envoyé avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Erreur!',
            text: response.error,
            icon: 'error',
            confirmButtonText: 'OK'
          });

        }
      }).catch(err =>{
          setError(err);
      }).finally(() => {
        setLoading(false);
      });// Délai de 1 seconde avant le rechargement
    };
  
    const handDeyOfBTmp = (e) => {
      setTemporaryBlockDays(e.target.value);
    };


    const toggleDetails = (userId) => {
      // Si l'utilisateur clique sur une nouvelle section, 
      // elle s'ouvre et la précédente se ferme
      setOpenDetailsId(userId);
      // Réinitialise le type d'avertissement
      setWarningType(null);
    };

    useEffect(() => {
      setLoading(true);
        getAllSignalemntUsers()
          .then(response => {
            if (response.success) {
                setUsersSignalement(response.data);
            }
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des SignalementUsers:", error);
            setError(true);
          }).finally(() => {
            setLoading(false);
          });
      }, []);
      
      if (loading) {
        return <Loading />;
      }
    
      console.log("error: ",typeof error);
      if (error) {
        return <Error error={errorData.data} />
      }
      
    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <AideService des={"Cher Administrateur, ceci est un espace de gestion de signalements où vous pouvez avertir, bloquer temporairement pour un nombre de jours défini ou bloquer définitivement un utilisateur selon le motif de signalement. Soyez très attentif à vos décisions !"}/>
          {usersSignalement.map(user => (
            <details key={user.user_signale_id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-all duration-300 mb-5"
            open={openDetailsId === user.user_signale_id}
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-primary-50"
              onClick={(e) => {
                e.preventDefault(); // Empêche le comportement par défaut
                toggleDetails(user.user_signale_id);
              }}
              
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-700">person</span>
                  </div>
                  <div>
                    <h3  className="font-semibold text-lg">{user.user_username}</h3>
                    <p className="text-gray-500 text-sm">{user.signalements.length} signalements actifs</p>
                  </div>
                </div>
                <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </summary>
              <div className="p-4">
                {user.signalements.map((report,index) =>{
                    return (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 mb-4 hover:shadow-md transition-all duration-300">
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-gray-600 text-sm mt-1">
                                  {report.raison}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                  <span>{new Date(report.date_signalement).toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit' 
                                  })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        
                        </div>
                      )
                })}

              {warningType ? (
                <>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Ajouter un commentaire
                </Typography>

                <textarea 
                placeholder="Donnez votre commentaire a cet utilisateur..."
                className="w-full p-2 border rounded-md"
                rows="4"
                value={commentaire}
                  onChange={(e) => {
                    // Permet d'ajouter du texte supplémentaire
                    setCommentaire(e.target.value);
                  }}
                  />
                </>
                
              ):(
                <div className="p-4 flex flex-wrap gap-2 justify-end">
                  <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-md flex items-center transition-colors duration-300"
                   onClick={(e) => {
                    e.stopPropagation();
                    handleWarning('firstWarning')}}
                   
                   >
                    <span className="material-symbols-outlined mr-2 text-sm">warning</span>
                      Avertissement
                  </button>

                  <div className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-md flex items-center transition-colors duration-300">
                    <span className="material-symbols-outlined mr-2 text-sm">block</span>
                      Blocage temporaire
                    <input 
                        id="Jours"
                        type="number"
                        className="ml-2 bg-white text-orange-800 text-xs px-2 py-1 rounded-full" 
                        placeholder="7 jours"
                        onChange={handDeyOfBTmp}
                    />
                    <button 
                        className="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWarning('temporaryBlock')}}
                    >
                        Confirmer
                    </button>
                </div>
                  
                  

                  <button className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md flex items-center transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWarning('permanentBlock')}}
                  >
                    <span className="material-symbols-outlined mr-2 text-sm">gpp_bad</span>
                      Blocage définitif
                  </button>
                </div>
              )} 
                
              </div>
              {warningType && (
          <div className="flex justify-end space-x-2 m-10">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleSend}
            >
              Envoyer
            </button>
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              onClick={() => setWarningType(null)}
            >
              Annuler
            </button>
          </div>
        )}
            </details>
          ))}
        </div>
      );
}

export default Signalement;