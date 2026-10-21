import React from 'react';
import { Droplets, PhoneCall, Mail, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
  onNavigate: (section: string) => void;
  onToggleStaffMode: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onToggleStaffMode,
}) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand Wordmark & Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white">
                <Droplets className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="text-base font-bold text-white">
                {t.authorityShort}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {language === 'am'
                ? 'የአዲስ አበባ ውሃ እና ፍሳሽ ባለስልጣን (አ.አ.ው.ፍ.ባ) ለመዲናዋ ንጹህ የመጠጥ ውሃ በማቅረብ እና የፍሳሽ ማስወገጃ አገልግሎት በመስጠት ላይ ይገኛል።'
                : 'Dedicated to providing reliable, clean water supply and sustainable wastewater sanitation management for the metropolitan population of Addis Ababa.'}
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              ISO 9001:2015 Quality Certified
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {language === 'am' ? 'የዜጎች አገልግሎቶች' : 'Citizen Services'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('rationing')}
                  className="hover:text-white transition-colors"
                >
                  {t.navRationing}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('billing')}
                  className="hover:text-white transition-colors"
                >
                  {t.navBilling}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-white transition-colors"
                >
                  {t.navReport}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="hover:text-white transition-colors"
                >
                  {t.navCommunity}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Headquarters */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {language === 'am' ? 'ዋና መስሪያ ቤት' : 'Headquarters'}
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Bole Road / St. Urael Church area, Megenagna branch, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">Toll-Free Helpline: 990 / +251 11 662 4900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>info@aawsa.gov.et</span>
              </div>
            </div>
          </div>

          {/* Col 4: Operations & System Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {language === 'am' ? 'የሲስተም ቁጥጥር' : 'Authority Systems'}
            </h4>
            <div className="space-y-2 text-[11px]">
              <button
                onClick={onToggleStaffMode}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded hover:text-white hover:bg-slate-800 transition-colors block w-full text-left"
              >
                {t.switchStaffMode}
              </button>
              <div className="text-slate-500 pt-1">
                Emergency Water Tanker Dispatch Depot: Akaki Staging Base
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Addis Ababa Water and Sewerage Authority (AAWSA). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Telebirr & Google Pay Verified</span>
            <span>·</span>
            <span>Ethiopian Water Technology Institute</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
