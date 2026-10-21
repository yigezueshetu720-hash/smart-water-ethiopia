import React from 'react';
import { Search, Droplet, ArrowRight, Gauge, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeroSectionProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (section: string) => void;
  activeFlowCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  searchQuery,
  onSearchChange,
  onNavigate,
  activeFlowCount,
}) => {
  const t = translations[language];

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Background imagery with measured contrast scrim for WCAG AA compliance */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_water_plant_1792581974330.jpg"
          alt="Addis Ababa Water Treatment Plant & Mountain Reservoirs"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <div className="max-w-3xl">
          {/* Natural human editorial kicker */}
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium mb-3">
            <span>{t.authorityTitle}</span>
            <span aria-hidden="true">·</span>
            <span>{t.heroKicker}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            {t.heroTitle}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>

          {/* Search bar for quick sub-city or woreda lookup */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.quickSearchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-slate-100 focus:text-slate-900 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
              />
            </div>
            <button
              onClick={() => onNavigate('rationing')}
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
            >
              <span>{language === 'am' ? 'ፈራረቃ ፈልግ' : 'Find Schedule'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">{language === 'am' ? 'ፈጣን ማጣሪያ፡' : 'Popular Zones:'}</span>
            {['Bole (ቦሌ)', 'Kirkos (ቂርቆስ)', 'Yeka (የካ)', 'Jemo (ጀሞ)', 'Ayat (አያት)'].map((zone) => (
              <button
                key={zone}
                onClick={() => {
                  onSearchChange(zone.split(' ')[0]);
                  onNavigate('rationing');
                }}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-slate-200 transition-colors whitespace-nowrap"
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* 4-column KPI strip adhering to 2-column balance rules */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">{t.statReservoirStorage}</div>
            <div className="mt-1 text-2xl font-bold font-mono text-cyan-400">91.4%</div>
            <div className="mt-1 text-xs text-slate-400">Legedadi & Gefersa dams</div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">{t.statDailyDistribution}</div>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">391,000 <span className="text-xs text-slate-400 font-normal">m³/day</span></div>
            <div className="mt-1 text-xs text-slate-400">4 Treatment Centers</div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">{t.statGridPressure}</div>
            <div className="mt-1 text-2xl font-bold font-mono text-sky-400">2.4 <span className="text-xs text-slate-400 font-normal">bar</span></div>
            <div className="mt-1 text-xs text-slate-400">Nominal municipal head</div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">{t.filterFlowing}</div>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">{activeFlowCount} <span className="text-xs text-slate-400 font-normal">/ 11 Zones</span></div>
            <div className="mt-1 text-xs text-slate-400">Live valve distribution</div>
          </div>
        </div>
      </div>
    </section>
  );
};
