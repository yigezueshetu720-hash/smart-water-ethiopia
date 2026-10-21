import React, { useState } from 'react';
import { 
  Building, 
  Droplets, 
  Users, 
  Clock, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Send,
  Truck
} from 'lucide-react';
import { CommunityApp, Language } from '../types';
import { translations } from '../data/translations';

interface CommunityBuilderSectionProps {
  language: Language;
  communities: CommunityApp[];
  onCreateCommunity: (app: CommunityApp) => void;
}

export const CommunityBuilderSection: React.FC<CommunityBuilderSectionProps> = ({
  language,
  communities,
  onCreateCommunity,
}) => {
  const t = translations[language];

  // Selected community to view live microsite applet
  const [activeCommunity, setActiveCommunity] = useState<CommunityApp | null>(communities[0]);

  // Builder wizard modal
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tanker Request State
  const [isTankerRequested, setIsTankerRequested] = useState(false);

  // Form State for new community
  const [formData, setFormData] = useState({
    name: '',
    nameAm: '',
    subCity: 'Bole',
    woreda: 'Woreda 03',
    blocksCount: 4,
    householdsCount: 160,
    tankCapacityLiters: 100000,
    currentLevelPercent: 65,
    rationingDays: ['Tuesday', 'Friday', 'Sunday'],
    rationingHours: '06:00 - 22:00',
    communityNotice: 'Ground pump scheduled to pressurize roof tanks at 6:00 PM. Please inspect private taps for drips.',
    emergencyTankerVendor: 'Sheger Emergency Water Logistics',
    vendorPhone: '+251 911 00 22 44',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `condo-${Date.now()}`;
    const newApp: CommunityApp = {
      id: `comm-${Date.now()}`,
      slug,
      name: formData.name || 'Bole Arabsa Site 4 Condominium',
      nameAm: formData.nameAm || 'የቦሌ አረብሳ ሳይት 4 ኮንዶሚኒየም',
      subCity: formData.subCity,
      woreda: formData.woreda,
      blocksCount: Number(formData.blocksCount),
      householdsCount: Number(formData.householdsCount),
      tankCapacityLiters: Number(formData.tankCapacityLiters),
      currentLevelPercent: Number(formData.currentLevelPercent),
      rationingDays: formData.rationingDays,
      rationingHours: formData.rationingHours,
      communityNotice: formData.communityNotice,
      emergencyTankerVendor: formData.emergencyTankerVendor,
      vendorPhone: formData.vendorPhone,
      subscriberCount: Math.floor(Number(formData.householdsCount) * 0.75),
      lastTankFillDate: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateCommunity(newApp);
    setActiveCommunity(newApp);
    setIsBuilderOpen(false);
    setStep(1);
  };

  const copyShareLink = (slug: string) => {
    navigator.clipboard.writeText(`https://aawsa.gov.et/c/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Estimate days of supply based on household consumption
  const calculateDaysRemaining = (capacity: number, percent: number, households: number) => {
    const litersAvailable = capacity * (percent / 100);
    // Average daily household essential consumption ~ 180 liters
    const dailyNeed = Math.max(1, households * 180);
    const days = litersAvailable / dailyNeed;
    return days.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
            <span>Decentralized Neighborhood Utilities</span>
            <span aria-hidden="true">·</span>
            <span>AAWSA Community Platform</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {t.communityTitle}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.communitySubtitle}
          </p>
        </div>

        {/* Builder launch button */}
        <button
          onClick={() => setIsBuilderOpen(true)}
          className="self-start md:self-auto px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createCommunityBtn}</span>
        </button>
      </div>

      {/* Community Selectors Bar */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-2">
          {language === 'am' ? 'የተዘጋጁ ማህበረሰቦች፡' : 'Condo Portals:'}
        </span>
        {communities.map((comm) => (
          <button
            key={comm.id}
            onClick={() => setActiveCommunity(comm)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap border flex items-center gap-2 ${
              activeCommunity?.id === comm.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{language === 'am' ? comm.nameAm : comm.name}</span>
          </button>
        ))}
      </div>

      {/* Active Community Public Web-App Viewport */}
      {activeCommunity && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="relative bg-slate-900 text-white p-6 sm:p-8">
            <div className="absolute inset-0 z-0 opacity-20">
              <img
                src="/src/assets/images/condo_water_tanks_1792581975297.jpg"
                alt="Addis Ababa Condominium Water Storage"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                  <span>{activeCommunity.subCity}, {activeCommunity.woreda}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCommunity.householdsCount} Households</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCommunity.blocksCount} Residential Blocks</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  {language === 'am' ? activeCommunity.nameAm : activeCommunity.name}
                </h3>
                <div className="mt-1 text-xs text-slate-300 font-mono">
                  Public Resident Portal: <span className="text-cyan-400">aawsa.gov.et/c/{activeCommunity.slug}</span>
                </div>
              </div>

              {/* Share & Tanker Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyShareLink(activeCommunity.slug)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share with Neighbors'}</span>
                </button>
                <button
                  onClick={() => setIsTankerRequested(!isTankerRequested)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{isTankerRequested ? 'Tanker Dispatched!' : 'Request Emergency Tanker'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Tank & Rationing Cockpit */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left 5 cols: Tank Gauge & Capacity telemetry */}
            <div className="md:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>{t.tankLevel}</span>
                  </h4>
                  <span className="text-xs font-mono font-bold text-sky-700">
                    {activeCommunity.currentLevelPercent}% Full
                  </span>
                </div>

                {/* Big Visual Gauge */}
                <div className="mt-4 relative h-36 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 flex items-end">
                  <div
                    className={`w-full transition-all duration-700 rounded-b-xl flex items-center justify-center font-bold text-white font-mono text-sm shadow-inner ${
                      activeCommunity.currentLevelPercent >= 60 ? 'bg-sky-600' :
                      activeCommunity.currentLevelPercent >= 30 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ height: `${activeCommunity.currentLevelPercent}%` }}
                  >
                    <span>
                      {((activeCommunity.tankCapacityLiters * activeCommunity.currentLevelPercent) / 100).toLocaleString()} L
                    </span>
                  </div>
                </div>

                {/* Storage breakdown numbers */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">TOTAL STORAGE</span>
                    <span className="text-slate-900 font-bold">{activeCommunity.tankCapacityLiters.toLocaleString()} Liters</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">EST. RUNWAY</span>
                    <span className="text-emerald-700 font-bold">
                      {calculateDaysRemaining(activeCommunity.tankCapacityLiters, activeCommunity.currentLevelPercent, activeCommunity.householdsCount)} Days
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Last refilled: {activeCommunity.lastTankFillDate}</span>
                <span className="font-medium text-slate-700">{activeCommunity.subscriberCount} residents alerted</span>
              </div>
            </div>

            {/* Right 7 cols: Schedule, Notices & Tanker Vendor */}
            <div className="md:col-span-7 space-y-5">
              {/* Municipal Grid Inflow Schedule */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{language === 'am' ? 'የከተማው መስመር የሚገባበት ቀን' : 'Municipal Grid Inflow Days'}</span>
                  </h4>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    AAWSA Verified
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeCommunity.rationingDays.map((day) => (
                    <span
                      key={day}
                      className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-md text-xs font-semibold border border-sky-200"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-600 font-mono">
                  Pumping Window: <strong>{activeCommunity.rationingHours}</strong>
                </div>
              </div>

              {/* Committee Notice Board */}
              <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  {language === 'am' ? 'የማህበሩ የውሃ ቁጥጥር ኮሚቴ ማሳሰቢያ' : 'HOA Water Committee Bulletin'}
                </h4>
                <p className="text-xs text-amber-950 leading-relaxed">
                  "{activeCommunity.communityNotice}"
                </p>
              </div>

              {/* Emergency Private Hauler / Tanker Contact */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">
                    {language === 'am' ? 'የአደጋ ጊዜ የቦቴ ውሃ አቅራቢ' : 'Designated Emergency Tanker Hauler'}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {activeCommunity.emergencyTankerVendor}
                  </span>
                </div>
                <a
                  href={`tel:${activeCommunity.vendorPhone}`}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg font-mono font-medium hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>{activeCommunity.vendorPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Minute No-Code Builder Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'am' ? 'የኮንዶሚኒየም ድረ-ገጽ መስሪያ (በ2 ደቂቃ)' : '2-Minute Community Webpage Builder'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Step {step} of 3 · Zero coding needed
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
              {step === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {language === 'am' ? 'የኮንዶሚኒየም / ማህበር ስም (እንግሊዝኛ)' : 'Condominium / Community Name (English)'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bole Arabsa Site 4 Condominium"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {language === 'am' ? 'የማህበር ስም (በአማርኛ)' : 'Community Name (Amharic)'}
                    </label>
                    <input
                      type="text"
                      placeholder="ምሳሌ፡ የቦሌ አረብሳ ሳይት 4 የኮንዶሚኒየም ማህበር"
                      value={formData.nameAm}
                      onChange={(e) => setFormData({ ...formData, nameAm: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Sub-City</label>
                      <select
                        value={formData.subCity}
                        onChange={(e) => setFormData({ ...formData, subCity: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                      >
                        {['Bole', 'Kirkos', 'Arada', 'Yeka', 'Lemi Kura', 'Nifas Silk-Lafto', 'Lideta', 'Kolfe Keranio', 'Gullele', 'Akaky Kaliti', 'Addis Ketema'].map((sc) => (
                          <option key={sc} value={sc}>{sc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Woreda / Kebele</label>
                      <input
                        type="text"
                        value={formData.woreda}
                        onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Number of Blocks</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.blocksCount}
                        onChange={(e) => setFormData({ ...formData, blocksCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 font-mono border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Total Households</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.householdsCount}
                        onChange={(e) => setFormData({ ...formData, householdsCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 font-mono border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Total Water Tank Capacity (Liters)
                    </label>
                    <input
                      type="number"
                      step={5000}
                      value={formData.tankCapacityLiters}
                      onChange={(e) => setFormData({ ...formData, tankCapacityLiters: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-mono border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                    <span className="text-[11px] text-slate-500">
                      Combined capacity of ground cistern + rooftop tanks (e.g. 100,000 L).
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Current Storage Level ({formData.currentLevelPercent}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formData.currentLevelPercent}
                      onChange={(e) => setFormData({ ...formData, currentLevelPercent: Number(e.target.value) })}
                      className="w-full accent-sky-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Empty (0%)</span>
                      <span className="font-bold text-sky-700">{formData.currentLevelPercent}%</span>
                      <span>Full (100%)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Daily Pumping Hours
                    </label>
                    <input
                      type="text"
                      value={formData.rationingHours}
                      onChange={(e) => setFormData({ ...formData, rationingHours: e.target.value })}
                      placeholder="e.g. 06:00 - 22:00"
                      className="w-full px-3 py-2 font-mono border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Community Bulletin Message to Residents
                    </label>
                    <textarea
                      rows={2}
                      value={formData.communityNotice}
                      onChange={(e) => setFormData({ ...formData, communityNotice: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Emergency Tanker Hauler</label>
                      <input
                        type="text"
                        value={formData.emergencyTankerVendor}
                        onChange={(e) => setFormData({ ...formData, emergencyTankerVendor: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Vendor Phone</label>
                      <input
                        type="tel"
                        value={formData.vendorPhone}
                        onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                        className="w-full px-3 py-2 font-mono border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
                    Your custom microsite URL will be generated instantly and ready to share on Telegram or SMS with all residents!
                  </div>
                </div>
              )}

              {/* Wizard Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Back
                  </button>
                ) : <span />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Launch Community App</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
