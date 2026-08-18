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

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Carlos Andrés Morales',
    email: 'coordinador@ecorural-purificacion.gov.co',
    documentId: '93.382.410',
    vereda: 'Cabecera Municipal',
    phone: '312 458 9021',
    role: 'coordinador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Don Jairo Benítez',
    email: 'jairo.conductor@ecorural.co',
    documentId: '14.280.993',
    vereda: 'Sabaneta',
    phone: '315 882 1044',
    role: 'conductor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'María Esperanza Guzmán',
    email: 'esperanza.guzman@purificacion-rural.org',
    documentId: '65.742.118',
    vereda: 'Chenche Asoleado',
    phone: '320 671 4490',
    role: 'habitante',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TRUCKS: Truck[] = [
  {
    id: 'trk-1',
    number: 'CAM-01',
    plate: 'WTK-842',
    model: 'Chevrolet FVR Compactador Rural',
    capacityTons: 8.5,
    currentLoadTons: 4.2,
    driverId: 'usr-2',
    driverName: 'Jairo Benítez',
    driverPhone: '315 882 1044',
    status: 'en_servicio',
    lastMaintenanceDate: '2026-08-05',
    mileageKm: 48230,
    fuelLevelPercent: 78,
    currentVereda: 'Chenche Asoleado',
    serviceZone: 'Sector Norte',
    year: 2023
  },
  {
    id: 'trk-2',
    number: 'CAM-02',
    plate: 'SMR-319',
    model: 'Hino Dutro 716 Recolector',
    capacityTons: 5.5,
    currentLoadTons: 3.8,
    driverId: 'drv-2',
    driverName: 'Héctor Fabio Lozano',
    driverPhone: '311 904 5532',
    status: 'en_servicio',
    lastMaintenanceDate: '2026-08-10',
    mileageKm: 62100,
    fuelLevelPercent: 62,
    currentVereda: 'Las Damas',
    serviceZone: 'Sector Oriental',
    year: 2022
  },
  {
    id: 'trk-3',
    number: 'CAM-03',
    plate: 'TLM-704',
    model: 'Isuzu NPR 4x4 Todo Terreno',
    capacityTons: 4.5,
    currentLoadTons: 0,
    driverId: 'drv-3',
    driverName: 'Ramiro Alfonso Varón',
    driverPhone: '314 233 8761',
    status: 'disponible',
    lastMaintenanceDate: '2026-08-12',
    mileageKm: 35400,
    fuelLevelPercent: 95,
    currentVereda: 'Parque Central Base',
    serviceZone: 'Sector Occidental',
    year: 2024
  },
  {
    id: 'trk-4',
    number: 'CAM-04',
    plate: 'PQX-512',
    model: 'Ford Cargo 815 Volqueta Adaptada',
    capacityTons: 6.0,
    currentLoadTons: 0,
    driverId: 'drv-4',
    driverName: 'Albeiro Castro Ortiz',
    driverPhone: '318 765 4321',
    status: 'mantenimiento',
    lastMaintenanceDate: '2026-08-17',
    mileageKm: 89300,
    fuelLevelPercent: 30,
    currentVereda: 'Taller Municipal',
    serviceZone: 'Sector Sur',
    year: 2021
  }
];

export const INITIAL_ROUTES: RuralRoute[] = [
  {
    id: 'rt-101',
    code: 'RUTA-NORTE-01',
    veredaId: 'vereda-chenche-asoleado',
    veredaName: 'Chenche Asoleado',
    scheduledDate: '2026-08-18',
    startTime: '06:30 AM',
    estimatedEndTime: '11:45 AM',
    truckId: 'trk-1',
    truckNumber: 'CAM-01',
    truckPlate: 'WTK-842',
    driverId: 'usr-2',
    driverName: 'Jairo Benítez',
    driverPhone: '315 882 1044',
    status: 'en_progreso',
    estimatedTons: 4.8,
    collectedTons: 3.6,
    recycledTons: 1.4,
    efficiencyPercent: 92,
    wasteTypePriority: 'Aprovechables Secos',
    notes: 'Priorizar recolección de empaques plásticos agrícolas limpios y evitar quemas en orillas de carretera.',
    stops: [
      { id: 'st-1', name: 'Entrada Puente Chenche', timeEst: '06:45 AM', completed: true, notes: 'Comunidad organizada con bolsas blancas' },
      { id: 'st-2', name: 'Escuela Rural Chenche Asoleado', timeEst: '07:30 AM', completed: true, notes: 'Reciclaje de papel y plástico escolar' },
      { id: 'st-3', name: 'Tienda Las Palmas (Cruce Chenche 1)', timeEst: '08:45 AM', completed: true, notes: 'Excelente separación' },
      { id: 'st-4', name: 'Finca El Porvenir', timeEst: '09:50 AM', completed: false, notes: 'En camino' },
      { id: 'st-5', name: 'Sector El Palmar', timeEst: '11:15 AM', completed: false }
    ],
    incidentsReported: 0
  },
  {
    id: 'rt-102',
    code: 'RUTA-ORIENTE-02',
    veredaId: 'vereda-las-damas',
    veredaName: 'Las Damas',
    scheduledDate: '2026-08-18',
    startTime: '07:00 AM',
    estimatedEndTime: '12:30 PM',
    truckId: 'trk-2',
    truckNumber: 'CAM-02',
    truckPlate: 'SMR-319',
    driverId: 'drv-2',
    driverName: 'Héctor Fabio Lozano',
    driverPhone: '311 904 5532',
    status: 'en_progreso',
    estimatedTons: 4.2,
    collectedTons: 2.9,
    recycledTons: 1.1,
    efficiencyPercent: 88,
    wasteTypePriority: 'Mixto Rural',
    notes: 'Sector con alta producción de envases de vidrio y chatarra menor.',
    stops: [
      { id: 'st-6', name: 'Cruce Veredal Las Damas', timeEst: '07:15 AM', completed: true },
      { id: 'st-7', name: 'Centro Comunitario y Cancha', timeEst: '08:30 AM', completed: true },
      { id: 'st-8', name: 'Vereda La Mata - Punto Limpio', timeEst: '10:15 AM', completed: false },
      { id: 'st-9', name: 'Hacienda La Ceiba', timeEst: '11:45 AM', completed: false }
    ],
    incidentsReported: 1
  },
  {
    id: 'rt-103',
    code: 'RUTA-SUR-03',
    veredaId: 'vereda-el-baura',
    veredaName: 'El Baura',
    scheduledDate: '2026-08-19',
    startTime: '06:00 AM',
    estimatedEndTime: '11:30 AM',
    truckId: 'trk-3',
    truckNumber: 'CAM-03',
    truckPlate: 'TLM-704',
    driverId: 'drv-3',
    driverName: 'Ramiro Alfonso Varón',
    driverPhone: '314 233 8761',
    status: 'programada',
    estimatedTons: 3.9,
    collectedTons: 0,
    recycledTons: 0,
    efficiencyPercent: 95,
    wasteTypePriority: 'Orgánico Agropecuario',
    notes: 'Jornada especial de compostaje y recolección de residuos orgánicos de cosechas.',
    stops: [
      { id: 'st-10', name: 'Muelle Fluvial El Baura', timeEst: '06:20 AM', completed: false },
      { id: 'st-11', name: 'Caserío Central', timeEst: '07:45 AM', completed: false },
      { id: 'st-12', name: 'Vereda Remolino Empalme', timeEst: '09:30 AM', completed: false }
    ],
    incidentsReported: 0
  },
  {
    id: 'rt-104',
    code: 'RUTA-OCC-04',
    veredaId: 'vereda-el-tambo',
    veredaName: 'El Tambo',
    scheduledDate: '2026-08-19',
    startTime: '01:00 PM',
    estimatedEndTime: '05:30 PM',
    truckId: 'trk-1',
    truckNumber: 'CAM-01',
    truckPlate: 'WTK-842',
    driverId: 'usr-2',
    driverName: 'Jairo Benítez',
    driverPhone: '315 882 1044',
    status: 'programada',
    estimatedTons: 5.1,
    collectedTons: 0,
    recycledTons: 0,
    efficiencyPercent: 90,
    wasteTypePriority: 'Mixto Rural',
    notes: 'Paso por vereda Santa Lucía 1 y Santa Lucía 2 en la tarde.',
    stops: [
      { id: 'st-13', name: 'Plaza El Tambo', timeEst: '01:15 PM', completed: false },
      { id: 'st-14', name: 'Vereda Santa Lucía 1 Centro', timeEst: '02:40 PM', completed: false },
      { id: 'st-15', name: 'Santa Lucía 2 Escuela', timeEst: '04:10 PM', completed: false }
    ],
    incidentsReported: 0
  },
  {
    id: 'rt-105',
    code: 'RUTA-CENTRO-05',
    veredaId: 'vereda-sabaneta',
    veredaName: 'Sabaneta',
    scheduledDate: '2026-08-17',
    startTime: '07:00 AM',
    estimatedEndTime: '12:00 PM',
    truckId: 'trk-2',
    truckNumber: 'CAM-02',
    truckPlate: 'SMR-319',
    driverId: 'drv-2',
    driverName: 'Héctor Fabio Lozano',
    driverPhone: '311 904 5532',
    status: 'completada',
    estimatedTons: 4.5,
    collectedTons: 4.6,
    recycledTons: 1.8,
    efficiencyPercent: 96,
    wasteTypePriority: 'Aprovechables Secos',
    notes: 'Recolección exitosa, cero quema de basuras en la jornada.',
    stops: [
      { id: 'st-16', name: 'Entrada Sabaneta', timeEst: '07:15 AM', completed: true },
      { id: 'st-17', name: 'Sector El Recreo', timeEst: '08:45 AM', completed: true },
      { id: 'st-18', name: 'Cruce Buenavista', timeEst: '10:30 AM', completed: true }
    ],
    incidentsReported: 0
  }
];

export const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: 'col-001',
    code: 'REC-2026-0818-01',
    veredaName: 'Chenche Asoleado',
    date: '2026-08-18',
    time: '08:45 AM',
    truckNumber: 'CAM-01',
    truckPlate: 'WTK-842',
    driverName: 'Jairo Benítez',
    organicTons: 1.6,
    plasticTons: 0.8,
    glassTons: 0.3,
    cardboardTons: 0.5,
    metalTons: 0.2,
    ordinaryTons: 1.2,
    totalTons: 4.6,
    recycledTons: 1.8,
    efficiencyPercent: 94,
    status: 'en_curso',
    notes: 'Sector agrícola comprometido con la separación. Cero bolsas arrojadas a quebradas.'
  },
  {
    id: 'col-002',
    code: 'REC-2026-0818-02',
    veredaName: 'Las Damas',
    date: '2026-08-18',
    time: '09:20 AM',
    truckNumber: 'CAM-02',
    truckPlate: 'SMR-319',
    driverName: 'Héctor Fabio Lozano',
    organicTons: 1.1,
    plasticTons: 0.6,
    glassTons: 0.4,
    cardboardTons: 0.3,
    metalTons: 0.1,
    ordinaryTons: 1.0,
    totalTons: 3.5,
    recycledTons: 1.4,
    efficiencyPercent: 89,
    status: 'en_curso',
    notes: 'Jornada activa. Vecinos entregaron chatarra de alambre y envases vacíos.'
  },
  {
    id: 'col-003',
    code: 'REC-2026-0817-03',
    veredaName: 'Sabaneta',
    date: '2026-08-17',
    time: '11:30 AM',
    truckNumber: 'CAM-02',
    truckPlate: 'SMR-319',
    driverName: 'Héctor Fabio Lozano',
    organicTons: 1.8,
    plasticTons: 0.9,
    glassTons: 0.3,
    cardboardTons: 0.4,
    metalTons: 0.2,
    ordinaryTons: 1.0,
    totalTons: 4.6,
    recycledTons: 1.8,
    efficiencyPercent: 96,
    status: 'completado',
    notes: 'Completada sin contratiempos en los tres puntos de acopio veredal.'
  },
  {
    id: 'col-004',
    code: 'REC-2026-0816-04',
    veredaName: 'El Tigre',
    date: '2026-08-16',
    time: '10:15 AM',
    truckNumber: 'CAM-03',
    truckPlate: 'TLM-704',
    driverName: 'Ramiro Alfonso Varón',
    organicTons: 1.2,
    plasticTons: 0.5,
    glassTons: 0.2,
    cardboardTons: 0.3,
    metalTons: 0.1,
    ordinaryTons: 0.9,
    totalTons: 3.2,
    recycledTons: 1.1,
    efficiencyPercent: 91,
    status: 'completado',
    notes: 'Excelente respuesta en zona de reserva; fauna silvestre protegida.'
  },
  {
    id: 'col-005',
    code: 'REC-2026-0815-05',
    veredaName: 'Campo Alegre',
    date: '2026-08-15',
    time: '02:00 PM',
    truckNumber: 'CAM-01',
    truckPlate: 'WTK-842',
    driverName: 'Jairo Benítez',
    organicTons: 2.1,
    plasticTons: 0.7,
    glassTons: 0.2,
    cardboardTons: 0.4,
    metalTons: 0.3,
    ordinaryTons: 1.4,
    totalTons: 5.1,
    recycledTons: 1.6,
    efficiencyPercent: 93,
    status: 'completado',
    notes: 'Recolección de bagazo y residuos orgánicos para abono en fincas.'
  },
  {
    id: 'col-006',
    code: 'REC-2026-0814-06',
    veredaName: 'Remolino',
    date: '2026-08-14',
    time: '08:30 AM',
    truckNumber: 'CAM-02',
    truckPlate: 'SMR-319',
    driverName: 'Héctor Fabio Lozano',
    organicTons: 1.4,
    plasticTons: 0.8,
    glassTons: 0.4,
    cardboardTons: 0.5,
    metalTons: 0.1,
    ordinaryTons: 0.8,
    totalTons: 4.0,
    recycledTons: 1.8,
    efficiencyPercent: 95,
    status: 'completado',
    notes: 'Ribera del Magdalena limpia de plásticos y botellas.'
  },
  {
    id: 'col-007',
    code: 'REC-2026-0813-07',
    veredaName: 'Buenavista',
    date: '2026-08-13',
    time: '11:00 AM',
    truckNumber: 'CAM-03',
    truckPlate: 'TLM-704',
    driverName: 'Ramiro Alfonso Varón',
    organicTons: 1.7,
    plasticTons: 0.6,
    glassTons: 0.3,
    cardboardTons: 0.4,
    metalTons: 0.1,
    ordinaryTons: 0.9,
    totalTons: 4.0,
    recycledTons: 1.4,
    efficiencyPercent: 92,
    status: 'completado',
    notes: 'Ruta de alta montaña completada con vehículo 4x4.'
  }
];

export const INITIAL_ALERTS: IncidentAlert[] = [
  {
    id: 'alt-01',
    title: 'Alerta Preventiva de Quema de Hojas y Plásticos',
    type: 'quema_basura',
    veredaName: 'Chenche 2',
    date: '2026-08-18',
    time: '07:10 AM',
    reportedBy: 'Gustavo Adolfo Prado (Líder JAC)',
    reporterPhone: '313 881 2290',
    status: 'atendida',
    description: 'Vecino preparaba quema en lindero de potrero. El promotor ambiental de Eco-Rural intervino, se le explicó la ruta de recolección y se evitó la emisión de humo tóxico y riesgo de incendio forestal.',
    severity: 'alta',
    preventedBurning: true,
    actionTaken: 'Material empacado para la ruta del jueves. Sensibilización comunitaria realizada.'
  },
  {
    id: 'alt-02',
    title: 'Punto Crítico con Mal Olor y Presencia de Perros Callejeros',
    type: 'olor_fuerte',
    veredaName: 'El Baura',
    date: '2026-08-17',
    time: '04:30 PM',
    reportedBy: 'Rosalba Cifuentes',
    reporterPhone: '321 445 6701',
    status: 'en_revision',
    description: 'Acumulación indebida de vísceras de pescado y residuos en la curva del río. Animales silvestres y perros estaban rompiendo las bolsas generando malos olores.',
    severity: 'alta',
    preventedBurning: false,
    actionTaken: 'Se programó cuadrilla de aseo prioritaria y caneca comunitaria sellada.'
  },
  {
    id: 'alt-03',
    title: 'Árbol caído y vía con paso restringido para camión',
    type: 'via_bloqueada',
    veredaName: 'Santa Lucía 2',
    date: '2026-08-17',
    time: '02:15 PM',
    reportedBy: 'Nelson Méndez',
    reporterPhone: '310 992 3314',
    status: 'critica',
    description: 'Rama de samán obstaculiza el paso de vehículos pesados en el km 4 del tramo veredal.',
    severity: 'media',
    preventedBurning: false,
    actionTaken: 'Maquinaria de infraestructura alertada para despeje antes de la ruta matutina.'
  },
  {
    id: 'alt-04',
    title: 'Reporte de Quema Clandestina Evitada',
    type: 'quema_basura',
    veredaName: 'Las Damas',
    date: '2026-08-16',
    time: '09:00 AM',
    reportedBy: 'Comité de Convivencia Veredal',
    status: 'atendida',
    description: 'Se evitó la quema de envases de agroquímicos usados. Se canalizaron al programa Campo Limpio de Purificación.',
    severity: 'alta',
    preventedBurning: true,
    actionTaken: 'Residuos entregados al centro de acopio seguro.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '¡Camión en tu sector!',
    message: 'El camión CAM-01 (WTK-842) conducido por Jairo Benítez acaba de ingresar a Chenche Asoleado.',
    timestamp: 'Hace 8 minutos',
    type: 'camion',
    read: false,
    vereda: 'Chenche Asoleado',
    linkTab: 'recolecciones'
  },
  {
    id: 'notif-2',
    title: 'Éxito Ambiental: Quema Evitada',
    message: 'Gracias al aviso comunitario se detuvo una quema de basuras en Chenche 2. Cuidamos el aire de Purificación.',
    timestamp: 'Hace 45 minutos',
    type: 'exito',
    read: false,
    vereda: 'Chenche 2',
    linkTab: 'rutas'
  },
  {
    id: 'notif-3',
    title: 'Próxima Ruta Programada Mañana',
    message: 'Mañana 19 de Agosto a las 06:00 AM inicia la recolección en El Baura y El Tambo.',
    timestamp: 'Hace 2 horas',
    type: 'ruta',
    read: true,
    vereda: 'El Baura',
    linkTab: 'rutas'
  },
  {
    id: 'notif-4',
    title: 'Mantenimiento Preventivo Concluido',
    message: 'El camión CAM-03 (TLM-704) superó la revisión tecnomecánica y ya está disponible para el servicio.',
    timestamp: 'Hace 5 horas',
    type: 'camion',
    read: true,
    linkTab: 'camiones'
  }
];

export const HISTORICAL_MONTHLY_STATS: MonthlyStats[] = [
  { month: 'Enero', monthNumber: 1, collectionsCount: 42, totalTons: 138.4, recycledTons: 48.2, organicTons: 62.1, efficiencyPercent: 88, burningsPrevented: 18 },
  { month: 'Febrero', monthNumber: 2, collectionsCount: 40, totalTons: 132.0, recycledTons: 47.5, organicTons: 59.4, efficiencyPercent: 89, burningsPrevented: 22 },
  { month: 'Marzo', monthNumber: 3, collectionsCount: 46, totalTons: 149.2, recycledTons: 55.1, organicTons: 68.3, efficiencyPercent: 91, burningsPrevented: 29 },
  { month: 'Abril', monthNumber: 4, collectionsCount: 44, totalTons: 142.8, recycledTons: 53.0, organicTons: 65.0, efficiencyPercent: 90, burningsPrevented: 25 },
  { month: 'Mayo', monthNumber: 5, collectionsCount: 48, totalTons: 156.3, recycledTons: 60.8, organicTons: 71.2, efficiencyPercent: 93, burningsPrevented: 34 },
  { month: 'Junio', monthNumber: 6, collectionsCount: 50, totalTons: 162.5, recycledTons: 64.2, organicTons: 74.0, efficiencyPercent: 94, burningsPrevented: 38 },
  { month: 'Julio', monthNumber: 7, collectionsCount: 52, totalTons: 168.0, recycledTons: 67.5, organicTons: 76.5, efficiencyPercent: 95, burningsPrevented: 41 },
  { month: 'Agosto (Actual)', monthNumber: 8, collectionsCount: 36, totalTons: 118.6, recycledTons: 49.3, organicTons: 54.2, efficiencyPercent: 96, burningsPrevented: 27 }
];

export const MATERIAL_DISTRIBUTION: MaterialDistribution[] = [
  {
    name: 'Residuos Orgánicos para Compostaje',
    category: 'Orgánico Aprovechable',
    percentage: 46,
    tons: 54.5,
    color: '#16a34a', // Verde Esmeralda
    description: 'Restos de cosechas, cáscaras, podas de fincas y residuos de cocina transformados en abono orgánico para Purificación.'
  },
  {
    name: 'Plásticos y Envases Agrícolas Limpios',
    category: 'Reciclable Seco',
    percentage: 22,
    tons: 26.1,
    color: '#0284c7', // Azul Purificación
    description: 'Botellas PET, plásticos rígidos, bolsas seleccionadas y envases no tóxicos lavados.'
  },
  {
    name: 'Cartón, Papel y Empaques',
    category: 'Reciclable Celulósico',
    percentage: 12,
    tons: 14.2,
    color: '#ca8a04', // Amarillo Dorado
    description: 'Cajas de embalaje rural, panelería, periódicos y empaques secos.'
  },
  {
    name: 'Vidrio y Botellas',
    category: 'Reciclable Inerte',
    percentage: 8,
    tons: 9.5,
    color: '#0d9488', // Verde Azulado
    description: 'Envases de bebidas, frascos de conservas y botellas retornables.'
  },
  {
    name: 'Metales y Chatarra Menor',
    category: 'Reciclable Metálico',
    percentage: 5,
    tons: 5.9,
    color: '#64748b', // Gris Acero
    description: 'Alambres de cerca, latas de alimentos, chatarra agrícola recuperable.'
  },
  {
    name: 'Residuos Ordinarios No Aprovechables',
    category: 'Disposición Final',
    percentage: 7,
    tons: 8.4,
    color: '#dc2626', // Rojo
    description: 'Papel higiénico, servilletas usadas, pañales y residuos no recuperables llevados a celda sanitaria.'
  }
];
