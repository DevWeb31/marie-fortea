import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Calendar, BarChart3 } from 'lucide-react';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implémenter la déconnexion Supabase
    // await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Back-Office Marie Fortea
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Connecté en tant qu'administrateur
              </span>
              <HarmoniousButton
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Déconnexion
              </HarmoniousButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue dans votre espace d'administration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Demandes en attente
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Aucune demande en attente
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total demandes
              </CardTitle>
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Aucune demande reçue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Taux de satisfaction
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">-</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pas encore de données
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Disponibilités
              </CardTitle>
              <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">-</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                À configurer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucune activité
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Les demandes et activités apparaîtront ici
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <HarmoniousButton
                  variant="primary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité à développer')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Gérer les disponibilités
                </HarmoniousButton>
                
                <HarmoniousButton
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité à développer')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Voir les demandes
                </HarmoniousButton>
                
                <HarmoniousButton
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => alert('Fonctionnalité à développer')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </HarmoniousButton>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Development Notice */}
        <div className="mt-8">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🚧 En cours de développement
                </h3>
                <p className="text-blue-700 dark:text-blue-200">
                  Cette interface d'administration est en cours de développement. 
                  Les fonctionnalités seront ajoutées progressivement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
