import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate authentication - In real app, this would connect to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo credentials
      if (
        formData.email === 'marie@example.com' &&
        formData.password === 'admin123'
      ) {
        toast({
          title: 'Connexion réussie',
          description:
            'Bienvenue Marie ! Redirection vers votre tableau de bord...',
        });

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        toast({
          title: 'Erreur de connexion',
          description: 'Email ou mot de passe incorrect.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la connexion.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-sm px-4 sm:max-w-md sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
            <Shield className="mr-2 h-4 w-4" />
            Espace Professionnel
          </Badge>

          <h1 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 sm:text-3xl">
            Connexion Admin
          </h1>

          <p className="px-4 font-['Inter'] text-sm text-gray-600 sm:text-base">
            Accédez à votre tableau de bord pour gérer vos demandes et
            disponibilités.
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="flex items-center justify-center font-['Poppins'] text-lg font-bold text-gray-900 sm:text-xl">
              <Lock className="mr-2 h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              Connexion Sécurisée
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-gray-700 sm:text-sm"
                >
                  Email professionnel
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="marie@example.com"
                    required
                    className="pl-9 text-sm sm:pl-10 sm:text-base"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-gray-700 sm:text-sm"
                >
                  Mot de passe
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    placeholder="••••••••"
                    required
                    className="pl-9 text-sm sm:pl-10 sm:text-base"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl sm:text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            {/* Demo credentials info */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3 sm:mt-6 sm:p-4">
              <div className="text-center text-xs text-gray-600 sm:text-sm">
                <div className="mb-2 font-medium">Démonstration :</div>
                <div>Email: marie@example.com</div>
                <div>Mot de passe: admin123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
