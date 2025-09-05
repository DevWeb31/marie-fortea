import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SiteSettingsService } from '@/lib/site-settings-service';
import { Wrench, AlertTriangle } from 'lucide-react';

const MaintenanceToggle: React.FC = () => {
  const { toast } = useToast();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    loadMaintenanceStatus();
  }, []);

  const loadMaintenanceStatus = async () => {
    try {
      const result = await SiteSettingsService.isMaintenanceModeEnabled();
      if (result.data !== null) {
        setIsMaintenanceMode(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du mode maintenance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    setIsToggling(true);
    try {
      const result = await SiteSettingsService.setMaintenanceMode(enabled);
      
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      setIsMaintenanceMode(enabled);
      
      toast({
        title: enabled ? 'Mode maintenance activé' : 'Mode maintenance désactivé',
        description: enabled 
          ? 'Le site est maintenant en mode maintenance' 
          : 'Le site est maintenant accessible au public',
        variant: enabled ? 'default' : 'default',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la modification du mode maintenance',
        variant: 'destructive',
      });
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-300">Chargement...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
      isMaintenanceMode 
        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center space-x-3">
        {isMaintenanceMode ? (
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        ) : (
          <Wrench className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
        <div>
          <Label htmlFor="maintenance-toggle" className="text-sm font-medium cursor-pointer">
            Mode Maintenance
          </Label>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {isMaintenanceMode 
              ? 'Le site est en maintenance - Seuls les admins peuvent y accéder'
              : 'Le site est accessible au public'
            }
          </p>
        </div>
      </div>
      
      <Switch
        id="maintenance-toggle"
        checked={isMaintenanceMode}
        onCheckedChange={handleToggle}
        disabled={isToggling}
        className="data-[state=checked]:bg-amber-600"
      />
    </div>
  );
};

export default MaintenanceToggle;
