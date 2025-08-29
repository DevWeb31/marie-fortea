import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Calendar, BarChart3, ExternalLink, FileText, MessageSquare, Trash2 } from 'lucide-react';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ui/theme-toggle';
import BookingRequestsList from '@/components/BookingRequestsList';
import SiteSettingsManager from '@/components/SiteSettingsManager';
import TrashTestPage from '@/pages/TrashTestPage';
import { BookingService } from '@/lib/booking-service';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'settings' | 'trash-test'>('dashboard');
  const [stats, setStats] = useState({
    pending: 0,
    total: 0,
    contacted: 0,
    confirmed: 0,
    estimatedTotal: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await BookingService.getBookingStatistics();
      if (result.data) {
        setStats({
          pending: result.data.pending || 0,
          total: result.data.total || 0,
          contacted: result.data.contacted || 0,
          confirmed: result.data.confirmed || 0,
          estimatedTotal: 0 // Sera calculé plus tard
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Rediriger quand même
      navigate('/admin');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'bookings', label: 'Demandes de réservation', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'trash-test', label: 'Test Corbeille', icon: Trash2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Back-Office Marie Fortea
              </h1>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Voir le site
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
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

      {/* Navigation des onglets */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'dashboard' | 'bookings' | 'settings' | 'trash-test')}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
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
                  <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.pending === 0 ? 'Aucune demande en attente' : `${stats.pending} demande${stats.pending > 1 ? 's' : ''} à traiter`}
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.total === 0 ? 'Aucune demande reçue' : `${stats.total} demande${stats.total > 1 ? 's' : ''} reçue${stats.total > 1 ? 's' : ''}`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Demandes contactées
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contacted}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.contacted === 0 ? 'Aucune demande contactée' : `${stats.contacted} demande${stats.contacted > 1 ? 's' : ''} contactée${stats.contacted > 1 ? 's' : ''}`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Demandes confirmées
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.confirmed === 0 ? 'Aucune demande confirmée' : `${stats.confirmed} demande${stats.confirmed > 1 ? 's' : ''} confirmée${stats.confirmed > 1 ? 's' : ''}`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab('bookings')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir toutes les demandes
                  </Button>
                  <Button
                    onClick={() => setActiveTab('bookings')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Traiter les demandes en attente
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Demandes en attente : {stats.pending}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Demandes contactées : {stats.contacted}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Demandes confirmées : {stats.confirmed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Total : {stats.total}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg">Comment utiliser le back-office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Consulter les demandes</p>
                    <p>Utilisez l'onglet "Demandes de réservation" pour voir toutes les demandes reçues</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Traiter les demandes</p>
                    <p>Mettez à jour le statut des demandes et ajoutez des notes administratives</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Suivre l'évolution</p>
                    <p>Surveillez les statistiques et l'évolution des demandes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestion des Demandes de Réservation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez toutes les demandes de réservation reçues via le site
              </p>
            </div>
            
            <BookingRequestsList />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <SiteSettingsManager />
          </div>
        )}

        {activeTab === 'trash-test' && (
          <TrashTestPage />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
