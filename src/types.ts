export type Language = 'en' | 'am';

export type RationingStatus = 'flowing' | 'scheduled' | 'filling' | 'maintenance';

export interface RationingZone {
  id: string;
  subCityEn: string;
  subCityAm: string;
  woredas: string;
  woredasAm: string;
  majorNeighborhoods: string[];
  status: RationingStatus;
  pressureBar: number;
  originReservoir: string;
  originReservoirAm: string;
  scheduleWindowEn: string;
  scheduleWindowAm: string;
  nextSupplyTimeEn: string;
  nextSupplyTimeAm: string;
  valveOpenPercent: number;
  populationServed: number;
  lastUpdated: string;
}

export interface BillRecord {
  customerId: string;
  customerNameEn: string;
  customerNameAm: string;
  meterNumber: string;
  subCity: string;
  woreda: string;
  billingPeriod: string;
  previousReading: number;
  currentReading: number;
  consumptionM3: number;
  tariffPerM3: number;
  waterChargeBirr: number;
  sewerageChargeBirr: number;
  meterRentalBirr: number;
  arrearsBirr: number;
  totalDueBirr: number;
  dueDate: string;
  isPaid: boolean;
  paymentMethod?: string;
  paymentRef?: string;
  paymentTimestamp?: string;
}

export type IncidentCategory = 
  | 'burst' 
  | 'leak' 
  | 'contamination' 
  | 'zero_pressure' 
  | 'illegal_tap' 
  | 'open_manhole';

export type IncidentUrgency = 'critical' | 'high' | 'medium' | 'low';

export interface IncidentReport {
  id: string;
  ticketId: string;
  subCity: string;
  woreda: string;
  landmark: string;
  category: IncidentCategory;
  urgency: IncidentUrgency;
  description: string;
  reporterPhone: string;
  photoUrl?: string;
  status: 'reported' | 'dispatched' | 'crew_on_site' | 'resolved';
  assignedCrew?: string;
  etaMinutes?: number;
  timestamp: string;
  lat: number;
  lng: number;
}

export interface CommunityApp {
  id: string;
  slug: string;
  name: string;
  nameAm: string;
  subCity: string;
  woreda: string;
  blocksCount: number;
  householdsCount: number;
  tankCapacityLiters: number;
  currentLevelPercent: number;
  rationingDays: string[];
  rationingHours: string;
  communityNotice: string;
  emergencyTankerVendor: string;
  vendorPhone: string;
  subscriberCount: number;
  lastTankFillDate: string;
  createdAt: string;
}

export interface ReservoirTelemetry {
  id: string;
  nameEn: string;
  nameAm: string;
  nominalCapacityM3Day: number;
  currentYieldM3Day: number;
  reservoirWaterLevelPercent: number;
  turbidityNTU: number;
  phLevel: number;
  chlorineResidualMgL: number;
  operationalStatus: 'optimal' | 'nominal' | 'maintenance';
}

export interface TankerTruck {
  truckId: string;
  driverName: string;
  plateNumber: string;
  capacityLiters: number;
  currentStatus: 'available' | 'en_route' | 'dispensing' | 'refilling';
  targetSubCity: string;
  waterOrigin: string;
}
