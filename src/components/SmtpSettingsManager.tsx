import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SiteSettingsService } from '@/lib/site-settings-service';
import { hashPassword, verifyPassword } from '@/lib/password-utils';
import { getCurrentConfig } from '@/config/environments';
import { 
  Mail, 
  Settings, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  TestTube,
  Eye,
  EyeOff,
  Server,
  Shield,
  User,
  Lock
} from 'lucide-react';

const SmtpSettingsManager: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [smtpSettings, setSmtpSettings] = useState<{ [key: string]: string }>({});
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});
  const [plainPassword, setPlainPassword] = useState<string>(''); // Mot de passe en clair pour les tests
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  // Charger les paramètres SMTP au montage du composant
  useEffect(() => {
    loadSmtpSettings();
  }, []);

  const loadSmtpSettings = async () => {
    setIsLoading(true);
    try {
      const result = await SiteSettingsService.getSmtpSettings();
      if (result.error) {
        // Si les paramètres SMTP n'existent pas, les créer automatiquement
        console.log('Paramètres SMTP manquants, création automatique...');
        await createDefaultSmtpSettings();
        // Recharger après création
        const retryResult = await SiteSettingsService.getSmtpSettings();
        if (retryResult.error) {
          toast({
            title: 'Erreur',
            description: retryResult.error,
            variant: 'destructive',
          });
          return;
        }
        if (retryResult.data) {
          setSmtpSettings(retryResult.data);
          setEditedValues(retryResult.data);
        }
      } else if (result.data) {
        setSmtpSettings(result.data);
        setEditedValues(result.data);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des paramètres SMTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSmtpSettings = async () => {
    try {
      const defaultSettings = [
        { key: 'smtp_host', value: 'smtp.gmail.com' },
        { key: 'smtp_port', value: '587' },
        { key: 'smtp_username', value: '' },
        { key: 'smtp_password', value: '' },
        { key: 'smtp_from', value: 'noreply@marie-fortea.com' },
        { key: 'smtp_encryption', value: 'tls' },
        { key: 'resend_api_key', value: '' },
        { key: 'email_provider', value: 'resend' }
      ];

      for (const setting of defaultSettings) {
        await SiteSettingsService.upsertSetting(setting.key, setting.value);
      }

      toast({
        title: 'Paramètres SMTP créés',
        description: 'Les paramètres SMTP par défaut ont été créés automatiquement.',
      });
    } catch (error) {
      console.error('Erreur lors de la création des paramètres SMTP par défaut:', error);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    // Ne pas gérer le mot de passe ici, il est géré séparément
    if (key === 'smtp_password') return;
    
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Optimisation : Utiliser useMemo pour calculer les changements seulement quand nécessaire
  const hasChanges = useMemo(() => {
    // Vérifier les changements dans les paramètres normaux
    const normalChanges = Object.keys(editedValues).some(key => {
      if (key === 'smtp_password') return false; // Ignorer le mot de passe haché
      
      const editedValue = editedValues[key] || '';
      const originalValue = smtpSettings[key] || '';
      return editedValue !== originalValue;
    });
    
    // Vérifier si le mot de passe a été saisi
    const passwordChanged = plainPassword !== '';
    
    return normalChanges || passwordChanged;
  }, [editedValues, smtpSettings, plainPassword]);

  // Optimisation : Utiliser useCallback pour la sauvegarde
  const saveSmtpSettings = useCallback(async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      const settingsToSave: { [key: string]: string } = { ...editedValues };
      
      // Si un nouveau mot de passe a été saisi, le hasher et l'ajouter
      if (plainPassword) {
        const hashedPassword = await hashPassword(plainPassword);
        settingsToSave.smtp_password = hashedPassword;
        setPlainPassword(''); // Réinitialiser le mot de passe en clair
      }
      
      // Sauvegarder via l'Edge Function
      const supabaseConfig = getCurrentConfig();
      const response = await fetch(`${supabaseConfig.url}/functions/v1/save-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        },
        body: JSON.stringify({ updates: settingsToSave }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Mettre à jour l'état local
      setSmtpSettings(settingsToSave);
      setEditedValues(settingsToSave);
      
      toast({
        title: 'Succès !',
        description: 'Configuration SMTP sauvegardée avec succès',
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue';
      toast({
        title: 'Erreur',
        description: `Erreur lors de la sauvegarde: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, editedValues, plainPassword, toast]);

  const testSmtpConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      console.log('🧪 Début du test SMTP...');
      console.log('🔐 plainPassword:', plainPassword);
      console.log('📝 editedValues:', editedValues);
      
      // Utiliser le mot de passe en clair pour le test
      const testSettings = { ...editedValues };
      if (plainPassword) {
        testSettings.smtp_password = plainPassword;
      }
      
      // Créer un objet temporaire avec les paramètres de test
      const testConfig = {
        host: testSettings.smtp_host || '',
        port: parseInt(testSettings.smtp_port || '587'),
        username: testSettings.smtp_username || '',
        password: plainPassword || '',
        from: testSettings.smtp_from || '',
        encryption: testSettings.smtp_encryption || 'tls'
      };
      
      console.log('🔧 Configuration de test:', testConfig);
      
      // Vérifier que tous les paramètres sont présents
      if (!testConfig.host || !testConfig.port || !testConfig.username || !testConfig.password) {
        throw new Error('Tous les paramètres SMTP doivent être remplis pour le test');
      }
      
      // Appeler la fonction Edge Function pour tester la connexion
      console.log('🌐 Appel de l\'Edge Function test-smtp...');
      const supabaseConfig = getCurrentConfig();
      console.log('🔗 URL Supabase:', supabaseConfig.url);
      console.log('🔑 Clé anon:', supabaseConfig.anonKey ? 'Présente' : 'Manquante');
      
      const response = await fetch(`${supabaseConfig.url}/functions/v1/test-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        },
        body: JSON.stringify(testConfig),
      });
      
      console.log('📡 Réponse reçue:', response.status, response.statusText);
      const result = await response.json();
      console.log('📄 Contenu de la réponse:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du test de connexion');
      }
      
      setTestResult({
        success: true,
        message: 'Test de connexion SMTP réussi ! La configuration est valide.',
        details: result
      });
      
      toast({
        title: 'Test réussi !',
        description: 'La configuration SMTP est valide',
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue';
      setTestResult({
        success: false,
        message: errorMessage,
        details: error
      });
      
      toast({
        title: 'Test échoué',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testResendConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const resendApiKey = getSettingValue('resend_api_key');
      if (!resendApiKey) {
        throw new Error('La clé API Resend n\'est pas configurée.');
      }

      // Appeler la fonction Edge Function pour tester la connexion
      const supabaseConfig = getCurrentConfig();
      const response = await fetch(`${supabaseConfig.url}/functions/v1/test-resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        },
        body: JSON.stringify({ apiKey: resendApiKey }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du test de connexion Resend');
      }
      
      setTestResult({
        success: true,
        message: 'Test de connexion Resend réussi ! La configuration est valide.',
        details: result
      });
      
      toast({
        title: 'Test réussi !',
        description: 'La configuration Resend est valide',
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue';
      setTestResult({
        success: false,
        message: errorMessage,
        details: error
      });
      
      toast({
        title: 'Test échoué',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getSettingValue = (key: string) => {
    return editedValues[key] || '';
  };

  const getSettingDisplayName = (key: string) => {
    const displayNames: { [key: string]: string } = {
      'smtp_host': 'Serveur SMTP',
      'smtp_port': 'Port SMTP',
      'smtp_username': 'Nom d\'utilisateur',
      'smtp_password': 'Mot de passe',
      'smtp_from': 'Email d\'expédition',
      'smtp_encryption': 'Type d\'encryption'
    };
    return displayNames[key] || key;
  };

  const getSettingDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      'smtp_host': 'Adresse du serveur SMTP (ex: smtp.gmail.com)',
      'smtp_port': 'Port du serveur SMTP (ex: 587 pour TLS, 465 pour SSL)',
      'smtp_username': 'Votre email ou nom d\'utilisateur SMTP',
      'smtp_password': 'Votre mot de passe ou mot de passe d\'application',
      'smtp_from': 'Email qui apparaîtra comme expéditeur',
      'smtp_encryption': 'Type de chiffrement pour la connexion'
    };
    return descriptions[key] || 'Paramètre de configuration SMTP';
  };

  const getPresetConfigurations = () => {
    return [
      {
        name: 'Gmail',
        host: 'smtp.gmail.com',
        port: '587',
        encryption: 'tls',
        note: 'Requiert un mot de passe d\'application'
      },
      {
        name: 'Outlook/Hotmail',
        host: 'smtp-mail.outlook.com',
        port: '587',
        encryption: 'tls',
        note: 'Connexion standard'
      },
      {
        name: 'Yahoo',
        host: 'smtp.mail.yahoo.com',
        port: '587',
        encryption: 'tls',
        note: 'Requiert un mot de passe d\'application'
      },
      {
        name: 'OVH',
        host: 'ssl0.ovh.net',
        port: '587',
        encryption: 'tls',
        note: 'Serveur français'
      }
    ];
  };

  const applyPresetConfiguration = (preset: any) => {
    setEditedValues(prev => ({
      ...prev,
      smtp_host: preset.host,
      smtp_port: preset.port,
      smtp_encryption: preset.encryption
    }));
    
    toast({
      title: 'Configuration appliquée',
      description: `Configuration ${preset.name} appliquée. N'oubliez pas de remplir vos identifiants.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Chargement des paramètres SMTP...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuration SMTP
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configurez les paramètres de votre serveur SMTP pour l'envoi d'emails
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Bouton de test temporaire */}
          <Button
            onClick={() => {
              console.log('🧪 Test de l\'état des variables:');
              console.log('📝 editedValues:', editedValues);
              console.log('💾 smtpSettings:', smtpSettings);
              console.log('🔐 plainPassword:', plainPassword);
              console.log('✅ hasChanges():', hasChanges);
              console.log('🔍 Object.keys(editedValues):', Object.keys(editedValues));
              console.log('🔍 Object.keys(smtpSettings):', Object.keys(smtpSettings));
            }}
            variant="outline"
            size="sm"
          >
            Debug State
          </Button>
          
          {/* Bouton de test SMTP */}
          <Button
            onClick={testSmtpConnection}
            disabled={!hasChanges || isSaving || isTesting}
            variant="outline"
          >
            {isTesting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Test...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Tester la connexion
              </>
            )}
          </Button>
          
          {/* Bouton de sauvegarde */}
          <Button
            onClick={saveSmtpSettings}
            disabled={!hasChanges || isSaving || isTesting}
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

      

      {/* Configurations prédéfinies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Configurations prédéfinies
          </CardTitle>
          <CardDescription>
            Cliquez sur une configuration pour l'appliquer automatiquement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getPresetConfigurations().map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex-col items-start text-left"
                onClick={() => applyPresetConfiguration(preset)}
              >
                <div className="font-medium mb-1">{preset.name}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {preset.host}:{preset.port}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {preset.note}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres SMTP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Paramètres du serveur SMTP
          </CardTitle>
          <CardDescription>
            Configurez les paramètres de connexion à votre serveur SMTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host" className="flex items-center">
                <Server className="mr-2 h-4 w-4" />
                Serveur SMTP *
              </Label>
              <Input
                id="smtp_host"
                value={getSettingValue('smtp_host')}
                onChange={(e) => handleValueChange('smtp_host', e.target.value)}
                placeholder="smtp.gmail.com"
              />
              <p className="text-xs text-muted-foreground">
                {getSettingDescription('smtp_host')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_port" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Port SMTP *
              </Label>
              <Input
                id="smtp_port"
                value={getSettingValue('smtp_port')}
                onChange={(e) => handleValueChange('smtp_port', e.target.value)}
                placeholder="587"
              />
              <p className="text-xs text-muted-foreground">
                {getSettingDescription('smtp_port')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_username" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Nom d'utilisateur *
              </Label>
              <Input
                id="smtp_username"
                value={getSettingValue('smtp_username')}
                onChange={(e) => handleValueChange('smtp_username', e.target.value)}
                placeholder="votre.email@gmail.com"
              />
              <p className="text-xs text-muted-foreground">
                {getSettingDescription('smtp_username')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Mot de passe *
              </Label>
              <div className="relative">
                <Input
                  id="smtp_password"
                  type={showPassword ? 'text' : 'password'}
                  value={plainPassword}
                  onChange={(e) => setPlainPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {getSettingDescription('smtp_password')}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                ⚠️ Le mot de passe sera haché avant d'être sauvegardé en base de données
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_from" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email d'expédition
              </Label>
              <Input
                id="smtp_from"
                type="email"
                value={getSettingValue('smtp_from')}
                onChange={(e) => handleValueChange('smtp_from', e.target.value)}
                placeholder="noreply@marie-fortea.com"
              />
              <p className="text-xs text-muted-foreground">
                {getSettingDescription('smtp_from')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_encryption" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Type d'encryption
              </Label>
              <Select
                value={getSettingValue('smtp_encryption')}
                onValueChange={(value) => handleValueChange('smtp_encryption', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS (Recommandé)</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">Aucune (Non recommandé)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getSettingDescription('smtp_encryption')}
              </p>
            </div>
          </div>
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

      {/* Indicateur de modifications */}
      {hasChanges && (
        <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Vous avez des modifications non sauvegardées. N'oubliez pas de sauvegarder vos changements.
          </span>
        </div>
      )}

      {/* Indicateur de succès */}
      {!hasChanges && Object.keys(smtpSettings).length > 0 && (
        <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Tous les paramètres SMTP sont à jour.
          </span>
        </div>
      )}

      {/* Configuration Resend (Alternative à SMTP) */}
      <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
            <Mail className="mr-2 h-5 w-5" />
            Configuration Resend (Recommandé)
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Service d'envoi d'emails fiable et simple à configurer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resend_api_key" className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Clé API Resend
              </Label>
              <Input
                id="resend_api_key"
                type="password"
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={getSettingValue('resend_api_key')}
                onChange={(e) => handleValueChange('resend_api_key', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Obtenez votre clé API sur <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com</a>
              </p>
            </div>
            
            <div>
              <Label htmlFor="email_provider" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Fournisseur d'email
              </Label>
              <Select
                value={getSettingValue('email_provider')}
                onValueChange={(value) => handleValueChange('email_provider', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">Resend (Recommandé)</SelectItem>
                  <SelectItem value="smtp">SMTP traditionnel</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choisissez votre méthode d'envoi d'emails
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={testResendConnection}
                disabled={!getSettingValue('resend_api_key') || isTesting}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                {isTesting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Test...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Tester Resend
                  </>
                )}
              </Button>
              
              <Button
                onClick={saveSmtpSettings}
                disabled={!hasChanges || isSaving || isTesting}
                className="bg-purple-600 hover:bg-purple-700"
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
        </CardContent>
      </Card>

      {/* Informations importantes */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
            <AlertCircle className="mr-2 h-5 w-5" />
            Informations importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Gmail :</strong> Activez l'authentification à 2 facteurs et créez un mot de passe d'application</li>
            <li><strong>Outlook/Hotmail :</strong> Utilisez votre mot de passe normal</li>
            <li><strong>Yahoo :</strong> Créez un mot de passe d'application</li>
            <li><strong>Sécurité :</strong> Utilisez toujours TLS ou SSL pour les connexions SMTP</li>
            <li><strong>Test :</strong> Testez toujours votre configuration avant d'utiliser le système</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmtpSettingsManager;
