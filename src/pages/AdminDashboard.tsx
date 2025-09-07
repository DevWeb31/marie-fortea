import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Calendar, BarChart3, ExternalLink, FileText, MessageSquare, Euro } from 'lucide-react';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ui/theme-toggle';
import MaintenanceToggle from '@/components/MaintenanceToggle';
import BookingRequestsList from '@/components/BookingRequestsList';
import SiteSettingsManager from '@/components/SiteSettingsManager';
import PricingManagement from './PricingManagement';
import { BookingService } from '@/lib/booking-service';
import { SiteSettingsService } from '@/lib/site-settings-service';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'settings' | 'pricing'>('dashboard');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [stats, setStats] = useState({
    pending: 0,
    total: 0,
    contacted: 0,
    confirmed: 0,
    estimatedTotal: 0
  });

  useEffect(() => {
    loadStats();
    loadMaintenanceStatus();
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

  const loadMaintenanceStatus = async () => {
    try {
      const result = await SiteSettingsService.isMaintenanceModeEnabled();
      if (result.data !== null) {
        setIsMaintenanceMode(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du mode maintenance:', error);
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
    { id: 'pricing', label: 'Gestion des Prix', icon: Euro },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-b border-gray-200/50 dark:border-zinc-700/50 rounded-2xl shadow-lg">
        {/* Effet de fond décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 dark:from-indigo-800/20 dark:to-blue-800/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header Mobile - Empilé */}
          <div className="block sm:hidden">
            <div className="space-y-6">
              {/* Titre et branding */}
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-3">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Back-Office Marie Fortea
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Tableau de bord administratif
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir le site public
                </a>
              </div>
              
              {/* Actions et statut */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="p-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl shadow-sm backdrop-blur-sm">
                    <ThemeToggle />
                  </div>
                  <div className="p-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl shadow-sm backdrop-blur-sm">
                    <MaintenanceToggle />
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Administrateur connecté
                  </span>
                </div>
                <HarmoniousButton
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-gray-200/50 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800"
                >
                  Déconnexion
                </HarmoniousButton>
              </div>
            </div>
          </div>
          
          {/* Header Desktop - Horizontal */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Back-Office Marie Fortea
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Tableau de bord administratif
                  </p>
                </div>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir le site public
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl shadow-sm backdrop-blur-sm">
                  <ThemeToggle />
                </div>
                <div className="p-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl shadow-sm backdrop-blur-sm">
                  <MaintenanceToggle />
                </div>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Administrateur
              </span>
              <HarmoniousButton
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-gray-200/50 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800 shadow-sm"
              >
                Déconnexion
              </HarmoniousButton>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation des onglets */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 mt-4 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          {/* Navigation Mobile - Scrollable horizontal */}
          <div className="block sm:hidden w-full">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'dashboard' | 'bookings' | 'settings')}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Navigation Desktop - Horizontal classique */}
          <div className="hidden sm:block w-full">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'dashboard' | 'bookings' | 'settings')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-zinc-800'
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
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="mt-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tableau de bord
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Bienvenue dans votre espace d'administration
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl">
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

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl">
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

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl">
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

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl">
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
              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl">
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
                  <Button
                    onClick={() => setActiveTab('pricing')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Euro className="h-4 w-4 mr-2" />
                    Gérer les prix
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl">
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
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Gérer les prix</p>
                    <p>Utilisez l'onglet "Gestion des Prix" pour modifier les tarifs de vos services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Marge mobile et tablette en bas de la page */}
            <div className="block lg:hidden h-8"></div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="mt-6 mb-8">
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

        {activeTab === 'pricing' && (
          <div>
            <PricingManagement />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <SiteSettingsManager />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
