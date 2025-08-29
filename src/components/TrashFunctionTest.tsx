import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { BookingService } from '@/lib/booking-service';

const TrashFunctionTest: React.FC = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test 1: Vérifier la connexion Supabase
  const testSupabaseConnection = async () => {
    addResult('🔍 Test 1: Vérification de la connexion Supabase...');
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('id')
        .limit(1);

      if (error) {
        addResult(`❌ Erreur de connexion: ${error.message}`);
        toast({
          title: 'Erreur de connexion',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        addResult(`✅ Connexion OK. ${data?.length || 0} réservations trouvées.`);
        toast({
          title: 'Connexion OK',
          description: 'Supabase est accessible',
        });
      }
    } catch (error) {
      addResult(`❌ Exception: ${error}`);
    }
  };

  // Test 2: Vérifier que les vues existent
  const testDatabaseViews = async () => {
    addResult('🔍 Test 2: Vérification des vues de base de données...');
    try {
      // Test de la vue trashed_booking_requests
      const { data: trashedData, error: trashedError } = await supabase
        .from('trashed_booking_requests')
        .select('id')
        .limit(1);

      if (trashedError) {
        addResult(`❌ Vue trashed_booking_requests: ${trashedError.message}`);
      } else {
        addResult(`✅ Vue trashed_booking_requests OK. ${trashedData?.length || 0} éléments.`);
      }

      // Test de la vue archived_booking_requests
      const { data: archivedData, error: archivedError } = await supabase
        .from('archived_booking_requests')
        .select('id')
        .limit(1);

      if (archivedError) {
        addResult(`❌ Vue archived_booking_requests: ${archivedError.message}`);
      } else {
        addResult(`✅ Vue archived_booking_requests OK. ${archivedData?.length || 0} éléments.`);
      }

    } catch (error) {
      addResult(`❌ Exception lors du test des vues: ${error}`);
    }
  };

  // Test 3: Vérifier que les fonctions RPC existent
  const testRPCFunctions = async () => {
    addResult('🔍 Test 3: Vérification des fonctions RPC...');
    try {
      // Test de la fonction soft_delete_booking_request
      const { data: softDeleteData, error: softDeleteError } = await supabase
        .rpc('soft_delete_booking_request', { booking_id: '00000000-0000-0000-0000-000000000000' });

      if (softDeleteError) {
        addResult(`❌ Fonction soft_delete_booking_request: ${softDeleteError.message}`);
      } else {
        addResult(`✅ Fonction soft_delete_booking_request OK. Retour: ${softDeleteData}`);
      }

      // Test de la fonction restore_booking_request
      const { data: restoreData, error: restoreError } = await supabase
        .rpc('restore_booking_request', { booking_id: '00000000-0000-0000-0000-000000000000' });

      if (restoreError) {
        addResult(`❌ Fonction restore_booking_request: ${restoreError.message}`);
      } else {
        addResult(`✅ Fonction restore_booking_request OK. Retour: ${restoreData}`);
      }

    } catch (error) {
      addResult(`❌ Exception lors du test des fonctions RPC: ${error}`);
    }
  };

  // Test 4: Tester le service BookingService
  const testBookingService = async () => {
    addResult('🔍 Test 4: Test du service BookingService...');
    try {
      // Test de la méthode getDeletedBookingRequests
      const deletedResult = await BookingService.getDeletedBookingRequests();
      if (deletedResult.error) {
        addResult(`❌ getDeletedBookingRequests: ${deletedResult.error}`);
      } else {
        addResult(`✅ getDeletedBookingRequests OK. ${deletedResult.data?.length || 0} réservations supprimées.`);
      }

      // Test de la méthode getArchivedBookingRequests
      const archivedResult = await BookingService.getArchivedBookingRequests();
      if (archivedResult.error) {
        addResult(`❌ getArchivedBookingRequests: ${archivedResult.error}`);
      } else {
        addResult(`✅ getArchivedBookingRequests OK. ${archivedResult.data?.length || 0} réservations archivées.`);
      }

    } catch (error) {
      addResult(`❌ Exception lors du test du service: ${error}`);
    }
  };

  // Test 5: Vérifier la structure de la table
  const testTableStructure = async () => {
    addResult('🔍 Test 5: Vérification de la structure de la table...');
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .limit(1);

      if (error) {
        addResult(`❌ Erreur lors de la lecture de la table: ${error.message}`);
      } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        addResult(`✅ Structure de la table OK. Colonnes: ${columns.join(', ')}`);
        
        // Vérifier les champs spécifiques
        const hasDeletedAt = columns.includes('deleted_at');
        const hasArchivedAt = columns.includes('archived_at');
        const hasStatusId = columns.includes('status_id');
        
        addResult(`📋 Champs: deleted_at=${hasDeletedAt ? '✅' : '❌'}, archived_at=${hasArchivedAt ? '✅' : '❌'}, status_id=${hasStatusId ? '✅' : '❌'}`);
      } else {
        addResult('⚠️ Table vide ou aucune donnée trouvée');
      }
    } catch (error) {
      addResult(`❌ Exception lors du test de structure: ${error}`);
    }
  };

  // Test complet
  const runAllTests = async () => {
    setIsLoading(true);
    clearResults();
    addResult('🚀 Démarrage des tests de diagnostic...');
    
    await testSupabaseConnection();
    await testDatabaseViews();
    await testRPCFunctions();
    await testBookingService();
    await testTableStructure();
    
    addResult('✅ Tests terminés. Vérifiez les résultats ci-dessus.');
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          🗑️ Test des Fonctions de Corbeille
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={runAllTests} disabled={isLoading}>
            {isLoading ? 'Tests en cours...' : '🔍 Lancer Tous les Tests'}
          </Button>
          <Button onClick={clearResults} variant="outline">
            🗑️ Effacer les Résultats
          </Button>
        </div>

        <div className="space-y-2">
          <Button onClick={testSupabaseConnection} variant="outline" size="sm">
            Test 1: Connexion Supabase
          </Button>
          <Button onClick={testDatabaseViews} variant="outline" size="sm">
            Test 2: Vues de Base de Données
          </Button>
          <Button onClick={testRPCFunctions} variant="outline" size="sm">
            Test 3: Fonctions RPC
          </Button>
          <Button onClick={testBookingService} variant="outline" size="sm">
            Test 4: Service BookingService
          </Button>
          <Button onClick={testTableStructure} variant="outline" size="sm">
            Test 5: Structure de Table
          </Button>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-medium mb-2">Résultats des Tests :</h4>
          <div className="max-h-96 overflow-y-auto space-y-1">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun test exécuté. Cliquez sur "Lancer Tous les Tests" pour commencer.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p><strong>Instructions :</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Lancez d'abord "Tous les Tests" pour un diagnostic complet</li>
            <li>Vérifiez que toutes les vues et fonctions RPC existent</li>
            <li>Si des erreurs apparaissent, appliquez les migrations Supabase</li>
            <li>Vérifiez que les champs deleted_at et archived_at existent</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrashFunctionTest;
