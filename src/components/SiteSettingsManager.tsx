import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SiteSettingsService, SiteSettings } from '@/lib/site-settings-service';
import { Mail, Settings, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import SmtpSettingsManager from './SmtpSettingsManager';

const SiteSettingsManager: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'smtp'>('general');
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});

  // Charger les paramètres au montage du composant
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const result = await SiteSettingsService.getAllSettings();
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.data) {
        setSettings(result.data);
        // Initialiser les valeurs éditées avec les valeurs actuelles
        const initialValues: { [key: string]: string } = {};
        result.data.forEach(setting => {
          initialValues[setting.key] = setting.value;
        });
        setEditedValues(initialValues);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSwitchChange = (key: string, checked: boolean) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: checked.toString()
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      let hasErrors = false;
      const errors: string[] = [];

      // Sauvegarder chaque paramètre modifié
      for (const [key, value] of Object.entries(editedValues)) {
        const currentSetting = settings.find(s => s.key === key);
        if (currentSetting && currentSetting.value !== value) {
          const result = await SiteSettingsService.updateSetting(key, value);
          if (result.error) {
            hasErrors = true;
            errors.push(`${key}: ${result.error}`);
          }
        }
      }

      if (hasErrors) {
        toast({
          title: 'Erreur lors de la sauvegarde',
          description: `Erreurs: ${errors.join(', ')}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Paramètres sauvegardés',
          description: 'Les paramètres ont été mis à jour avec succès.',
        });
        
        // Recharger les paramètres pour mettre à jour l'interface
        await loadSettings();
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde des paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    return settings.some(setting => 
      editedValues[setting.key] !== setting.value
    );
  };

  const getSettingValue = (key: string) => {
    return editedValues[key] || '';
  };

  const isBooleanSetting = (key: string) => {
    return key === 'enable_booking_email_notifications';
  };

  const getSettingDisplayName = (key: string) => {
    const displayNames: { [key: string]: string } = {
      'site_title': 'Titre du site',
      'site_description': 'Description du site',
      'contact_email': 'Email de contact général',
      'contact_phone': 'Téléphone de contact',
      'booking_notification_email': 'Email de réception des réservations',
      'enable_booking_email_notifications': 'Activer les notifications par email',
      'booking_email_template': 'Template d\'email'
    };
    return displayNames[key] || key;
  };

  const getSettingDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      'site_title': 'Titre principal affiché sur le site',
      'site_description': 'Description du site pour le référencement',
      'contact_email': 'Email de contact général affiché sur le site',
      'contact_phone': 'Numéro de téléphone affiché sur le site',
      'booking_notification_email': 'Adresse email qui recevra les notifications de nouvelles réservations',
      'enable_booking_email_notifications': 'Activer ou désactiver l\'envoi automatique d\'emails lors de nouvelles réservations',
      'booking_email_template': 'Template utilisé pour les emails de notification (défaut: "default")'
    };
    return descriptions[key] || 'Paramètre de configuration';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Chargement des paramètres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paramètres du site</h2>
          <p className="text-muted-foreground">
            Gérez la configuration générale de votre site et les notifications de réservation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={loadSettings}
            disabled={isSaving}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button
            onClick={saveSettings}
            disabled={!hasChanges() || isSaving}
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'general', label: 'Général', icon: Settings },
            { id: 'email', label: 'Notifications', icon: Mail },
            { id: 'smtp', label: 'SMTP (Fallback)', icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'general' | 'email' | 'smtp')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

              {/* Contenu des onglets */}
        {activeTab === 'general' && (
          <>
            {/* Paramètres généraux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Paramètres généraux
                </CardTitle>
                <CardDescription>
                  Configuration générale du site et informations de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings
                  .filter(setting => 
                    !setting.key.includes('booking') && 
                    !setting.key.includes('email') && 
                    !setting.key.includes('smtp') &&
                    !setting.key.includes('pricing')
                  )
                  .map(setting => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {getSettingDisplayName(setting.key)}
                      </Label>
                      <Input
                        id={setting.key}
                        value={getSettingValue(setting.key)}
                        onChange={(e) => handleValueChange(setting.key, e.target.value)}
                        placeholder={`Entrez ${getSettingDisplayName(setting.key).toLowerCase()}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {getSettingDescription(setting.key)}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'email' && (
          <>
            {/* Paramètres des réservations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Paramètres des réservations
                </CardTitle>
                <CardDescription>
                  Configuration des notifications et emails de réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email de notification */}
                <div className="space-y-2">
                  <Label htmlFor="booking_notification_email" className="text-sm font-medium">
                    Email de réception des réservations
                  </Label>
                  <Input
                    id="booking_notification_email"
                    type="email"
                    value={getSettingValue('booking_notification_email')}
                    onChange={(e) => handleValueChange('booking_notification_email', e.target.value)}
                    placeholder="admin@marie-fortea.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Adresse email qui recevra les notifications de nouvelles réservations
                  </p>
                </div>

                {/* Activation des notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable_booking_email_notifications" className="text-sm font-medium">
                      Activer les notifications par email
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Envoyer automatiquement un email lors de nouvelles réservations
                    </p>
                  </div>
                  <Switch
                    id="enable_booking_email_notifications"
                    checked={getSettingValue('enable_booking_email_notifications') === 'true'}
                    onCheckedChange={(checked) => handleSwitchChange('enable_booking_email_notifications', checked)}
                  />
                </div>

                {/* Template d'email */}
                <div className="space-y-2">
                  <Label htmlFor="booking_email_template" className="text-sm font-medium">
                    Template d'email
                  </Label>
                  <Input
                    id="booking_email_template"
                    value={getSettingValue('booking_email_template')}
                    onChange={(e) => handleValueChange('booking_email_template', e.target.value)}
                    placeholder="default"
                  />
                  <p className="text-xs text-muted-foreground">
                    Template utilisé pour les emails de notification (défaut: "default")
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'smtp' && (
          <SmtpSettingsManager />
        )}

      {/* Indicateur de modifications */}
      {hasChanges() && (
        <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Vous avez des modifications non sauvegardées. N'oubliez pas de sauvegarder vos changements.
          </span>
        </div>
      )}

      {/* Indicateur de succès */}
      {!hasChanges() && settings.length > 0 && (
        <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Tous les paramètres sont à jour.
          </span>
        </div>
      )}
    </div>
  );
};

export default SiteSettingsManager;
