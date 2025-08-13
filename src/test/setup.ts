/**
 * Configuration de setup pour Vitest - DevWeb31 Architecture
 * Ce fichier configure l'environnement de test global
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock des variables d'environnement pour les tests
vi.mock('@/config/environments', () => ({
  default: {
    name: 'Test',
    apiUrl: 'http://localhost:3000/api',
    supabaseUrl: 'http://localhost:54321',
    supabaseAnonKey: 'test-key',
    debug: true,
    logLevel: 'debug',
    enableAnalytics: false,
    enableLogs: true,
    features: {
      auth: true,
      realtime: false,
      storage: false,
      edgeFunctions: false,
    },
  },
  currentEnvironment: 'test',
  isDevelopment: false,
  isStaging: false,
  isProduction: false,
  isTest: true,
  isLocal: true,
  isRemote: false,
}));

// Mock de Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      then: vi.fn(),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        download: vi.fn(),
        remove: vi.fn(),
        list: vi.fn(),
      })),
    },
  })),
}));

// Mock de React Router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '' }),
  useParams: () => ({}),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) =>
    `<a href="${to}">${children}</a>`,
}));

// Configuration globale des tests
beforeEach(() => {
  // Reset des mocks avant chaque test
  vi.clearAllMocks();

  // Configuration de l'environnement de test
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock de localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock de sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });
});

afterEach(() => {
  // Nettoyage après chaque test
  vi.restoreAllMocks();
});

// Configuration des timeouts
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000,
});
