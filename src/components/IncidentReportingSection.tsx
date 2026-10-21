import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Send, 
  Search, 
  Wrench,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { IncidentReport, IncidentCategory, IncidentUrgency, Language } from '../types';
import { translations } from '../data/translations';

interface IncidentReportingSectionProps {
  language: Language;
  incidents: IncidentReport[];
  preselectedSubCity?: string;
  onNewIncident: (incident: Omit<IncidentReport, 'id' | 'ticketId' | 'timestamp' | 'status'>) => IncidentReport;
}

export const IncidentReportingSection: React.FC<IncidentReportingSectionProps> = ({
  language,
  incidents,
  preselectedSubCity,
  onNewIncident,
}) => {
  const t = translations[language];

  // Form State
  const [category, setCategory] = useState<IncidentCategory>('burst');
  const [subCity, setSubCity] = useState(preselectedSubCity || 'Bole');
  const [woreda, setWoreda] = useState('Woreda 04');
  const [landmark, setLandmark] = useState('');
  const [urgency, setUrgency] = useState<IncidentUrgency>('high');
  const [reporterPhone, setReporterPhone] = useState('');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyCreatedTicket, setNewlyCreatedTicket] = useState<IncidentReport | null>(null);

  // Ticket Lookup State
  const [ticketSearch, setTicketSearch] = useState('TK-2026-AAW-1042');
  const [searchedTicket, setSearchedTicket] = useState<IncidentReport | null>(
    incidents.find((i) => i.ticketId === 'TK-2026-AAW-1042') || incidents[0]
  );

  const subCitiesList = [
    { en: 'Bole', am: 'ቦሌ' },
    { en: 'Kirkos', am: 'ቂርቆስ' },
    { en: 'Arada', am: 'አራዳ' },
    { en: 'Yeka', am: 'የካ' },
    { en: 'Lemi Kura', am: 'ለሚ ኩራ' },
    { en: 'Nifas Silk-Lafto', am: 'ንፋስ ስልክ ላፍቶ' },
    { en: 'Lideta', am: 'ልደታ' },
    { en: 'Kolfe Keranio', am: 'ኮልፌ ቀራኒዮ' },
    { en: 'Gullele', am: 'ጉለሌ' },
    { en: 'Akaky Kaliti', am: 'አቃቂ ቃሊቲ' },
    { en: 'Addis Ketema', am: 'አዲስ ከተማ' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmark || !reporterPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = onNewIncident({
        subCity,
        woreda,
        landmark,
        category,
        urgency,
        description: description || 'Citizen reported water leakage incident via AAWSA portal.',
        reporterPhone,
        lat: 9.02,
        lng: 38.75,
      });

      setNewlyCreatedTicket(created);
      setSearchedTicket(created);
      setTicketSearch(created.ticketId);
      setIsSubmitting(false);

      // Reset form fields
      setLandmark('');
      setDescription('');
    }, 1200);
  };

  const handleTicketSearch = () => {
    const found = incidents.find(
      (i) => i.ticketId.trim().toLowerCase() === ticketSearch.trim().toLowerCase()
    );
    if (found) {
      setSearchedTicket(found);
    } else {
      alert(language === 'am' ? 'የትኬት መለያው አልተገኘም። እባክዎ በትክክል ያስገቡ።' : 'Ticket ID not found. Please verify the code.');
    }
  };

  const getUrgencyBadge = (u: IncidentUrgency) => {
    switch (u) {
      case 'critical':
        return { label: language === 'am' ? 'እጅግ አስቸኳይ' : 'Critical Hazard', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'high':
        return { label: language === 'am' ? 'ከፍተኛ' : 'High Priority', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'medium':
        return { label: language === 'am' ? 'መካከለኛ' : 'Medium', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'low':
        return { label: language === 'am' ? 'ዝቅተኛ' : 'Low', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStatusStep = (status: IncidentReport['status']) => {
    switch (status) {
      case 'reported':
        return 1;
      case 'dispatched':
        return 2;
      case 'crew_on_site':
        return 3;
      case 'resolved':
        return 4;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider">
          <span>Citizen Hotlines & Rapid Response</span>
          <span aria-hidden="true">·</span>
          <span>AAWSA Emergency Desk</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
          {t.reportTitle}
        </h2>
        <p className="text-slate-600 text-xs mt-0.5 max-w-2xl">
          {t.reportSubtitle}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reporting Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{language === 'am' ? 'አዲስ የጥቆማ ቅጽ ይሙሉ' : 'Submit New Leakage or Outage Report'}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {language === 'am'
              ? 'ጥቆማው እንደደረሰ አፋጣኝ የስራ ትዕዛዝ (Ticket ID) ይወጣና የመስክ ቴክኒሻኖች ይሰማራሉ።'
              : 'Directly triggers municipal dispatch protocol. Urgent hazards are escalated within 15 minutes.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {t.incidentType}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'burst', labelEn: 'Pipe Burst / Flood', labelAm: 'የቧንቧ መሰበር / ጎርፍ' },
                  { id: 'leak', labelEn: 'Water Leakage', labelAm: 'የውሃ መፍሰስ / ብክነት' },
                  { id: 'zero_pressure', labelEn: 'Zero Pressure / Dry', labelAm: 'የውሃ መቋረጥ / ድርቀት' },
                  { id: 'contamination', labelEn: 'Discolored / Dirty', labelAm: 'የቆሸሸ ወይም ቀለም ያለው' },
                  { id: 'illegal_tap', labelEn: 'Illegal Bypass', labelAm: 'ህገ-ወጥ መስመር ጠለፋ' },
                  { id: 'open_manhole', labelEn: 'Open Sewer / Valve', labelAm: 'ክፍት ፍሳሽ ጉድጓድ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as IncidentCategory)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      category === item.id
                        ? 'border-sky-600 bg-sky-50/50 text-sky-900 font-semibold ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>{language === 'am' ? item.labelAm : item.labelEn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-city & Woreda row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.subCityLabel}
                </label>
                <select
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {subCitiesList.map((sc) => (
                    <option key={sc.en} value={sc.en}>
                      {sc.en} ({sc.am})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.woredaLabel}
                </label>
                <input
                  type="text"
                  required
                  value={woreda}
                  onChange={(e) => setWoreda(e.target.value)}
                  placeholder="e.g. Woreda 04, Block 12"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Landmark & Street */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.landmarkLabel}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Edna Mall junction, behind total station, In front of Building 14"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Urgency and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.urgencyLabel}
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-center font-medium">
                  {(['critical', 'high', 'medium', 'low'] as IncidentUrgency[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`py-1 text-[11px] rounded transition-colors uppercase ${
                        urgency === u
                          ? u === 'critical' ? 'bg-rose-600 text-white shadow-xs' :
                            u === 'high' ? 'bg-amber-600 text-white shadow-xs' :
                            'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="0911 23 45 67"
                    className="w-full pl-9 pr-3 py-2 font-mono bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.descriptionLabel}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the water flow rate, damage, or duration..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Photo Attachment Simulator */}
            <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 font-medium">
                  {hasPhoto ? 'Photo Attached: pipe_leak_evidence.jpg' : t.attachPhoto}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100 shadow-xs"
              >
                {hasPhoto ? 'Remove' : 'Simulate Camera'}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <span>Generating Workorder Ticket...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.submitReport}</span>
                </>
              )}
            </button>
          </form>

          {/* Newly created confirmation */}
          {newlyCreatedTicket && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">
                  {language === 'am' ? 'ጥቆማዎ በተሳካ ሁኔታ ተመዝግቧል!' : 'Report Dispatched to AAWSA Operations!'}
                </span>
                <span className="block mt-1">
                  Ticket Reference ID: <strong className="font-mono text-emerald-800">{newlyCreatedTicket.ticketId}</strong>
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  An SMS with this ticket reference has been queued for {newlyCreatedTicket.reporterPhone}.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Ticket Tracking & Field Ops Context */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tracking Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Search className="w-4 h-4 text-sky-600" />
              <span>{t.trackTicketTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {language === 'am' ? 'የትኬት ቁጥርዎን በማስገባት የመስክ ቴክኒሻኖችን ወቅታዊ ሁኔታ ይመልከቱ።' : 'Enter your ticket ID to monitor crew dispatch and excavation status.'}
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder={t.trackPlaceholder}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleTicketSearch}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                {t.checkStatus}
              </button>
            </div>

            {/* Ticket Progress Timeline */}
            {searchedTicket && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {searchedTicket.ticketId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getUrgencyBadge(searchedTicket.urgency).color}`}>
                    {getUrgencyBadge(searchedTicket.urgency).label}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-600">
                  <div className="font-medium text-slate-800">{searchedTicket.subCity}, {searchedTicket.woreda}</div>
                  <div className="text-slate-500 mt-0.5">{searchedTicket.landmark}</div>
                </div>

                {/* Progress Steps */}
                <div className="mt-6 relative">
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200" />
                  <div className="space-y-4 text-xs relative">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        getStatusStep(searchedTicket.status) >= 1 ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Report Logged in Dispatch Queue</div>
                        <div className="text-[11px] text-slate-500">{searchedTicket.timestamp}</div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        getStatusStep(searchedTicket.status) >= 2 ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Assigned to Field Response Crew</div>
                        <div className="text-[11px] text-slate-500">
                          {searchedTicket.assignedCrew || 'Zone Rapid Excavation Unit'}
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        getStatusStep(searchedTicket.status) >= 3 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Technicians On-Site / Excavating</div>
                        <div className="text-[11px] text-slate-500">
                          {searchedTicket.status === 'crew_on_site' ? 'Currently replacing ruptured valve section' : 'Pending site arrival'}
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        getStatusStep(searchedTicket.status) >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        4
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Repaired & Water Restored</div>
                        <div className="text-[11px] text-slate-500">
                          {searchedTicket.status === 'resolved' ? 'Certified pressure nominal' : 'Awaiting completion verification'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Field Operations Visual Card */}
          <div className="bg-slate-900 text-white rounded-xl overflow-hidden border border-slate-800 shadow-xs">
            <div className="relative h-44">
              <img
                src="/src/assets/images/field_engineer_inspection_1792581975223.jpg"
                alt="AAWSA Field Technician Inspection in Addis Ababa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                  AAWSA Field Engineering Division
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  12 Rapid Response Units on Active 24/7 Patrol
                </h4>
              </div>
            </div>
            <div className="p-4 text-xs text-slate-300 space-y-2">
              <p>
                Equipped with acoustic correlator leak detectors, high-flow dewatering pumps, and replacement ductile iron pipe stock across all Addis Ababa corridors.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Emergency Hotline: <strong className="text-cyan-300 font-mono">990</strong></span>
                <span>Average Response: <strong className="text-slate-200 font-mono">32 mins</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
