import { 
  User, 
  Truck, 
  RuralRoute, 
  CollectionRecord, 
  IncidentAlert, 
  AppNotification, 
  MonthlyStats, 
  MaterialDistribution 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_TRUCKS, 
  INITIAL_ROUTES, 
  INITIAL_COLLECTIONS, 
  INITIAL_ALERTS, 
  INITIAL_NOTIFICATIONS, 
  HISTORICAL_MONTHLY_STATS, 
  MATERIAL_DISTRIBUTION 
} from './mockInitialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'ecorural_current_user',
  USERS: 'ecorural_users',
  TRUCKS: 'ecorural_trucks',
  ROUTES: 'ecorural_routes',
  COLLECTIONS: 'ecorural_collections',
  ALERTS: 'ecorural_alerts',
  NOTIFICATIONS: 'ecorural_notifications',
  MONTHLY_STATS: 'ecorural_monthly_stats',
  MATERIALS: 'ecorural_materials'
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.warn(`Error loading ${key} from storage:`, err);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
  }
}

export interface EcoRuralState {
  currentUser: User | null;
  users: User[];
  trucks: Truck[];
  routes: RuralRoute[];
  collections: CollectionRecord[];
  alerts: IncidentAlert[];
  notifications: AppNotification[];
  monthlyStats: MonthlyStats[];
  materials: MaterialDistribution[];
}

type Listener = (state: EcoRuralState) => void;

class EcoRuralModelStore {
  private currentUser: User | null = null;
  private users: User[] = [];
  private trucks: Truck[] = [];
  private routes: RuralRoute[] = [];
  private collections: CollectionRecord[] = [];
  private alerts: IncidentAlert[] = [];
  private notifications: AppNotification[] = [];
  private monthlyStats: MonthlyStats[] = [];
  private materials: MaterialDistribution[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    this.users = loadFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.currentUser = loadFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, this.users[0] || null);
    this.trucks = loadFromStorage<Truck[]>(STORAGE_KEYS.TRUCKS, INITIAL_TRUCKS);
    this.routes = loadFromStorage<RuralRoute[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
    this.collections = loadFromStorage<CollectionRecord[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
    this.alerts = loadFromStorage<IncidentAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    this.notifications = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.monthlyStats = loadFromStorage<MonthlyStats[]>(STORAGE_KEYS.MONTHLY_STATS, HISTORICAL_MONTHLY_STATS);
    this.materials = loadFromStorage<MaterialDistribution[]>(STORAGE_KEYS.MATERIALS, MATERIAL_DISTRIBUTION);
  }

  public getState(): EcoRuralState {
    return {
      currentUser: this.currentUser,
      users: [...this.users],
      trucks: [...this.trucks],
      routes: [...this.routes],
      collections: [...this.collections],
      alerts: [...this.alerts],
      notifications: [...this.notifications],
      monthlyStats: [...this.monthlyStats],
      materials: [...this.materials],
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach(fn => fn(currentState));
  }

  // Getters
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public getTrucks(): Truck[] {
    return [...this.trucks];
  }

  public getRoutes(): RuralRoute[] {
    return [...this.routes];
  }

  public getCollections(): CollectionRecord[] {
    return [...this.collections];
  }

  public getAlerts(): IncidentAlert[] {
    return [...this.alerts];
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getMonthlyStats(): MonthlyStats[] {
    return [...this.monthlyStats];
  }

  public getMaterials(): MaterialDistribution[] {
    return [...this.materials];
  }

  // User Actions
  public setCurrentUser(user: User | null): void {
    this.currentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    this.notify();
  }

  public addUser(user: User): void {
    this.users = [user, ...this.users];
    this.currentUser = user;
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: '¡Bienvenido a Eco-Rural!',
      message: `Cuenta activada para ${user.name} en ${user.vereda} (Purificación).`,
      timestamp: 'Ahora mismo',
      type: 'comunidad',
      read: false
    });
    this.notify();
  }

  // Route Actions
  public addRoute(routeData: Omit<RuralRoute, 'id'>): RuralRoute {
    const newRoute: RuralRoute = {
      ...routeData,
      id: `rt-${Date.now()}`
    };
    this.routes = [newRoute, ...this.routes];
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);

    // Update truck status if assigned
    if (newRoute.status === 'en_progreso') {
      this.updateTruckStatus(newRoute.truckId, 'en_servicio', newRoute.veredaName);
    }

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Nueva Ruta Programada',
      message: `Ruta ${newRoute.code} asignada para la vereda ${newRoute.veredaName} con camión ${newRoute.truckNumber}.`,
      timestamp: 'Ahora mismo',
      type: 'ruta',
      read: false,
      vereda: newRoute.veredaName,
      linkTab: 'rutas'
    });

    this.notify();
    return newRoute;
  }

  public updateRoute(id: string, updates: Partial<RuralRoute>): void {
    this.routes = this.routes.map(r => (r.id === id ? { ...r, ...updates } : r));
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);
    this.notify();
  }

  public deleteRoute(id: string): void {
    const route = this.routes.find(r => r.id === id);
    this.routes = this.routes.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);
    if (route) {
      this.addNotification({
        id: `notif-${Date.now()}`,
        title: 'Ruta Eliminada',
        message: `La ruta ${route.code} en ${route.veredaName} ha sido cancelada del cronograma.`,
        timestamp: 'Ahora mismo',
        type: 'alerta',
        read: false
      });
    }
    this.notify();
  }

  public toggleRouteStop(routeId: string, stopId: string): void {
    this.routes = this.routes.map(r => {
      if (r.id !== routeId) return r;
      const updatedStops = r.stops.map(s => s.id === stopId ? { ...s, completed: !s.completed } : s);
      const allDone = updatedStops.every(s => s.completed);
      return {
        ...r,
        stops: updatedStops,
        status: allDone ? 'completada' : r.status
      };
    });
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);
    this.notify();
  }

  // Truck Actions
  public addTruck(truckData: Omit<Truck, 'id'>): Truck {
    const newTruck: Truck = {
      ...truckData,
      id: `trk-${Date.now()}`
    };
    this.trucks = [newTruck, ...this.trucks];
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Nuevo Camión Integrado',
      message: `Vehículo ${newTruck.number} (${newTruck.plate}) incorporado a la flota de aseo rural.`,
      timestamp: 'Ahora mismo',
      type: 'camion',
      read: false,
      linkTab: 'camiones'
    });
    this.notify();
    return newTruck;
  }

  public updateTruck(id: string, updates: Partial<Truck>): void {
    this.trucks = this.trucks.map(t => (t.id === id ? { ...t, ...updates } : t));
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    this.notify();
  }

  public updateTruckStatus(id: string, status: Truck['status'], currentVereda?: string): void {
    this.trucks = this.trucks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          currentVereda: currentVereda ?? t.currentVereda,
          currentLoadTons: status === 'disponible' ? 0 : t.currentLoadTons
        };
      }
      return t;
    });
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    this.notify();
  }

  public deleteTruck(id: string): void {
    this.trucks = this.trucks.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    this.notify();
  }

  // Collection Actions
  public addCollection(collectionData: Omit<CollectionRecord, 'id'>): CollectionRecord {
    const newRecord: CollectionRecord = {
      ...collectionData,
      id: `col-${Date.now()}`
    };
    this.collections = [newRecord, ...this.collections];
    saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);

    // Update monthly stats
    if (this.monthlyStats.length > 0) {
      const currentMonthStat = this.monthlyStats[this.monthlyStats.length - 1];
      currentMonthStat.collectionsCount += 1;
      currentMonthStat.totalTons = Number((currentMonthStat.totalTons + newRecord.totalTons).toFixed(1));
      currentMonthStat.recycledTons = Number((currentMonthStat.recycledTons + newRecord.recycledTons).toFixed(1));
      currentMonthStat.organicTons = Number((currentMonthStat.organicTons + newRecord.organicTons).toFixed(1));
      saveToStorage(STORAGE_KEYS.MONTHLY_STATS, this.monthlyStats);
    }

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Recolección Registrada',
      message: `Se pesaron y procesaron ${newRecord.totalTons} Ton en ${newRecord.veredaName} (${newRecord.recycledTons} Ton aprovechables).`,
      timestamp: 'Ahora mismo',
      type: 'exito',
      read: false,
      vereda: newRecord.veredaName,
      linkTab: 'recolecciones'
    });

    this.notify();
    return newRecord;
  }

  public updateCollection(id: string, updates: Partial<CollectionRecord>): void {
    this.collections = this.collections.map(c => (c.id === id ? { ...c, ...updates } : c));
    saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);
    this.notify();
  }

  public deleteCollection(id: string): void {
    this.collections = this.collections.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);
    this.notify();
  }

  // Alert Actions
  public addAlert(alertData: Omit<IncidentAlert, 'id'>): IncidentAlert {
    const newAlert: IncidentAlert = {
      ...alertData,
      id: `alt-${Date.now()}`
    };
    this.alerts = [newAlert, ...this.alerts];
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: `Alerta: ${newAlert.title}`,
      message: `Reporte en vereda ${newAlert.veredaName}: ${newAlert.description.slice(0, 80)}...`,
      timestamp: 'Ahora mismo',
      type: 'alerta',
      read: false,
      vereda: newAlert.veredaName
    });

    this.notify();
    return newAlert;
  }

  public updateAlertStatus(id: string, status: IncidentAlert['status'], actionTaken?: string): void {
    this.alerts = this.alerts.map(a => (a.id === id ? { ...a, status, actionTaken: actionTaken || a.actionTaken } : a));
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    this.notify();
  }

  // Notification Actions
  public addNotification(notification: AppNotification): void {
    this.notifications = [notification, ...this.notifications];
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markAllNotificationsAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // Reset to initial demo data
  public resetToDemo(): void {
    localStorage.clear();
    this.init();
    this.notify();
  }
}

export const modelStore = new EcoRuralModelStore();
