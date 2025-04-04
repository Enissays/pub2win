import React, { useEffect, useState } from "react";
import { getAllSignalemntUsers } from "../services/pub2winService";
import { AideService } from "../components";


const Signalement = () =>{
    const [usersSignalement,setUsersSignalement]=useState([]);
    const [getDayOfBTemp,setGetDayOfBTemp]=useState("");

    const handDeyOfBTmp = (event) =>{
        console.log(event.target.value)
    }
    useEffect(() => {
        getAllSignalemntUsers()
          .then(response => {
            if (response.success) {
                setUsersSignalement(response.data);
            }
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des SignalementUsers:", error);
          })
      }, []);

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <AideService des={"Cher Administrateur, ceci est un espace de gestion de signalements où vous pouvez avertir, bloquer temporairement pour un nombre de jours défini ou bloquer définitivement un utilisateur selon le motif de signalement. Soyez très attentif à vos décisions !"}/>
          {usersSignalement.map(user => (
            <details key={user.user_signale_id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-all duration-300 mb-5">
              <summary className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-primary-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-700">person</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.user_username}</h3>
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

                          {/*make a desicion*/}
                          
                        </div>
                      )
                })}
                <div className="p-4 flex flex-wrap gap-2 justify-end">
                          <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-md flex items-center transition-colors duration-300">
                            <span className="material-symbols-outlined mr-2 text-sm">warning</span>
                            Premier avertissement
                          </button>
                        <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-md flex items-center transition-colors duration-300">
                            <span className="material-symbols-outlined mr-2 text-sm">block</span>
                            Blocage temporaire
                            <input 
                            id="Jours"
                            className="ml-2 bg-white text-orange-800 text-xs px-2 py-1 rounded-full" placeholder="7 jours"
                            onChange={handDeyOfBTmp}
                            >
                            </input>
                        </button>
                        <button className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md flex items-center transition-colors duration-300">
                            <span className="material-symbols-outlined mr-2 text-sm">gpp_bad</span>
                            Blocage définitif
                        </button>
                          </div>
              </div>
            </details>
          ))}
        </div>
      );
}

export default Signalement;