import React from 'react';
import { useTheme } from './theme-provider';
import { ThemeToggleButtons } from './theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function ThemeDemo() {
  const { theme } = useTheme();

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Démonstration des Thèmes
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Testez les différents thèmes disponibles sur le site
        </p>
      </div>

      {/* Sélecteur de thème */}
      <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400">🎨</span>
            Sélection du Thème
          </CardTitle>
          <CardDescription>
            Choisissez entre thème clair, sombre ou automatique selon votre système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <ThemeToggleButtons />
            <div className="text-center">
              <Badge variant="outline" className="text-sm">
                Thème actuel : <span className="font-semibold capitalize">{theme}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemples de composants */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Composants UI</CardTitle>
            <CardDescription>
              Exemples de composants dans le thème actuel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-primary"></div>
              <div className="h-2 w-full rounded bg-secondary"></div>
              <div className="h-2 w-full rounded bg-accent"></div>
              <div className="h-2 w-full rounded bg-muted"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Palette de Couleurs</CardTitle>
            <CardDescription>
              Variables CSS utilisées pour le thème
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="font-medium">Background</div>
                <div className="h-4 w-full rounded bg-background border"></div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Foreground</div>
                <div className="h-4 w-full rounded bg-foreground"></div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Card</div>
                <div className="h-4 w-full rounded bg-card border"></div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Border</div>
                <div className="h-4 w-full rounded bg-border"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur le thème */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">
            ℹ️ Informations sur les Thèmes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Thème Clair</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Interface claire et lumineuse, parfaite pour la journée
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Thème Sombre</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Interface sombre et reposante, idéale pour la soirée
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Thème Système</h4>
              <p className="text-gray-600 dark:text-gray-300">
                S'adapte automatiquement aux préférences de votre système
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>💾 Persistance :</strong> Votre choix de thème est automatiquement 
              sauvegardé dans le navigateur et sera restauré lors de votre prochaine visite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
