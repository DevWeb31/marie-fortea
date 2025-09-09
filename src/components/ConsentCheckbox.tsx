import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield } from 'lucide-react';

interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  checked,
  onCheckedChange,
  required = true,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id="consent"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-1"
        />
        <div className="space-y-1">
          <Label 
            htmlFor="consent" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Consentement RGPD
              {required && <span className="text-red-500">*</span>}
            </div>
          </Label>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            J'accepte que mes données personnelles soient collectées et traitées conformément à la{' '}
            <Link 
              to="/privacy-policy" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
            >
              politique de confidentialité
              <ExternalLink className="h-3 w-3" />
            </Link>
            {' '}et aux{' '}
            <Link 
              to="/data-management" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
            >
              conditions de traitement des données
              <ExternalLink className="h-3 w-3" />
            </Link>
            . Je comprends que mes données sont nécessaires pour la fourniture du service de garde d'enfants 
            et seront conservées conformément aux obligations légales.
          </p>
        </div>
      </div>
      
      {required && !checked && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Vous devez accepter le traitement de vos données personnelles pour continuer.
        </p>
      )}
    </div>
  );
};

export default ConsentCheckbox;
