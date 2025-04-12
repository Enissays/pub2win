import React, { useEffect, useState, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid, errorData } from '../data/dummy';
import { deleteUserbyUsername, getAllUsers, SRchByUsername, updateUser } from '../services/pub2winService';
import { AideService, BoxVide, Error, Header, Loading } from '../components';
import Swal from 'sweetalert2';

const Orders = () => {
  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const gridRef = useRef(null);
  const [username, setUsername] = useState('');
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    loadAllUsers();
    console.log("Username: ",username)
  }, [searchUsername]);

  useEffect(() => {
    if (username && Object.keys(updateData).length > 0) {
      handleUpdateUser();
    }
  }, [updateData]);

  const loadAllUsers = () => {
    setLoading(true);
    setError('');

    // Si searchUsername est vide, chargez tous les utilisateurs
    // Sinon, effectuez une recherche avec le texte actuel
    if (!searchUsername.trim()) {
      getAllUsers()
        .then(response => {
          if (response.success) {
            setUsers(response.allusers);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des utilisateurs:", error);
          setError('Erreur de connexion au serveur');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Utilisez le service de recherche avec le texte actuel
      SRchByUsername(searchUsername)
        .then(response => {
          if (response.success && response.user) {
            setUsers(response.user);
          } else {
            setError('Aucun utilisateur correspondant trouvé');
            setUsers([]);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la recherche:", error);
          setError('Erreur lors de la recherche');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  
  const handleReset = () => {
    setSearchUsername('');
    loadAllUsers();
  };

  const handleUpdateUser = () => {
    setLoading(true);
    
    updateUser(username, updateData)
      .then(response => {
        if (response.success) {
          // Mettre à jour l'utilisateur dans l'état local
          setUsers(prevUsers => prevUsers.map(user => 
            // condition                      true                     false
            user.username === username ? { ...user, ...updateData } : user
          ));
          
          // Afficher un message de succès
          Swal.fire({
            title: 'Succès!',
            text: 'Utilisateur mis à jour avec succès',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          setError('Erreur lors de la mise à jour de l\'utilisateur');
        }
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        setError('Erreur lors de la mise à jour');
      })
      .finally(() => {
        setLoading(false);
        setUsername('');
        setUpdateData({});
      });
  };

  const editing = { allowDeleting: true, allowEditing: true };

  const handleDeleteUser = (args) => {
      const username = args.data.map(user => user.username)[0];
      console.log("username: ", username);
      //deleteUserbyUsername
      setLoading(true);
      deleteUserbyUsername(username)
        .then(response => {
          if (response.success) {
            // Supprimer l'utilisateur de l'état local
            setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
            // Optionnel: Afficher un message de succès
            Swal.fire({
              title: 'Succès!',
              text: 'Utilisateur supprimé avec succès',
              icon: 'success',
              confirmButtonText: 'OK'
            });

          } else {
            setError('Erreur lors de la suppression de l\'utilisateur');
          }
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'utilisateur:", error);
          setError('Erreur lors de la suppression');
        })
        .finally(() => {
          setLoading(false);
        });
      
  };

  if (loading) {
      return <Loading />;
    }
  
    console.log("error: ",typeof error);
    if (error) {
      return <Error error={errorData.data} />
  }


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <AideService 
          des={"Cher Administrateur, ceci est un espace de gestion de comptes avec toutes les fonctionnalités essentielles. Il intègre recherche avancée, multifiltrage et options d'exportation de données vers différents formats. En cliquant sur l'utilisateur souhaité, vous pouvez accéder à toutes les fonctionnalités de gestion disponibles."}
        />
      {users.length > 0 ? (
        <>
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <form className="flex w-full md:w-auto">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Rechercher par username"
            className="p-2 border border-gray-300 md:w-64"
            style={{marginRight:'15px'}}
          />
        </form>
        
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full md:w-auto"
          disabled={loading}
        >
          Réinitialiser
        </button>
      </div>
      
      <GridComponent
        ref={gridRef}
        id="gridcomp"
        dataSource={users}
        allowPaging
        allowSorting
        allowExcelExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
        actionBegin={(args) => {
          if (args.requestType === 'delete') {
            // Annuler la suppression par défaut du composant
            args.cancel = true;
            // Appeler notre fonction personnalisée de suppression
            handleDeleteUser(args);
          }
        }}
        actionComplete={(args) => {
          if (args.requestType === 'save') {
            // Récupérer toutes les cases qui ont été modifiées
            const changedFields = {};
            const originalData = args.previousData;
            const newData = args.data;
            
            // Enregistrer l'username pour l'utiliser dans la mise à jour
            setUsername(originalData.username);
            
            // Comparer les données originales et les nouvelles données
            Object.keys(newData).forEach(key => {
              if (originalData[key] !== newData[key]) {
                changedFields[key] = newData[key];
                
                // Ajouter les champs modifiés à updateData
                setUpdateData(prevData => ({
                  ...prevData,
                  [key]: newData[key]
                }));
              }
            });
          }
        }}
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit]} />
      </GridComponent>
      </>
      ) : <BoxVide Title={"Les utilisateurs apparaîtront ici"} des={"Aucun utilisateur trouvé."} />}
    </div>
  );
};

export default Orders;