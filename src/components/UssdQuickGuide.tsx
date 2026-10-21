import React, { useState } from 'react';
import { Smartphone, Check, ArrowRight, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface UssdQuickGuideProps {
  language: Language;
}

export const UssdQuickGuide: React.FC<UssdQuickGuideProps> = ({ language }) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [ussdInput, setUssdInput] = useState('*804#');
  const [screen, setScreen] = useState<'dialer' | 'menu' | 'subcity_select' | 'bill_result'>('dialer');
  const [ussdChoice, setUssdChoice] = useState('');

  const handleDial = (e: React.FormEvent) => {
    e.preventDefault();
    if (ussdInput.includes('804') || ussdInput.includes('127')) {
      setScreen('menu');
    }
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ussdChoice === '1') {
      setScreen('subcity_select');
    } else if (ussdChoice === '2') {
      setScreen('bill_result');
    } else {
      setScreen('menu');
    }
    setUssdChoice('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-xl p-6 sm:p-8 border border-sky-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Smartphone className="w-4 h-4" />
            <span>Ethio Telecom & AAWSA Offline Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {t.ussdGuide}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {t.ussdSubtitle}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-cyan-200">
            <span>Dial: <strong>*804#</strong></span>
            <span>·</span>
            <span>Alternative: <strong>*127*4#</strong></span>
            <span>·</span>
            <span>Toll-Free Helpline: <strong>990</strong></span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsOpen(true);
            setScreen('dialer');
          }}
          className="px-5 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap shadow-xs flex items-center gap-2 shrink-0"
        >
          <Smartphone className="w-4 h-4 text-sky-700" />
          <span>{language === 'am' ? 'የUSSD መሞከሪያ ክፈት (*804#)' : 'Try *804# USSD Simulator'}</span>
        </button>
      </div>

      {/* Interactive Feature-Phone USSD Simulator Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                ETHIO TELECOM · USSD
              </span>
            </div>

            {/* Simulated Phone Screen */}
            <div className="mt-4 bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 font-mono text-emerald-400 text-xs min-h-[220px] flex flex-col justify-between">
              {screen === 'dialer' && (
                <form onSubmit={handleDial} className="h-full flex flex-col justify-between">
                  <div>
                    <div className="text-center text-slate-400 text-[11px] mb-2">Dial AAWSA Shortcode</div>
                    <input
                      type="text"
                      value={ussdInput}
                      onChange={(e) => setUssdInput(e.target.value)}
                      className="w-full text-center text-xl font-bold bg-transparent text-emerald-300 focus:outline-none border-b border-emerald-500/40 py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs mt-4"
                  >
                    SEND (DIAL)
                  </button>
                </form>
              )}

              {screen === 'menu' && (
                <form onSubmit={handleMenuSubmit} className="space-y-3">
                  <div className="text-[11px] text-emerald-200">
                    AAWSA SMART WATER:<br />
                    1. Water Rationing Schedule<br />
                    2. Check Monthly Bill<br />
                    3. Report Emergency Leak<br />
                    4. Emergency Tanker Contact
                  </div>
                  <div className="pt-2">
                    <input
                      type="number"
                      autoFocus
                      placeholder="Enter choice (1-4)"
                      value={ussdChoice}
                      onChange={(e) => setUssdChoice(e.target.value)}
                      className="w-full px-2 py-1 bg-black/40 border border-emerald-500/40 rounded text-emerald-300 text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-600 text-slate-950 font-bold rounded text-[11px] mt-2"
                    >
                      SUBMIT
                    </button>
                  </div>
                </form>
              )}

              {screen === 'subcity_select' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-emerald-200">
                    BOLE SUB-CITY:<br />
                    Status: FLOWING ACTIVE<br />
                    Schedule: Tue, Thu, Sat<br />
                    Pressure: 2.8 bar (Nominal)<br />
                    Supply ends: 22:00
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreen('menu')}
                    className="w-full py-1.5 bg-emerald-600 text-slate-950 font-bold rounded text-[11px]"
                  >
                    BACK TO MENU
                  </button>
                </div>
              )}

              {screen === 'bill_result' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-emerald-200">
                    CUSTOMER: AAWSA-90421<br />
                    METER: MTR-ET-849201<br />
                    CONSUMPTION: 22 m³<br />
                    TOTAL DUE: 584.80 ETB<br />
                    Pay via Telebirr or *127#
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreen('menu')}
                    className="w-full py-1.5 bg-emerald-600 text-slate-950 font-bold rounded text-[11px]"
                  >
                    BACK TO MENU
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-[10px] text-slate-500">
              Works across all GSM 2G / 3G / 4G handsets in Ethiopia
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
