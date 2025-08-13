import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar,
  Clock,
  Baby,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  X,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  LogOut,
  Eye,
  Filter
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('demandes');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock data - In real app, this would come from Supabase
  const [requests] = useState([
    {
      id: 1,
      parentName: 'Sophie Martinez',
      parentEmail: 'sophie.martinez@email.com',
      parentPhone: '06 12 34 56 78',
      address: '15 Rue Victor Hugo, 31000 Toulouse',
      serviceType: 'mariage',
      date: '2024-02-15',
      startTime: '14:00',
      endTime: '23:00',
      numberOfChildren: '2',
      childrenDetails: 'Emma 4 ans (allergie aux noix), Lucas 2 ans (sieste vers 15h)',
      specialInstructions: 'Les enfants adorent les puzzles. Emma a peur du noir.',
      emergencyContact: 'Grand-mère Patricia',
      emergencyPhone: '06 87 65 43 21',
      status: 'nouveau',
      createdAt: '2024-01-28T10:30:00Z'
    },
    {
      id: 2,
      parentName: 'Thomas Dubois',
      parentEmail: 'thomas.dubois@email.com',
      parentPhone: '06 98 76 54 32',
      address: '8 Avenue Jean Jaurès, 31200 Toulouse',
      serviceType: 'soiree',
      date: '2024-02-10',
      startTime: '19:00',
      endTime: '01:00',
      numberOfChildren: '1',
      childrenDetails: 'Camille 3 ans, très sociable',
      specialInstructions: 'Coucher vers 21h avec histoire',
      emergencyContact: 'Tante Marie',
      emergencyPhone: '06 11 22 33 44',
      status: 'confirme',
      createdAt: '2024-01-25T14:15:00Z'
    },
    {
      id: 3,
      parentName: 'Claire Petit',
      parentEmail: 'claire.petit@email.com',
      parentPhone: '06 55 44 33 22',
      address: '22 Boulevard de Strasbourg, 31000 Toulouse',
      serviceType: 'urgence',
      date: '2024-02-08',
      startTime: '08:00',
      endTime: '18:00',
      numberOfChildren: '3',
      childrenDetails: 'Léa 6 ans, Tom 4 ans, Zoé 18 mois',
      specialInstructions: 'Urgence professionnelle. Repas préparés.',
      emergencyContact: 'Voisine Anna',
      emergencyPhone: '06 77 88 99 00',
      status: 'termine',
      createdAt: '2024-01-20T07:45:00Z'
    }
  ]);

  const [stats] = useState({
    totalRequests: 15,
    confirmedBookings: 8,
    revenue: 1250,
    averageRating: 4.9
  });

  const serviceTypeLabels = {
    'mariage': 'Mariage',
    'urgence': 'Urgence',
    'soiree': 'Soirée parents',
    'weekend': 'Week-end',
    'autre': 'Autre'
  };

  const statusLabels = {
    'nouveau': { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
    'confirme': { label: 'Confirmé', color: 'bg-green-100 text-green-800' },
    'refuse': { label: 'Refusé', color: 'bg-red-100 text-red-800' },
    'termine': { label: 'Terminé', color: 'bg-gray-100 text-gray-800' }
  };

  const handleLogout = () => {
    navigate('/admin');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-green-50/20 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Poppins']">
              Tableau de Bord
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-['Inter']">
              Bonjour Marie ! Voici un aperçu de votre activité.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50 text-sm sm:text-base w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Demandes totales</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Poppins']">{stats.totalRequests}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">+12% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Réservations confirmées</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Poppins']">{stats.confirmedBookings}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">+8% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Revenus ce mois</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Poppins']">{stats.revenue}€</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs sm:text-sm text-green-600">+15% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Poppins']">{stats.averageRating}/5</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
            <TabsTrigger value="demandes" className="text-xs sm:text-sm font-medium">
              Demandes de Garde
            </TabsTrigger>
            <TabsTrigger value="planning" className="text-xs sm:text-sm font-medium">
              Planning
            </TabsTrigger>
            <TabsTrigger value="historique" className="text-xs sm:text-sm font-medium">
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Requests Tab */}
          <TabsContent value="demandes">
            {/* Alert for new requests */}
            {requests.some(r => r.status === 'nouveau') && (
              <Alert className="mb-4 sm:mb-6 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Vous avez {requests.filter(r => r.status === 'nouveau').length} nouvelle(s) demande(s) en attente de traitement.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Requests List */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {requests.map((request) => (
                  <Card 
                    key={request.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedRequest?.id === request.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                    } ${request.status === 'nouveau' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'}`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-['Poppins']">
                            {request.parentName}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-['Inter']">
                            {serviceTypeLabels[request.serviceType]} - {formatDate(request.date)}
                          </p>
                        </div>
                        <Badge className={`${statusLabels[request.status].color} text-xs`}>
                          {statusLabels[request.status].label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(request.startTime)} - {formatTime(request.endTime)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Baby className="w-4 h-4" />
                          <span>{request.numberOfChildren} enfant{request.numberOfChildren > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{request.address.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{request.parentPhone}</span>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <span className="text-xs text-gray-500">
                          Reçu le {formatDate(request.createdAt)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm w-full sm:w-auto"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Request Details */}
              <div className="lg:col-span-1">
                {selectedRequest ? (
                  <Card className="border-0 shadow-lg lg:sticky lg:top-8">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                      <CardTitle className="text-base sm:text-lg font-bold text-gray-900 font-['Poppins']">
                        Détails de la Demande
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-['Poppins']">Contact Parent</h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{selectedRequest.parentName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <a href={`mailto:${selectedRequest.parentEmail}`} className="text-blue-600 hover:underline">
                              {selectedRequest.parentEmail}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <a href={`tel:${selectedRequest.parentPhone}`} className="text-blue-600 hover:underline">
                              {selectedRequest.parentPhone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-['Poppins']">Détails Service</h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div><strong>Type:</strong> {serviceTypeLabels[selectedRequest.serviceType]}</div>
                          <div><strong>Date:</strong> {formatDate(selectedRequest.date)}</div>
                          <div><strong>Horaires:</strong> {formatTime(selectedRequest.startTime)} - {formatTime(selectedRequest.endTime)}</div>
                          <div><strong>Adresse:</strong> <span className="break-words">{selectedRequest.address}</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-['Poppins']">Enfants</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-xs sm:text-sm">
                          <div className="mb-2"><strong>Nombre:</strong> {selectedRequest.numberOfChildren}</div>
                          <div><strong>Détails:</strong> <span className="break-words">{selectedRequest.childrenDetails}</span></div>
                        </div>
                      </div>

                      {selectedRequest.specialInstructions && (
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-['Poppins']">Instructions Spéciales</h4>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs sm:text-sm break-words">
                            {selectedRequest.specialInstructions}
                          </div>
                        </div>
                      )}

                      {selectedRequest.emergencyContact && (
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-['Poppins']">Contact d'Urgence</h4>
                          <div className="text-xs sm:text-sm">
                            <div>{selectedRequest.emergencyContact}</div>
                            <div className="text-blue-600">{selectedRequest.emergencyPhone}</div>
                          </div>
                        </div>
                      )}

                      {selectedRequest.status === 'nouveau' && (
                        <div className="pt-3 sm:pt-4 border-t space-y-2 sm:space-y-3">
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmer la demande
                          </Button>
                          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 text-sm sm:text-base">
                            <X className="w-4 h-4 mr-2" />
                            Refuser la demande
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-4 sm:p-6 text-center text-gray-500">
                      <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm sm:text-base">Sélectionnez une demande pour voir les détails</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-lg sm:text-xl">Planning des Interventions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center py-8 sm:py-12">
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base text-gray-500 mb-4">Le calendrier interactif sera bientôt disponible</p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Vous pourrez gérer vos disponibilités et voir vos interventions planifiées
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="historique">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-lg sm:text-xl">Historique des Interventions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {requests.filter(r => r.status === 'termine').map((request) => (
                    <div key={request.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 font-['Poppins']">
                            {request.parentName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {serviceTypeLabels[request.serviceType]} - {formatDate(request.date)}
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          Terminé
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {request.numberOfChildren} enfant{request.numberOfChildren > 1 ? 's' : ''} • {formatTime(request.startTime)} - {formatTime(request.endTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;