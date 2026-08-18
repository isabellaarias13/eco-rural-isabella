import { modelStore } from '../models/store';
import { CollectionRecord } from '../types';

export class CollectionController {
  public static createCollection(data: {
    veredaName: string;
    date: string;
    time: string;
    truckId: string;
    organicTons: number;
    plasticTons: number;
    glassTons: number;
    cardboardTons: number;
    metalTons: number;
    ordinaryTons: number;
    notes?: string;
  }): CollectionRecord {
    const trucks = modelStore.getTrucks();
    const truck = trucks.find(t => t.id === data.truckId) || trucks[0];

    const recycledTons = Number(
      (data.plasticTons + data.glassTons + data.cardboardTons + data.metalTons).toFixed(2)
    );
    const totalTons = Number(
      (data.organicTons + recycledTons + data.ordinaryTons).toFixed(2)
    );
    
    // Efficiency: (organic + recycled) / total * 100
    const efficiencyPercent = totalTons > 0 
      ? Math.min(100, Math.round(((data.organicTons + recycledTons) / totalTons) * 100)) 
      : 90;

    const code = `REC-${Date.now().toString().slice(-6)}`;

    return modelStore.addCollection({
      code,
      veredaName: data.veredaName,
      date: data.date,
      time: data.time,
      truckNumber: truck.number,
      truckPlate: truck.plate,
      driverName: truck.driverName,
      organicTons: data.organicTons,
      plasticTons: data.plasticTons,
      glassTons: data.glassTons,
      cardboardTons: data.cardboardTons,
      metalTons: data.metalTons,
      ordinaryTons: data.ordinaryTons,
      totalTons,
      recycledTons,
      efficiencyPercent,
      status: 'completado',
      notes: data.notes || `Recolección oficial en vereda ${data.veredaName}.`
    });
  }

  public static updateCollection(id: string, updates: Partial<CollectionRecord>): void {
    modelStore.updateCollection(id, updates);
  }

  public static deleteCollection(id: string): void {
    modelStore.deleteCollection(id);
  }
}
