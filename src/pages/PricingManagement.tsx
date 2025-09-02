import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PricingService, PricingConfig } from '@/lib/pricing-service';
import { Euro, Save, RefreshCw, Calculator, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';

const PricingManagement: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewCalculation, setPreviewCalculation] = useState<any>(null);
  const [previewInputs, setPreviewInputs] = useState({
    serviceType: 'babysitting',
    durationHours: 2,
    childrenCount: 1
  });
  const [selectedService, setSelectedService] = useState<string>('');

  // Charger la configuration des prix
  useEffect(() => {
    loadPricingConfig();
  }, []);

  const loadPricingConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await PricingService.getPricingConfig();
      if (error) {
        toast({
          title: 'Erreur',
          description: error,
          variant: 'destructive',
        });
      } else if (data) {
        setConfig(data);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement de la configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder la configuration
  const saveConfig = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const { error } = await PricingService.updatePricingConfig(config);
      if (error) {
        toast({
          title: 'Erreur',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Succès',
          description: 'Configuration des prix mise à jour avec succès',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculer un exemple de prix
  const calculatePreview = async () => {
    try {
      const { data, error } = await PricingService.calculatePrice(
        previewInputs.serviceType,
        previewInputs.durationHours,
        previewInputs.childrenCount
      );
      if (error) {
        toast({
          title: 'Erreur',
          description: error,
          variant: 'destructive',
        });
      } else {
        setPreviewCalculation(data);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du calcul',
        variant: 'destructive',
      });
    }
  };

  // Initialiser les prix par défaut
  const initializeDefaultPricing = async () => {
    setSaving(true);
    try {
      const { error } = await PricingService.initializeDefaultPricing();
      if (error) {
        toast({
          title: 'Erreur',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Succès',
          description: 'Prix par défaut initialisés',
        });
        await loadPricingConfig();
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'initialisation',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Mettre à jour un champ de configuration
  const updateField = (field: keyof PricingConfig, value: any) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  // Mettre à jour un prix de service
  const updateServicePrice = (service: string, price: number) => {
    if (!config) return;
    setConfig({
      ...config,
      servicePrices: {
        ...config.servicePrices,
        [service]: price
      }
    });
  };

  // Mettre à jour un prix de nuit
  const updateServiceNightPrice = (service: string, price: number) => {
    if (!config) return;
    setConfig({
      ...config,
      serviceNightPrices: {
        ...config.serviceNightPrices,
        [service]: price
      }
    });
  };

  // Obtenir le nom d'affichage d'un service
  const getServiceDisplayName = (service: string): string => {
    const serviceNames: { [key: string]: string } = {
      'babysitting': 'Garde d\'enfants',
      'event_support': 'Soutien événementiel',
      'evening_care': 'Garde en soirée',
      'emergency_care': 'Garde d\'urgence'
    };
    return serviceNames[service] || service.replace('_', ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement de la configuration...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Configuration non trouvée
            </CardTitle>
            <CardDescription>
              Aucune configuration de prix n'a été trouvée. Initialisez les prix par défaut pour commencer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={initializeDefaultPricing} disabled={saving}>
              {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Initialiser les prix par défaut
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Prix</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configurez les tarifs de vos services de garde d'enfants
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadPricingConfig}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={saveConfig} disabled={saving}>
            {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration du supplément enfants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Supplément Enfants
            </CardTitle>
            <CardDescription>
              Configurez le supplément pour les enfants supplémentaires (à partir du 3ème enfant)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="additionalChildRate">Supplément par enfant supplémentaire (€/heure)</Label>
              <Input
                id="additionalChildRate"
                type="number"
                step="0.01"
                min="0"
                value={config.additionalChildRate}
                onChange={(e) => updateField('additionalChildRate', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ce supplément s'applique à partir du 3ème enfant
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prix par type de service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Euro className="h-5 w-5 mr-2" />
              Prix par Service
            </CardTitle>
            <CardDescription>
              Définissez le prix direct par heure pour chaque type de service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="serviceType">Type de service</Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un type de service" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(config.servicePrices).map(([service, price]) => (
                    <SelectItem key={service} value={service}>
                      <div className="flex items-center justify-between w-full">
                        <span>{getServiceDisplayName(service)}</span>
                        <span className="text-sm text-gray-500 ml-2">{price}€/heure</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="servicePrice">
                    Prix de jour pour "{getServiceDisplayName(selectedService)}" (€/heure)
                  </Label>
                  <Input
                    id="servicePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={config.servicePrices[selectedService as keyof typeof config.servicePrices]}
                    onChange={(e) => updateServicePrice(selectedService, parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>

                {/* Tarif de nuit si applicable */}
                {config.serviceNightConfig[selectedService as keyof typeof config.serviceNightConfig] && (
                  <div>
                    <Label htmlFor="serviceNightPrice">
                      Prix de nuit pour "{getServiceDisplayName(selectedService)}" (€/heure)
                    </Label>
                    <Input
                      id="serviceNightPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={config.serviceNightPrices[selectedService as keyof typeof config.serviceNightPrices] || 0}
                      onChange={(e) => updateServiceNightPrice(selectedService, parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Tarif appliqué à partir de 22h
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Résumé des prix actuels */}
            <Separator />
            <div>
              <Label className="text-sm font-medium">Résumé des prix actuels</Label>
              <div className="mt-2 space-y-2">
                {Object.entries(config.servicePrices).map(([service, price]) => (
                  <div key={service} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <span className="text-sm font-medium">{getServiceDisplayName(service)}</span>
                      {config.serviceNightConfig[service as keyof typeof config.serviceNightConfig] && (
                        <div className="text-xs text-gray-500 mt-1">
                          Nuit: {config.serviceNightPrices[service as keyof typeof config.serviceNightPrices]}€/h
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-sm">{price}€/heure</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculateur de prix en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Calculateur de Prix
          </CardTitle>
          <CardDescription>
            Testez vos tarifs avec différents paramètres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="previewService">Type de service</Label>
              <Select
                value={previewInputs.serviceType}
                onValueChange={(value) => setPreviewInputs({ ...previewInputs, serviceType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un type de service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="babysitting">{getServiceDisplayName('babysitting')}</SelectItem>
                  <SelectItem value="event_support">{getServiceDisplayName('event_support')}</SelectItem>
                  <SelectItem value="evening_care">{getServiceDisplayName('evening_care')}</SelectItem>
                  <SelectItem value="emergency_care">{getServiceDisplayName('emergency_care')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previewDuration">Durée (heures)</Label>
              <Input
                id="previewDuration"
                type="number"
                min="0.5"
                step="0.5"
                value={previewInputs.durationHours}
                onChange={(e) => setPreviewInputs({ ...previewInputs, durationHours: parseFloat(e.target.value) || 1 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="previewChildren">Nombre d'enfants</Label>
              <Input
                id="previewChildren"
                type="number"
                min="1"
                max="10"
                value={previewInputs.childrenCount}
                onChange={(e) => setPreviewInputs({ ...previewInputs, childrenCount: parseInt(e.target.value) || 1 })}
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={calculatePreview} className="mb-4">
            <Calculator className="h-4 w-4 mr-2" />
            Calculer le prix
          </Button>

          {previewCalculation && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Résultat du calcul :</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Prix de base ({previewCalculation.breakdown.durationHours}h × {previewCalculation.breakdown.hourlyRate}€) :</span>
                  <span>{previewCalculation.baseAmount.toFixed(2)}€</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  Service : {getServiceDisplayName(previewCalculation.breakdown.serviceType)}
                </div>
                {previewCalculation.additionalChildrenAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Supplément enfants supplémentaires :</span>
                    <span>+{previewCalculation.additionalChildrenAmount.toFixed(2)}€</span>
                  </div>
                )}
                {previewCalculation.additionalChildrenAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Supplément enfants supplémentaires (à partir du 3ème) :</span>
                    <span>+{previewCalculation.additionalChildrenAmount.toFixed(2)}€</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total :</span>
                  <span className="text-green-600">{previewCalculation.totalAmount.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations sur la dernière mise à jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dernière mise à jour : {config.lastUpdated.toLocaleString('fr-FR')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les modifications seront automatiquement appliquées sur le site public
              </p>
            </div>
            <Badge variant="secondary">
              Configuration active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingManagement;
