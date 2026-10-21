import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Download, 
  Receipt, 
  Smartphone, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Printer,
  Calendar,
  AlertCircle,
  Calculator,
  History,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';
import { BillRecord, Language } from '../types';
import { translations } from '../data/translations';

interface BillPaySectionProps {
  language: Language;
  bills: BillRecord[];
  onBillPaid: (customerId: string, method: string, ref: string) => void;
}

export const BillPaySection: React.FC<BillPaySectionProps> = ({
  language,
  bills,
  onBillPaid,
}) => {
  const t = translations[language];
  const [searchInput, setSearchInput] = useState('AAWSA-90421');
  const [activeBill, setActiveBill] = useState<BillRecord | null>(
    bills.find((b) => b.customerId === 'AAWSA-90421') || bills[0]
  );

  // Tab mode: 'pay' | 'calculator' | 'history'
  const [activeTab, setActiveTab] = useState<'pay' | 'calculator' | 'history'>('pay');

  // Payment process state
  const [selectedMethod, setSelectedMethod] = useState<'telebirr' | 'cbe' | 'gpay' | 'bank'>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('0911234567');
  const [pinCode, setPinCode] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [completedRef, setCompletedRef] = useState<string>('');

  // Interactive tariff calculator state
  const [calcVolume, setCalcVolume] = useState<number>(18);

  const handleSearch = (idToSearch?: string) => {
    const query = (idToSearch || searchInput).trim().toLowerCase();
    const found = bills.find(
      (b) =>
        b.customerId.toLowerCase() === query ||
        b.meterNumber.toLowerCase() === query
    );
    if (found) {
      setActiveBill(found);
    } else {
      // Create a dynamic lookup result for resident convenience
      const newBill: BillRecord = {
        customerId: (idToSearch || searchInput).toUpperCase(),
        customerNameEn: 'Addis Ababa Resident',
        customerNameAm: 'የአዲስ አበባ ነዋሪ',
        meterNumber: `MTR-ET-${Math.floor(100000 + Math.random() * 900000)}`,
        subCity: 'Bole',
        woreda: 'Woreda 05',
        billingPeriod: 'Meskerem - Tikimt 2019 (Oct 2026)',
        previousReading: 340,
        currentReading: 362,
        consumptionM3: 22,
        tariffPerM3: 18.5,
        waterChargeBirr: 407.0,
        sewerageChargeBirr: 162.8,
        meterRentalBirr: 15.0,
        arrearsBirr: 0.0,
        totalDueBirr: 584.8,
        dueDate: '2026-10-30',
        isPaid: false,
      };
      setActiveBill(newBill);
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBill) return;

    setIsProcessing(true);

    setTimeout(() => {
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const generatedRef =
        selectedMethod === 'telebirr'
          ? `TB-AAW-2026-${randomDigits}`
          : selectedMethod === 'cbe'
          ? `CBE-AAW-2026-${randomDigits}`
          : selectedMethod === 'gpay'
          ? `GP-AAW-2026-${randomDigits}`
          : `BOA-AAW-2026-${randomDigits}`;

      onBillPaid(activeBill.customerId, selectedMethod, generatedRef);

      setActiveBill({
        ...activeBill,
        isPaid: true,
        paymentMethod:
          selectedMethod === 'telebirr'
            ? 'Telebirr'
            : selectedMethod === 'cbe'
            ? 'CBE Birr'
            : selectedMethod === 'gpay'
            ? 'Google Pay'
            : 'Bank Direct',
        paymentRef: generatedRef,
        paymentTimestamp: new Date().toLocaleString(),
      });

      setCompletedRef(generatedRef);
      setIsProcessing(false);
      setShowReceiptModal(true);
    }, 1500);
  };

  // Tariff calculation helper
  const calculateTariff = (vol: number) => {
    let waterCost = 0;
    if (vol <= 7) {
      waterCost = vol * 7.5;
    } else if (vol <= 20) {
      waterCost = 7 * 7.5 + (vol - 7) * 18.5;
    } else if (vol <= 50) {
      waterCost = 7 * 7.5 + 13 * 18.5 + (vol - 20) * 32.0;
    } else {
      waterCost = 7 * 7.5 + 13 * 18.5 + 30 * 32.0 + (vol - 50) * 48.0;
    }
    const sewerCost = waterCost * 0.4;
    const meterRent = 15.0;
    const total = waterCost + sewerCost + meterRent;
    return { waterCost, sewerCost, meterRent, total };
  };

  const calcResults = calculateTariff(calcVolume);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <span>AAWSA Public Utility Portal</span>
            <span>·</span>
            <span>Digital Billing & Instant Checkout</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'am' ? 'የውሃ ሂሳብ ማጣሪያ እና ዲጂታል ክፍያ' : 'Water Bill Inquiry & Digital Payment Portal'}
          </h2>
          <p className="text-slate-500 text-xs mt-1 max-w-2xl">
            {language === 'am'
              ? 'የተጠቃሚ መለያ ቁጥርዎን (Customer ID) ወይም የቆጣሪ ቁጥር በማስገባት የወሩን የተጣራ ሂሳብ ያግኙና በTelebirr፣ በCBE Birr ወይም በGoogle Pay ይክፈሉ።'
              : 'Enter your Customer ID or Water Meter Number to retrieve certified consumption bills and settle directly via Telebirr, CBE Birr, or Google Pay.'}
          </p>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('pay')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pay' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'ክፍያ ፈጽም' : 'Bill Checkout'}</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calculator' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'የታሪፍ ስሌት' : 'Tariff Estimator'}</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'የክፍያ ታሪክ' : 'History'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'pay' && (
        <>
          {/* Search and Quick Presets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Customer ID (e.g. AAWSA-90421) or Meter Number (e.g. 987451)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              >
                {t.retrieveBill}
              </button>
            </div>

            {/* Quick test account chips */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{t.sampleIds}</span>
              {bills.map((b) => (
                <button
                  key={b.customerId}
                  onClick={() => {
                    setSearchInput(b.customerId);
                    handleSearch(b.customerId);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border cursor-pointer ${
                    activeBill?.customerId === b.customerId
                      ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b.customerId} ({b.customerNameEn.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Bill Presentation & Payment Split */}
          {activeBill && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Official Itemized Bill Statement */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                {/* Bill Statement Header */}
                <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                      {language === 'am' ? 'የአዲስ አበባ ውሃ እና ፍሳሽ ባለስልጣን' : 'Addis Ababa Water & Sewerage Authority'}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {t.billDetails}
                    </h3>
                    <div className="mt-1 text-xs text-slate-400 font-mono">
                      {t.billPeriod}: <span className="text-slate-200">{activeBill.billingPeriod}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right">
                    {activeBill.isPaid ? (
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.statusPaid}</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold font-mono tracking-wider animate-pulse">
                        {t.statusUnpaid}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Details Banner */}
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.enterCustId}</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">
                      {activeBill.customerId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'am' ? 'የደንበኛ ስም' : 'Customer Name'}</span>
                    <span className="font-semibold text-slate-900 block mt-0.5">
                      {language === 'am' ? activeBill.customerNameAm : activeBill.customerNameEn}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.meterNumber}</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">
                      {activeBill.meterNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'am' ? 'ክፍለ ከተማ / ወረዳ' : 'Sub-City & Woreda'}</span>
                    <span className="font-semibold text-slate-900 block mt-0.5">
                      {activeBill.subCity}, {activeBill.woreda}
                    </span>
                  </div>
                </div>

                {/* Meter Reading Math */}
                <div className="p-6 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    {language === 'am' ? 'የቆጣሪ ንባብ እና የፍጆታ ስሌት' : 'Meter Readings & Consumption Volume'}
                  </h4>
                  <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center font-mono">
                    <div>
                      <div className="text-[11px] text-slate-500">{t.prevReading}</div>
                      <div className="text-base font-bold text-slate-800 mt-1">{activeBill.previousReading} <span className="text-xs font-normal text-slate-500">m³</span></div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">{t.currReading}</div>
                      <div className="text-base font-bold text-slate-800 mt-1">{activeBill.currentReading} <span className="text-xs font-normal text-slate-500">m³</span></div>
                    </div>
                    <div className="bg-blue-50/80 rounded-lg py-1 border border-blue-100">
                      <div className="text-[11px] text-blue-800 font-semibold">{t.netConsumption}</div>
                      <div className="text-base font-bold text-blue-900 mt-1">{activeBill.consumptionM3} <span className="text-xs font-normal text-blue-700">m³</span></div>
                    </div>
                  </div>
                </div>

                {/* Itemized Line Items according to AAWSA Tariff Structure */}
                <div className="p-6 space-y-3 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {language === 'am' ? 'ዝርዝር የክፍያ ስሌት' : 'Itemized Tariff Breakdown'}
                  </h4>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">
                      {t.waterCharge} ({activeBill.consumptionM3} m³ @ {activeBill.tariffPerM3.toFixed(2)} ETB)
                    </span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {activeBill.waterChargeBirr.toFixed(2)} ETB
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">
                      {t.sewerCharge}
                    </span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {activeBill.sewerageChargeBirr.toFixed(2)} ETB
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">
                      {t.meterRental}
                    </span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {activeBill.meterRentalBirr.toFixed(2)} ETB
                    </span>
                  </div>

                  {activeBill.arrearsBirr > 0 && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-rose-700">
                      <span>{t.arrears}</span>
                      <span className="font-mono font-semibold tabular-nums">
                        {activeBill.arrearsBirr.toFixed(2)} ETB
                      </span>
                    </div>
                  )}

                  {/* Total Row */}
                  <div className="flex items-center justify-between pt-3 text-sm font-bold text-slate-900">
                    <span>{t.totalDue}</span>
                    <span className="text-xl font-mono text-blue-700 tabular-nums">
                      {activeBill.totalDueBirr.toFixed(2)} ETB
                    </span>
                  </div>
                </div>

                {/* Bill Action Footer if Paid */}
                {activeBill.isPaid && (
                  <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        {language === 'am'
                          ? `በ${activeBill.paymentMethod} ተከፍሏል · Ref: ${activeBill.paymentRef}`
                          : `Settled via ${activeBill.paymentMethod} · Ref: ${activeBill.paymentRef}`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCompletedRef(activeBill.paymentRef || 'REF-SETTLED');
                        setShowReceiptModal(true);
                      }}
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{t.downloadReceipt}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Digital Payment Terminal */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
                {activeBill.isPaid ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {language === 'am' ? 'ይህ ሂሳብ ሙሉ በሙሉ ተከፍሏል' : 'Bill Settled in Full'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'am'
                          ? `የግብይት መለያ፦ ${activeBill.paymentRef}`
                          : `Transaction Ref: ${activeBill.paymentRef}`}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCompletedRef(activeBill.paymentRef || 'REF-SETTLED');
                        setShowReceiptModal(true);
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>{language === 'am' ? 'ይፋዊ ደረሰኝ አውርድ' : 'Download Official Tax Receipt'}</span>
                    </button>

                    <button
                      onClick={() => {
                        // Switch to next unpaid bill
                        const unpaid = bills.find((b) => !b.isPaid && b.customerId !== activeBill.customerId);
                        if (unpaid) {
                          setActiveBill(unpaid);
                          setSearchInput(unpaid.customerId);
                        }
                      }}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                    >
                      {language === 'am' ? 'ሌላ ቆጣሪ ሂሳብ ፈልግ' : 'Query Another Meter Bill'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                          {language === 'am' ? 'የክፍያ ዘዴ ይምረጡ' : 'Select Payment Gateway'}
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                          <Lock className="w-3 h-3" /> 256-Bit SSL
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {language === 'am' ? 'ፈጣን፣ አስተማማኝ እና ከኮሚሽን ነፃ ዲጂታል ክፍያ' : 'Instant and commission-free utility payment'}
                      </p>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('telebirr')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          selectedMethod === 'telebirr'
                            ? 'border-[#FFCC00] bg-amber-50/70 text-slate-950 font-bold ring-1 ring-[#FFCC00] shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-base mb-1">📱</div>
                        <div className="font-bold text-xs">Telebirr</div>
                        <div className="text-[10px] text-slate-400 font-normal">Ethio Telecom</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMethod('cbe')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          selectedMethod === 'cbe'
                            ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-1 ring-purple-600 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-base mb-1">🏦</div>
                        <div className="font-bold text-xs">CBE Birr</div>
                        <div className="text-[10px] text-slate-400 font-normal">Commercial Bank</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMethod('gpay')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          selectedMethod === 'gpay'
                            ? 'border-slate-950 bg-slate-100 text-slate-950 font-bold ring-1 ring-slate-950 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-base mb-1">🌐</div>
                        <div className="font-bold text-xs">Google Pay</div>
                        <div className="text-[10px] text-slate-400 font-normal">Fast Checkout</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMethod('bank')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          selectedMethod === 'bank'
                            ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-600 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-base mb-1">🏛️</div>
                        <div className="font-bold text-xs">Bank Transfer</div>
                        <div className="text-[10px] text-slate-400 font-normal">Abyssinia / Dashen</div>
                      </button>
                    </div>

                    {/* Method dynamic fields */}
                    {selectedMethod === 'gpay' ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                        <div className="font-bold text-slate-800">Google Pay Express</div>
                        <p className="text-[11px] text-slate-500">
                          One-click secure payment using your Google Wallet card or debit account.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {selectedMethod === 'telebirr'
                              ? t.telebirrPhonePrompt
                              : language === 'am' ? 'የሞባይል ስልክ ቁጥር' : 'Registered Mobile Number'}
                          </label>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0911234567"
                            className="w-full px-3.5 py-2.5 font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs bg-slate-50 focus:bg-white transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {selectedMethod === 'telebirr'
                              ? t.telebirrPinPrompt
                              : language === 'am' ? 'የክፍያ ማረጋገጫ ሚስጥር ቁጥር (PIN)' : 'Payment PIN / OTP'}
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={6}
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                            placeholder="••••"
                            className="w-full px-3.5 py-2.5 font-mono tracking-widest text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition"
                          />
                        </div>
                      </div>
                    )}

                    {/* Fee Summary */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-500">
                        <span>Utility Water Charge:</span>
                        <span className="font-mono text-slate-800">{activeBill.totalDueBirr.toFixed(2)} ETB</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Gateway Convenience Fee:</span>
                        <span className="font-mono text-emerald-600 font-bold">0.00 ETB (FREE)</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5 text-sm">
                        <span>Total Due:</span>
                        <span className="font-mono text-blue-700">{activeBill.totalDueBirr.toFixed(2)} ETB</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                        selectedMethod === 'telebirr'
                          ? 'bg-[#FFCC00] hover:bg-[#E6B800] text-slate-950 font-bold'
                          : selectedMethod === 'cbe'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold'
                          : 'bg-slate-950 hover:bg-slate-900 text-white font-bold'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>{language === 'am' ? 'ክፍያው እየተፈጸመ ነው...' : 'Processing Transaction...'}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {language === 'am'
                              ? `${activeBill.totalDueBirr.toFixed(2)} ETB ክፍያ ፈጽም`
                              : `Authorize Payment of ${activeBill.totalDueBirr.toFixed(2)} ETB`}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'am' ? 'የአዲስ አበባ ውሃ ታሪፍ ስሌት ማስያ' : 'Official Addis Ababa Water Tariff Calculator'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'am'
                  ? 'የውሃ ፍጆታዎን በሜትር ኩብ (m³) በማስገባት የሚመጣውን የተጣራ ሂሳብ አስቀድመው ይገምግሙ።'
                  : 'Estimate your monthly water bill based on the approved AAWSA tiered tariff schedule.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Slider Input */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'am' ? 'ወርሃዊ የፍጆታ መጠን (ሜትር ኩብ - m³)' : 'Monthly Consumption Volume (m³)'}
              </label>
              
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="80"
                  value={calcVolume}
                  onChange={(e) => setCalcVolume(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-blue-700 text-sm">
                  {calcVolume} m³
                </div>
              </div>

              {/* Tariff Tier Cards */}
              <div className="space-y-2 text-xs">
                <div className={`p-2 rounded-lg border flex justify-between ${calcVolume <= 7 ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-white border-slate-100 text-slate-600'}`}>
                  <span>ደረጃ 1 (0 – 7 m³): Lifeline Rate</span>
                  <span>7.50 ETB / m³</span>
                </div>
                <div className={`p-2 rounded-lg border flex justify-between ${calcVolume > 7 && calcVolume <= 20 ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'bg-white border-slate-100 text-slate-600'}`}>
                  <span>ደረጃ 2 (8 – 20 m³): Standard Residential</span>
                  <span>18.50 ETB / m³</span>
                </div>
                <div className={`p-2 rounded-lg border flex justify-between ${calcVolume > 20 && calcVolume <= 50 ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-100 text-slate-600'}`}>
                  <span>ደረጃ 3 (21 – 50 m³): Higher Consumption</span>
                  <span>32.00 ETB / m³</span>
                </div>
                <div className={`p-2 rounded-lg border flex justify-between ${calcVolume > 50 ? 'bg-rose-50 border-rose-300 font-bold text-rose-900' : 'bg-white border-slate-100 text-slate-600'}`}>
                  <span>ደረጃ 4 (50+ m³): Commercial / Heavy</span>
                  <span>48.00 ETB / m³</span>
                </div>
              </div>
            </div>

            {/* Calculated Breakdown */}
            <div className="p-6 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
              <div className="text-cyan-400 font-sans font-bold text-xs uppercase tracking-wider">
                {language === 'am' ? 'የተገመተ ወርሃዊ የክፍያ ድምር' : 'Estimated Tariff Calculation'}
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Clean Water Volume Fee:</span>
                <span>{calcResults.waterCost.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Sewerage Treatment Charge (40%):</span>
                <span>{calcResults.sewerCost.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Meter Maintenance & Rent:</span>
                <span>{calcResults.meterRent.toFixed(2)} ETB</span>
              </div>

              <div className="flex justify-between pt-2 text-base font-bold text-cyan-300 font-mono">
                <span>ESTIMATED TOTAL:</span>
                <span>{calcResults.total.toFixed(2)} ETB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'am' ? 'የክፍያ ታሪክ እና የተረጋገጡ ደረሰኞች' : 'Payment History & Settled Statements'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'am' ? 'የቅርብ ጊዜ የተከፈሉ የውሃ ሂሳቦች መዝገብ' : 'Recent settled billing cycles and certified e-receipts'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              ✓ All Tax Records Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Billing Period</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {bills.map((bill) => (
                  <tr key={bill.customerId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{bill.customerId}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans">{bill.billingPeriod}</td>
                    <td className="py-3 px-4 text-slate-600">{bill.consumptionM3} m³</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{bill.totalDueBirr.toFixed(2)} ETB</td>
                    <td className="py-3 px-4 font-sans text-slate-600">{bill.paymentMethod || 'Telebirr'}</td>
                    <td className="py-3 px-4">
                      {bill.isPaid ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          PAID
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          DUE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => {
                          setActiveBill(bill);
                          setCompletedRef(bill.paymentRef || `TB-AAW-${bill.customerId}`);
                          setShowReceiptModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs cursor-pointer"
                      >
                        {language === 'am' ? 'ደረሰኝ' : 'Receipt'} ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Certified AAWSA Receipt Modal */}
      {showReceiptModal && activeBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  {language === 'am' ? 'ይፋዊ የAAWSA የክፍያ ደረሰኝ' : 'Official AAWSA Electronic Tax Receipt'}
                </h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt Body */}
            <div className="py-4 space-y-4 font-mono text-xs text-slate-800">
              <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900 uppercase">Addis Ababa Water & Sewerage Authority</div>
                <div className="text-[11px] text-slate-500 font-sans">Ministry of Water & Energy · Federal Republic of Ethiopia</div>
                <div className="text-[10px] text-slate-400 mt-0.5">TIN: 0002910481 · VAT Reg No: 849102-ET</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Transaction Ref:</span>
                  <span className="font-bold text-slate-900">{completedRef || activeBill.paymentRef || 'AAW-2026-90421'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date & Time:</span>
                  <span className="text-slate-800">{activeBill.paymentTimestamp || new Date().toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Customer ID:</span>
                  <span className="font-bold text-slate-900">{activeBill.customerId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Customer Name:</span>
                  <span className="text-slate-800 font-sans">{activeBill.customerNameEn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Meter Number:</span>
                  <span className="text-slate-800">{activeBill.meterNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Method:</span>
                  <span className="font-bold text-emerald-700">
                    {activeBill.paymentMethod || 'Telebirr Digital'}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="border-t border-b border-slate-200 py-2 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Water Tariff ({activeBill.consumptionM3} m³)</span>
                  <span>{activeBill.waterChargeBirr.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Sewerage Charge (40%)</span>
                  <span>{activeBill.sewerageChargeBirr.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Meter Service & Rent</span>
                  <span>{activeBill.meterRentalBirr.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-100 text-sm text-slate-900">
                  <span>TOTAL SETTLED</span>
                  <span className="text-blue-700">{activeBill.totalDueBirr.toFixed(2)} ETB</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-sans flex items-center justify-between">
                <span>✓ AAWSA Electronic Stamp Affixed · Payment Cleared</span>
                <span className="font-mono text-[9px] text-emerald-600">AUTH: 0x9042F</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Electronic verification enabled</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
