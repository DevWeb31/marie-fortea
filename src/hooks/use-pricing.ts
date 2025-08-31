import { useState, useEffect, useCallback } from 'react';
import { PricingService } from '@/lib/pricing-service';

interface UsePricingReturn {
  pricing: any;
  loading: boolean;
  error: string | null;
  calculatePrice: (serviceType: string, durationHours: number, childrenCount: number) => Promise<number>;
  refresh: () => Promise<void>;
}

export const usePricing = (): UsePricingReturn => {
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Charger les prix
  const loadPricing = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await PricingService.getPublicPricing();
      if (error) {
        setError(error);
      } else if (data) {
        setPricing(data);
        setLastRefresh(new Date());
      }
    } catch (err) {
      setError('Erreur lors du chargement des prix');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculer un prix spécifique
  const calculatePrice = useCallback(async (
    serviceType: string,
    durationHours: number,
    childrenCount: number
  ): Promise<number> => {
    try {
      const { data: calculation, error } = await PricingService.calculatePrice(
        serviceType,
        durationHours,
        childrenCount
      );
      
      if (error) {
        console.error('Erreur lors du calcul du prix:', error);
        // Fallback vers un calcul simple
        const basePrice = 15; // Prix par défaut
        return basePrice * durationHours;
      }
      
      return calculation?.totalAmount || 0;
    } catch (err) {
      console.error('Erreur lors du calcul du prix:', err);
      // Fallback vers un calcul simple
      const basePrice = 15; // Prix par défaut
      return basePrice * durationHours;
    }
  }, []);

  // Actualiser les prix
  const refresh = useCallback(async () => {
    await loadPricing();
  }, [loadPricing]);

  // Charger les prix au montage
  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  // Actualiser automatiquement toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeSinceLastRefresh = now.getTime() - lastRefresh.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeSinceLastRefresh > fiveMinutes) {
        loadPricing();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, [loadPricing, lastRefresh]);

  return {
    pricing,
    loading,
    error,
    calculatePrice,
    refresh
  };
};
