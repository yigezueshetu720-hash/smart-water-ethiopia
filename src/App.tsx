/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CleanDashboardView } from './components/CleanDashboardView';
import { RationingSection } from './components/RationingSection';
import { BillPaySection } from './components/BillPaySection';
import { IncidentReportingSection } from './components/IncidentReportingSection';
import { CommunityBuilderSection } from './components/CommunityBuilderSection';
import { ScadaTelemetryView } from './components/ScadaTelemetryView';
import { UssdQuickGuide } from './components/UssdQuickGuide';
import { ArrowLeft } from 'lucide-react';

import { 
  INITIAL_RATIONING_ZONES, 
  MOCK_BILLS, 
  INITIAL_INCIDENTS, 
  PRELOADED_COMMUNITIES, 
  RESERVOIR_DATA, 
  TANKER_FLEET 
} from './data/mockData';
import { 
  Language, 
  RationingZone, 
  BillRecord, 
  IncidentReport, 
  CommunityApp, 
  ReservoirTelemetry, 
  TankerTruck 
} from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('am');
  // Default directly to the clean dashboard requested by the user
  const [activeTab, setActiveTab] = useState<'clean_dashboard' | 'rationing' | 'billing' | 'incident' | 'community' | 'scada' | 'ussd'>('clean_dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core application state
  const [zones, setZones] = useState<RationingZone[]>(INITIAL_RATIONING_ZONES);
  const [bills, setBills] = useState<BillRecord[]>(MOCK_BILLS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [communities, setCommunities] = useState<CommunityApp[]>(PRELOADED_COMMUNITIES);
  const [reservoirs, setReservoirs] = useState<ReservoirTelemetry[]>(RESERVOIR_DATA);
  const [tankers, setTankers] = useState<TankerTruck[]>(TANKER_FLEET);
  const [preselectedReportSubCity, setPreselectedReportSubCity] = useState<string>('Bole');

  // Handle Bill Settlement
  const handleBillPaid = (customerId: string, method: string, ref: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.customerId === customerId
          ? {
              ...b,
              isPaid: true,
              paymentMethod: method === 'telebirr' ? 'Telebirr' : method === 'gpay' ? 'Google Pay' : 'CBE Birr',
              paymentRef: ref,
              paymentTimestamp: new Date().toLocaleString(),
            }
          : b
      )
    );
  };

  // Handle New Incident Report
  const handleNewIncident = (
    newIncData: Omit<IncidentReport, 'id' | 'ticketId' | 'timestamp' | 'status'>
  ): IncidentReport => {
    const randomTicketNumber = Math.floor(1000 + Math.random() * 9000);
    const newIncident: IncidentReport = {
      ...newIncData,
      id: `inc-${Date.now()}`,
      ticketId: `TK-2026-AAW-${randomTicketNumber}`,
      status: 'reported',
      timestamp: 'Just now',
    };

    setIncidents((prev) => [newIncident, ...prev]);
    return newIncident;
  };

  // Handle Community App Creation
  const handleCreateCommunity = (newApp: CommunityApp) => {
    setCommunities((prev) => [newApp, ...prev]);
  };

  // Handle Valve Actuation in SCADA
  const handleUpdateZoneValve = (zoneId: string, valveOpenPercent: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const newStatus =
            valveOpenPercent === 0
              ? 'maintenance'
              : valveOpenPercent >= 70
              ? 'flowing'
              : valveOpenPercent >= 35
              ? 'filling'
              : 'scheduled';

          const newPressure =
            valveOpenPercent === 0
              ? 0.0
              : parseFloat(((valveOpenPercent / 100) * 3.0).toFixed(1));

          return {
            ...z,
            valveOpenPercent,
            status: newStatus,
            pressureBar: newPressure,
            lastUpdated: 'Just now (Staff override)',
          };
        }
        return z;
      })
    );
  };

  // Handle Tanker Reassignment
  const handleDispatchTanker = (truckId: string, targetSubCity: string) => {
    setTankers((prev) =>
      prev.map((t) =>
        t.truckId === truckId
          ? {
              ...t,
              targetSubCity,
              currentStatus: 'en_route',
            }
          : t
      )
    );
  };

  const handleNavigateToReport = (subCityName: string) => {
    setPreselectedReportSubCity(subCityName);
    setActiveTab('incident');
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col ${language === 'am' ? 'font-amharic' : ''}`}>
      {/* If in clean_dashboard, render the user's requested clean layout */}
      {activeTab === 'clean_dashboard' ? (
        <CleanDashboardView
          language={language}
          onLanguageChange={setLanguage}
          zones={zones}
          bills={bills}
          onBillPaid={handleBillPaid}
          onNewIncident={handleNewIncident}
          onOpenExtendedRationing={() => setActiveTab('rationing')}
          onOpenBilling={() => setActiveTab('billing')}
          onOpenCommunityBuilder={() => setActiveTab('community')}
          onOpenStaffScada={() => setActiveTab('scada')}
          onOpenUssd={() => setActiveTab('ussd')}
        />
      ) : (
        /* Extended Detailed View Container with Back to Clean Dashboard Button */
        <div className="min-h-screen flex flex-col">
          {/* Top Return Bar */}
          <header className="bg-white border-b border-slate-100 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
            <button
              onClick={() => setActiveTab('clean_dashboard')}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ ዋናው ዳሽቦርድ ተመለስ' : 'Back to Clean Dashboard'}</span>
            </button>

            {/* Sub-navigation tabs */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs">
              <button
                onClick={() => setActiveTab('rationing')}
                className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                  activeTab === 'rationing' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {language === 'am' ? 'የውሃ ፈራረቃ' : 'Rationing'}
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                  activeTab === 'billing' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {language === 'am' ? 'ሂሳብ እና ክፍያ' : 'Bill & Pay'}
              </button>
              <button
                onClick={() => setActiveTab('incident')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  activeTab === 'incident' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {language === 'am' ? 'ጥቆማዎች' : 'Incidents'}
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  activeTab === 'community' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {language === 'am' ? 'ኮንዶሚኒየም' : 'Condo Apps'}
              </button>
              <button
                onClick={() => setActiveTab('scada')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  activeTab === 'scada' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {language === 'am' ? 'SCADA ግድቦች' : 'SCADA Telemetry'}
              </button>
              <button
                onClick={() => setActiveTab('ussd')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  activeTab === 'ussd' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                *804# USSD
              </button>
            </div>

            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'am' ? 'en' : 'am')}
              className="text-xs font-semibold px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              {language === 'am' ? 'EN' : 'አማርኛ'}
            </button>
          </header>

          <main className="max-w-6xl w-full mx-auto p-6 flex-1">
            {activeTab === 'rationing' && (
              <RationingSection
                language={language}
                zones={zones}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNavigateToReport={handleNavigateToReport}
                onNavigateToCommunity={() => setActiveTab('community')}
              />
            )}

            {activeTab === 'billing' && (
              <BillPaySection
                language={language}
                bills={bills}
                onBillPaid={handleBillPaid}
              />
            )}

            {activeTab === 'incident' && (
              <IncidentReportingSection
                language={language}
                incidents={incidents}
                preselectedSubCity={preselectedReportSubCity}
                onNewIncident={handleNewIncident}
              />
            )}

            {activeTab === 'community' && (
              <CommunityBuilderSection
                language={language}
                communities={communities}
                onCreateCommunity={handleCreateCommunity}
              />
            )}

            {activeTab === 'scada' && (
              <ScadaTelemetryView
                language={language}
                zones={zones}
                reservoirs={reservoirs}
                tankers={tankers}
                onUpdateZoneValve={handleUpdateZoneValve}
                onDispatchTanker={handleDispatchTanker}
              />
            )}

            {activeTab === 'ussd' && (
              <UssdQuickGuide language={language} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
