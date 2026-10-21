import React from 'react';
import { Droplets, Globe, Shield, PhoneCall, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  isStaffMode: boolean;
  onToggleStaffMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeSection,
  onNavigate,
  isStaffMode,
  onToggleStaffMode,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top emergency announcement bar */}
      <div className="bg-sky-900 text-sky-100 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold uppercase tracking-wider text-sky-300">AAWSA Alert</span>
            <span className="text-sky-200/50">·</span>
            <span className="truncate">
              {language === 'am' 
                ? 'የለገዳዲ እና የገፈርሳ ግድቦች የውሃ ክምችት በጥሩ ደረጃ ላይ ይገኛል። የውሃ ብክነትን በ990 ጥቆማ ይስጡ።'
                : 'Legedadi and Gefersa reservoir storage at 91% capacity. Report pipe leakages to 990 hotline.'}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-sky-200 text-xs">
            <a href="tel:990" className="flex items-center gap-1.5 hover:text-white transition-colors font-mono">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span>990</span>
            </a>
            <span className="hidden sm:inline text-sky-200/50">·</span>
            <span className="hidden sm:inline font-mono">USSD: *804#</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar adhering strictly to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('rationing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-800 transition-colors">
            <Droplets className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              {t.authorityShort}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
              Addis Ababa Water & Sewerage Authority
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('rationing')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeSection === 'rationing'
                ? 'border-sky-600 text-sky-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navRationing}
          </button>
          <button
            onClick={() => onNavigate('billing')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeSection === 'billing'
                ? 'border-sky-600 text-sky-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navBilling}
          </button>
          <button
            onClick={() => onNavigate('report')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeSection === 'report'
                ? 'border-sky-600 text-sky-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navReport}
          </button>
          <button
            onClick={() => onNavigate('community')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeSection === 'community'
                ? 'border-sky-600 text-sky-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navCommunity}
          </button>
          <button
            onClick={onToggleStaffMode}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              isStaffMode
                ? 'border-amber-600 text-amber-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.navStaff}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Language switch */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('am')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap font-amharic ${
                language === 'am'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አማርኛ
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('billing')}
            className="px-3.5 py-2 text-xs font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            {t.navBilling}
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-slate-100/80 border-t border-slate-200 text-xs font-medium text-slate-700 overflow-x-auto">
        <button
          onClick={() => onNavigate('rationing')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeSection === 'rationing' ? 'bg-white text-sky-800 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navRationing}
        </button>
        <button
          onClick={() => onNavigate('billing')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeSection === 'billing' ? 'bg-white text-sky-800 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navBilling}
        </button>
        <button
          onClick={() => onNavigate('report')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeSection === 'report' ? 'bg-white text-sky-800 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navReport}
        </button>
        <button
          onClick={() => onNavigate('community')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeSection === 'community' ? 'bg-white text-sky-800 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navCommunity}
        </button>
        <button
          onClick={onToggleStaffMode}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1 ${
            isStaffMode ? 'bg-amber-100 text-amber-900 font-semibold' : ''
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>{t.navStaff}</span>
        </button>
      </div>
    </header>
  );
};
