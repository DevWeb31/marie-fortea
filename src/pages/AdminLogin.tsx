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
    password: ''
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
      if (formData.email === 'marie@example.com' && formData.password === 'admin123') {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue Marie ! Redirection vers votre tableau de bord...",
        });
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 flex items-center justify-center">
      <div className="max-w-sm sm:max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-6 sm:mb-8">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Espace Professionnel
          </Badge>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Connexion Admin
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 font-['Inter'] px-4">
            Accédez à votre tableau de bord pour gérer vos demandes et disponibilités.
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 font-['Poppins'] flex items-center justify-center">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Connexion Sécurisée
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700">
                  Email professionnel
                </Label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-3" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="marie@example.com"
                    required
                    className="pl-9 sm:pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-3" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-9 sm:pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base sm:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>
            
            {/* Demo credentials info */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600 text-center">
                <div className="font-medium mb-2">Démonstration :</div>
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