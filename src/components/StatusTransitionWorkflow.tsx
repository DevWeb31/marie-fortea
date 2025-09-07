import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  RefreshCw,
  Eye,
  Edit,
  Save,
  X,
  Info,
  Warning,
  Shield,
  Zap,
  Target,
  Route
} from 'lucide-react';
import { 
  BookingRequestSummary, 
  BookingStatusCode,
  formatBookingStatus, 
  getStatusColor,
  formatDate,
  BOOKING_STATUSES 
} from '@/types/booking';

interface StatusTransitionWorkflowProps {
  className?: string;
  onTransitionComplete?: () => void;
}

interface TransitionStep {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  validationMessage?: string;
  component: React.ReactNode;
}

interface TransitionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiresApproval: boolean;
}

const StatusTransitionWorkflow: React.FC<StatusTransitionWorkflowProps> = ({ 
  className = '',
  onTransitionComplete 
}) => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<BookingRequestSummary | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // États pour le workflow
  const [fromStatus, setFromStatus] = useState<BookingStatusCode>('nouvelle');
  const [toStatus, setToStatus] = useState<BookingStatusCode>('acceptee');
  const [transitionReason, setTransitionReason] = useState('');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [adminApproval, setAdminApproval] = useState(false);
  const [autoActions, setAutoActions] = useState<string[]>([]);
  
  // États pour la validation
  const [validation, setValidation] = useState<TransitionValidation>({
    isValid: false,
    errors: [],
    warnings: [],
    requiresApproval: false
  });

  // Étapes du workflow
  const [workflowSteps, setWorkflowSteps] = useState<TransitionStep[]>([]);

  // Ouvrir le workflow
  const openWorkflow = (booking: BookingRequestSummary) => {
    setSelectedBooking(booking);
    setFromStatus(booking.status as BookingStatusCode);
    setToStatus('acceptee');
    setTransitionReason('');
    setTransitionNotes('');
    setAdminApproval(false);
    setAutoActions([]);
    setCurrentStep(0);
    setIsWorkflowOpen(true);
    
    // Initialiser les étapes du workflow
    initializeWorkflowSteps(booking);
  };

  // Initialiser les étapes du workflow
  const initializeWorkflowSteps = (booking: BookingRequestSummary) => {
    const steps: TransitionStep[] = [
      {
        id: 'validation',
        name: 'Validation des données',
        description: 'Vérifier que toutes les informations sont complètes',
        isCompleted: false,
        isRequired: true,
        component: <ValidationStep booking={booking} />
      },
      {
        id: 'reason',
        name: 'Raison du changement',
        description: 'Spécifier la raison de la transition',
        isCompleted: false,
        isRequired: true,
        component: <ReasonStep 
          reason={transitionReason}
          onReasonChange={setTransitionReason}
        />
      },
      {
        id: 'notes',
        name: 'Notes et commentaires',
        description: 'Ajouter des notes détaillées si nécessaire',
        isCompleted: false,
        isRequired: false,
        component: <NotesStep 
          notes={transitionNotes}
          onNotesChange={setTransitionNotes}
        />
      },
      {
        id: 'approval',
        name: 'Approbation administrative',
        description: 'Validation par un administrateur si requis',
        isCompleted: false,
        isRequired: true,
        component: <ApprovalStep 
          requiresApproval={validation.requiresApproval}
          isApproved={adminApproval}
          onApprovalChange={setAdminApproval}
        />
      },
      {
        id: 'confirmation',
        name: 'Confirmation finale',
        description: 'Récapitulatif et confirmation de la transition',
        isCompleted: false,
        isRequired: true,
        component: <ConfirmationStep 
          fromStatus={fromStatus}
          toStatus={toStatus}
          reason={transitionReason}
          notes={transitionNotes}
          autoActions={autoActions}
        />
      }
    ];
    
    setWorkflowSteps(steps);
  };

  // Valider l'étape actuelle
  const validateCurrentStep = (): boolean => {
    const step = workflowSteps[currentStep];
    if (!step) return false;

    let isValid = true;
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (step.id) {
      case 'validation':
        // Validation des données de base
        if (!selectedBooking) {
          errors.push('Aucune réservation sélectionnée');
          isValid = false;
        }
        break;

      case 'reason':
        // Validation de la raison
        if (!transitionReason.trim()) {
          errors.push('La raison du changement est obligatoire');
          isValid = false;
        }
        break;

      case 'approval':
        // Validation de l'approbation
        if (validation.requiresApproval && !adminApproval) {
          errors.push('L\'approbation administrative est requise');
          isValid = false;
        }
        break;

      case 'confirmation':
        // Validation finale
        if (!validation.isValid) {
          errors.push('Veuillez corriger les erreurs avant de continuer');
          isValid = false;
        }
        break;
    }

    // Mettre à jour la validation
    setValidation(prev => ({
      ...prev,
      isValid,
      errors,
      warnings
    }));

    return isValid;
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < workflowSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Workflow terminé
        executeTransition();
      }
    }
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Marquer une étape comme terminée
  const completeStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, isCompleted: true } : step
    ));
  };

  // Exécuter la transition
  const executeTransition = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implémenter l'appel à l'API pour exécuter la transition
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Transition réussie',
        description: `Le statut a été changé de "${formatBookingStatus(fromStatus)}" vers "${formatBookingStatus(toStatus)}"`,
      });

      // Fermer le workflow et notifier le composant parent
      setIsWorkflowOpen(false);
      onTransitionComplete?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'exécution de la transition',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Obtenir le pourcentage de progression
  const getProgressPercentage = (): number => {
    const completedSteps = workflowSteps.filter(step => step.isCompleted).length;
    return Math.round((completedSteps / workflowSteps.length) * 100);
  };

  return (
    <div className={className}>
      {/* Bouton pour ouvrir le workflow */}
      <Button onClick={() => selectedBooking && openWorkflow(selectedBooking)}>
        <Route className="h-4 w-4 mr-2" />
        Workflow de Transition
      </Button>

      {/* Dialogue du workflow */}
      <Dialog open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Route className="h-5 w-5" />
              <span>Workflow de Transition de Statut</span>
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* En-tête avec informations de la réservation */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{selectedBooking.parentName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatDate(selectedBooking.requestedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(fromStatus)}>
                      {formatBookingStatus(fromStatus)}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <Badge className={getStatusColor(toStatus)}>
                      {formatBookingStatus(toStatus)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progression du workflow</span>
                  <span>{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Étapes du workflow */}
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="border rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : index === currentStep 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{step.name}</h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      
                      {step.isRequired && (
                        <Badge variant="outline" className="text-xs">Requis</Badge>
                      )}
                    </div>

                    {/* Contenu de l'étape */}
                    {index === currentStep && (
                      <div className="ml-11">
                        {step.component}
                        
                        {/* Messages de validation */}
                        {validation.errors.length > 0 && (
                          <div className="mt-3 p-3 border border-red-200 dark:border-red-800 rounded-md">
                            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-medium">Erreurs de validation :</span>
                            </div>
                            <ul className="mt-2 text-sm text-red-700 dark:text-red-300">
                              {validation.errors.map((error, idx) => (
                                <li key={idx}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {validation.warnings.length > 0 && (
                          <div className="mt-3 p-3 border border-yellow-200 dark:border-yellow-800 rounded-md">
                            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                              <Warning className="h-4 w-4" />
                              <span className="font-medium">Avertissements :</span>
                            </div>
                            <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                              {validation.warnings.map((warning, idx) => (
                                <li key={idx}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions de navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isProcessing}
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Précédent
                </Button>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsWorkflowOpen(false)}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Traitement...
                      </>
                    ) : currentStep === workflowSteps.length - 1 ? (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Exécuter la transition
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Suivant
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composants pour chaque étape du workflow

const ValidationStep: React.FC<{ booking: BookingRequestSummary }> = ({ booking }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">Nom du parent :</span>
        <p className="text-gray-600">{booking.parentName}</p>
      </div>
      <div>
        <span className="font-medium">Téléphone :</span>
        <p className="text-gray-600">{booking.parentPhone}</p>
      </div>
      <div>
        <span className="font-medium">Service :</span>
        <p className="text-gray-600">{booking.serviceName}</p>
      </div>
      <div>
        <span className="font-medium">Date :</span>
        <p className="text-gray-600">{formatDate(booking.requestedDate)}</p>
      </div>
    </div>
    
    <div className="p-3 border border-green-200 dark:border-green-800 rounded-md">
      <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Toutes les informations sont complètes et valides</span>
      </div>
    </div>
  </div>
);

const ReasonStep: React.FC<{ 
  reason: string; 
  onReasonChange: (reason: string) => void; 
}> = ({ reason, onReasonChange }) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="transitionReason">Raison du changement de statut *</Label>
      <Select value={reason} onValueChange={onReasonChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Sélectionner une raison..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="validation_admin">Validation administrative</SelectItem>
          <SelectItem value="confirmation_client">Confirmation client</SelectItem>
          <SelectItem value="annulation_client">Annulation client</SelectItem>
          <SelectItem value="indisponibilite">Indisponibilité</SelectItem>
          <SelectItem value="erreur_systeme">Erreur système</SelectItem>
          <SelectItem value="autre">Autre raison</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-md">
      <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
        <Info className="h-4 w-4" />
        <span className="text-sm">Cette raison sera enregistrée dans l'historique des changements</span>
      </div>
    </div>
  </div>
);

const NotesStep: React.FC<{ 
  notes: string; 
  onNotesChange: (notes: string) => void; 
}> = ({ notes, onNotesChange }) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="transitionNotes">Notes et commentaires (optionnel)</Label>
      <Textarea
        id="transitionNotes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Ajouter des détails sur la transition..."
        className="mt-1"
        rows={3}
      />
    </div>
    
    <div className="p-3 border border-yellow-200 dark:border-yellow-800 rounded-md">
      <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
        <Warning className="h-4 w-4" />
        <span className="text-sm">Les notes sont recommandées pour tracer les décisions importantes</span>
      </div>
    </div>
  </div>
);

const ApprovalStep: React.FC<{ 
  requiresApproval: boolean; 
  isApproved: boolean; 
  onApprovalChange: (approved: boolean) => void; 
}> = ({ requiresApproval, isApproved, onApprovalChange }) => (
  <div className="space-y-3">
    {requiresApproval ? (
      <div>
        <Label className="text-sm font-medium">Approbation administrative requise</Label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isApproved}
              onChange={(e) => onApprovalChange(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Je confirme l'approbation de cette transition</span>
          </label>
        </div>
      </div>
    ) : (
      <div className="p-3 border border-green-200 dark:border-green-800 rounded-md">
        <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Aucune approbation administrative requise pour cette transition</span>
        </div>
      </div>
    )}
    
    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-md">
      <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
        <Shield className="h-4 w-4" />
        <span className="text-sm">Cette transition respecte les règles de workflow définies</span>
      </div>
    </div>
  </div>
);

const ConfirmationStep: React.FC<{ 
  fromStatus: BookingStatusCode; 
  toStatus: BookingStatusCode; 
  reason: string; 
  notes: string; 
  autoActions: string[]; 
}> = ({ fromStatus, toStatus, reason, notes, autoActions }) => (
  <div className="space-y-4">
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
      <h4 className="font-medium mb-3">Récapitulatif de la transition</h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Statut actuel :</span>
          <p className="text-gray-600">{formatBookingStatus(fromStatus)}</p>
        </div>
        <div>
          <span className="font-medium">Nouveau statut :</span>
          <p className="text-gray-600">{formatBookingStatus(toStatus)}</p>
        </div>
        <div>
          <span className="font-medium">Raison :</span>
          <p className="text-gray-600">{reason}</p>
        </div>
        {notes && (
          <div>
            <span className="font-medium">Notes :</span>
            <p className="text-gray-600">{notes}</p>
          </div>
        )}
      </div>
    </div>
    
    {autoActions.length > 0 && (
      <div className="p-3 border border-purple-200 dark:border-purple-800 rounded-md">
        <div className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Actions automatiques qui seront exécutées :</span>
        </div>
        <ul className="mt-2 text-sm text-purple-700 dark:text-purple-300">
          {autoActions.map((action, idx) => (
            <li key={idx}>• {action}</li>
          ))}
        </ul>
      </div>
    )}
    
    <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-md">
      <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
        <Target className="h-4 w-4" />
        <span className="text-sm">Vérifiez que toutes les informations sont correctes avant de confirmer</span>
      </div>
    </div>
  </div>
);

export default StatusTransitionWorkflow;
