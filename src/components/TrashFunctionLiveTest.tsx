import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { BookingService } from '@/lib/booking-service';

const TrashFunctionLiveTest: React.FC = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [deletedRequests, setDeletedRequests] = useState<any[]>([]);
  const [archivedRequests, setArchivedRequests] = useState<any[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Charger les réservations existantes
  const loadBookingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .is('deleted_at', null)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        addResult(`❌ Erreur lors du chargement: ${error.message}`);
      } else {
        setBookingRequests(data || []);
        addResult(`✅ ${data?.length || 0} réservations actives chargées`);
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Charger les réservations supprimées
  const loadDeletedRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('trashed_booking_requests')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) {
        addResult(`❌ Erreur lors du chargement des supprimées: ${error.message}`);
      } else {
        setDeletedRequests(data || []);
        addResult(`✅ ${data?.length || 0} réservations supprimées chargées`);
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Charger les réservations archivées
  const loadArchivedRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('archived_booking_requests')
        .select('*')
        .order('archived_at', { ascending: false });

      if (error) {
        addResult(`❌ Erreur lors du chargement des archivées: ${error.message}`);
      } else {
        setArchivedRequests(data || []);
        addResult(`✅ ${data?.length || 0} réservations archivées chargées`);
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Test de la fonction moveToTrash
  const testMoveToTrash = async (id: string) => {
    addResult(`🔍 Test de moveToTrash pour l'ID: ${id}`);
    
    try {
      const result = await BookingService.moveToTrash(id);
      
      if (result.error) {
        addResult(`❌ Erreur moveToTrash: ${result.error}`);
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ moveToTrash réussi: ${result.data}`);
        toast({
          title: 'Succès',
          description: 'Réservation mise à la corbeille avec succès',
        });
        
        // Recharger les données
        await loadBookingRequests();
        await loadDeletedRequests();
      }
    } catch (error) {
      addResult(`❌ Exception moveToTrash: ${error}`);
    }
  };

  // Test de la fonction restoreFromTrash
  const testRestoreFromTrash = async (id: string) => {
    addResult(`🔍 Test de restoreFromTrash pour l'ID: ${id}`);
    
    try {
      const result = await BookingService.restoreFromTrash(id);
      
      if (result.error) {
        addResult(`❌ Erreur restoreFromTrash: ${result.error}`);
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ restoreFromTrash réussi: ${result.data}`);
        toast({
          title: 'Succès',
          description: 'Réservation restaurée avec succès',
        });
        
        // Recharger les données
        await loadBookingRequests();
        await loadDeletedRequests();
      }
    } catch (error) {
      addResult(`❌ Exception restoreFromTrash: ${error}`);
    }
  };

  // Test de la fonction archiveBooking
  const testArchiveBooking = async (id: string) => {
    addResult(`🔍 Test de archiveBooking pour l'ID: ${id}`);
    
    try {
      const result = await BookingService.archiveBooking(id);
      
      if (result.error) {
        addResult(`❌ Erreur archiveBooking: ${result.error}`);
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ archiveBooking réussi: ${result.data}`);
        toast({
          title: 'Succès',
          description: 'Réservation archivée avec succès',
        });
        
        // Recharger les données
        await loadBookingRequests();
        await loadArchivedRequests();
      }
    } catch (error) {
      addResult(`❌ Exception archiveBooking: ${error}`);
    }
  };

  // Test de la fonction unarchiveBooking
  const testUnarchiveBooking = async (id: string) => {
    addResult(`🔍 Test de unarchiveBooking pour l'ID: ${id}`);
    
    try {
      const result = await BookingService.unarchiveBooking(id);
      
      if (result.error) {
        addResult(`❌ Erreur unarchiveBooking: ${result.error}`);
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ unarchiveBooking réussi: ${result.data}`);
        toast({
          title: 'Succès',
          description: 'Réservation désarchivée avec succès',
        });
        
        // Recharger les données
        await loadBookingRequests();
        await loadArchivedRequests();
      }
    } catch (error) {
      addResult(`❌ Exception unarchiveBooking: ${error}`);
    }
  };

  // Test complet de toutes les fonctions
  const runAllTests = async () => {
    setIsLoading(true);
    clearResults();
    addResult('🚀 Démarrage des tests en direct...');
    
    await loadBookingRequests();
    await loadDeletedRequests();
    await loadArchivedRequests();
    
    addResult('✅ Tests de chargement terminés. Utilisez les boutons ci-dessous pour tester les fonctions.');
    setIsLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          🧪 Test en Direct des Fonctions de Corbeille
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Boutons de contrôle */}
        <div className="flex space-x-2">
          <Button onClick={runAllTests} disabled={isLoading}>
            {isLoading ? 'Tests en cours...' : '🔄 Recharger Toutes les Données'}
          </Button>
          <Button onClick={clearResults} variant="outline">
            🗑️ Effacer les Résultats
          </Button>
        </div>

        {/* Réservations actives */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 Réservations Actives ({bookingRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingRequests.length === 0 ? (
              <p className="text-gray-500">Aucune réservation active trouvée</p>
            ) : (
              <div className="space-y-2">
                {bookingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{request.parent_name}</p>
                      <p className="text-sm text-gray-600">
                        {request.service_type} - {new Date(request.requested_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => testMoveToTrash(request.id)} 
                        variant="destructive" 
                        size="sm"
                      >
                        🗑️ Mettre à la Corbeille
                      </Button>
                      <Button 
                        onClick={() => testArchiveBooking(request.id)} 
                        variant="outline" 
                        size="sm"
                      >
                        📁 Archiver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Réservations supprimées */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🗑️ Réservations Supprimées ({deletedRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {deletedRequests.length === 0 ? (
              <p className="text-gray-500">Aucune réservation supprimée trouvée</p>
            ) : (
              <div className="space-y-2">
                {deletedRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div className="flex-1">
                      <p className="font-medium">{request.parent_name}</p>
                      <p className="text-sm text-gray-600">
                        Supprimée le {new Date(request.deleted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => testRestoreFromTrash(request.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      🔄 Restaurer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Réservations archivées */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📁 Réservations Archivées ({archivedRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {archivedRequests.length === 0 ? (
              <p className="text-gray-500">Aucune réservation archivée trouvée</p>
            ) : (
              <div className="space-y-2">
                {archivedRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                    <div className="flex-1">
                      <p className="font-medium">{request.parent_name}</p>
                      <p className="text-sm text-gray-600">
                        Archivée le {new Date(request.archived_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => testUnarchiveBooking(request.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      📂 Désarchiver
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats des tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Résultats des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="max-h-64 overflow-y-auto space-y-1">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun test exécuté. Cliquez sur "Recharger Toutes les Données" pour commencer.</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500">
          <p><strong>Instructions :</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Les données sont chargées automatiquement au démarrage</li>
            <li>Utilisez les boutons pour tester chaque fonction individuellement</li>
            <li>Vérifiez que les réservations se déplacent correctement entre les onglets</li>
            <li>Les résultats des tests s'affichent en temps réel</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default TrashFunctionLiveTest;
