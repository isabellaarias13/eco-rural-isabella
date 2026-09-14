import { 
  User, 
  UserRole,
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
import { 
  db, 
  testFirestoreConnection,
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from './firebase';

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
  firebaseConnected: boolean;
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
  private firebaseConnected: boolean = false;
  private isSyncingFromFirebase: boolean = false;

  constructor() {
    this.init();
    this.initFirebaseSync();
  }

  public deduplicateUsers(userList: User[]): User[] {
    const seenIds = new Set<string>();
    const seenDocs = new Set<string>();
    const seenEmails = new Set<string>();
    const result: User[] = [];

    for (const u of userList) {
      if (!u) continue;
      const cleanId = (u.id || '').trim();
      const rawDoc = (u.documentId || '').trim();
      const cleanDocDigits = rawDoc.replace(/\D/g, '');
      const cleanEmail = (u.email || '').trim().toLowerCase();

      // Check if duplicate by ID
      if (cleanId && seenIds.has(cleanId)) continue;

      // Check if duplicate by Document ID (both numeric comparison and exact string)
      if (cleanDocDigits && cleanDocDigits.length >= 4 && seenDocs.has(cleanDocDigits)) continue;
      if (rawDoc && rawDoc.length >= 4 && seenDocs.has(rawDoc)) continue;

      // Check if duplicate by Email (if email exists and is valid)
      if (cleanEmail && cleanEmail.includes('@') && seenEmails.has(cleanEmail)) continue;

      if (cleanId) seenIds.add(cleanId);
      if (cleanDocDigits && cleanDocDigits.length >= 4) seenDocs.add(cleanDocDigits);
      if (rawDoc && rawDoc.length >= 4) seenDocs.add(rawDoc);
      if (cleanEmail && cleanEmail.includes('@')) seenEmails.add(cleanEmail);

      result.push(u);
    }
    return result;
  }

  private init() {
    this.users = this.deduplicateUsers(loadFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS));
    // Remove any persisted localStorage user so every device starts at login/register screen
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    // Check sessionStorage only if the user explicitly logged in during this active browser tab
    try {
      const activeSession = sessionStorage.getItem('ecorural_session_user');
      if (activeSession) {
        this.currentUser = JSON.parse(activeSession);
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }

    this.trucks = loadFromStorage<Truck[]>(STORAGE_KEYS.TRUCKS, INITIAL_TRUCKS);
    this.routes = loadFromStorage<RuralRoute[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
    this.collections = loadFromStorage<CollectionRecord[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
    this.alerts = loadFromStorage<IncidentAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    this.notifications = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.monthlyStats = loadFromStorage<MonthlyStats[]>(STORAGE_KEYS.MONTHLY_STATS, HISTORICAL_MONTHLY_STATS);
    this.materials = loadFromStorage<MaterialDistribution[]>(STORAGE_KEYS.MATERIALS, MATERIAL_DISTRIBUTION);
  }

  private async initFirebaseSync() {
    try {
      this.firebaseConnected = await testFirestoreConnection();
      this.notify();

      // Listen to users collection
      onSnapshot(collection(db, 'users'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteUsers = snapshot.docs.map(d => {
            const data = d.data() as User;
            return {
              ...data,
              id: data.id || d.id
            } as User;
          });
          this.isSyncingFromFirebase = true;
          this.users = this.deduplicateUsers(remoteUsers);
          saveToStorage(STORAGE_KEYS.USERS, this.users);
          
          // Only update currentUser if one was already explicitly logged in; DO NOT override with users[0]
          if (this.currentUser) {
            const updatedCurrent = this.users.find(
              u => u.id === this.currentUser?.id || u.documentId === this.currentUser?.documentId
            );
            if (updatedCurrent) {
              this.currentUser = updatedCurrent;
              sessionStorage.setItem('ecorural_session_user', JSON.stringify(this.currentUser));
            }
          }
          this.isSyncingFromFirebase = false;
          this.notify();
        } else {
          // Seed initial users to Firebase if collection is empty
          this.seedInitialUsersToFirebase();
        }
      }, (err) => console.log('Firestore snapshot info (users):', err.message));

      // Listen to trucks collection
      onSnapshot(collection(db, 'trucks'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteTrucks = snapshot.docs.map(d => d.data() as Truck);
          this.isSyncingFromFirebase = true;
          this.trucks = remoteTrucks;
          saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
          this.isSyncingFromFirebase = false;
          this.notify();
        } else {
          this.seedInitialTrucksToFirebase();
        }
      }, (err) => console.log('Firestore snapshot info (trucks):', err.message));

      // Listen to routes collection
      onSnapshot(collection(db, 'routes'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteRoutes = snapshot.docs.map(d => d.data() as RuralRoute);
          this.isSyncingFromFirebase = true;
          this.routes = remoteRoutes;
          saveToStorage(STORAGE_KEYS.ROUTES, this.routes);
          this.isSyncingFromFirebase = false;
          this.notify();
        } else {
          this.seedInitialRoutesToFirebase();
        }
      }, (err) => console.log('Firestore snapshot info (routes):', err.message));

      // Listen to collections (recolecciones)
      onSnapshot(collection(db, 'collections'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteCollections = snapshot.docs.map(d => d.data() as CollectionRecord);
          this.isSyncingFromFirebase = true;
          this.collections = remoteCollections;
          saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);
          this.isSyncingFromFirebase = false;
          this.notify();
        } else {
          this.seedInitialCollectionsToFirebase();
        }
      }, (err) => console.log('Firestore snapshot info (collections):', err.message));

      // Listen to alerts
      onSnapshot(collection(db, 'alerts'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteAlerts = snapshot.docs.map(d => d.data() as IncidentAlert);
          this.isSyncingFromFirebase = true;
          this.alerts = remoteAlerts;
          saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
          this.isSyncingFromFirebase = false;
          this.notify();
        } else {
          this.seedInitialAlertsToFirebase();
        }
      }, (err) => console.log('Firestore snapshot info (alerts):', err.message));

      // Listen to notifications
      onSnapshot(collection(db, 'notifications'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteNotifications = snapshot.docs.map(d => d.data() as AppNotification);
          this.isSyncingFromFirebase = true;
          this.notifications = remoteNotifications;
          saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
          this.isSyncingFromFirebase = false;
          this.notify();
        }
      }, (err) => console.log('Firestore snapshot info (notifications):', err.message));

    } catch (e) {
      console.warn('Firebase initialization note:', e);
    }
  }

  // Seeding helpers for Firestore initial sync
  private async seedInitialUsersToFirebase() {
    try {
      for (const user of INITIAL_USERS) {
        await setDoc(doc(db, 'users', user.id), user);
      }
    } catch (e) {
      console.warn('Sync note (users):', e);
    }
  }

  private async seedInitialTrucksToFirebase() {
    try {
      for (const truck of INITIAL_TRUCKS) {
        await setDoc(doc(db, 'trucks', truck.id), truck);
      }
    } catch (e) {
      console.warn('Sync note (trucks):', e);
    }
  }

  private async seedInitialRoutesToFirebase() {
    try {
      for (const route of INITIAL_ROUTES) {
        await setDoc(doc(db, 'routes', route.id), route);
      }
    } catch (e) {
      console.warn('Sync note (routes):', e);
    }
  }

  private async seedInitialCollectionsToFirebase() {
    try {
      for (const col of INITIAL_COLLECTIONS) {
        await setDoc(doc(db, 'collections', col.id), col);
      }
    } catch (e) {
      console.warn('Sync note (collections):', e);
    }
  }

  private async seedInitialAlertsToFirebase() {
    try {
      for (const alert of INITIAL_ALERTS) {
        await setDoc(doc(db, 'alerts', alert.id), alert);
      }
    } catch (e) {
      console.warn('Sync note (alerts):', e);
    }
  }

  public getState(): EcoRuralState {
    this.users = this.deduplicateUsers(this.users);
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
      firebaseConnected: this.firebaseConnected
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  // Auth Actions
  public setCurrentUser(user: User | null): void {
    this.currentUser = user;
    if (user) {
      sessionStorage.setItem('ecorural_session_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('ecorural_session_user');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify();
  }

  public isAdminUser(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === 'administrador' || this.currentUser.role === 'coordinador';
  }

  public loginWithDocumentOrRole(documentId: string, role?: User['role']): User | null {
    const found = this.users.find(u => u.documentId === documentId || (role && u.role === role));
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    return null;
  }

  public registerUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    this.users = [newUser, ...this.users.filter(u => u.id !== newUser.id)];
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser);

    // Save to Firestore
    setDoc(doc(db, 'users', newUser.id), newUser).catch(err => console.warn('Firestore write user:', err));

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Bienvenido a Eco-Rural',
      message: `Hola ${newUser.name}, tu registro ha sido completado con éxito para ${newUser.vereda || 'Purificación'}.`,
      timestamp: 'Ahora mismo',
      type: 'exito',
      read: false
    });

    this.notify();
    return newUser;
  }

  // Truck Actions (Restricted to Administrators)
  public addTruck(truckData: Omit<Truck, 'id'>): Truck {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden agregar camiones.');
      throw new Error('Solo los administradores tienen permiso para agregar camiones.');
    }
    const newTruck: Truck = {
      ...truckData,
      id: `trk-${Date.now()}`
    };
    this.trucks = [...this.trucks, newTruck];
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);

    // Save to Firestore
    setDoc(doc(db, 'trucks', newTruck.id), newTruck).catch(err => console.warn('Firestore write truck:', err));

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Nuevo Camión Registrado',
      message: `Se añadió el camión #${newTruck.number} (${newTruck.plate}) a la flota municipal.`,
      timestamp: 'Ahora mismo',
      type: 'camion',
      read: false,
      linkTab: 'camiones'
    });

    this.notify();
    return newTruck;
  }

  public updateTruck(id: string, updates: Partial<Truck>): void {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden actualizar camiones.');
      return;
    }
    this.trucks = this.trucks.map(t => (t.id === id ? { ...t, ...updates } : t));
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    
    const updatedTruck = this.trucks.find(t => t.id === id);
    if (updatedTruck) {
      setDoc(doc(db, 'trucks', id), updatedTruck).catch(err => console.warn('Firestore update truck:', err));
    }

    this.notify();
  }

  public updateTruckStatus(id: string, status: Truck['status'], currentVereda?: string): void {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden cambiar estado de camiones.');
      return;
    }
    this.trucks = this.trucks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          currentVereda: currentVereda !== undefined ? currentVereda : t.currentVereda
        };
      }
      return t;
    });
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    const updated = this.trucks.find(t => t.id === id);
    if (updated) {
      setDoc(doc(db, 'trucks', id), updated).catch(err => console.warn('Firestore update truck status:', err));
    }
    this.notify();
  }

  public deleteTruck(id: string): void {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden eliminar camiones.');
      return;
    }
    this.trucks = this.trucks.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TRUCKS, this.trucks);
    deleteDoc(doc(db, 'trucks', id)).catch(err => console.warn('Firestore delete truck:', err));
    this.notify();
  }

  // Route Actions (Restricted to Administrators)
  public addRoute(routeData: Omit<RuralRoute, 'id'>): RuralRoute {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden programar rutas.');
      throw new Error('Solo los administradores tienen permiso para programar rutas.');
    }
    const newRoute: RuralRoute = {
      ...routeData,
      id: `rt-${Date.now()}`
    };
    this.routes = [newRoute, ...this.routes];
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);

    // Save to Firestore
    setDoc(doc(db, 'routes', newRoute.id), newRoute).catch(err => console.warn('Firestore write route:', err));

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Nueva Ruta Veredal Programada',
      message: `Ruta ${newRoute.code} asignada para ${newRoute.veredaName} el ${newRoute.scheduledDate}.`,
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
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden actualizar rutas.');
      return;
    }
    this.routes = this.routes.map(r => (r.id === id ? { ...r, ...updates } : r));
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);

    const updatedRoute = this.routes.find(r => r.id === id);
    if (updatedRoute) {
      setDoc(doc(db, 'routes', id), updatedRoute).catch(err => console.warn('Firestore update route:', err));
    }

    this.notify();
  }

  public deleteRoute(id: string): void {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden eliminar rutas.');
      return;
    }
    this.routes = this.routes.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);
    deleteDoc(doc(db, 'routes', id)).catch(err => console.warn('Firestore delete route:', err));
    this.notify();
  }

  public toggleRouteStop(routeId: string, stopId: string): void {
    // Only admins can change stop statuses
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden verificar paradas.');
      return;
    }
    this.routes = this.routes.map(route => {
      if (route.id === routeId && route.stops) {
        const updatedStops = route.stops.map(s => {
          if (s.id === stopId) {
            const nextCompleted = !s.completed;
            return {
              ...s,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : undefined
            };
          }
          return s;
        });
        return { ...route, stops: updatedStops };
      }
      return route;
    });
    saveToStorage(STORAGE_KEYS.ROUTES, this.routes);
    const updatedRoute = this.routes.find(r => r.id === routeId);
    if (updatedRoute) {
      setDoc(doc(db, 'routes', routeId), updatedRoute).catch(err => console.warn('Firestore update route stop:', err));
    }
    this.notify();
  }

  // Collection Actions (Restricted to Administrators)
  public addCollection(collectionData: Omit<CollectionRecord, 'id'>): CollectionRecord {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden registrar recolecciones.');
      throw new Error('Solo los administradores tienen permiso para registrar pesajes y recolecciones.');
    }
    const newRecord: CollectionRecord = {
      ...collectionData,
      id: `col-${Date.now()}`
    };
    this.collections = [newRecord, ...this.collections];
    saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);

    // Save to Firestore
    setDoc(doc(db, 'collections', newRecord.id), newRecord).catch(err => console.warn('Firestore write collection:', err));

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
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden modificar recolecciones.');
      return;
    }
    this.collections = this.collections.map(c => (c.id === id ? { ...c, ...updates } : c));
    saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);
    
    const updatedCollection = this.collections.find(c => c.id === id);
    if (updatedCollection) {
      setDoc(doc(db, 'collections', id), updatedCollection).catch(err => console.warn('Firestore update collection:', err));
    }

    this.notify();
  }

  public deleteCollection(id: string): void {
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden eliminar registros de recolección.');
      return;
    }
    this.collections = this.collections.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.COLLECTIONS, this.collections);
    deleteDoc(doc(db, 'collections', id)).catch(err => console.warn('Firestore delete collection:', err));
    this.notify();
  }

  // Alert Actions (Anyone can report, but ONLY admins can resolve/update status)
  public addAlert(alertData: Omit<IncidentAlert, 'id'>): IncidentAlert {
    const newAlert: IncidentAlert = {
      ...alertData,
      id: `alt-${Date.now()}`
    };
    this.alerts = [newAlert, ...this.alerts];
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);

    // Save to Firestore
    setDoc(doc(db, 'alerts', newAlert.id), newAlert).catch(err => console.warn('Firestore write alert:', err));

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
    if (!this.isAdminUser()) {
      console.warn('Permiso denegado: Solo administradores pueden cambiar el estado de las alertas.');
      return;
    }
    this.alerts = this.alerts.map(a => (a.id === id ? { ...a, status, actionTaken: actionTaken || a.actionTaken } : a));
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    
    const updatedAlert = this.alerts.find(a => a.id === id);
    if (updatedAlert) {
      setDoc(doc(db, 'alerts', id), updatedAlert).catch(err => console.warn('Firestore update alert:', err));
    }

    this.notify();
  }

  // Notification Actions
  public addNotification(notification: AppNotification): void {
    this.notifications = [notification, ...this.notifications];
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setDoc(doc(db, 'notifications', notification.id), notification).catch(err => console.warn('Firestore write notification:', err));
    this.notify();
  }

  public markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    const updatedNotification = this.notifications.find(n => n.id === id);
    if (updatedNotification) {
      setDoc(doc(db, 'notifications', id), updatedNotification).catch(err => console.warn('Firestore update notification:', err));
    }
    this.notify();
  }

  public markAllNotificationsAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    for (const notif of this.notifications) {
      setDoc(doc(db, 'notifications', notif.id), notif).catch(() => {});
    }
    this.notify();
  }

  // Getters for controllers & views
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getUsers(): User[] {
    this.users = this.deduplicateUsers(this.users);
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

  public isFirebaseConnected(): boolean {
    return this.firebaseConnected;
  }

  public addUser(user: User): void {
    // Put new registered user at index 0 and deduplicate against existing
    const cleanDoc = user.documentId ? user.documentId.replace(/\D/g, '') : '';
    const filteredExisting = this.users.filter(u => {
      if (u.id === user.id) return false;
      const uDocDigits = u.documentId ? u.documentId.replace(/\D/g, '') : '';
      if (cleanDoc && cleanDoc.length >= 4 && uDocDigits === cleanDoc) return false;
      return true;
    });

    this.users = this.deduplicateUsers([user, ...filteredExisting]);
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(user);
    setDoc(doc(db, 'users', user.id), user).catch(err => console.warn('Firestore write user:', err));

    // Register a system notification so the new user appears in notifications immediately
    this.addNotification({
      id: `notif-user-${Date.now()}`,
      title: 'Nuevo Habitante/Usuario Registrado',
      message: `${user.name} (${user.role.toUpperCase()}) se ha registrado en el sistema rural para la vereda ${user.vereda}.`,
      timestamp: 'Ahora mismo',
      type: 'comunidad',
      read: false,
      vereda: user.vereda
    });

    this.notify();
  }

  public deleteUser(userId: string): { success: boolean; message: string; deletedUser?: User } {
    const target = this.users.find(u => u.id === userId);
    if (!target) {
      return { success: false, message: 'Usuario no encontrado en la base de datos.' };
    }

    const cleanDoc = target.documentId ? target.documentId.replace(/\D/g, '') : '';
    const cleanEmail = (target.email || '').trim().toLowerCase();
    
    // Remove user and any accidental clone by doc digits or email or id
    this.users = this.users.filter(u => {
      if (u.id === userId) return false;
      if (cleanDoc && cleanDoc.length >= 4 && u.documentId.replace(/\D/g, '') === cleanDoc) return false;
      if (cleanEmail && cleanEmail.includes('@') && (u.email || '').trim().toLowerCase() === cleanEmail) return false;
      return true;
    });
    this.users = this.deduplicateUsers(this.users);
    saveToStorage(STORAGE_KEYS.USERS, this.users);

    // Delete in Firestore
    deleteDoc(doc(db, 'users', userId)).catch(err => {
      console.warn('Firestore delete user error:', err);
    });
    if (cleanDoc && cleanDoc !== userId) {
      deleteDoc(doc(db, 'users', cleanDoc)).catch(() => {});
    }
    if (target.documentId && target.documentId !== userId && target.documentId !== cleanDoc) {
      deleteDoc(doc(db, 'users', target.documentId)).catch(() => {});
    }

    // If deleting the current user in session
    if (this.currentUser?.id === userId || (cleanDoc && this.currentUser?.documentId.replace(/\D/g, '') === cleanDoc)) {
      this.currentUser = this.users.length > 0 ? this.users[0] : null;
      if (this.currentUser) {
        sessionStorage.setItem('ecorural_session_user', JSON.stringify(this.currentUser));
      } else {
        sessionStorage.removeItem('ecorural_session_user');
      }
    }

    this.addNotification({
      id: `notif-user-del-${Date.now()}`,
      title: 'Registro de Habitante Eliminado',
      message: `El habitante/usuario ${target.name} (${target.role.toUpperCase()}) ha sido eliminado del sistema.`,
      timestamp: 'Ahora mismo',
      type: 'alerta',
      read: false
    });

    this.notify();
    return { success: true, message: `El habitante ${target.name} fue eliminado con éxito.`, deletedUser: target };
  }

  public updateUserProfile(userId: string, data: Partial<User>): { success: boolean; user?: User; message: string } {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado.' };
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...data
    };

    this.users[userIndex] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    setDoc(doc(db, 'users', userId), updatedUser).catch(err => console.warn('Firestore update profile:', err));

    if (this.currentUser?.id === userId) {
      this.currentUser = updatedUser;
      sessionStorage.setItem('ecorural_session_user', JSON.stringify(updatedUser));
    }

    this.addNotification({
      id: `notif-profile-${Date.now()}`,
      title: 'Perfil Actualizado',
      message: `La información de perfil de ${updatedUser.name} ha sido actualizada con éxito.`,
      timestamp: 'Ahora mismo',
      type: 'exito',
      read: false
    });

    this.notify();
    return { success: true, user: updatedUser, message: 'Perfil actualizado con éxito.' };
  }

  public updateUserRole(userId: string, newRole: UserRole): User | null {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    const updatedUser: User = {
      ...this.users[userIndex],
      role: newRole
    };

    this.users[userIndex] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    setDoc(doc(db, 'users', userId), updatedUser).catch(err => console.warn('Firestore update role:', err));

    if (this.currentUser?.id === userId) {
      this.currentUser = updatedUser;
      sessionStorage.setItem('ecorural_session_user', JSON.stringify(updatedUser));
    }

    this.notify();
    return updatedUser;
  }

  public updateUserPassword(documentIdOrEmailOrPhone: string, newPassword: string): { success: boolean; message: string; user?: User } {
    const clean = documentIdOrEmailOrPhone.trim().toLowerCase();
    const cleanNumbers = clean.replace(/\D/g, '');

    const userIndex = this.users.findIndex(u => {
      const uDocNumbers = u.documentId.replace(/\D/g, '');
      const uPhoneNumbers = u.phone.replace(/\D/g, '');
      const uEmail = (u.email || '').toLowerCase();

      return (
        (cleanNumbers.length > 3 && (uDocNumbers === cleanNumbers || uPhoneNumbers === cleanNumbers)) ||
        (clean.length > 3 && uEmail === clean)
      );
    });

    if (userIndex === -1) {
      return { success: false, message: 'No se encontró ningún usuario con ese número de documento, correo o teléfono.' };
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      password: newPassword
    };

    this.users[userIndex] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(err => console.warn('Firestore update pass:', err));

    if (this.currentUser?.id === updatedUser.id) {
      this.currentUser = updatedUser;
      sessionStorage.setItem('ecorural_session_user', JSON.stringify(this.currentUser));
    }

    this.addNotification({
      id: `notif-pass-${Date.now()}`,
      title: 'Contraseña Actualizada',
      message: `Se ha restablecido exitosamente la contraseña para el usuario ${updatedUser.name}.`,
      timestamp: 'Ahora mismo',
      type: 'exito',
      read: false
    });

    this.notify();
    return { success: true, message: 'Contraseña actualizada con éxito.', user: updatedUser };
  }

  // Reset to initial demo data
  public resetToDemo(): void {
    localStorage.clear();
    this.init();
    this.seedInitialUsersToFirebase();
    this.seedInitialTrucksToFirebase();
    this.seedInitialRoutesToFirebase();
    this.seedInitialCollectionsToFirebase();
    this.seedInitialAlertsToFirebase();
    this.notify();
  }
}

export const modelStore = new EcoRuralModelStore();
