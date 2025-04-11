import React, { useState } from 'react';
import { Line1,CollapsibleChart,Line2, Line3, Line4, Line5, Line6, Line7, BoxO} from '../components';

const Ecommerce = () => {
  const [openChart, setOpenChart] = useState(null);
  
  // Gérer le clic sur un graphique
  const handleChartClick = (chartId, event) => {
    // Empêcher la propagation si on clique sur le sélecteur d'année
    if (event.target.tagName === 'SELECT' || event.target.closest('select')) {
      event.stopPropagation();
      return;
    }
    setOpenChart(openChart === chartId ? null : chartId);
  };



  return (
    <div className="mt-12">
      <div>
      </div>
      
      <BoxO/>

      <div className="flex flex-col gap-4 dark:text-gray-200">
        {/* Graphique 1 */}
        <CollapsibleChart 
          title="Statistiques des utilisateurs par mois" 
          isOpen={openChart === 'chart1'}
          onClick={(e) => handleChartClick('chart1', e)}
        >
          <Line1 onRequestStatus={(status)  =>{
            console.log("Requête réussie ?", status);
          }}/>
        </CollapsibleChart>
        
        {/* Graphique 2 */}
        <CollapsibleChart 
          title="Statistiques des abonnements de commerçants" 
          isOpen={openChart === 'chart2'}
          onClick={(e) => handleChartClick('chart2', e)}
        >
          <Line2 />
        </CollapsibleChart>
        
        {/* Graphique 3 */}
        <CollapsibleChart 
          title="Statistiques des offres" 
          isOpen={openChart === 'chart3'}
          onClick={(e) => handleChartClick('chart3', e)}
        >
          <Line3 />
        </CollapsibleChart>


        <CollapsibleChart 
          title="Statistiques des offres acceptées par les influenceurs" 
          isOpen={openChart === 'chart4'}
          onClick={(e) => handleChartClick('chart4', e)}
        >
          <Line4 />
        </CollapsibleChart>

        <CollapsibleChart 
          title="Rapport Statistique sur le Total des Commissions" 
          isOpen={openChart === 'chart5'}
          onClick={(e) => handleChartClick('chart5', e)}
        >
          <Line5 />
        </CollapsibleChart>

        <CollapsibleChart 
          title="Rapport Statistique sur le nombre totale de signalement" 
          isOpen={openChart === 'chart6'}
          onClick={(e) => handleChartClick('chart6', e)}
        >
          <Line6 />
        </CollapsibleChart>


        <CollapsibleChart 
          title="Rapport Statistique sur le nombre d'influenceur par un commercant" 
          isOpen={openChart === 'chart7'}
          onClick={(e) => handleChartClick('chart7', e)}
        >
          <Line7 />
        </CollapsibleChart>
      </div>
    </div>
  );
};

export default Ecommerce;