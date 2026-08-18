import { modelStore } from '../models/store';
import { Truck, TruckStatus } from '../types';

export class TruckController {
  public static addTruck(data: {
    number: string;
    plate: string;
    model: string;
    capacityTons: number;
    driverName: string;
    driverPhone: string;
    serviceZone: string;
    year: number;
  }): Truck {
    return modelStore.addTruck({
      number: data.number.trim().toUpperCase(),
      plate: data.plate.trim().toUpperCase(),
      model: data.model.trim(),
      capacityTons: data.capacityTons,
      currentLoadTons: 0,
      driverId: `drv-${Date.now()}`,
      driverName: data.driverName.trim(),
      driverPhone: data.driverPhone.trim(),
      status: 'disponible',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      mileageKm: 1200,
      fuelLevelPercent: 100,
      serviceZone: data.serviceZone || 'Purificación Rural',
      year: data.year || 2024
    });
  }

  public static updateTruck(id: string, updates: Partial<Truck>): void {
    modelStore.updateTruck(id, updates);
  }

  public static setStatus(id: string, status: TruckStatus, currentVereda?: string): void {
    modelStore.updateTruckStatus(id, status, currentVereda);
  }

  public static deleteTruck(id: string): void {
    modelStore.deleteTruck(id);
  }
}
