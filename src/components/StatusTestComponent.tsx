import React, { useState, useEffect } from 'react';
import { 
  BOOKING_STATUSES, 
  getBookingStatusByCode, 
  getBookingStatusName, 
  getBookingStatusColor,
  getBookingStatusIcon,
  formatStatusDisplay,
  getAvailableTransitions,
  changeBookingStatus
} from '../types/booking-status';

const StatusTestComponent: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('nouvelle');
  const [testResult, setTestResult] = useState<string>('');

  // Test des fonctions utilitaires
  const testUtilityFunctions = () => {
    const status = getBookingStatusByCode(selectedStatus);
    const name = getBookingStatusName(selectedStatus);
    const color = getBookingStatusColor(selectedStatus);
    const icon = getBookingStatusIcon(selectedStatus);
    const display = formatStatusDisplay(selectedStatus);

    setTestResult(`
✅ Test des fonctions utilitaires pour le statut "${selectedStatus}":

📊 Statut complet: ${JSON.stringify(status, null, 2)}
🏷️ Nom: ${name}
🎨 Couleur: ${color}
🔖 Icône: ${icon}

🎯 Affichage formaté:
- Nom: ${display.name}
- Couleur: ${display.color}
- Icône: ${display.icon}
- Description: ${display.description}
- Classes CSS: ${display.cssClasses}
    `);
  };

  // Test des transitions disponibles
  const testTransitions = async () => {
    setTestResult('🔄 Test des transitions disponibles...');
    
    try {
      // Simulation d'un ID de réservation (en production, ce serait un vrai ID)
      const mockBookingId = '123e4567-e89b-12d3-a456-426614174000';
      const transitions = await getAvailableTransitions(mockBookingId);
      
      setTestResult(`
✅ Test des transitions disponibles:

📋 Transitions trouvées: ${transitions.length}
${transitions.map(t => `
  • ${t.toStatusName} (${t.toStatusCode})
    - Couleur: ${t.toStatusColor}
    - Icône: ${t.toStatusIcon}
    - Admin requis: ${t.requiresAdminApproval ? 'Oui' : 'Non'}
    - Notes requises: ${t.requiresNotes ? 'Oui' : 'Non'}
`).join('')}
      `);
    } catch (error) {
      setTestResult(`❌ Erreur lors du test des transitions: ${error}`);
    }
  };

  // Test du changement de statut
  const testChangeStatus = async () => {
    setTestResult('🔄 Test du changement de statut...');
    
    try {
      const mockBookingId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await changeBookingStatus(
        mockBookingId,
        'acceptee',
        'Test de changement de statut',
        'admin@test.com',
        'Test de transition'
      );
      
      setTestResult(`
✅ Test du changement de statut:

📊 Résultat: ${result.success ? 'Succès' : 'Échec'}
💬 Message: ${result.message || 'Aucun message'}
❌ Erreur: ${result.error || 'Aucune erreur'}
      `);
    } catch (error) {
      setTestResult(`❌ Erreur lors du test du changement de statut: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        🧪 Composant de Test - Système de Statuts
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section des statuts disponibles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Statuts Disponibles
          </h2>
          
          <div className="space-y-3">
            {BOOKING_STATUSES.map((status) => (
              <div
                key={status.code}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStatus === status.code 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedStatus(status.code)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="font-medium text-gray-900">
                    {status.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({status.code})
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {status.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">
                    Icône: {status.icon}
                  </span>
                  <span className="text-xs text-gray-500">
                    Ordre: {status.sortOrder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section des tests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧪 Tests des Fonctionnalités
          </h2>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={testUtilityFunctions}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔧 Tester les fonctions utilitaires
            </button>
            
            <button
              onClick={testTransitions}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              🔄 Tester les transitions disponibles
            </button>
            
            <button
              onClick={testChangeStatus}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ✏️ Tester le changement de statut
            </button>
          </div>

          {/* Affichage du statut sélectionné */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Statut sélectionné: {selectedStatus}
            </h3>
            {selectedStatus && (
              <div className="text-sm text-gray-600">
                <p><strong>Nom:</strong> {getBookingStatusName(selectedStatus)}</p>
                <p><strong>Couleur:</strong> {getBookingStatusColor(selectedStatus)}</p>
                <p><strong>Icône:</strong> {getBookingStatusIcon(selectedStatus)}</p>
                <p><strong>Description:</strong> {getBookingStatusByCode(selectedStatus)?.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Résultats des tests */}
      {testResult && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Résultats des Tests
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
            {testResult}
          </pre>
        </div>
      )}

      {/* Informations sur le système */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          ℹ️ Informations sur le Système
        </h2>
        <div className="text-blue-700 space-y-2">
          <p>• <strong>8 statuts prédéfinis</strong> avec couleurs et icônes</p>
          <p>• <strong>Transitions autorisées</strong> entre statuts avec validation</p>
          <p>• <strong>Fonctions utilitaires</strong> pour la gestion des statuts</p>
          <p>• <strong>Compatibilité legacy</strong> avec l'ancien système</p>
          <p>• <strong>Types TypeScript</strong> complets et typés</p>
        </div>
      </div>
    </div>
  );
};

export default StatusTestComponent;
