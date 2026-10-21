import React from 'react';
import { Search, Globe, Droplet, Bell, Shield, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface TopNavProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickAction: (action: string) => void;
  isStaffMode: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  language,
  onLanguageChange,
  activeTab,
  searchQuery,
  onSearchChange,
  onQuickAction,
  isStaffMode,
}) => {
  const t = translations[language];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'rationing':
        return language === 'am' ? 'የውሃ ፈራረቃ መከታተያ' : 'Water Rationing Grid';
      case 'billing':
        return language === 'am' ? 'የውሃ ሂሳብ እና ክፍያ' : 'Bill Inquiry & Payment';
      case 'incident':
        return language === 'am' ? 'የጥቆማዎች ክትትል' : 'Incident Triage & Workorders';
      case 'community':
        return language === 'am' ? 'የኮንዶሚኒየም ማህበረሰቦች' : 'Condominium Web-Apps';
      case 'scada':
        return language === 'am' ? 'የግድቦች እና ቫልቮች ቁጥጥር' : 'SCADA Telemetry & Feeder Control';
      case 'ussd':
        return language === 'am' ? 'ያለ ኢንተርኔት *804#' : 'Offline USSD *804# Gateway';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 sticky top-0 z-20">
      {/* Zone 1: Contextual Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap shrink-0">
        <span className="font-semibold text-slate-900">AAWSA</span>
        <span>/</span>
        <span className="text-slate-600">Addis Ababa</span>
        <span>/</span>
        <span className="font-semibold text-sky-700">{getBreadcrumbTitle()}</span>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            language === 'am'
              ? 'ክፍለ ከተማ፣ የደንበኛ መለያ ወይም ትኬት ይፈልጉ...'
              : 'Search sub-city, Customer ID (e.g. AAWSA-90421), or Ticket...'
          }
          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-400 shadow-xs"
        />
      </div>

      {/* Zone 3: Language switch & Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
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
          onClick={() => onQuickAction('billing')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <span>{language === 'am' ? 'የፍጆታ ማጣሪያ (ነፃ)' : 'Free Statement'}</span>
        </button>

        <button
          onClick={() => onQuickAction('report')}
          className="hidden sm:flex px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <span>{language === 'am' ? 'ብልሽት ጥቆማ' : 'Report Leak'}</span>
        </button>
      </div>
    </header>
  );
};
