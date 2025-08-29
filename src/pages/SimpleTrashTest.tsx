import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { BookingService } from '@/lib/booking-service';

const SimpleTrashTest: React.FC = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => setResults([]);

  // Charger les réservations
  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .is('deleted_at', null)
        .is('archived_at', null)
        .limit(5);

      if (error) {
        addResult(`❌ Erreur chargement: ${error.message}`);
      } else {
        setRequests(data || []);
        addResult(`✅ ${data?.length || 0} réservations chargées`);
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Test 1: Vérifier la structure
  const testStructure = async () => {
    addResult('🔍 Test de la structure de la table...');
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .limit(1);

      if (error) {
        addResult(`❌ Erreur structure: ${error.message}`);
      } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        const hasDeletedAt = columns.includes('deleted_at');
        const hasArchivedAt = columns.includes('archived_at');
        addResult(`✅ Structure OK. deleted_at: ${hasDeletedAt ? '✅' : '❌'}, archived_at: ${hasArchivedAt ? '✅' : '❌'}`);
      }
    } catch (error) {
      addResult(`❌ Exception structure: ${error}`);
    }
  };

  // Test 2: Test RPC direct
  const testRPCDirect = async (id: string) => {
    addResult(`🔍 Test RPC direct pour ${id}...`);
    try {
      const { data, error } = await supabase
        .rpc('soft_delete_booking_request', { booking_id: id });

      if (error) {
        addResult(`❌ Erreur RPC: ${error.message}`);
      } else {
        addResult(`✅ RPC OK. Retour: ${data}`);
        if (data === false) {
          addResult(`⚠️ RPC retourne false - réservation non trouvée ou déjà supprimée`);
        }
      }
    } catch (error) {
      addResult(`❌ Exception RPC: ${error}`);
    }
  };

  // Test 3: Test via service
  const testViaService = async (id: string) => {
    addResult(`🔍 Test via service pour ${id}...`);
    try {
      const result = await BookingService.moveToTrash(id);
      if (result.error) {
        addResult(`❌ Erreur service: ${result.error}`);
      } else {
        addResult(`✅ Service OK: ${result.data}`);
      }
    } catch (error) {
      addResult(`❌ Exception service: ${error}`);
    }
  };

  // Test 4: Test mise à jour directe
  const testDirectUpdate = async (id: string) => {
    addResult(`🔍 Test mise à jour directe pour ${id}...`);
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');

      if (error) {
        addResult(`❌ Erreur mise à jour directe: ${error.message}`);
      } else {
        addResult(`✅ Mise à jour directe OK: ${data?.length || 0} lignes affectées`);
      }
    } catch (error) {
      addResult(`❌ Exception mise à jour directe: ${error}`);
    }
  };

  // Test complet
  const runAllTests = async () => {
    setIsLoading(true);
    clearResults();
    addResult('🚀 Démarrage des tests...');
    
    await loadRequests();
    await testStructure();
    
    if (requests.length > 0) {
      const firstId = requests[0].id;
      addResult(`\n🧪 Tests sur la première réservation: ${firstId}`);
      addResult('Utilisez les boutons ci-dessous pour tester chaque méthode.');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🧪 Test Simplifié - Fonction "Mettre à la Corbeille"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600 mb-6">
            Page de test simplifiée pour diagnostiquer rapidement le problème de la corbeille
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Problème Actuel</h3>
            <p className="text-sm text-red-700">
              <strong>Erreur :</strong> "Aucune réservation trouvée ou déjà dans la corbeille"
            </p>
            <p className="text-sm text-red-700 mt-1">
              <strong>Objectif :</strong> Identifier exactement où se situe le problème
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle>🎛️ Contrôles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button onClick={runAllTests} disabled={isLoading}>
              {isLoading ? 'Tests en cours...' : '🔄 Lancer Tous les Tests'}
            </Button>
            <Button onClick={clearResults} variant="outline">
              🗑️ Effacer les Résultats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Réservations */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Réservations Actives ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-gray-500">Aucune réservation trouvée</p>
          ) : (
            <div className="space-y-2">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{request.parent_name || 'Sans nom'}</p>
                    <p className="text-sm text-gray-600">
                      ID: {request.id} | Status: {request.status}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => testRPCDirect(request.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      🔍 Test RPC
                    </Button>
                    <Button 
                      onClick={() => testViaService(request.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      🛠️ Test Service
                    </Button>
                    <Button 
                      onClick={() => testDirectUpdate(request.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      📝 Test Direct
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Résultats des Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="max-h-96 overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun test exécuté. Cliquez sur "Lancer Tous les Tests" pour commencer.</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Instructions de Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-xl">1.</span>
              <div>
                <p className="font-medium">Lancez tous les tests</p>
                <p className="text-sm text-gray-600">Cliquez sur "🔄 Lancer Tous les Tests"</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">2.</span>
              <div>
                <p className="font-medium">Testez chaque méthode</p>
                <p className="text-sm text-gray-600">Utilisez les 3 boutons de test sur chaque réservation</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-purple-600 text-xl">3.</span>
              <div>
                <p className="font-medium">Analysez les résultats</p>
                <p className="text-sm text-gray-600">Comparez les résultats pour identifier le problème</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Cette page teste exactement la même fonctionnalité que votre composant principal.
              Si ça ne fonctionne pas ici, ça ne fonctionnera pas non plus dans votre application.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleTrashTest;
