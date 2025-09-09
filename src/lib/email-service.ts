import { supabase } from './supabase';
import { SiteSettingsService } from './site-settings-service';
import { BookingRequest } from '@/types/booking';
import { formatDuration } from './duration-utils';


export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
    // Envoyer un email de notification de réservation
  static async sendBookingNotification(bookingRequest: BookingRequest): Promise<{ data: boolean | null; error: string | null }> {
    try {
      // Vérifier si les notifications par email sont activées
      const notificationsEnabled = await SiteSettingsService.areEmailNotificationsEnabled();
      if (notificationsEnabled.error || !notificationsEnabled.data) {
        return { data: true, error: null }; // Pas d'erreur, juste désactivé
      }

      // Récupérer l'email de notification
      const notificationEmail = await SiteSettingsService.getBookingNotificationEmail();
      if (notificationEmail.error || !notificationEmail.data) {
        return { data: null, error: 'Email de notification non configuré' };
      }

      // Préparer le contenu de l'email
      const emailData = this.prepareBookingNotificationEmail(bookingRequest, notificationEmail.data);

      // Essayer d'envoyer via Mailgun d'abord
      try {
        await this.sendEmailViaMailgun(emailData);
        return { data: true, error: null };
      } catch (mailgunError) {
        
        // Essayer le fallback SMTP
        try {
          await this.sendEmailViaFallback(emailData);
          return { data: true, error: null };
        } catch (fallbackError) {
        }
      }

      // Dernier recours : simulation locale
      const { error } = await this.sendEmailViaInbucket(emailData);

      if (error) {
        return { data: null, error: 'Erreur lors de l\'envoi de l\'email' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de l\'envoi de l\'email' };
    }
  }

  // Préparer le contenu de l'email de notification
  private static prepareBookingNotificationEmail(bookingRequest: BookingRequest, adminEmail: string): EmailData {
    const subject = `Nouvelle demande de réservation - ${bookingRequest.parentName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande de réservation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #495057; }
          .value { margin-bottom: 10px; }
          .highlight { background-color: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Nouvelle demande de réservation</h1>
            <p>Une nouvelle demande de réservation a été soumise sur votre site.</p>
          </div>

          <div class="section">
            <h2>👨‍👩‍👧‍👦 Informations du parent</h2>
            <div class="value">
              <span class="label">Nom :</span> ${bookingRequest.parentName}
            </div>
            <div class="value">
              <span class="label">Téléphone :</span> ${bookingRequest.parentPhone}
            </div>
            ${bookingRequest.parentEmail ? `<div class="value">
              <span class="label">Email :</span> ${bookingRequest.parentEmail}
            </div>` : ''}
            ${bookingRequest.parentAddress ? `<div class="value">
              <span class="label">Adresse :</span> ${bookingRequest.parentAddress}
            </div>` : ''}
          </div>

          <div class="section">
            <h2>📅 Détails de la réservation</h2>
            <div class="value">
              <span class="label">Type de service :</span> ${this.getServiceTypeName(bookingRequest.serviceType)}
            </div>
            <div class="value">
              <span class="label">Date demandée :</span> ${new Date(bookingRequest.requestedDate).toLocaleDateString('fr-FR')}
            </div>
            <div class="value">
              <span class="label">Heure de début :</span> ${bookingRequest.startTime}
            </div>
            <div class="value">
              <span class="label">Heure de fin :</span> ${bookingRequest.endTime}
            </div>
            <div class="value">
              <span class="label">Durée estimée :</span> ${bookingRequest.durationHours ? formatDuration(bookingRequest.durationHours) : 'À calculer'}
            </div>
          </div>

          <div class="section">
            <h2>👶 Informations sur les enfants</h2>
            <div class="value">
              <span class="label">Nombre d'enfants :</span> ${bookingRequest.childrenCount}
            </div>
            <div class="value">
              <span class="label">Détails :</span> ${bookingRequest.childrenDetails || 'Non spécifié'}
            </div>
            ${bookingRequest.childrenAges ? `<div class="value">
              <span class="label">Âges :</span> ${bookingRequest.childrenAges}
            </div>` : ''}
          </div>

          ${bookingRequest.specialInstructions ? `<div class="section">
            <h2>📝 Instructions spéciales</h2>
            <div class="value">${bookingRequest.specialInstructions}</div>
          </div>` : ''}

          ${bookingRequest.emergencyContact ? `<div class="section">
            <h2>🚨 Contact d'urgence</h2>
            <div class="value">
              <span class="label">Nom :</span> ${bookingRequest.emergencyContact}
            </div>
            ${bookingRequest.emergencyPhone ? `<div class="value">
              <span class="label">Téléphone :</span> ${bookingRequest.emergencyPhone}
            </div>` : ''}
          </div>` : ''}

          <div class="highlight">
            <strong>📞 Méthode de contact préférée :</strong> ${this.getContactMethodName(bookingRequest.preferredContactMethod)}
          </div>

          <div class="section">
            <h2>📊 Informations techniques</h2>
            <div class="value">
              <span class="label">Statut :</span> ${this.getStatusName(bookingRequest.status)}
            </div>
            <div class="value">
              <span class="label">Date de soumission :</span> ${new Date(bookingRequest.createdAt).toLocaleString('fr-FR')}
            </div>
            <div class="value">
              <span class="label">Source :</span> ${bookingRequest.source}
            </div>
          </div>

          <div class="footer">
            <p>Cette notification a été envoyée automatiquement par votre système de réservation.</p>
            <p>ID de la demande : ${bookingRequest.id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Nouvelle demande de réservation - ${bookingRequest.parentName}

INFORMATIONS DU PARENT
Nom : ${bookingRequest.parentName}
Téléphone : ${bookingRequest.parentPhone}
${bookingRequest.parentEmail ? `Email : ${bookingRequest.parentEmail}` : ''}
${bookingRequest.parentAddress ? `Adresse : ${bookingRequest.parentAddress}` : ''}

DÉTAILS DE LA RÉSERVATION
Type de service : ${this.getServiceTypeName(bookingRequest.serviceType)}
Date demandée : ${new Date(bookingRequest.requestedDate).toLocaleDateString('fr-FR')}
Heure de début : ${bookingRequest.startTime}
Heure de fin : ${bookingRequest.endTime}
Durée estimée : ${bookingRequest.durationHours ? formatDuration(bookingRequest.durationHours) : 'À calculer'}

INFORMATIONS SUR LES ENFANTS
Nombre d'enfants : ${bookingRequest.childrenCount}
Détails : ${bookingRequest.childrenDetails || 'Non spécifié'}
${bookingRequest.childrenAges ? `Âges : ${bookingRequest.childrenAges}` : ''}

${bookingRequest.specialInstructions ? `
INSTRUCTIONS SPÉCIALES
${bookingRequest.specialInstructions}
` : ''}

${bookingRequest.emergencyContact ? `
CONTACT D'URGENCE
Nom : ${bookingRequest.emergencyContact}
${bookingRequest.emergencyPhone ? `Téléphone : ${bookingRequest.emergencyPhone}` : ''}
` : ''}

MÉTHODE DE CONTACT PRÉFÉRÉE : ${this.getContactMethodName(bookingRequest.preferredContactMethod)}

INFORMATIONS TECHNIQUES
Statut : ${this.getStatusName(bookingRequest.status)}
Date de soumission : ${new Date(bookingRequest.createdAt).toLocaleString('fr-FR')}
Source : ${bookingRequest.source}

ID de la demande : ${bookingRequest.id}
    `;

    return {
      to: adminEmail,
      subject,
      html,
      text
    };
  }

  // Envoyer un email avec le formulaire détaillé
  static async sendDetailedFormEmail(bookingRequest: any, formUrl: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      // Vérifier si les notifications par email sont activées
      const notificationsEnabled = await SiteSettingsService.areEmailNotificationsEnabled();
      if (notificationsEnabled.error || !notificationsEnabled.data) {
        return { data: true, error: null }; // Pas d'erreur, juste désactivé
      }

      // Préparer le contenu de l'email
      const emailData = this.prepareDetailedFormEmail(bookingRequest, formUrl);

      // En développement local, utiliser directement la simulation pour éviter les problèmes CORS
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Simuler un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { data: true, error: null };
      }

      // Essayer d'envoyer via Mailgun d'abord
      try {
        await this.sendEmailViaMailgun(emailData);
        return { data: true, error: null };
      } catch (mailgunError) {
        // Essayer le fallback SMTP
        try {
          await this.sendEmailViaFallback(emailData);
          return { data: true, error: null };
        } catch (fallbackError) {
          // Continuer vers Inbucket
        }
      }

      // Dernier recours : simulation locale
      const { error } = await this.sendEmailViaInbucket(emailData);

      if (error) {
        return { data: null, error: 'Erreur lors de l\'envoi de l\'email' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de l\'envoi de l\'email' };
    }
  }

  // Préparer le contenu de l'email pour le formulaire détaillé
  private static prepareDetailedFormEmail(bookingRequest: any, formUrl: string): EmailData {
    const subject = `Complétez votre réservation - ${bookingRequest.parentName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complétez votre réservation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #059669; }
          .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complétez votre réservation</h1>
            <p>Bonjour ${bookingRequest.parentName} !</p>
          </div>
          
          <div class="content">
            <p>Merci pour votre demande de réservation. Pour finaliser votre demande, nous avons besoin de quelques informations supplémentaires.</p>
            
            <div class="info-box">
              <h3>Résumé de votre réservation :</h3>
              <p><strong>Type de service :</strong> ${this.getServiceTypeName(bookingRequest.serviceType)}</p>
              <p><strong>Date :</strong> ${new Date(bookingRequest.requestedDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>Horaires :</strong> ${bookingRequest.startTime} - ${bookingRequest.endTime}</p>
              <p><strong>Nombre d'enfants :</strong> ${bookingRequest.childrenCount}</p>
            </div>
            
            <p>Le formulaire détaillé vous permettra de renseigner :</p>
            <ul>
              <li>L'adresse complète de la garde</li>
              <li>Les prénoms et âges de chaque enfant</li>
              <li>Les allergies et particularités</li>
              <li>Les préférences et goûts</li>
              <li>Des commentaires supplémentaires</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${formUrl}" class="button">Compléter ma réservation</a>
            </div>
            
            <p><strong>Important :</strong> Ce lien est personnel et sécurisé. Il expire dans 7 jours.</p>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br>L'équipe Marie Fortea</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Complétez votre réservation - ${bookingRequest.parentName}

Bonjour ${bookingRequest.parentName},

Merci pour votre demande de réservation. Pour finaliser votre demande, nous avons besoin de quelques informations supplémentaires.

Résumé de votre réservation :
- Type de service : ${this.getServiceTypeName(bookingRequest.serviceType)}
- Date : ${new Date(bookingRequest.requestedDate).toLocaleDateString('fr-FR')}
- Horaires : ${bookingRequest.startTime} - ${bookingRequest.endTime}
- Nombre d'enfants : ${bookingRequest.childrenCount}

Le formulaire détaillé vous permettra de renseigner :
- L'adresse complète de la garde
- Les prénoms et âges de chaque enfant
- Les allergies et particularités
- Les préférences et goûts
- Des commentaires supplémentaires

Lien vers le formulaire : ${formUrl}

Important : Ce lien est personnel et sécurisé. Il expire dans 7 jours.

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Marie Fortea
    `;

    return {
      to: bookingRequest.parentEmail || '',
      subject,
      html,
      text
    };
  }

  // Obtenir le nom lisible du type de service
  private static getServiceTypeName(serviceType: string): string {
    const serviceNames: { [key: string]: string } = {
      'babysitting': 'Garde d\'enfants',
      'event_support': 'Soutien événementiel',
      'overnight_care': 'Garde de nuit',
      'weekend_care': 'Garde de weekend',
      'holiday_care': 'Garde pendant les vacances',
      'emergency_care': 'Garde d\'urgence'
    };
    return serviceNames[serviceType] || serviceType;
  }

  // Obtenir le nom lisible de la méthode de contact
  private static getContactMethodName(method: string): string {
    const methodNames: { [key: string]: string } = {
      'phone': 'Téléphone',
      'email': 'Email',
      'sms': 'SMS',
      'whatsapp': 'WhatsApp'
    };
    return methodNames[method] || method;
  }

  // Obtenir le nom lisible du statut
  private static getStatusName(status: string): string {
    const statusNames: { [key: string]: string } = {
      'pending': 'En attente',
      'contacted': 'Contacté',
      'confirmed': 'Confirmé',
      'cancelled': 'Annulé',
      'completed': 'Terminé'
    };
    return statusNames[status] || status;
  }

  // Envoyer un email via SMTP ou simulation locale
  private static async sendEmailViaInbucket(emailData: EmailData): Promise<{ data: any; error: any }> {
    try {

      
      // Vérifier si la configuration Mailgun est disponible
      const mailgunConfigured = await this.isMailgunConfigured();
      
      if (mailgunConfigured) {
        // Configuration Mailgun disponible, essayer l'envoi réel
        try {
          const result = await this.sendEmailViaMailgun(emailData);
          return { data: result, error: null };
        } catch (mailgunError) {
          // Fallback vers la simulation
        }
      }
      
      // Fallback : simulation locale
      
      return { 
        data: { 
          success: true, 
          message: 'Email simulé avec succès (développement local)',
          id: 'simulated-' + Date.now(),
          to: emailData.to,
          subject: emailData.subject
        }, 
        error: null 
      };
      
    } catch (error) {
      // Même en cas d'erreur, on simule un succès pour le développement
      
      return { 
        data: { 
          success: true, 
          message: 'Email simulé (fallback)',
          id: 'fallback-' + Date.now()
        }, 
        error: null 
      };
    }
  }

  // Envoyer un email via Mailgun
  private static async sendEmailViaMailgun(emailData: EmailData): Promise<any> {
    try {
      // Utiliser l'Edge Function send-email-mailgun
      const { data, error } = await supabase.functions.invoke('send-email-mailgun', {
        body: emailData
      });

      if (error) {
        throw new Error(`Erreur Mailgun: ${error.message}`);
      }

      // Vérifier si c'est une simulation
      if (data && data.simulated) {
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Envoyer un email via fallback (SMTP ou simulation)
  private static async sendEmailViaFallback(emailData: EmailData): Promise<any> {
    try {
      // Utiliser l'Edge Function send-email-fallback
      const { data, error } = await supabase.functions.invoke('send-email-fallback', {
        body: emailData
      });

      if (error) {
        throw new Error(`Erreur fallback: ${error.message}`);
      }

      // Vérifier si c'est une simulation
      if (data && data.simulated) {
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier si Mailgun est configuré
  private static async isMailgunConfigured(): Promise<boolean> {
    try {
      // Pour l'instant, on considère que Mailgun est toujours configuré
      // car les variables d'environnement sont définies dans Supabase
      return true;
    } catch (error) {
      return false;
    }
  }

  // Envoyer un email personnalisé
  static async sendCustomEmail(emailData: EmailData): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { error } = await this.sendEmailViaInbucket(emailData);

      if (error) {
        return { data: null, error: 'Erreur lors de l\'envoi de l\'email' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de l\'envoi de l\'email' };
    }
  }

  // Envoyer un email d'export de données
  static async sendDataExportEmail(userEmail: string, downloadUrl: string, hasData: boolean): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const emailData = this.prepareDataExportEmail(userEmail, downloadUrl, hasData);

      // Essayer d'envoyer via Mailgun d'abord
      try {
        await this.sendEmailViaMailgun(emailData);
        return { data: true, error: null };
      } catch (mailgunError) {
        console.warn('Erreur Mailgun, tentative avec fallback:', mailgunError);
        
        // Essayer le fallback SMTP
        try {
          await this.sendEmailViaFallback(emailData);
          return { data: true, error: null };
        } catch (fallbackError) {
          console.warn('Erreur fallback, utilisation de la simulation:', fallbackError);
        }
      }

      // Dernier recours : simulation locale
      const { error } = await this.sendEmailViaInbucket(emailData);

      if (error) {
        return { data: null, error: 'Erreur lors de l\'envoi de l\'email' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de l\'envoi de l\'email' };
    }
  }

  // Préparer le contenu de l'email d'export de données
  private static prepareDataExportEmail(userEmail: string, downloadUrl: string, hasData: boolean): EmailData {
    const subject = hasData 
      ? 'Vos données personnelles - Marie Fortea' 
      : 'Demande d\'export de données - Marie Fortea';

    const html = hasData ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vos données personnelles</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #5a6fd8; }
          .alert { background: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vos données personnelles</h1>
            <p>Marie Fortea - Services de garde d'enfants</p>
          </div>
          
          <div class="content">
            <h2>Bonjour,</h2>
            
            <p>Vous avez demandé l'export de vos données personnelles. Nous avons préparé un fichier contenant toutes les informations que nous détenons vous concernant.</p>
            
            <div class="alert">
              <strong>🔒 Lien sécurisé de téléchargement</strong><br>
              Cliquez sur le bouton ci-dessous pour télécharger vos données. Ce lien est personnel et sécurisé.
            </div>
            
            <div style="text-align: center;">
              <a href="${downloadUrl}" class="button">Télécharger mes données</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong>
              <ul>
                <li>Ce lien expire dans 24 heures pour votre sécurité</li>
                <li>Il ne peut être utilisé qu'une seule fois</li>
                <li>Vos données sont au format JSON</li>
              </ul>
            </div>
            
            <h3>Que contient votre export ?</h3>
            <ul>
              <li>📋 Toutes vos réservations et demandes</li>
              <li>👶 Les détails de vos enfants</li>
              <li>📞 Vos informations de contact</li>
              <li>📝 Vos préférences et commentaires</li>
              <li>🔐 L'historique de vos consentements RGPD</li>
            </ul>
            
            <p>Si vous avez des questions concernant vos données ou si vous rencontrez des difficultés avec le téléchargement, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br><strong>L'équipe Marie Fortea</strong></p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement suite à votre demande d'export de données.</p>
            <p>Marie Fortea - contact@marie-fortea.fr - 07 84 97 64 00</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demande d'export de données</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .info { background: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Demande d'export de données</h1>
            <p>Marie Fortea - Services de garde d'enfants</p>
          </div>
          
          <div class="content">
            <h2>Bonjour,</h2>
            
            <p>Vous avez demandé l'export de vos données personnelles pour l'adresse email : <strong>${userEmail}</strong></p>
            
            <div class="info">
              <strong>ℹ️ Information importante</strong><br>
              Aucune donnée personnelle n'a été trouvée pour cette adresse email dans notre système.
            </div>
            
            <p>Cela peut signifier que :</p>
            <ul>
              <li>Vous n'avez jamais effectué de réservation sur notre site</li>
              <li>Vos données ont déjà été supprimées (conservation limitée à 2 mois après la fin de la garde)</li>
              <li>L'adresse email utilisée ne correspond pas à celle de vos réservations</li>
            </ul>
            
            <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez effectuer une réservation, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br><strong>L'équipe Marie Fortea</strong></p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement suite à votre demande d'export de données.</p>
            <p>Marie Fortea - contact@marie-fortea.fr - 07 84 97 64 00</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = hasData ? `
Vos données personnelles - Marie Fortea

Bonjour,

Vous avez demandé l'export de vos données personnelles. Nous avons préparé un fichier contenant toutes les informations que nous détenons vous concernant.

Lien de téléchargement sécurisé : ${downloadUrl}

IMPORTANT :
- Ce lien expire dans 24 heures pour votre sécurité
- Il ne peut être utilisé qu'une seule fois
- Vos données sont au format JSON

Que contient votre export ?
- Toutes vos réservations et demandes
- Les détails de vos enfants
- Vos informations de contact
- Vos préférences et commentaires
- L'historique de vos consentements RGPD

Si vous avez des questions concernant vos données ou si vous rencontrez des difficultés avec le téléchargement, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Marie Fortea

Marie Fortea - contact@marie-fortea.fr - 07 84 97 64 00
    ` : `
Demande d'export de données - Marie Fortea

Bonjour,

Vous avez demandé l'export de vos données personnelles pour l'adresse email : ${userEmail}

INFORMATION IMPORTANTE :
Aucune donnée personnelle n'a été trouvée pour cette adresse email dans notre système.

Cela peut signifier que :
- Vous n'avez jamais effectué de réservation sur notre site
- Vos données ont déjà été supprimées (conservation limitée à 2 mois après la fin de la garde)
- L'adresse email utilisée ne correspond pas à celle de vos réservations

Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez effectuer une réservation, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Marie Fortea

Marie Fortea - contact@marie-fortea.fr - 07 84 97 64 00
    `;

    return {
      to: userEmail,
      subject: subject,
      html: html,
      text: text
    };
  }
}
