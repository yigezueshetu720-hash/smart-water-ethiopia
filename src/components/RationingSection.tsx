import React, { useState } from 'react';
import { 
  Droplet, 
  Clock, 
  MapPin, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Bell, 
  Filter, 
  Waves,
  Send,
  Building,
  Check
} from 'lucide-react';
import { RationingZone, RationingStatus, Language } from '../types';
import { translations } from '../data/translations';

interface RationingSectionProps {
  language: Language;
  zones: RationingZone[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateToReport: (subCity: string) => void;
  onNavigateToCommunity: () => void;
}

export const RationingSection: React.FC<RationingSectionProps> = ({
  language,
  zones,
  searchQuery,
  onSearchChange,
  onNavigateToReport,
  onNavigateToCommunity,
}) => {
  const t = translations[language];
  const [statusFilter, setStatusFilter] = useState<'all' | RationingStatus>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [smsModalZone, setSmsModalZone] = useState<RationingZone | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSubscribed, setSmsSubscribed] = useState(false);

  // Filter zones by search and status
  const filteredZones = zones.filter((zone) => {
    const matchesSearch =
      zone.subCityEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.subCityAm.includes(searchQuery) ||
      zone.woredas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.woredasAm.includes(searchQuery) ||
      zone.majorNeighborhoods.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || zone.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RationingStatus) => {
    switch (status) {
      case 'flowing':
        return {
          label: language === 'am' ? 'አሁን እየፈሰሰ ነው' : 'Flowing Active',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Waves,
          color: 'text-emerald-600',
        };
      case 'scheduled':
        return {
          label: language === 'am' ? 'በመርሐ-ግብር በቀጣይ' : 'Scheduled',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          icon: Clock,
          color: 'text-sky-600',
        };
      case 'filling':
        return {
          label: language === 'am' ? 'ታንከር እየሞላ' : 'Pressurizing / Filling',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Activity,
          color: 'text-amber-600',
        };
      case 'maintenance':
        return {
          label: language === 'am' ? 'በጥገና ላይ' : 'Emergency Repair',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: Wrench,
          color: 'text-rose-600',
        };
    }
  };

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setSmsSubscribed(true);
    setTimeout(() => {
      setSmsSubscribed(false);
      setSmsModalZone(null);
      setPhoneNumber('');
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <span>AAWSA Zonal Feeder Grid</span>
            <span aria-hidden="true">·</span>
            <span>Addis Ababa Master Grid</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'am' ? 'የአዲስ አበባ ከተማ የውሃ ፈራረቃ እና የቀጥታ ፍሰት መከታተያ' : 'Addis Ababa Water Rationing Schedule & Live Flow Grid'}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {language === 'am'
              ? 'በ11ዱም ክፍለ ከተሞች ውስጥ የውሃ ቫልቭ አከፋፈት፣ የመስመር ግፊት እና የቀጣይ ዙር መርሃ-ግብር መረጃ።'
              : 'Live distribution telemetry across all 11 Sub-cities. Check valve status, line pressure, and scheduled supply hours.'}
          </p>
        </div>

        {/* Community Quick Action link */}
        <button
          onClick={onNavigateToCommunity}
          className="self-start md:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <Building className="w-4 h-4 text-cyan-300" />
          <span>{language === 'am' ? 'ለኮንዶሚኒየም ማህበር ድረ-ገጽ ፍጠር' : 'Build Condominium Water App'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto border border-slate-200">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterAll} ({zones.length})
          </button>
          <button
            onClick={() => setStatusFilter('flowing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'flowing'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{t.filterFlowing}</span>
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'scheduled'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>{t.filterScheduled}</span>
          </button>
          <button
            onClick={() => setStatusFilter('filling')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'filling'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>{t.filterFilling}</span>
          </button>
          <button
            onClick={() => setStatusFilter('maintenance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'maintenance'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>{t.filterMaintenance}</span>
          </button>
        </div>

        {/* Sub-city Quick Finder Input */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'am' ? 'ሰፈር ወይም ወረዳ ፈልግ...' : 'Filter by neighborhood or woreda...'}
            className="w-full px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 shadow-xs"
          />
        </div>
      </div>

      {/* Interactive Sub-City Map Schematics Banner */}
      <div className="mt-6 bg-slate-900 rounded-xl p-5 text-white border border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold tracking-wide">
              {language === 'am' ? 'የአዲስ አበባ ክፍለ ከተሞች የቀጥታ ካርታ እይታ' : 'Addis Ababa Sub-City Zonal Grid Status'}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Flowing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Scheduled</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pressurizing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Repair</span>
            </span>
          </div>
        </div>

        {/* Schematic Grid of Sub-Cities */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const statusConfig = getStatusBadge(zone.status);
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(isSelected ? null : zone.id)}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-sky-950/80 border-cyan-400 ring-2 ring-cyan-400/30'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">
                    {language === 'am' ? zone.subCityAm : zone.subCityEn}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    zone.status === 'flowing' ? 'bg-emerald-400' :
                    zone.status === 'scheduled' ? 'bg-sky-400' :
                    zone.status === 'filling' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{zone.pressureBar.toFixed(1)} bar</span>
                  <span>{zone.valveOpenPercent}% open</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-city Cards Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredZones.map((zone) => {
          const status = getStatusBadge(zone.status);
          const StatusIcon = status.icon;

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-xl border transition-all shadow-xs flex flex-col justify-between ${
                selectedZoneId === zone.id
                  ? 'border-sky-500 ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-5">
                {/* Header: Sub-city Name & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {language === 'am' ? zone.subCityAm : zone.subCityEn}
                      <span className="ml-1.5 text-xs font-normal text-slate-500">
                        ({language === 'am' ? zone.subCityEn : zone.subCityAm})
                      </span>
                    </h3>
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{language === 'am' ? zone.woredasAm : zone.woredas}</span>
                    </div>
                  </div>

                  <div className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 shrink-0 ${status.bg}`}>
                    <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">{status.label}</span>
                  </div>
                </div>

                {/* Major Neighborhoods */}
                <div className="mt-3.5 flex flex-wrap gap-1 text-[11px] text-slate-600">
                  <span className="text-slate-400 font-medium">{language === 'am' ? 'ሰፈሮች፡' : 'Areas:'}</span>
                  {zone.majorNeighborhoods.map((n, idx) => (
                    <span key={n} className="inline-block">
                      {n}{idx < zone.majorNeighborhoods.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>

                {/* Valve & Pressure Telemetry Strip */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500 text-[11px]">{t.pressure}</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 flex items-baseline gap-1">
                      <span className="text-sm">{zone.pressureBar.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500 font-normal">bar ({(zone.pressureBar * 14.5).toFixed(0)} PSI)</span>
                    </div>
                    {/* Visual pressure bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          zone.pressureBar >= 2.0 ? 'bg-emerald-500' :
                          zone.pressureBar >= 1.0 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, (zone.pressureBar / 3.0) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[11px]">{t.valveStatus}</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">
                      <span className="text-sm">{zone.valveOpenPercent}%</span>
                      <span className="text-[10px] text-slate-500 font-normal ml-1">Open</span>
                    </div>
                    {/* Visual valve openness bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{ width: `${zone.valveOpenPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Supply Schedule & Current Status */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t.scheduleWindow}:</span>
                      <span className="font-medium text-slate-800">
                        {language === 'am' ? zone.scheduleWindowAm : zone.scheduleWindowEn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Droplet className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">{t.nextSupply}:</span>
                      <span className="font-semibold text-slate-900">
                        {language === 'am' ? zone.nextSupplyTimeAm : zone.nextSupplyTimeEn}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    <span>{t.reservoirsOrigin}: </span>
                    <span className="font-medium text-slate-700">
                      {language === 'am' ? zone.originReservoirAm : zone.originReservoir}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSmsModalZone(zone)}
                  className="text-xs font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'የSMS ማሳሰቢያ' : 'Get SMS Alert'}</span>
                </button>

                {zone.status === 'maintenance' || zone.pressureBar < 1.0 ? (
                  <button
                    onClick={() => onNavigateToReport(zone.subCityEn)}
                    className="text-xs font-medium text-rose-700 hover:text-rose-900 flex items-center gap-1 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{language === 'am' ? 'ችግር ጥቆማ' : 'Report Issue'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Updated {zone.lastUpdated}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredZones.length === 0 && (
        <div className="mt-8 p-12 text-center bg-white rounded-xl border border-slate-200">
          <Droplet className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {language === 'am' ? 'ምንም አይነት የተዛመደ ክፍለ ከተማ አልተገኘም' : 'No matching sub-city or neighborhood found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {language === 'am'
              ? 'እባክዎ ትክክለኛ የክፍለ ከተማ ስም (ቦሌ፣ ቂርቆስ፣ አራዳ፣ የካ፣ ወዘተ) ወይም ሰፈር ያስገቡ።'
              : 'Please check your spelling or search by general area name (e.g. Bole, Piazza, Jemo, CMC).'}
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            {language === 'am' ? 'ሁሉንም ክፍለ ከተሞች አሳይ' : 'Show All Sub-Cities'}
          </button>
        </div>
      )}

      {/* SMS Notification Modal */}
      {smsModalZone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {language === 'am' ? 'የውሃ ፈራረቃ የSMS ማሳወቂያ' : 'Sub-City Rationing SMS Alert'}
                </h3>
              </div>
              <button
                onClick={() => setSmsModalZone(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {smsSubscribed ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900">
                  {language === 'am' ? 'ምዝገባው ተጠናቅቋል!' : 'Successfully Subscribed!'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  {language === 'am'
                    ? `ለ${smsModalZone.subCityAm} ክፍለ ከተማ የውሃ ቫልቭ ሲከፈት እና ሲዘጋ በ${phoneNumber} የSMS መልዕክት ይደርስዎታል።`
                    : `You will receive timely SMS updates on ${phoneNumber} 30 minutes before valve actuation in ${smsModalZone.subCityEn}.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSmsSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'am' ? 'የተመረጠው ክፍለ ከተማ' : 'Target Sub-City'}
                  </label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                    {language === 'am' ? smsModalZone.subCityAm : smsModalZone.subCityEn} ({smsModalZone.woredas})
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'am' ? 'የኢትዮ ቴሌኮም ስልክ ቁጥር' : 'Ethio Telecom Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                      +251
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="911 23 45 67"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-14 pr-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {language === 'am'
                      ? 'ነፃ የAAWSA አገልግሎት ነው። ያለ ኢንተርኔት በ*804# በማንኛውም ሰዓት መከታተል ይችላሉ።'
                      : 'Free public service powered by AAWSA & Ethio Telecom USSD gateway.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSmsModalZone(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    {language === 'am' ? 'ተመለስ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
                  >
                    {language === 'am' ? 'ማሳሰቢያ አግብር' : 'Enable SMS Alerts'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
