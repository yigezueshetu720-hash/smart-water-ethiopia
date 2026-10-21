import React, { useState } from 'react';
import { 
  Activity, 
  Droplet, 
  Sliders, 
  Truck, 
  Check, 
  ShieldCheck, 
  Gauge, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { RationingZone, ReservoirTelemetry, TankerTruck, Language } from '../types';
import { translations } from '../data/translations';

interface ScadaTelemetryViewProps {
  language: Language;
  zones: RationingZone[];
  reservoirs: ReservoirTelemetry[];
  tankers: TankerTruck[];
  onUpdateZoneValve: (zoneId: string, percent: number) => void;
  onDispatchTanker: (truckId: string, dest: string) => void;
}

export const ScadaTelemetryView: React.FC<ScadaTelemetryViewProps> = ({
  language,
  zones,
  reservoirs,
  tankers,
  onUpdateZoneValve,
  onDispatchTanker,
}) => {
  const t = translations[language];
  const [selectedSubCity, setSelectedSubCity] = useState(zones[0].id);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with SCADA Status */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <span>AAWSA SCADA Control Center</span>
            <span aria-hidden="true">·</span>
            <span>Live PLC & RTU Telemetry</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'am' ? 'የማጣሪያ ጣቢያዎች እና የዋና ቫልቮች መቆጣጠሪያ' : 'Municipal Water Reservoirs & Main Feeder Telemetry'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hydrostatic pressure, chlorination balance, and automated gate actuators across the metropolitan distribution grid.
          </p>
        </div>

        {toastMsg && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium flex items-center gap-2 shrink-0">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>

      {/* 4 Major Water Treatment Plants / Reservoirs */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          {language === 'am' ? 'የውሃ ማጣሪያ ጣቢያዎች እና የግድቦች ይዞታ' : 'Primary Source Reservoirs & Treatment Facilities'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {reservoirs.map((res) => (
            <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">
                    {language === 'am' ? res.nameAm : res.nameEn}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {res.operationalStatus.toUpperCase()}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Storage Level</span>
                    <span className="font-mono font-bold text-sky-700">{res.reservoirWaterLevelPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all"
                      style={{ width: `${res.reservoirWaterLevelPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Yield:</span>
                    <span className="font-bold text-slate-800">{res.currentYieldM3Day.toLocaleString()} m³/d</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Turbidity:</span>
                    <span>{res.turbidityNTU} NTU</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>pH / Chlorine:</span>
                    <span>{res.phLevel} / {res.chlorineResidualMgL} mg/L</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Grid: Feeder Valve Actuators (Left 7) & Emergency Tanker Fleet (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Valve Actuators */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {language === 'am' ? 'የክፍለ ከተሞች የቫልቭ አከፋፈት መቆጣጠሪያ' : 'Sub-City Valve Actuators & Pressure Modulation'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Adjust flow rates to balance distribution or isolate zones.
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-[140px]">
                  <div className="font-bold text-slate-900">
                    {language === 'am' ? zone.subCityAm : zone.subCityEn}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Head: {zone.pressureBar.toFixed(1)} bar · {zone.valveOpenPercent}% open
                  </div>
                </div>

                {/* Slider */}
                <div className="flex-1 max-w-xs flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={zone.valveOpenPercent}
                    onChange={(e) => {
                      onUpdateZoneValve(zone.id, Number(e.target.value));
                      showToast(`Adjusted ${zone.subCityEn} valve to ${e.target.value}%`);
                    }}
                    className="w-full accent-sky-600"
                  />
                  <span className="w-8 font-mono font-bold text-[11px] text-slate-700 text-right">
                    {zone.valveOpenPercent}%
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onUpdateZoneValve(zone.id, 90);
                      showToast(`Opened ${zone.subCityEn} to 90%`);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      onUpdateZoneValve(zone.id, 0);
                      showToast(`Isolated ${zone.subCityEn}`);
                    }}
                    className="px-2 py-1 bg-rose-50 border border-rose-200 rounded text-[10px] font-medium text-rose-700 hover:bg-rose-100"
                  >
                    Shut
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Emergency Tanker Trucks */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>{language === 'am' ? 'የአደጋ ጊዜ የቦቴ መኪኖች ስምሪት' : 'Emergency Water Tanker Fleet'}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Rapid bulk water haulage to hospitals, condominiums, and dry corridors.
            </p>
          </div>

          <div className="space-y-3">
            {tankers.map((t) => (
              <div key={t.truckId} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono">{t.truckId} · {t.plateNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    t.currentStatus === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    t.currentStatus === 'en_route' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {t.currentStatus}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                  <div>Driver: <strong className="text-slate-800 font-sans">{t.driverName}</strong></div>
                  <div>Capacity: <strong className="text-sky-700">{t.capacityLiters.toLocaleString()} Liters</strong></div>
                  <div>Destination: <strong className="text-slate-800 font-sans">{t.targetSubCity}</strong></div>
                </div>

                <button
                  onClick={() => {
                    onDispatchTanker(t.truckId, 'Lemi Kura Clinic & Ayat Condominiums');
                    showToast(`Dispatched ${t.truckId} to Lemi Kura`);
                  }}
                  className="w-full py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
                >
                  Dispatch to High-Need Zone
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
