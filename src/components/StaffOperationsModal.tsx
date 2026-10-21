import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Droplet, 
  Wrench, 
  Truck, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Gauge, 
  X,
  RefreshCw
} from 'lucide-react';
import { RationingZone, IncidentReport, ReservoirTelemetry, TankerTruck, Language } from '../types';
import { translations } from '../data/translations';

interface StaffOperationsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  zones: RationingZone[];
  incidents: IncidentReport[];
  reservoirs: ReservoirTelemetry[];
  tankers: TankerTruck[];
  onUpdateZoneValve: (zoneId: string, valveOpenPercent: number) => void;
  onUpdateIncidentStatus: (incidentId: string, status: IncidentReport['status']) => void;
  onDispatchTanker: (truckId: string, targetSubCity: string) => void;
}

export const StaffOperationsModal: React.FC<StaffOperationsModalProps> = ({
  language,
  isOpen,
  onClose,
  zones,
  incidents,
  reservoirs,
  tankers,
  onUpdateZoneValve,
  onUpdateIncidentStatus,
  onDispatchTanker,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'reservoirs' | 'valves' | 'workorders' | 'tankers'>('reservoirs');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-800 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {t.staffTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  STAFF MODE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Internal SCADA & Field Operations Dispatch Console
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('reservoirs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reservoirs'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t.reservoirTitle}</span>
          </button>
          <button
            onClick={() => setActiveTab('valves')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'valves'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Grid Valve Actuators ({zones.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('workorders')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'workorders'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Workorders & Crew Dispatch ({incidents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tankers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'tankers'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.tankerFleetTitle} ({tankers.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: RESERVOIR TELEMETRY */}
          {activeTab === 'reservoirs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservoirs.map((res) => (
                  <div key={res.id} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {language === 'am' ? res.nameAm : res.nameEn}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Yield: {res.currentYieldM3Day.toLocaleString()} / {res.nominalCapacityM3Day.toLocaleString()} m³/day
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {res.operationalStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Reservoir Capacity Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Dam Storage Level</span>
                        <span className="font-mono font-bold text-cyan-400">{res.reservoirWaterLevelPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${res.reservoirWaterLevelPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Water Quality Indices according to WHO/Ethiopian Standards */}
                    <div className="pt-2 border-t border-slate-700/60 grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">TURBIDITY</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{res.turbidityNTU} NTU</div>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">pH LEVEL</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{res.phLevel}</div>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">CHLORINE</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{res.chlorineResidualMgL} mg/L</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VALVE ACTUATORS */}
          {activeTab === 'valves' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 text-xs">
                Staff can manually adjust sub-city main feeder valves to balance pressure during peak hours or isolate sectors for emergency maintenance.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {zones.map((zone) => (
                  <div key={zone.id} className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">
                        {zone.subCityEn} ({zone.subCityAm})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        zone.status === 'flowing' ? 'bg-emerald-500/20 text-emerald-300' :
                        zone.status === 'scheduled' ? 'bg-sky-500/20 text-sky-300' :
                        zone.status === 'filling' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {zone.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Head: {zone.pressureBar.toFixed(1)} bar</span>
                      <span>Valve: {zone.valveOpenPercent}%</span>
                    </div>

                    {/* Interactive Slider */}
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
                      className="w-full accent-cyan-400"
                    />

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          onUpdateZoneValve(zone.id, 90);
                          showToast(`Opened ${zone.subCityEn} valve to 90%`);
                        }}
                        className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-200 transition-colors"
                      >
                        Open (90%)
                      </button>
                      <button
                        onClick={() => {
                          onUpdateZoneValve(zone.id, 0);
                          showToast(`Closed ${zone.subCityEn} valve`);
                        }}
                        className="flex-1 py-1 bg-rose-900/60 hover:bg-rose-800/80 rounded text-[10px] text-rose-200 transition-colors"
                      >
                        Isolate (0%)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORKORDERS & CREW DISPATCH */}
          {activeTab === 'workorders' && (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{inc.ticketId}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-white">{inc.subCity}, {inc.woreda}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        inc.urgency === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {inc.urgency}
                      </span>
                    </div>
                    <div className="text-slate-300">{inc.landmark} — {inc.description}</div>
                    <div className="text-[11px] text-slate-400">
                      Reporter: {inc.reporterPhone} · Reported {inc.timestamp}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={inc.status}
                      onChange={(e) => {
                        onUpdateIncidentStatus(inc.id, e.target.value as IncidentReport['status']);
                        showToast(`Ticket ${inc.ticketId} updated to ${e.target.value}`);
                      }}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="reported">Reported</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="crew_on_site">Crew On-Site</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TANKER FLEET */}
          {activeTab === 'tankers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tankers.map((t) => (
                  <div key={t.truckId} className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white font-mono">{t.truckId}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        t.currentStatus === 'available' ? 'bg-emerald-500/20 text-emerald-300' :
                        t.currentStatus === 'en_route' ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.currentStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-300 text-xs">
                      <div>Driver: <strong className="text-white">{t.driverName}</strong></div>
                      <div>Plate: <strong className="font-mono text-slate-200">{t.plateNumber}</strong></div>
                      <div>Capacity: <strong className="font-mono text-cyan-300">{t.capacityLiters.toLocaleString()} L</strong></div>
                      <div className="text-[11px] text-slate-400">Current Destination: {t.targetSubCity}</div>
                    </div>

                    <button
                      onClick={() => {
                        onDispatchTanker(t.truckId, 'Bole Arabsa Emergency Clinic');
                        showToast(`Tanker ${t.truckId} redirected to Bole Arabsa`);
                      }}
                      className="w-full py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      Dispatch / Reassign Route
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Toast */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Connected to AAWSA GIS Network Server</span>
          {toastMessage && (
            <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded font-medium animate-fade-in">
              ✓ {toastMessage}
            </span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Exit Staff Mode
          </button>
        </div>
      </div>
    </div>
  );
};
