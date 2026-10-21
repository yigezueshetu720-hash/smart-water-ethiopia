import React from 'react';
import { Layers, Droplets, Gauge, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface KpiStripProps {
  language: Language;
  activeFlowCount: number;
  totalZones: number;
  openIncidentsCount: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  language,
  activeFlowCount,
  totalZones,
  openIncidentsCount,
}) => {
  const t = translations[language];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* KPI 1 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 text-xs">
          <span>{t.statReservoirStorage}</span>
          <Droplets className="w-3.5 h-3.5 text-cyan-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">91.4%</span>
          <span className="text-[11px] text-slate-500">Normal Range</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          Legedadi (94%) & Gefersa (88%)
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 text-xs">
          <span>{t.statDailyDistribution}</span>
          <Layers className="w-3.5 h-3.5 text-sky-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">391,000</span>
          <span className="text-xs text-slate-500 font-mono">m³/day</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          All 4 treatment plants active
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 text-xs">
          <span>{t.filterFlowing}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">{activeFlowCount}</span>
          <span className="text-xs text-slate-500 font-mono">/ {totalZones} Sub-Cities</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          Rationing schedule adhered
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 text-xs">
          <span>{language === 'am' ? 'የስራ ላይ ጥቆማዎች' : 'Active Workorders'}</span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{openIncidentsCount}</span>
          <span className="text-xs text-slate-500 font-mono">Field Crews</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          Avg response time: 32 mins
        </div>
      </div>
    </div>
  );
};
