import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import { getAdminInformation } from '../services/pub2winService';

const UserProfile = () => {
  const [username,setUsername]=useState();
  const [email,setEmail]=useState();

  useEffect(() =>{
    getAdminInformation()
        .then(response => {
          if (response.success) {
            setUsername(response.data.username)
            setEmail(response.data.email)
          } else {
            setError("Échec de la récupération des données");
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des informations:", error);
          setError("Erreur de connexion au serveur");
        })
        .finally(() => {
          setLoading(false);
        });
  },[])
  

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Admin Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>


      <div className="flex gap-5 items-center mt-6 border-color pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />

        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {username} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  Administrator   </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {email} </p>
        </div>
      </div>
    </div>

  );
};

export default UserProfile;
