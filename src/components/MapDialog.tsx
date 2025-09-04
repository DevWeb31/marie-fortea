import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X, Loader2 } from 'lucide-react';
import './MapDialog.css';

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapDialog: React.FC<MapDialogProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !mapContainer) {
      setIsLoading(true);
      setError(null);
      
      // Créer le conteneur de carte
      const container = document.createElement('div');
      container.id = 'map-container';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.borderRadius = '8px';
      setMapContainer(container);
      
      // Charger Leaflet de manière dynamique
      const loadMap = async () => {
        try {
          // Vérifier si Leaflet est déjà chargé
          if ((window as any).L) {
            createMap(container);
            return;
          }

          // Charger les CSS de Leaflet
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.crossOrigin = '';
          document.head.appendChild(link);

          // Charger le script de Leaflet
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.crossOrigin = '';
          
          script.onload = () => {
            createMap(container);
          };
          
          script.onerror = (e) => {
            console.error('❌ Erreur lors du chargement du script Leaflet:', e);
            setError('Erreur lors du chargement de la carte. Veuillez réessayer.');
            setIsLoading(false);
          };
          
          document.head.appendChild(script);
        } catch (error) {
          console.error('❌ Erreur lors du chargement de la carte:', error);
          setError('Erreur lors du chargement de la carte. Veuillez réessayer.');
          setIsLoading(false);
        }
      };
      
      loadMap();
    } else if (!isOpen) {
      setMapContainer(null);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, mapContainer]);

  const createMap = (container: HTMLDivElement) => {
    try {
  
      const L = (window as any).L;
      
      if (!L) {
        throw new Error('Leaflet n\'est pas disponible');
      }
      
      // Coordonnées de Montaigut sur Save
      const montaigutCoords: [number, number] = [43.6917, 1.2319];
      
      // Créer la carte
      const map = L.map(container).setView(montaigutCoords, 10);
      
      // Ajouter la couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);
      
      // Ajouter le cercle de 20km
      const circle = L.circle(montaigutCoords, {
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        weight: 2,
        radius: 20000 // 20km en mètres
      }).addTo(map);
      
      // Forcer le redimensionnement de la carte
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
      setIsLoading(false);
    } catch (error) {
      setError(`Erreur lors de la création de la carte: ${error.message}`);
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl h-[85vh] sm:h-[80vh] p-0">
        <DialogHeader className="p-3 sm:p-4 md:p-6 pb-0">
          <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold">
            Zone de service - Montaigut sur Save
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogHeader>
        
        <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4">
            Carte interactive montrant la zone de service de Marie Fortea avec un rayon de 20 km autour de Montaigut sur Save.
          </p>
          
          <div className="w-full h-[65vh] sm:h-[60vh] md:h-[55vh] rounded-lg border border-gray-200 relative bg-gray-50" style={{ minHeight: '300px' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin text-blue-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Chargement de la carte...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75 rounded-lg">
                <div className="text-center p-4">
                  <p className="text-xs sm:text-sm text-red-600 mb-2">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            )}
            
            {mapContainer && !isLoading && !error && (
              <div 
                ref={(el) => {
                  if (el && mapContainer) {
                    el.innerHTML = '';
                    el.appendChild(mapContainer);
                  }
                }}
                className="w-full h-full rounded-lg"
              />
            )}
          </div>
          

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
