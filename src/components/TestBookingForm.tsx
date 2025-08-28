import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookingService } from '@/lib/booking-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

const TestBookingForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const [formData, setFormData] = useState({
    parentName: 'Test Parent',
    parentEmail: 'test@example.com',
    parentPhone: '06 12 34 56 78',
    parentAddress: '123 Rue de Test, 75001 Paris',
    serviceType: 'babysitting',
    requestedDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    childrenCount: 2,
    childrenDetails: '2 enfants - Test',
    childrenAges: '5, 8',
    specialInstructions: 'Instructions de test',
    emergencyContact: 'Contact Urgence Test',
    emergencyPhone: '06 98 76 54 32',
    preferredContactMethod: 'phone' as const,
    contactNotes: 'Notes de test',
    captchaToken: 'test-captcha-token'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTestResult(null);

    try {
      const result = await BookingService.createBookingRequest(formData);

      if (result.error) {
        setTestResult({
          success: false,
          message: result.error,
          details: result
        });
        
        toast({
          title: 'Test échoué',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setTestResult({
          success: true,
          message: 'Réservation créée avec succès ! Vérifiez votre email de notification.',
          details: result.data
        });
        
        toast({
          title: 'Test réussi !',
          description: 'Réservation créée et email envoyé (si configuré)',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue';
      setTestResult({
        success: false,
        message: errorMessage,
        details: error
      });
      
      toast({
        title: 'Erreur de test',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Test du Système de Réservation et d'Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Ce formulaire de test permet de vérifier que le système de réservation fonctionne 
            et que les emails de notification sont envoyés correctement.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">Nom du parent</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="parentEmail">Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentPhone">Téléphone</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serviceType">Type de service</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange('serviceType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="babysitting">Garde d'enfants</SelectItem>
                    <SelectItem value="event_support">Soutien événementiel</SelectItem>
                    <SelectItem value="overnight_care">Garde de nuit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestedDate">Date demandée</Label>
                <Input
                  id="requestedDate"
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => handleInputChange('requestedDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="childrenCount">Nombre d'enfants</Label>
                <Select
                  value={formData.childrenCount.toString()}
                  onValueChange={(value) => handleInputChange('childrenCount', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 enfant</SelectItem>
                    <SelectItem value="2">2 enfants</SelectItem>
                    <SelectItem value="3">3 enfants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Test en cours...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Tester la réservation et l'email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Résultat du test */}
      {testResult && (
        <Card className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className={`flex items-center ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.success ? (
                <CheckCircle className="mr-2 h-5 w-5" />
              ) : (
                <AlertCircle className="mr-2 h-5 w-5" />
              )}
              {testResult.success ? 'Test réussi !' : 'Test échoué'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
              {testResult.message}
            </p>
            
            {testResult.details && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium">
                  Détails techniques
                </summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions de test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Vérifiez la configuration</p>
              <p>Assurez-vous que les paramètres SMTP sont configurés dans Supabase</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Soumettez le test</p>
              <p>Remplissez le formulaire et cliquez sur "Tester la réservation et l'email"</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Vérifiez l'email</p>
              <p>Vérifiez que l'email de notification est reçu à l'adresse configurée</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestBookingForm;
