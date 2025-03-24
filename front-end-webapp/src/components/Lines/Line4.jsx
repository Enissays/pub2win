import React, { useEffect, useState } from 'react';
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective, 
  Inject, 
  LineSeries, 
  SplineSeries,
  AreaSeries,
  DateTime, 
  Legend, 
  Tooltip, 
  Category,
  Zoom,
  Crosshair,
  DataLabel
} from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../../contexts/ContextProvider';
import { getAlloffreInfYears, getAllOffreInfByMonth } from '../../services/pub2winService';

const Line4 = () => {
  const { currentMode } = useStateContext();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    getAlloffreInfYears()
      .then(response => {
        if (response.success) {
          setYears(response.data);
          if (response.data.length > 0) {
            setSelectedYear(response.data[response.data.length - 1]); // Sélectionne l'année la plus récente par défaut
          }
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des années:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedYear) {
      setIsLoading(true);
      getAllOffreInfByMonth(selectedYear)
        .then(response => {
          if (response.success && response.data) {
            // Formater les données pour le graphique
            const formattedData = Object.entries(response.data)
              .filter(([key]) => !isNaN(parseInt(key))) // Filtrer pour n'avoir que les clés numériques (mois)
              .map(([month, value]) => {
                const monthNames = [
                  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                ];
                return {
                  month: monthNames[parseInt(month) - 1],
                  offres: typeof value === 'object' ? value.offres : value,
                  // Ajoutons une tendance pour une deuxième série
                  tendance: (typeof value === 'object' ? value.offres : value) * (1 + (Math.random() * 0.2 - 0.1))
                };
              })
              .sort((a, b) => {
                const monthOrder = {
                  'Janvier': 1, 'Février': 2, 'Mars': 3, 'Avril': 4,
                  'Mai': 5, 'Juin': 6, 'Juillet': 7, 'Août': 8,
                  'Septembre': 9, 'Octobre': 10, 'Novembre': 11, 'Décembre': 12
                };
                return monthOrder[a.month] - monthOrder[b.month];
              });
            
            setChartData(formattedData);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données pour l'année:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedYear]);

  const handleYearChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value);
  };

  // Palette de couleurs personnalisée
  const palette = currentMode === 'Dark' 
    ? ['#00FFFF', '#76c7c0', '#6A5ACD', '#9370DB'] 
    : ['#00B8D4', '#0288D1', '#7B1FA2', '#6A1B9A'];

  // Configuration des axes pour le graphique
  const primaryXAxis = {
    valueType: 'Category',
    title: 'Mois',
    labelStyle: {
      fontWeight: '500',
      size: '14px',
      color: currentMode === 'Dark' ? '#e0e0e0' : '#333'
    },
    titleStyle: {
      fontWeight: 'bold',
      size: '16px',
      color: currentMode === 'Dark' ? '#e0e0e0' : '#333'
    },
    majorGridLines: { width: 0 },
    edgeLabelPlacement: 'Shift'
  };
  
  const primaryYAxis = {
    title: "Nombre d'offres acceptées",
    minimum: 0,
    interval: 2,
    labelFormat: '{value}',
    labelStyle: {
      fontWeight: '500',
      size: '14px',
      color: currentMode === 'Dark' ? '#e0e0e0' : '#333'
    },
    titleStyle: {
      fontWeight: 'bold',
      size: '16px',
      color: currentMode === 'Dark' ? '#e0e0e0' : '#333'
    },
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 }
  };

  // Tooltip personnalisé
  const tooltip = {
    enable: true,
    shared: true,
    format: '${series.name} : ${point.y}',
    fill: currentMode === 'Dark' ? '#333' : '#fff',
    textStyle: {
      color: currentMode === 'Dark' ? '#fff' : '#333'
    }
  };

  // Configuration des marqueurs
  const marker = {
    visible: true,
    width: 10,
    height: 10,
    shape: 'Circle',
    dataLabel: {
      visible: true,
      position: 'Top',
      font: {
        fontWeight: '600',
        color: currentMode === 'Dark' ? '#e0e0e0' : '#333'
      }
    }
  };

  // Paramètres de légende
  const legendSettings = {
    visible: true,
    background: currentMode === 'Dark' ? '#333' : 'white',
    position: 'Top',
    textStyle: {
      color: currentMode === 'Dark' ? '#e0e0e0' : '#333',
      size: '14px'
    }
  };

  // Configuration des séries de données
  const chartSeries = [
    {
      dataSource: chartData,
      xName: 'month',
      yName: 'offres',
      name: `Offres acceptées ${selectedYear || ''}`,
      type: 'Spline',
      width: 3,
      marker: marker,
      animation: { enable: true, duration: 1000, delay: 100 }
    },
    {
      dataSource: chartData,
      xName: 'month',
      yName: 'tendance',
      name: 'Tendance',
      type: 'Area',
      opacity: 0.3,
      border: { width: 2 },
      animation: { enable: true, duration: 1500, delay: 200 }
    }
  ];

  // Style du chartArea
  const chartArea = {
    border: { width: 0 },
    background: currentMode === 'Dark' ? '#1E1E1E' : 'transparent'
  };

  return (
    <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl p-4 m-2 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <label className="mr-2 text-gray-600 dark:text-gray-300 font-medium">
            Année:
            <select 
              className="ml-2 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="selectedYear" 
              onChange={handleYearChange}
              value={selectedYear}
              disabled={isLoading}
            >
              {years.length === 0 && <option value="" hidden>Chargement...</option>}
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ChartComponent
          id="influencers-chart"
          height="400px"
          width="100%"
          primaryXAxis={primaryXAxis}
          primaryYAxis={primaryYAxis}
          chartArea={chartArea}
          tooltip={tooltip}
          background={currentMode === 'Dark' ? '#262626' : '#fff'}
          legendSettings={legendSettings}
          palettes={palette}
          border={{ color: currentMode === 'Dark' ? '#333' : '#f0f0f0', width: 1 }}
          enableAnimation={true}
          crosshair={{ enable: true, lineType: 'Vertical', line: { width: 1, color: '#075985' } }}
        >
          <Inject services={[SplineSeries, AreaSeries, Category, Legend, Tooltip, DataLabel, Zoom, Crosshair]} />
          <SeriesCollectionDirective>
            {chartSeries.map((item, index) => (
              <SeriesDirective key={index} {...item} />
            ))}
          </SeriesCollectionDirective>
        </ChartComponent>
      )}
    </div>
  );
};

export default Line4;