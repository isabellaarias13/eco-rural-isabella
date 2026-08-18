import { modelStore } from '../models/store';
import { IncidentAlert, IncidentType } from '../types';

export class AlertController {
  public static reportIncident(data: {
    title: string;
    type: IncidentType;
    veredaName: string;
    description: string;
    severity: 'alta' | 'media' | 'baja';
    preventedBurning?: boolean;
    reportedBy?: string;
    reporterPhone?: string;
  }): IncidentAlert {
    const currentUser = modelStore.getCurrentUser();
    const now = new Date();
    
    return modelStore.addAlert({
      title: data.title.trim(),
      type: data.type,
      veredaName: data.veredaName,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      reportedBy: data.reportedBy || currentUser?.name || 'Habitante Rural Purificación',
      reporterPhone: data.reporterPhone || currentUser?.phone || 'No registrado',
      status: 'critica',
      description: data.description.trim(),
      severity: data.severity,
      preventedBurning: data.preventedBurning || data.type === 'quema_basura',
      actionTaken: data.type === 'quema_basura' 
        ? 'Alerta prioritaria transmitida a brigada de aseo rural para evitar quema de basuras y daños a la fauna.' 
        : 'Reporte registrado en la central de aseo de Purificación.'
    });
  }

  public static resolveAlert(id: string, actionTaken: string): void {
    modelStore.updateAlertStatus(id, 'atendida', actionTaken);
  }

  public static setUnderReview(id: string): void {
    modelStore.updateAlertStatus(id, 'en_revision');
  }
}
