import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, X, HelpCircle, BookOpen } from 'lucide-react';
import { useAudience } from '../context/AudienceContext';

/**
 * ExpandableInfo Component
 * @param {string} title - Title of the section / modal
 * @param {string} shortText - Text shown initially
 * @param {React.ReactNode} children - Detailed rich content (HTML/React elements) shown in modal or when expanded
 * @param {boolean} useModal - If true, opens a premium detailed modal. If false, expands inline.
 * @param {string} buttonText - Custom button label
 */
export default function ExpandableInfo({ title, shortText, children, useModal = false, buttonText = "Informasi Tambahan" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { audienceMode } = useAudience();

  // Custom styling based on audience mode
  const getButtonClass = () => {
    switch (audienceMode) {
      case 'anak':
        return 'bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs py-2 px-4 rounded-full inline-flex items-center gap-1.5 transition-all shadow-md';
      case 'lansia':
        return 'bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold text-lg py-3 px-6 border-2 border-white rounded-lg inline-flex items-center gap-2 transition-all';
      case 'pemerintah':
        return 'bg-navy-700 hover:bg-navy-600 text-blue-300 font-semibold text-xs py-1.5 px-3 border border-blue-500/30 rounded inline-flex items-center gap-1.5 transition-all';
      default:
        return 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium text-xs py-1.5 px-3 rounded-lg border border-emerald-500/20 inline-flex items-center gap-1.5 transition-all';
    }
  };

  const getHeaderClass = () => {
    switch (audienceMode) {
      case 'anak': return 'text-xl font-bold text-amber-400';
      case 'lansia': return 'text-2xl font-extrabold text-yellow-300';
      case 'pemerintah': return 'text-lg font-bold text-slate-100';
      default: return 'text-lg font-semibold text-white';
    }
  };

  return (
    <div className="w-full mt-3">
      {/* Short Text Description */}
      <p className={`text-slate-400 leading-relaxed ${audienceMode === 'lansia' ? 'text-white font-semibold' : 'text-sm'}`}>
        {shortText}
      </p>

      {/* Toggle Button */}
      <div className="mt-3 flex items-center">
        {useModal ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className={getButtonClass()}
            aria-label={`Buka ${title}`}
          >
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{buttonText}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={getButtonClass()}
            aria-label={isExpanded ? "Tutup detail" : "Buka detail"}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                <span>Sembunyikan</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Inline Expansion */}
      {!useModal && isExpanded && (
        <div className="mt-4 p-4 rounded-xl bg-navy-900/60 border border-navy-600/20 animate-slide-down">
          <div className={`prose prose-invert max-w-none text-slate-300 ${audienceMode === 'lansia' ? 'text-white' : 'text-sm'}`}>
            {children}
          </div>
        </div>
      )}

      {/* Premium Modal Popup */}
      {useModal && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div 
            className={`w-full max-w-2xl bg-navy-900 border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
              audienceMode === 'anak' 
                ? 'border-amber-400/40 rounded-3xl bg-[#072516]' 
                : audienceMode === 'lansia'
                ? 'border-yellow-300 border-4 bg-[#000000]'
                : 'border-navy-600/50'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-navy-600/30">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-5 h-5 ${audienceMode === 'anak' ? 'text-amber-400' : audienceMode === 'lansia' ? 'text-yellow-300' : 'text-emerald-400'}`} />
                <h3 className={getHeaderClass()}>{title}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  audienceMode === 'lansia' 
                    ? 'bg-yellow-300 text-black hover:bg-yellow-400 font-extrabold border-2 border-white' 
                    : 'bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white'
                }`}
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 leading-relaxed flex-1 min-h-0">
              <div className={`prose prose-invert max-w-none ${audienceMode === 'lansia' ? 'text-white font-bold text-lg' : 'text-sm text-slate-300'}`}>
                {children}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-navy-600/30 bg-navy-950/40 flex justify-end shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  audienceMode === 'anak'
                    ? 'bg-amber-400 text-emerald-950 hover:bg-amber-500 font-bold rounded-full'
                    : audienceMode === 'lansia'
                    ? 'bg-yellow-300 text-black hover:bg-yellow-400 font-extrabold border-2 border-white text-lg'
                    : 'bg-navy-800 hover:bg-navy-700 text-slate-200'
                }`}
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
