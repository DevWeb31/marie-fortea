import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PricingService } from '@/lib/pricing-service';
import { Euro, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface DynamicPricingProps {
  showDetails?: boolean;
  className?: string;
}

const DynamicPricing: React.FC<DynamicPricingProps> = ({ showDetails = true, className = '' }) => {
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await PricingService.getPublicPricing();
      if (error) {
        setError(error);
      } else if (data) {
        setPricing(data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des prix');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Chargement des prix...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !pricing) {
    return (
      <Card className={`border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
        <CardHeader className="rounded-t-xl">
          <CardTitle className="font-['Poppins'] text-base dark:text-white sm:text-lg flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
            Prix temporairement indisponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
              <span>Prix de base :</span>
              <span className="font-semibold">15€/heure</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
              <span>Supplément par enfant :</span>
              <span className="font-semibold">+5€/heure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
      <CardHeader className="rounded-t-xl">
        <CardTitle className="font-['Poppins'] text-base dark:text-white sm:text-lg flex items-center">
          <Euro className="mr-2 h-4 w-4 text-green-600" />
          Tarifs & Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        {/* Supplément enfants */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">Supplément par enfant</span>
            </div>
            <span className="font-bold text-green-600 text-xs sm:text-sm">+{pricing.additionalChildRate}€/heure</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Ce supplément s'applique à partir du 3ème enfant
          </p>
        </div>

        {/* Services disponibles */}
        {showDetails && (
          <>
            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2 flex items-center text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Nos Services
              </h4>
              <div className="space-y-2">
                {pricing.services.map((service: any) => (
                  <div key={service.type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">{service.name}</span>
                    </div>
                    <span className="font-semibold text-xs text-gray-900 dark:text-white sm:text-sm">{service.price}€/heure</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}


      </CardContent>
    </Card>
  );
};

export default DynamicPricing;
