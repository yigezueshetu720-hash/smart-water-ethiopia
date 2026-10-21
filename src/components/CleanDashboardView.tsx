import React, { useState } from 'react';
import { 
  Droplet, 
  Clock, 
  MapPin, 
  CreditCard, 
  Camera, 
  Check, 
  ChevronDown, 
  X, 
  Building2, 
  AlertTriangle,
  Receipt,
  Download,
  Share2,
  ExternalLink,
  Layers,
  Activity,
  Smartphone
} from 'lucide-react';
import { Language, RationingZone, BillRecord, IncidentReport, CommunityApp } from '../types';
import { translations } from '../data/translations';

interface CleanDashboardViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  zones: RationingZone[];
  bills: BillRecord[];
  onBillPaid: (customerId: string, method: string, ref: string) => void;
  onNewIncident: (incident: Omit<IncidentReport, 'id' | 'ticketId' | 'timestamp' | 'status'>) => IncidentReport;
  onOpenExtendedRationing: () => void;
  onOpenBilling: () => void;
  onOpenCommunityBuilder: () => void;
  onOpenStaffScada: () => void;
  onOpenUssd: () => void;
}

export const CleanDashboardView: React.FC<CleanDashboardViewProps> = ({
  language,
  onLanguageChange,
  zones,
  bills,
  onBillPaid,
  onNewIncident,
  onOpenExtendedRationing,
  onOpenBilling,
  onOpenCommunityBuilder,
  onOpenStaffScada,
  onOpenUssd,
}) => {
  const t = translations[language];

  // Selected active zone (default: Bole Atlas)
  const [selectedZone, setSelectedZone] = useState<RationingZone>(
    zones.find((z) => z.id === 'bole') || zones[0]
  );
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Active bill (default: 420.00 ETB / active account)
  const [activeBill, setActiveBill] = useState<BillRecord>(bills[0]);
  
  // Payment Modal & Flow State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'telebirr' | 'gpay' | 'cbe'>('telebirr');
  const [payPhoneNumber, setPayPhoneNumber] = useState('0911234567');
  const [payPinCode, setPayPinCode] = useState('1234');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [settledReceipt, setSettledReceipt] = useState<{
    ref: string;
    method: string;
    amount: number;
    meter: string;
    customerId: string;
    timestamp: string;
  } | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Initiate Payment Modal
  const handleStartPayment = (method: 'telebirr' | 'gpay' | 'cbe') => {
    setSelectedPayMethod(method);
    setPaymentStatus('idle');
    setIsPaymentModalOpen(true);
  };

  // Process & Authorize Payment
  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');

    setTimeout(() => {
      const generatedRef = selectedPayMethod === 'telebirr'
        ? `TB-AAW-${Math.floor(100000 + Math.random() * 900000)}`
        : selectedPayMethod === 'gpay'
        ? `GP-AAW-${Math.floor(100000 + Math.random() * 900000)}`
        : `CBE-AAW-${Math.floor(100000 + Math.random() * 900000)}`;

      const methodLabel = selectedPayMethod === 'telebirr' ? 'Telebirr' : selectedPayMethod === 'gpay' ? 'Google Pay' : 'CBE Birr';
      
      onBillPaid(activeBill.customerId, selectedPayMethod, generatedRef);
      setActiveBill((prev) => ({
        ...prev,
        isPaid: true,
        paymentMethod: methodLabel,
        paymentRef: generatedRef,
        totalDueBirr: 0.0,
      }));

      setSettledReceipt({
        ref: generatedRef,
        method: methodLabel,
        amount: activeBill.totalDueBirr,
        meter: activeBill.meterNumber,
        customerId: activeBill.customerId,
        timestamp: new Date().toLocaleString(),
      });

      setPaymentStatus('success');
    }, 1200);
  };

  // Camera / Incident Reporting Modal
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState<'burst' | 'leak' | 'zero_pressure'>('burst');
  const [incidentLandmark, setIncidentLandmark] = useState('ቦሌ አትላስ ሆቴል ፊት ለፊት');
  const [incidentPhone, setIncidentPhone] = useState('0911234567');
  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(true);
  const [createdTicket, setCreatedTicket] = useState<IncidentReport | null>(null);

  // Water points modal
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);

  // Handle Fast Camera Incident Submission
  const handleFastReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = onNewIncident({
      subCity: selectedZone.subCityEn,
      woreda: selectedZone.woredas.split('-')[0].trim() || 'Woreda 14',
      landmark: incidentLandmark,
      category: incidentCategory,
      urgency: 'high',
      description: 'Quick mobile camera incident report submitted by resident.',
      reporterPhone: incidentPhone,
      lat: 9.002,
      lng: 38.784,
    });
    setCreatedTicket(newTicket);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen selection:bg-blue-500 selection:text-white flex flex-col justify-between">
      {/* 🌐 1. SMART HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 shadow-xs">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Logo & Authority title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm">
              💧
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-slate-900">
                AAWSA Smart Water
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                {language === 'am' ? 'የአዲስ አበባ ውሃና ፍሳሽ ባለስልጣን' : 'Addis Ababa Water & Sewerage Authority'}
              </p>
            </div>
          </div>

          {/* Geolocation & Lang Toggle */}
          <div className="flex items-center gap-3 text-xs font-medium">
            {/* Location Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsLocationPickerOpen(!isLocationPickerOpen)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs transition"
              >
                <span>📍</span>
                <span className="font-semibold">
                  {language === 'am' ? selectedZone.subCityAm : selectedZone.subCityEn} ({selectedZone.majorNeighborhoods[0]})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Location Dropdown Modal */}
              {isLocationPickerOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400">
                    {language === 'am' ? 'ክፍለ ከተማ ይምረጡ' : 'Select Your Neighborhood'}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {zones.map((z) => (
                      <button
                        key={z.id}
                        onClick={() => {
                          setSelectedZone(z);
                          setIsLocationPickerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                          selectedZone.id === z.id
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{language === 'am' ? z.subCityAm : z.subCityEn}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{z.majorNeighborhoods.slice(0, 2).join(', ')}</div>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${
                          z.status === 'flowing' ? 'bg-emerald-500' :
                          z.status === 'scheduled' ? 'bg-amber-500' : 'bg-slate-300'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1"
              >
                <span>{language === 'am' ? 'አማርኛ' : 'English'}</span>
                <span>▾</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-50">
                  <button
                    onClick={() => {
                      onLanguageChange('am');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      language === 'am' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    አማርኛ
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      language === 'en' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 📊 2. MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6 w-full flex-1">
        
        {/* ⏳ CARD 1: LIVE RATIONING STATUS (የውሃ ፈራረቃ ካርድ) */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-xl text-amber-600 shrink-0">
                ⏳
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'am' ? 'የዛሬ የውሃ ሁኔታ መከታተያ' : 'Today\'s Water Rationing Schedule'}
                </h2>
                <p className="text-sm font-medium text-amber-600 mt-0.5">
                  🟡 {language === 'am' ? 'ውሃ በቅርቡ ይለቀቃል (ከቀኑ 10:00 ሰዓት ጀምሮ)' : 'Water supply will be pressurized shortly (from 16:00)'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'am' 
                    ? `የ4 ሰዓት ከ44 ደቂቃ ካውንትዳውን ይቀራል • ${selectedZone.subCityAm} ${selectedZone.woredasAm}`
                    : `4h 44m countdown remaining • ${selectedZone.subCityEn} ${selectedZone.woredas}`}
                </p>
              </div>
            </div>

            {/* Mini Progress Visual Indicator */}
            <div className="flex flex-col items-end gap-1.5 w-full md:w-48">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                <div className="bg-amber-500 h-full rounded-full animate-pulse" style={{ width: '65%' }} />
              </div>
              <button
                onClick={onOpenExtendedRationing}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                {language === 'am' ? 'ሙሉ የ11ዱን ክፍለ ከተሞች መርሐ-ግብር እይ ➔' : 'View all 11 sub-cities schedule ➔'}
              </button>
            </div>
          </div>
        </section>

        {/* 🧾 CARD 2 & CARD 3: GRID LAYOUT FOR ACTIONS (ሂሳብ እና ችግር ጥቆማ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 💳 CARD 2: EXPRESS CHECKOUT WIDGET (የሂሳብ መክፈያ) */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between min-h-[190px] transition-all duration-300 hover:shadow-md">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'am' ? 'ቀሪ የውሃ ሂሳብ' : 'Outstanding Water Bill'}
                  </h3>
                  {activeBill.isPaid ? (
                    <div className="mt-1">
                      <p className="text-3xl font-bold tracking-tight text-emerald-600 font-mono">
                        0.00 <span className="text-sm font-medium text-slate-500 font-sans">ETB</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                        ✓ {language === 'am' ? 'ተከፍሏል (PAID & SETTLED)' : 'PAID & SETTLED'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-mono">
                      {activeBill.totalDueBirr.toFixed(2)} <span className="text-sm font-medium text-slate-500 font-sans">ETB</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase font-mono">
                    {language === 'am' ? `ሜትር፦ ${activeBill.meterNumber}` : `Meter: ${activeBill.meterNumber}`}
                  </span>
                  <button
                    onClick={onOpenBilling}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    {language === 'am' ? 'ዝርዝር ሂሳብ ➔' : 'Full Bill ➔'}
                  </button>
                </div>
              </div>

              {!activeBill.isPaid && (
                <p className="text-xs text-slate-400 mt-2">
                  {language === 'am'
                    ? `የክፍያ ማብቂያ፡ ${activeBill.dueDate} • ${activeBill.customerNameAm}`
                    : `Due: ${activeBill.dueDate} • ${activeBill.customerNameEn}`}
                </p>
              )}
            </div>

            {/* Quick Payment Integration Buttons */}
            {activeBill.isPaid ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => {
                    if (!settledReceipt) {
                      setSettledReceipt({
                        ref: activeBill.paymentRef || 'AAW-PAID-987451',
                        method: activeBill.paymentMethod || 'Telebirr',
                        amount: 420.0,
                        meter: activeBill.meterNumber,
                        customerId: activeBill.customerId,
                        timestamp: activeBill.paymentTimestamp || new Date().toLocaleString(),
                      });
                    }
                    setIsReceiptModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  {language === 'am' ? 'ይፋዊ ደረሰኝ' : 'View Receipt'}
                </button>
                <button
                  onClick={onOpenBilling}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  {language === 'am' ? 'የክፍያ ታሪክ' : 'Bill History'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => handleStartPayment('telebirr')}
                  className="bg-[#FFCC00] hover:bg-[#E6B800] text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  📱 Telebirr
                </button>
                <button
                  onClick={() => handleStartPayment('gpay')}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  🌐 Google Pay
                </button>
              </div>
            )}
          </section>

          {/* 📸 CROWD-SOURCED INCIDENT REPORTER (ችግር ማሳወቂያ) */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between min-h-[180px] transition-all duration-300 hover:shadow-md">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {language === 'am' ? 'የአካባቢ ችግር ጥቆማ' : 'Citizen Incident Hotline'}
              </h3>
              <h4 className="text-base font-bold text-slate-900 mt-1">
                {language === 'am' ? 'የቧንቧ ስብራት ወይም ፍሳሽ አጋጥሞዎታል?' : 'Encountered a pipe burst or leakage?'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'am' ? 'የ30 ሰከንድ ፈጣን ጥቆማ በቀጥታ ለAAWSA የጥገና ቡድን ይላኩ።' : 'Send a 30-second rapid photo report directly to AAWSA crews.'}
              </p>
            </div>

            {/* Camera Native Trigger Button */}
            <button
              onClick={() => setIsCameraModalOpen(true)}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-rose-100 mt-6 active:scale-98"
            >
              📷 {language === 'am' ? 'ፎቶ አንሳና በቀጥታ ላክ' : 'Snap Photo & Submit Incident'}
            </button>
          </section>

        </div>

        {/* 🚰 CARD 4: MINIMALIST PUBLIC WATER POINTS (የህዝብ ውሃ ነጥቦች) */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              📍 {language === 'am' ? 'በአቅራቢያዎ የሚገኙ ንቁ የውሃ ነጥቦች' : 'Active Public Water Points Nearby'}
            </h3>
            <button
              onClick={() => setIsPointsModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              {language === 'am' ? 'ሁሉንም እይ ➔' : 'View all ➔'}
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-700">
                🏢 {language === 'am' ? 'የወረዳ 14 የጋራ ማጠራቀሚያ ታንክ' : 'Woreda 14 Communal Water Cistern'}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                🟢 {language === 'am' ? '75% ሙሉ' : '75% Full'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-700">
                🚰 {language === 'am' ? 'የአትላስ ህዝብ ውሃ ማከፋፈያ ኪዮስክ #3' : 'Atlas Public Water Tap Kiosk #3'}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                🟢 {language === 'am' ? 'ክፍት ነው' : 'Active'}
              </span>
            </div>
          </div>
        </section>

        {/* Quick Utility Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={onOpenExtendedRationing}
            className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-slate-200 text-left transition flex items-center gap-2.5"
          >
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">{language === 'am' ? '11ዱ ክፍለ ከተሞች' : '11 Sub-Cities'}</div>
              <div className="text-[10px] text-slate-400">Rationing Table</div>
            </div>
          </button>

          <button
            onClick={onOpenCommunityBuilder}
            className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-slate-200 text-left transition flex items-center gap-2.5"
          >
            <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">{language === 'am' ? 'የኮንዶሚኒየም ገጽ' : 'Condo Builder'}</div>
              <div className="text-[10px] text-slate-400">2-Minute Creator</div>
            </div>
          </button>

          <button
            onClick={onOpenStaffScada}
            className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-slate-200 text-left transition flex items-center gap-2.5"
          >
            <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">{language === 'am' ? 'የግድቦች ይዞታ' : 'SCADA Dams'}</div>
              <div className="text-[10px] text-slate-400">Legedadi 91%</div>
            </div>
          </button>

          <button
            onClick={onOpenUssd}
            className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-slate-200 text-left transition flex items-center gap-2.5"
          >
            <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">*804# USSD</div>
              <div className="text-[10px] text-slate-400">Offline Gateway</div>
            </div>
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-[11px] text-slate-400 font-medium">
        © 2026 AAWSA Smart Water Engine • {language === 'am' ? 'በዲጂታል የውሃ መከታተያ የተደገፈ' : 'Addis Ababa Municipal Water Authority'}
      </footer>

      {/* 100% Free Public Service Notice */}

      {/* 📷 MODAL: CAMERA NATIVE INCIDENT REPORTER */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center">
                  📷
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {language === 'am' ? 'የ30 ሰከንድ ፈጣን ጥቆማ' : '30-Second Rapid Incident Report'}
                </h3>
              </div>
              <button onClick={() => { setIsCameraModalOpen(false); setCreatedTicket(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {createdTicket ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {language === 'am' ? 'ጥቆማዎ ለAAWSA ደርሷል!' : 'Report Dispatched!'}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  Ticket ID: <strong>{createdTicket.ticketId}</strong>
                </p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  {language === 'am'
                    ? 'የአካባቢው ፈጣን ምላሽ ሰጪ ቡድን ተመድቧል። በአማካይ በ30 ደቂቃ ውስጥ ወደ ቦታው ይደርሳሉ።'
                    : 'The rapid excavation response crew has been assigned to your location.'}
                </p>
                <button
                  onClick={() => { setIsCameraModalOpen(false); setCreatedTicket(null); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  {language === 'am' ? 'እሺ (ዝጋ)' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFastReport} className="py-4 space-y-3 text-xs">
                {/* Photo Preview Simulator */}
                <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src="/src/assets/images/field_engineer_inspection_1792581975223.jpg"
                    alt="Captured Leakage Photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                    📍 {selectedZone.subCityEn} Woreda 14
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                    ✓ Photo Attached
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'am' ? 'የችግሩ አይነት' : 'Incident Type'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setIncidentCategory('burst')}
                      className={`p-2 rounded-lg border text-center font-medium ${
                        incidentCategory === 'burst'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      የቧንቧ መሰበር
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentCategory('leak')}
                      className={`p-2 rounded-lg border text-center font-medium ${
                        incidentCategory === 'leak'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      የውሃ መፍሰስ
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentCategory('zero_pressure')}
                      className={`p-2 rounded-lg border text-center font-medium ${
                        incidentCategory === 'zero_pressure'
                          ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      ውሃ መቋረጥ
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'am' ? 'ትክክለኛ ቦታ / ምልክት' : 'Specific Landmark'}
                  </label>
                  <input
                    type="text"
                    required
                    value={incidentLandmark}
                    onChange={(e) => setIncidentLandmark(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'am' ? 'የስልክ ቁጥር' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={incidentPhone}
                    onChange={(e) => setIncidentPhone(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  {language === 'am' ? 'ጥቆማውን ለጥገና ቡድን ላክ' : 'Dispatch Emergency Report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 💳 MODAL: INTERACTIVE PAYMENT CHECKOUT */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shadow-xs ${
                  selectedPayMethod === 'telebirr' ? 'bg-[#FFCC00] text-slate-950' :
                  selectedPayMethod === 'gpay' ? 'bg-slate-950 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {selectedPayMethod === 'telebirr' ? '📱' : selectedPayMethod === 'gpay' ? '🌐' : '🏦'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {language === 'am' ? 'የውሃ ሂሳብ መክፈያ' : 'Water Bill Checkout'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {selectedPayMethod === 'telebirr' ? 'Telebirr SuperApp Gateway' :
                     selectedPayMethod === 'gpay' ? 'Google Pay Fast Checkout' : 'Commercial Bank of Ethiopia'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setIsPaymentModalOpen(false); setPaymentStatus('idle'); }} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentStatus === 'processing' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {language === 'am' ? 'ክፍያው እየተረጋገጠ ነው...' : 'Securing Payment Transaction...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedPayMethod === 'telebirr'
                      ? 'Ethio Telecom Telebirr API · Connecting to core billing'
                      : 'Authorizing with secure payment gateway'}
                  </p>
                </div>
              </div>
            ) : paymentStatus === 'success' ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
                  ✓
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {language === 'am' ? 'ክፍያው በተሳካ ሁኔታ ተፈጽሟል!' : 'Payment Settled Successfully!'}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  Ref: <strong className="text-slate-900">{settledReceipt?.ref}</strong>
                </p>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 text-left space-y-1">
                  <div className="flex justify-between">
                    <span>{language === 'am' ? 'የተከፈለ መጠን፡' : 'Amount Paid:'}</span>
                    <strong className="font-mono">{settledReceipt?.amount.toFixed(2)} ETB</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'am' ? 'የቆጣሪ ቁጥር፡' : 'Meter Number:'}</span>
                    <strong className="font-mono">{settledReceipt?.meter}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'am' ? 'የክፍያ ዘዴ፡' : 'Channel:'}</span>
                    <strong>{settledReceipt?.method}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'am'
                    ? 'የማረጋገጫ አጭር መልዕክት (SMS) ወደ ስልክዎ ተልኳል።'
                    : 'Confirmation SMS sent to your registered mobile number.'}
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setIsReceiptModalOpen(true);
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    {language === 'am' ? 'ይፋዊ ደረሰኝ አሳይ' : 'View Official Receipt'}
                  </button>
                  <button
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setPaymentStatus('idle');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {language === 'am' ? 'ዝጋ' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecutePayment} className="py-4 space-y-4 text-xs">
                {/* Method selector pills */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    {language === 'am' ? 'የክፍያ ዘዴ ይምረጡ' : 'Select Payment Method'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod('telebirr')}
                      className={`p-2 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                        selectedPayMethod === 'telebirr'
                          ? 'border-[#FFCC00] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FFCC00]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">📱</span>
                      <span className="text-[11px]">Telebirr</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod('gpay')}
                      className={`p-2 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                        selectedPayMethod === 'gpay'
                          ? 'border-slate-900 bg-slate-100 text-slate-950 shadow-xs ring-1 ring-slate-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">🌐</span>
                      <span className="text-[11px]">Google Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod('cbe')}
                      className={`p-2 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                        selectedPayMethod === 'cbe'
                          ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs ring-1 ring-purple-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">🏦</span>
                      <span className="text-[11px]">CBE Birr</span>
                    </button>
                  </div>
                </div>

                {/* Amount Due Card */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      {language === 'am' ? 'የሚከፈለው ሂሳብ' : 'Total Amount Due'}
                    </span>
                    <span className="text-xs text-slate-600">
                      {activeBill.customerId} · {activeBill.meterNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-blue-700">
                      {activeBill.totalDueBirr.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 font-sans ml-1">ETB</span>
                  </div>
                </div>

                {/* Input fields based on method */}
                {selectedPayMethod === 'gpay' ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-900 text-white rounded-xl text-center font-medium text-xs flex items-center justify-center gap-2">
                      <span>G Pay</span>
                      <span className="text-slate-400">|</span>
                      <span>Express Checkout</span>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                      Payment will be processed instantly via your linked debit card or Google account.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {selectedPayMethod === 'telebirr' 
                          ? (language === 'am' ? 'የቴሌብር ስልክ ቁጥር' : 'Registered Telebirr Mobile')
                          : (language === 'am' ? 'የCBE Birr ስልክ ቁጥር' : 'Registered CBE Birr Mobile')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={payPhoneNumber}
                        onChange={(e) => setPayPhoneNumber(e.target.value)}
                        placeholder="0911234567"
                        className="w-full px-3 py-2 font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {language === 'am' ? 'ሚስጥር ቁጥር (PIN)' : 'Security PIN / OTP'}
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={6}
                        value={payPinCode}
                        onChange={(e) => setPayPinCode(e.target.value)}
                        placeholder="••••"
                        className="w-full px-3 py-2 font-mono tracking-widest text-base border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                    selectedPayMethod === 'telebirr'
                      ? 'bg-[#FFCC00] hover:bg-[#E6B800] text-slate-950 font-bold'
                      : selectedPayMethod === 'gpay'
                      ? 'bg-slate-950 hover:bg-slate-900 text-white font-bold'
                      : 'bg-purple-600 hover:bg-purple-700 text-white font-bold'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {language === 'am'
                      ? `${activeBill.totalDueBirr.toFixed(2)} ETB ክፍያ ፈጽም`
                      : `Authorize & Pay ${activeBill.totalDueBirr.toFixed(2)} ETB`}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 📄 MODAL: OFFICIAL CERTIFIED AAWSA ELECTRONIC TAX RECEIPT */}
      {isReceiptModalOpen && settledReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 font-mono text-xs">
            {/* Header */}
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg mx-auto font-bold mb-1 shadow-xs">
                💧
              </div>
              <div className="font-bold text-slate-900 text-sm uppercase">
                {language === 'am' ? 'የአዲስ አበባ ውሃና ፍሳሽ ባለስልጣን' : 'Addis Ababa Water & Sewerage Authority'}
              </div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                Official Electronic Utility Tax Receipt • ህጋዊ የኤሌክትሮኒክስ ደረሰኝ
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                TIN: 0002910481 · VAT Reg No: 849102-ET
              </div>
            </div>

            {/* Receipt details */}
            <div className="py-4 space-y-2.5 text-[11px] border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Ref:</span>
                <span className="font-bold text-slate-900">{settledReceipt.ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Timestamp:</span>
                <span className="text-slate-700">{settledReceipt.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Account:</span>
                <span className="font-bold text-slate-900">{settledReceipt.customerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certified Meter:</span>
                <span className="font-bold text-slate-900">{settledReceipt.meter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="font-semibold text-slate-800">{settledReceipt.method}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900 text-xs">
                <span>TOTAL SETTLED:</span>
                <span className="text-emerald-700">{settledReceipt.amount.toFixed(2)} ETB</span>
              </div>
            </div>

            {/* Stamp simulation */}
            <div className="py-3 flex items-center justify-between text-[10px] text-slate-400 font-sans">
              <div className="border border-dashed border-emerald-400 bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-mono font-bold text-[9px] uppercase">
                ✓ AAWSA PAID & VERIFIED
              </div>
              <span>Digital Signature Token: 0x98A1B...</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ደረሰኝ አውርድ / Print' : 'Download / Print'}</span>
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-sans font-semibold cursor-pointer"
              >
                {language === 'am' ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚰 MODAL: EXTENDED ACTIVE WATER POINTS */}
      {isPointsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                📍 {language === 'am' ? 'በአዲስ አበባ የሚገኙ ንቁ የህዝብ ውሃ ነጥቦች' : 'Active Public Water Points in Addis Ababa'}
              </h3>
              <button onClick={() => setIsPointsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-80 overflow-y-auto text-xs">
              {[
                { name: '🏢 የወረዳ 14 የጋራ ማጠራቀሚያ ታንክ', status: '75% ሙሉ', loc: 'ቦሌ አትላስ', active: true },
                { name: '🚰 የአትላስ ህዝብ ውሃ ማከፋፈያ ኪዮስክ #3', status: 'ክፍት ነው', loc: 'ቦሌ ወረዳ 14', active: true },
                { name: '🏢 የጀሞ 1 ብሎክ 24 የኮንዶሚኒየም ታንክ', status: '82% ሙሉ', loc: 'ንፋስ ስልክ', active: true },
                { name: '🚰 የፒያሳ ማዘጋጃ ቤት አጠገብ የውሃ ኪዮስክ #1', status: 'ክፍት ነው', loc: 'አራዳ', active: true },
                { name: '🚛 የአቃቂ የአደጋ ጊዜ ቦቴ ማከፋፈያ', status: 'በስራ ላይ', loc: 'አቃቂ ቃሊቲ', active: true },
                { name: '🏢 የአያት ዞን 3 የነዋሪዎች ታንከር', status: '60% ሙሉ', loc: 'ለሚ ኩራ', active: true },
              ].map((pt, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-800">{pt.name}</div>
                    <div className="text-[10px] text-slate-400">{pt.loc}</div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    🟢 {pt.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsPointsModalOpen(false)}
              className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
            >
              {language === 'am' ? 'ዝጋ' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
