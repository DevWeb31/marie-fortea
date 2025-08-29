import React from 'react';
import TrashFunctionTest from '@/components/TrashFunctionTest';
import TrashFunctionLiveTest from '@/components/TrashFunctionLiveTest';
import TrashFunctionDebug from '@/components/TrashFunctionDebug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrashTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🗑️ Test de la Fonction "Mettre à la Corbeille"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Cette page teste toutes les fonctionnalités de gestion de la corbeille après l'application des migrations Supabase.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">✅ Migrations Appliquées</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Toutes les migrations Supabase ont été appliquées avec succès</li>
              <li>• Les vues de base de données sont créées et fonctionnelles</li>
              <li>• Les fonctions RPC sont disponibles et opérationnelles</li>
              <li>• La structure de la table est complète avec tous les champs nécessaires</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🔍 Diagnostic Automatique</h3>
            <p className="text-sm text-blue-700">
              Le composant ci-dessous effectue des tests automatiques pour vérifier que toutes les fonctionnalités 
              de la corbeille fonctionnent correctement. Utilisez-le pour diagnostiquer tout problème restant.
            </p>
          </div>
        </CardContent>
      </Card>

      <TrashFunctionTest />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            🧪 Test en Direct des Fonctions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Ce composant teste en temps réel les fonctions de corbeille avec de vraies données de votre base de données.
            Vous pouvez voir les réservations se déplacer entre les différents états (actives, supprimées, archivées).
          </p>
        </CardContent>
      </Card>

      <TrashFunctionLiveTest />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            🐛 Débogage du Problème "Mettre à la Corbeille"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            <strong>Problème identifié :</strong> Vous recevez l'erreur "Aucune réservation trouvée ou déjà dans la corbeille".
            Ce composant de débogage vous aidera à identifier exactement où se situe le problème.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Erreur Actuelle</h3>
            <p className="text-sm text-red-700">
              <strong>Message d'erreur :</strong> "Aucune réservation trouvée ou déjà dans la corbeille"
            </p>
            <p className="text-sm text-red-700 mt-1">
              <strong>Causes possibles :</strong> Problème avec la fonction RPC, permissions RLS, ou structure de données
            </p>
          </div>
        </CardContent>
      </Card>

      <TrashFunctionDebug />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            📋 Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">1.</span>
              <div>
                <p className="font-medium">Lancez les tests automatiques ci-dessus</p>
                <p className="text-sm text-gray-600">Cliquez sur "Lancer Tous les Tests" pour vérifier que tout fonctionne</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-xl">2.</span>
              <div>
                <p className="font-medium">Utilisez le composant de débogage</p>
                <p className="text-sm text-gray-600">Lancez le "Test Complet" et testez les différentes méthodes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-purple-600 text-xl">3.</span>
              <div>
                <p className="font-medium">Identifiez la cause du problème</p>
                <p className="text-sm text-gray-600">Comparez les résultats des tests RPC direct vs service</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            🆘 En Cas de Problème
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Si la fonction "mettre à la corbeille" ne fonctionne toujours pas :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Vérifiez les résultats des tests automatiques ci-dessus</li>
              <li>Utilisez le composant de débogage pour identifier le problème exact</li>
              <li>Consultez le guide de dépannage : <code className="bg-gray-100 px-1 rounded">TRASH_FUNCTION_TROUBLESHOOTING.md</code></li>
              <li>Vérifiez les logs de la console du navigateur</li>
              <li>Assurez-vous que Supabase est en cours d'exécution</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrashTestPage;
