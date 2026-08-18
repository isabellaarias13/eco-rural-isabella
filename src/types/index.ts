export type UserRole = 'habitante' | 'conductor' | 'coordinador' | 'administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  documentId: string;
  vereda: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Vereda {
  id: string;
  name: string;
  zone: string;
  distanceKmFromCenter: number;
  householdsCount: number;
  populationEstimate: number;
  criticalPointsCount: number;
  mapCoords: { x: number; y: number; lat: number; lng: number };
  mainActivity: string;
}

export type RouteStatus = 'programada' | 'en_progreso' | 'completada' | 'cancelada' | 'reprogramada';

export interface RouteStop {
  id: string;
  name: string;
  timeEst: string;
  completed: boolean;
  notes?: string;
}

export interface RuralRoute {
  id: string;
  code: string;
  veredaId: string;
  veredaName: string;
  scheduledDate: string;
  startTime: string;
  estimatedEndTime: string;
  truckId: string;
  truckNumber: string;
  truckPlate: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  status: RouteStatus;
  estimatedTons: number;
  collectedTons: number;
  recycledTons: number;
  efficiencyPercent: number;
  wasteTypePriority: 'Mixto Rural' | 'Orgánico Agropecuario' | 'Aprovechables Secos' | 'Ordinarios';
  notes: string;
  stops: RouteStop[];
  incidentsReported: number;
}

export type TruckStatus = 'disponible' | 'en_servicio' | 'mantenimiento';

export interface Truck {
  id: string;
  number: string;
  plate: string;
  model: string;
  capacityTons: number;
  currentLoadTons: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  status: TruckStatus;
  lastMaintenanceDate: string;
  mileageKm: number;
  fuelLevelPercent: number;
  currentVereda?: string;
  serviceZone: string;
  year: number;
}

export interface CollectionRecord {
  id: string;
  code: string;
  veredaName: string;
  date: string;
  time: string;
  truckNumber: string;
  truckPlate: string;
  driverName: string;
  organicTons: number;
  plasticTons: number;
  glassTons: number;
  cardboardTons: number;
  metalTons: number;
  ordinaryTons: number;
  totalTons: number;
  recycledTons: number;
  efficiencyPercent: number;
  status: 'completado' | 'en_curso' | 'pendiente' | 'reprogramado';
  notes: string;
}

export type IncidentType = 
  | 'quema_basura' 
  | 'via_bloqueada' 
  | 'basurero_ilegal' 
  | 'olor_fuerte' 
  | 'animales_riesgo' 
  | 'camion_varado' 
  | 'otro';

export interface IncidentAlert {
  id: string;
  title: string;
  type: IncidentType;
  veredaName: string;
  date: string;
  time: string;
  reportedBy: string;
  reporterPhone?: string;
  status: 'critica' | 'atendida' | 'en_revision';
  description: string;
  severity: 'alta' | 'media' | 'baja';
  preventedBurning: boolean;
  actionTaken?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alerta' | 'ruta' | 'camion' | 'comunidad' | 'exito';
  read: boolean;
  vereda?: string;
  linkTab?: string;
}

export interface MonthlyStats {
  month: string;
  monthNumber: number;
  collectionsCount: number;
  totalTons: number;
  recycledTons: number;
  organicTons: number;
  efficiencyPercent: number;
  burningsPrevented: number;
}

export interface MaterialDistribution {
  name: string;
  category: string;
  percentage: number;
  tons: number;
  color: string;
  description: string;
}
