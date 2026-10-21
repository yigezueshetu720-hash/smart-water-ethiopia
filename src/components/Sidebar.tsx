import React from 'react';
import { 
  Droplets, 
  Layers, 
  CreditCard, 
  AlertTriangle, 
  Building2, 
  Activity, 
  Smartphone, 
  ShieldCheck, 
  PhoneCall,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface SidebarProps {
  language: Language;
  activeTab: string;
  onTabChange: (tab: string) => void;
  flowingZonesCount: number;
  openIncidentsCount: number;
  communitiesCount: number;
  isStaffMode: boolean;
  onToggleStaffMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  activeTab,
  onTabChange,
  flowingZonesCount,
  openIncidentsCount,
  communitiesCount,
  isStaffMode,
  onToggleStaffMode,
}) => {
  const t = translations[language];

  const navItems = [
    {
      id: 'rationing',
      labelEn: 'Rationing Grid',
      labelAm: 'የውሃ ፈራረቃ',
      icon: Layers,
      badge: `${flowingZonesCount} Active`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'billing',
      labelEn: 'Free Statement',
      labelAm: 'የፍጆታ ማረጋገጫ',
      icon: CreditCard,
      badge: '100% Free',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'incident',
      labelEn: 'Incident Triage',
      labelAm: 'ጥቆማ እና ክትትል',
      icon: AlertTriangle,
      badge: `${openIncidentsCount} Tickets`,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      id: 'community',
      labelEn: 'Condo Web-Apps',
      labelAm: 'የኮንዶሚኒየም ገጾች',
      icon: Building2,
      badge: `${communitiesCount} Sites`,
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
    {
      id: 'scada',
      labelEn: 'SCADA Telemetry',
      labelAm: 'የግድቦች ቁጥጥር',
      icon: Activity,
      badge: '4 Plants',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
    {
      id: 'ussd',
      labelEn: 'USSD Offline *804#',
      labelAm: 'ያለ ኢንተርኔት *804#',
      icon: Smartphone,
      badge: 'Ethio Telecom',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-xs">
              <Droplets className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 leading-tight">
                {language === 'am' ? 'አ.አ.ው.ፍ.ባ ስማርት' : 'AAWSA Smart Water'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Addis Ababa Water Authority
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher Banner (Citizen vs Staff Ops) */}
        <div className="p-3">
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => isStaffMode && onToggleStaffMode()}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                !isStaffMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'am' ? 'የነዋሪዎች ገጽ' : 'Citizen'}
            </button>
            <button
              onClick={() => !isStaffMode && onToggleStaffMode()}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1 ${
                isStaffMode
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>{language === 'am' ? 'የሰራተኞች' : 'Staff SCADA'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between text-left ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-sky-700' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">
                    {language === 'am' ? item.labelAm : item.labelEn}
                  </span>
                </div>

                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Quick Hotline */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Emergency Hotline</span>
          <a
            href="tel:990"
            className="flex items-center gap-1.5 font-mono font-bold text-sky-800 hover:text-sky-950"
          >
            <PhoneCall className="w-3 h-3 text-cyan-600" />
            <span>990</span>
          </a>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mb-0.5">
            <span>NETWORK</span>
            <span className="text-emerald-600 font-bold">ONLINE</span>
          </div>
          <div>Legedadi & Gefersa dams nominal. 11/11 sub-cities tracked.</div>
        </div>
      </div>
    </aside>
  );
};
