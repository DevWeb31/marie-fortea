import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SiteSettingsService } from '@/lib/site-settings-service';
import { Mail, Save, AlertCircle } from 'lucide-react';

const SmtpSettingsManager: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_from: 'noreply@marie-fortea.com'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const result = await SiteSettingsService.getSmtpSettings();
      if (result.data) {
        setSettings(prev => ({ ...prev, ...result.data }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Sauvegarder les paramètres essentiels
      await SiteSettingsService.upsertSetting('smtp_host', settings.smtp_host);
      await SiteSettingsService.upsertSetting('smtp_port', settings.smtp_port);
      await SiteSettingsService.upsertSetting('smtp_username', settings.smtp_username);
      await SiteSettingsService.upsertSetting('smtp_password', settings.smtp_password);
      await SiteSettingsService.upsertSetting('smtp_from', settings.smtp_from);
      await SiteSettingsService.upsertSetting('smtp_encryption', 'tls');

      toast({
        title: 'Paramètres sauvegardés',
        description: 'Configuration SMTP mise à jour avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configuration SMTP (Fallback)
          </CardTitle>
          <CardDescription>
            Chargement...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Configuration SMTP (Fallback)
        </CardTitle>
        <CardDescription>
          Configuration de secours si MailGun n'est pas disponible. 
          <span className="text-amber-600 font-medium"> MailGun est utilisé en priorité.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Configuration simplifiée</p>
              <p>Seuls les paramètres essentiels sont affichés. MailGun reste la méthode principale d'envoi d'emails.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_host">Serveur SMTP</Label>
            <Input
              id="smtp_host"
              value={settings.smtp_host}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_port">Port</Label>
            <Input
              id="smtp_port"
              value={settings.smtp_port}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
              placeholder="587"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_username">Nom d'utilisateur</Label>
            <Input
              id="smtp_username"
              value={settings.smtp_username}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_password">Mot de passe</Label>
            <Input
              id="smtp_password"
              type="password"
              value={settings.smtp_password}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="smtp_from">Email expéditeur</Label>
            <Input
              id="smtp_from"
              value={settings.smtp_from}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_from: e.target.value }))}
              placeholder="noreply@marie-fortea.com"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmtpSettingsManager;