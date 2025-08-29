import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { BookingService } from '@/lib/booking-service';

const TrashFunctionDebug: React.FC = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [testMode, setTestMode] = useState<'direct' | 'service'>('direct');

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Charger les réservations actives
  const loadActiveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .is('deleted_at', null)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        addResult(`❌ Erreur lors du chargement: ${error.message}`);
      } else {
        setBookingRequests(data || []);
        addResult(`✅ ${data?.length || 0} réservations actives chargées`);
        
        if (data && data.length > 0) {
          setSelectedRequestId(data[0].id);
          addResult(`📋 Première réservation sélectionnée: ${data[0].id}`);
        }
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Test direct de la fonction RPC
  const testDirectRPC = async (id: string) => {
    addResult(`🔍 Test direct de soft_delete_booking_request pour l'ID: ${id}`);
    
    try {
      // Vérifier d'abord que la réservation existe
      const { data: checkData, error: checkError } = await supabase
        .from('booking_requests')
        .select('id, deleted_at, archived_at')
        .eq('id', id)
        .single();

      if (checkError) {
        addResult(`❌ Erreur lors de la vérification: ${checkError.message}`);
        return;
      }

      addResult(`📋 Réservation trouvée: ID=${checkData.id}, deleted_at=${checkData.deleted_at}, archived_at=${checkData.archived_at}`);

      // Tester la fonction RPC
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('soft_delete_booking_request', { booking_id: id });

      if (rpcError) {
        addResult(`❌ Erreur RPC: ${rpcError.message}`);
        toast({
          title: 'Erreur RPC',
          description: rpcError.message,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ RPC réussi. Retour: ${rpcData}`);
        
        if (rpcData === false) {
          addResult(`⚠️ La fonction retourne false - réservation non trouvée ou déjà supprimée`);
        } else if (rpcData === true) {
          addResult(`✅ Réservation mise à la corbeille avec succès`);
          toast({
            title: 'Succès',
            description: 'Réservation mise à la corbeille via RPC direct',
          });
        }
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Test via le service BookingService
  const testViaService = async (id: string) => {
    addResult(`🔍 Test via BookingService.moveToTrash pour l'ID: ${id}`);
    
    try {
      const result = await BookingService.moveToTrash(id);
      
      if (result.error) {
        addResult(`❌ Erreur via service: ${result.error}`);
        toast({
          title: 'Erreur via Service',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ Service réussi: ${result.data}`);
        toast({
          title: 'Succès via Service',
          description: 'Réservation mise à la corbeille via service',
        });
      }
    } catch (error) {
      addResult(`❌ Exception via service: ${error}`);
    }
  };

  // Test de mise à jour directe de la table
  const testDirectUpdate = async (id: string) => {
    addResult(`🔍 Test de mise à jour directe de la table pour l'ID: ${id}`);
    
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id, deleted_at');

      if (error) {
        addResult(`❌ Erreur de mise à jour directe: ${error.message}`);
        toast({
          title: 'Erreur de mise à jour',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ Mise à jour directe réussie: ${data?.length || 0} lignes affectées`);
        if (data && data.length > 0) {
          addResult(`📋 Réservation mise à jour: ${JSON.stringify(data[0])}`);
        }
        toast({
          title: 'Succès mise à jour directe',
          description: 'Réservation mise à jour directement dans la table',
        });
      }
    } catch (error) {
      addResult(`❌ Exception mise à jour directe: ${error}`);
    }
  };

  // Vérifier la structure de la table
  const checkTableStructure = async () => {
    addResult('🔍 Vérification de la structure de la table...');
    
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .limit(1);

      if (error) {
        addResult(`❌ Erreur de structure: ${error.message}`);
      } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        addResult(`✅ Structure OK. Colonnes: ${columns.join(', ')}`);
        
        const hasDeletedAt = columns.includes('deleted_at');
        const hasArchivedAt = columns.includes('archived_at');
        const hasStatusId = columns.includes('status_id');
        
        addResult(`📋 Champs: deleted_at=${hasDeletedAt ? '✅' : '❌'}, archived_at=${hasArchivedAt ? '✅' : '❌'}, status_id=${hasStatusId ? '✅' : '❌'}`);
      }
    } catch (error) {
      addResult(`❌ Exception structure: ${error}`);
    }
  };

  // Vérifier les permissions RLS
  const checkRLSPermissions = async () => {
    addResult('🔍 Vérification des permissions RLS...');
    
    try {
      // Tenter une lecture simple
      const { data, error } = await supabase
        .from('booking_requests')
        .select('id')
        .limit(1);

      if (error) {
        addResult(`❌ Erreur de lecture: ${error.message}`);
      } else {
        addResult(`✅ Lecture OK. ${data?.length || 0} éléments lus.`);
      }

      // Tenter une mise à jour simple
      const { error: updateError } = await supabase
        .from('booking_requests')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000000');

      if (updateError) {
        addResult(`❌ Erreur de mise à jour: ${updateError.message}`);
      } else {
        addResult(`✅ Mise à jour OK (même si aucune ligne affectée).`);
      }
    } catch (error) {
      addResult(`❌ Exception permissions: ${error}`);
    }
  };

  // Test complet
  const runCompleteTest = async () => {
    setIsLoading(true);
    clearResults();
    addResult('🚀 Démarrage du test complet de débogage...');
    
    await loadActiveRequests();
    await checkTableStructure();
    await checkRLSPermissions();
    
    if (selectedRequestId) {
      addResult(`\n🔍 Tests sur la réservation sélectionnée: ${selectedRequestId}`);
      addResult('Utilisez les boutons ci-dessous pour tester différentes méthodes.');
    }
    
    addResult('✅ Test complet terminé.');
    setIsLoading(false);
  };

  useEffect(() => {
    runCompleteTest();
  }, []);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          🐛 Débogage de la Fonction "Mettre à la Corbeille"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Contrôles */}
        <div className="flex space-x-2">
          <Button onClick={runCompleteTest} disabled={isLoading}>
            {isLoading ? 'Tests en cours...' : '🔄 Test Complet'}
          </Button>
          <Button onClick={clearResults} variant="outline">
            🗑️ Effacer les Résultats
          </Button>
        </div>

        {/* Sélection de réservation */}
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
                      <p className="font-medium">{request.parent_name || 'Sans nom'}</p>
                      <p className="text-sm text-gray-600">
                        ID: {request.id} | Status: {request.status} | 
                        Date: {request.requested_date ? new Date(request.requested_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => setSelectedRequestId(request.id)} 
                        variant={selectedRequestId === request.id ? "default" : "outline"}
                        size="sm"
                      >
                        {selectedRequestId === request.id ? '✅ Sélectionnée' : 'Sélectionner'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tests sur la réservation sélectionnée */}
        {selectedRequestId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🧪 Tests sur la Réservation Sélectionnée</CardTitle>
              <p className="text-sm text-gray-600">ID: {selectedRequestId}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => testDirectRPC(selectedRequestId)}
                  variant="outline"
                  className="h-20"
                >
                  🔍 Test RPC Direct
                </Button>
                
                <Button 
                  onClick={() => testViaService(selectedRequestId)}
                  variant="outline"
                  className="h-20"
                >
                  🛠️ Test via Service
                </Button>
                
                <Button 
                  onClick={() => testDirectUpdate(selectedRequestId)}
                  variant="outline"
                  className="h-20"
                >
                  📝 Test Mise à Jour Directe
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note :</strong> Ces tests vous aideront à identifier exactement où se situe le problème.
                  Commencez par le "Test RPC Direct" pour voir si la fonction Supabase fonctionne.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultats des tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Résultats des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="max-h-96 overflow-y-auto space-y-1">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun test exécuté. Cliquez sur "Test Complet" pour commencer.</p>
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
          <p><strong>Instructions de débogage :</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>1. Lancez le "Test Complet" pour diagnostiquer la structure</li>
            <li>2. Sélectionnez une réservation active</li>
            <li>3. Testez d'abord le "Test RPC Direct" pour voir si la fonction Supabase fonctionne</li>
            <li>4. Comparez avec le "Test via Service" pour identifier le problème</li>
            <li>5. Utilisez le "Test Mise à Jour Directe" comme solution de contournement si nécessaire</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
};

export default TrashFunctionDebug;
