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
    console.log('🗺️ MapDialog: useEffect déclenché, isOpen:', isOpen);
    
    if (isOpen && !mapContainer) {
      console.log('🗺️ MapDialog: Modal ouvert, création du conteneur de carte');
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
          console.log('🗺️ MapDialog: Vérification de Leaflet...');
          
          // Vérifier si Leaflet est déjà chargé
          if ((window as any).L) {
            console.log('✅ Leaflet déjà chargé, création de la carte...');
            createMap(container);
            return;
          }

          console.log('📥 Chargement des CSS Leaflet...');
          // Charger les CSS de Leaflet
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.crossOrigin = '';
          document.head.appendChild(link);

          console.log('📥 Chargement du script Leaflet...');
          // Charger le script de Leaflet
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.crossOrigin = '';
          
          script.onload = () => {
            console.log('✅ Script Leaflet chargé avec succès');
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
      console.log('🗺️ MapDialog: Modal fermé, nettoyage');
      setMapContainer(null);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, mapContainer]);

  const createMap = (container: HTMLDivElement) => {
    try {
      console.log('🗺️ MapDialog: Création de la carte...');
      const L = (window as any).L;
      
      if (!L) {
        throw new Error('Leaflet n\'est pas disponible');
      }
      
      // Coordonnées de Montaigut sur Save
      const montaigutCoords: [number, number] = [43.6917, 1.2319];
      console.log('📍 Coordonnées Montaigut:', montaigutCoords);
      
      // Créer la carte
      const map = L.map(container).setView(montaigutCoords, 10);
      console.log('🗺️ Carte créée');
      
      // Ajouter la couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);
      console.log('🗺️ Tuiles ajoutées');
      
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
      console.log('✅ Carte créée avec succès !');
    } catch (error) {
      setError(`Erreur lors de la création de la carte: ${error.message}`);
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Zone de service - Montaigut sur Save
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-600 mb-4">
            Carte interactive montrant la zone de service de Marie Fortea avec un rayon de 20 km autour de Montaigut sur Save.
          </p>
          
          <div className="w-full h-[60vh] rounded-lg border border-gray-200 relative bg-gray-50" style={{ minHeight: '400px' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="text-gray-600">Chargement de la carte...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75 rounded-lg">
                <div className="text-center">
                  <p className="text-red-600 mb-2">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    size="sm"
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
