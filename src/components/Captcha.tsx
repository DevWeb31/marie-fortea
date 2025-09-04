import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface CaptchaProps {
  onVerified: (token: string) => void;
  onError?: (error: string) => void;
  className?: string;
  resetTrigger?: number; // Prop pour déclencher une réinitialisation
}

interface CaptchaChallenge {
  question: string;
  answer: number;
  token: string;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerified, onError, className = '', resetTrigger }) => {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Générer un nouveau défi captcha
  const generateChallenge = (): CaptchaChallenge => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '*';
    
    let answer: number;
    let question: string;
    
    if (operation === '+') {
      answer = num1 + num2;
      question = `Combien font ${num1} + ${num2} ?`;
    } else {
      answer = num1 * num2;
      question = `Combien font ${num1} × ${num2} ?`;
    }

    // Générer un token unique basé sur le défi
    const token = btoa(`${num1}${operation}${num2}${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '');

    return { question, answer, token };
  };

  // Initialiser le captcha
  useEffect(() => {
    setChallenge(generateChallenge());
  }, []);

  // Réinitialiser le captcha quand resetTrigger change
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setChallenge(generateChallenge());
      setUserAnswer('');
      setIsVerified(false);
      setIsLoading(false);
      setError('');
    }
  }, [resetTrigger]);

  // Valider la réponse
  const validateAnswer = async () => {
    if (!challenge) return;

    setIsLoading(true);
    setError('');

    try {
      // Simuler une validation
      await new Promise(resolve => setTimeout(resolve, 500));

      const answer = parseInt(userAnswer);
      
      if (answer === challenge.answer) {
        setIsVerified(true);
        onVerified(challenge.token);
        setError('');
      } else {
        setError('Réponse incorrecte. Veuillez réessayer.');
        setUserAnswer('');
        setChallenge(generateChallenge());
      }
    } catch (err) {
      setError('Erreur lors de la validation. Veuillez réessayer.');
      onError?.('Erreur de validation du captcha');
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un nouveau défi
  const refreshChallenge = () => {
    setChallenge(generateChallenge());
    setUserAnswer('');
    setError('');
    setIsVerified(false);
  };

  // Gérer la soumission avec Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerified && userAnswer.trim()) {
      validateAnswer();
    }
  };

  if (!challenge) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Vérification de sécurité
        </Label>
        {isVerified && (
          <CheckCircle className="h-5 w-5 text-green-600" />
        )}
      </div>

      {!isVerified ? (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {challenge.question}
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Votre réponse"
                className="text-center text-lg font-semibold"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={refreshChallenge}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="px-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="button"
            onClick={validateAnswer}
            disabled={!userAnswer.trim() || isLoading}
            className="w-full"
            size="sm"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Vérification...
              </>
            ) : (
              'Vérifier'
            )}
          </Button>
        </>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Vérification réussie !</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Vous pouvez maintenant soumettre votre demande
          </p>
        </div>
      )}
    </div>
  );
};

export default Captcha;
