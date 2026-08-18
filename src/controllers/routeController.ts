import { modelStore } from '../models/store';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { RuralRoute, RouteStatus } from '../types';

export class RouteController {
  public static createRoute(params: {
    veredaName: string;
    scheduledDate: string;
    startTime: string;
    estimatedEndTime: string;
    truckId: string;
    wasteTypePriority: 'Mixto Rural' | 'Orgánico Agropecuario' | 'Aprovechables Secos' | 'Ordinarios';
    notes?: string;
    estimatedTons?: number;
  }): RuralRoute {
    const trucks = modelStore.getTrucks();
    const truck = trucks.find(t => t.id === params.truckId) || trucks[0];
    const vereda = PURIFICACION_VEREDAS.find(v => v.name === params.veredaName);

    const routeCount = modelStore.getRoutes().length + 1;
    const code = `RUTA-${params.veredaName.substring(0, 3).toUpperCase()}-${String(routeCount).padStart(2, '0')}`;

    // Auto-generate standard rural checkpoints/stops for the vereda
    const defaultStops = [
      { id: `st-${Date.now()}-1`, name: `Entrada y Cruce Principal ${params.veredaName}`, timeEst: params.startTime, completed: false },
      { id: `st-${Date.now()}-2`, name: `Escuela / Caserío Central`, timeEst: '08:15 AM', completed: false },
      { id: `st-${Date.now()}-3`, name: `Punto Limpio y Fincas del Alto`, timeEst: params.estimatedEndTime, completed: false }
    ];

    const newRoute = modelStore.addRoute({
      code,
      veredaId: vereda?.id || 'vereda-gen',
      veredaName: params.veredaName,
      scheduledDate: params.scheduledDate,
      startTime: params.startTime,
      estimatedEndTime: params.estimatedEndTime,
      truckId: truck.id,
      truckNumber: truck.number,
      truckPlate: truck.plate,
      driverId: truck.driverId,
      driverName: truck.driverName,
      driverPhone: truck.driverPhone,
      status: 'programada',
      estimatedTons: params.estimatedTons || 4.0,
      collectedTons: 0,
      recycledTons: 0,
      efficiencyPercent: 90,
      wasteTypePriority: params.wasteTypePriority,
      notes: params.notes || `Ruta para recolección en ${params.veredaName} Purificación.`,
      stops: defaultStops,
      incidentsReported: 0
    });

    return newRoute;
  }

  public static updateRoute(id: string, updates: Partial<RuralRoute>): void {
    if (updates.truckId) {
      const trucks = modelStore.getTrucks();
      const truck = trucks.find(t => t.id === updates.truckId);
      if (truck) {
        updates.truckNumber = truck.number;
        updates.truckPlate = truck.plate;
        updates.driverId = truck.driverId;
        updates.driverName = truck.driverName;
        updates.driverPhone = truck.driverPhone;
      }
    }
    modelStore.updateRoute(id, updates);
  }

  public static deleteRoute(id: string): void {
    modelStore.deleteRoute(id);
  }

  public static changeStatus(id: string, status: RouteStatus): void {
    const route = modelStore.getRoutes().find(r => r.id === id);
    if (!route) return;

    modelStore.updateRoute(id, { status });

    if (status === 'en_progreso') {
      modelStore.updateTruckStatus(route.truckId, 'en_servicio', route.veredaName);
    } else if (status === 'completada') {
      modelStore.updateTruckStatus(route.truckId, 'disponible');
      // If completed and no collection record exists for today, automatically register it in collections
      const exists = modelStore.getCollections().some(c => c.veredaName === route.veredaName && c.date === route.scheduledDate);
      if (!exists) {
        modelStore.addCollection({
          code: `REC-${Date.now().toString().slice(-6)}`,
          veredaName: route.veredaName,
          date: route.scheduledDate,
          time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          truckNumber: route.truckNumber,
          truckPlate: route.truckPlate,
          driverName: route.driverName,
          organicTons: Number((route.estimatedTons * 0.45).toFixed(1)),
          plasticTons: Number((route.estimatedTons * 0.22).toFixed(1)),
          glassTons: Number((route.estimatedTons * 0.08).toFixed(1)),
          cardboardTons: Number((route.estimatedTons * 0.12).toFixed(1)),
          metalTons: Number((route.estimatedTons * 0.05).toFixed(1)),
          ordinaryTons: Number((route.estimatedTons * 0.08).toFixed(1)),
          totalTons: route.estimatedTons,
          recycledTons: Number((route.estimatedTons * 0.47).toFixed(1)),
          efficiencyPercent: 95,
          status: 'completado',
          notes: `Recolección completada con éxito en ${route.veredaName}.`
        });
      }
    }
  }

  public static toggleStop(routeId: string, stopId: string): void {
    modelStore.toggleRouteStop(routeId, stopId);
  }
}
