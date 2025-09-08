import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Home, Calendar } from 'lucide-react';

const BookingConfirmed: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingId, parentName } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="text-center bg-background/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Réservation confirmée !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Merci {parentName || 'cher client'}, votre réservation a été confirmée avec succès.
            </p>
            
            {bookingId && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Numéro de réservation</p>
                <p className="font-mono text-sm font-medium">#{bookingId.slice(0, 8)}</p>
              </div>
            )}
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Nous avons bien reçu tous les détails de votre réservation.</p>
              <p>Notre équipe vous contactera prochainement pour finaliser les derniers détails.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/contact')}
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Nous contacter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmed;
