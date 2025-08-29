import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { formatBookingStatus, getStatusColor } from '@/types/booking';

const StatusChangeTest: React.FC = () => {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);

  // Test simple de changement de statut
  const testStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      // Simuler un changement de statut
      console.log(`Changement de statut de ${currentStatus} vers ${newStatus}`);
      
      // Ici vous pouvez ajouter un appel réel à votre API
      // const result = await updateBookingStatus('test-id', newStatus);
      
      setCurrentStatus(newStatus);
      toast({
        title: 'Statut mis à jour',
        description: `Statut changé de "${formatBookingStatus(currentStatus)}" vers "${formatBookingStatus(newStatus)}"`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du changement de statut',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test de connexion à Supabase
  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_statuses')
        .select('*')
        .limit(1);

      if (error) {
        toast({
          title: 'Erreur Supabase',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connexion Supabase OK',
          description: `Connecté avec succès. ${data?.length || 0} statuts trouvés.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Impossible de se connecter à Supabase',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test de Changement de Statut</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Statut actuel :</p>
          <Badge className={getStatusColor(currentStatus)}>
            {formatBookingStatus(currentStatus)}
          </Badge>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => testStatusChange('contacted')}
            disabled={isLoading || currentStatus === 'contacted'}
            className="w-full"
            variant="outline"
          >
            → Contacté
          </Button>
          
          <Button
            onClick={() => testStatusChange('confirmed')}
            disabled={isLoading || currentStatus === 'confirmed'}
            className="w-full"
            variant="outline"
          >
            → Confirmé
          </Button>
          
          <Button
            onClick={() => testStatusChange('completed')}
            disabled={isLoading || currentStatus === 'completed'}
            className="w-full"
            variant="outline"
          >
            → Terminé
          </Button>
          
          <Button
            onClick={() => testStatusChange('cancelled')}
            disabled={isLoading || currentStatus === 'cancelled'}
            className="w-full"
            variant="outline"
          >
            → Annulé
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={testSupabaseConnection}
            className="w-full"
            variant="secondary"
          >
            Tester Connexion Supabase
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Ce composant teste la logique de changement de statut.
          Vérifiez la console pour les logs détaillés.
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChangeTest;
