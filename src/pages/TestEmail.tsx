import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mail, Settings, Database } from 'lucide-react';

const TestEmail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Test du Système d'Email
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Vérifiez que le système de réservation et d'envoi d'emails fonctionne correctement
          </p>
        </div>

        {/* Informations importantes */}
        <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
              <AlertCircle className="mr-2 h-5 w-5" />
              Configuration requise
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <p className="mb-3">
              Avant de tester, assurez-vous que :
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Les variables SMTP sont configurées dans votre dashboard Supabase</li>
              <li>La fonction Edge <code>send-email</code> est déployée</li>
              <li>L'email de notification est configuré dans le back-office</li>
            </ul>
          </CardContent>
        </Card>

        {/* Statut des composants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-sm">Base de données</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                Prête
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-sm">Fonction Edge</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                Déployée
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-sm">Configuration SMTP</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></div>
                À vérifier
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire de test */}
        <div className="text-center text-gray-500">
          Composant de test supprimé
        </div>

        {/* Liens utiles */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Liens utiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Dashboard Supabase</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configurez les variables SMTP
                </p>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ouvrir →
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Back-office</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configurez l'email de notification
                </p>
              </div>
              <a
                href="/admin"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ouvrir →
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Documentation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Guide complet du système d'email
                </p>
              </div>
              <a
                href="/EMAIL_SYSTEM_README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ouvrir →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestEmail;
