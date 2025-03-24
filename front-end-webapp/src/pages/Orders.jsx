import React, { useEffect, useState, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import { getAllUsers, SRchByUsername } from '../services/pub2winService';
import { Header } from '../components';

const Orders = () => {
  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const gridRef = useRef(null);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = () => {
    setLoading(true);
    setError('');
    getAllUsers()
      .then(response => {
        if (response.success) {
          setUsers(response.allusers);
        } else {
          setError('Erreur lors du chargement des utilisateurs');
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        setError('Erreur de connexion au serveur');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) {
      setError('Veuillez entrer un nom d\'utilisateur');
      return;
    }

    setLoading(true);
    setError('');
    
    SRchByUsername(searchUsername)
      .then(response => {
        if (response.success && response.user) {
          // Afficher uniquement l'utilisateur recherché
          setUsers([response.user]);
        } else {
          setError('Utilisateur non trouvé');
          // Conserver les utilisateurs actuels ou vider la liste selon votre préférence
          // setUsers([]);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la recherche de l'utilisateur:", error);
        setError('Erreur lors de la recherche');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setSearchUsername('');
    loadAllUsers();
  };

  const editing = { allowDeleting: true, allowEditing: true };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Utilisateurs" />
      
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <form className="flex w-full md:w-auto">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Rechercher par username"
            className="p-2 border border-gray-300 md:w-64"
          />
        </form>
        
        <button
            onSubmit={handleSearch}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white rounded font-bold py-2 px-4 rounded-r-md"
            disabled={loading}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full md:w-auto"
          disabled={loading}
        >
          Réinitialiser
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <GridComponent
        ref={gridRef}
        id="gridcomp"
        dataSource={users}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};

export default Orders;