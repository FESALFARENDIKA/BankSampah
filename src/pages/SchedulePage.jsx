import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Clock, MapPin, AlertCircle, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { scheduleEvents, upcomingPickups } from '../data/scheduleData';
import { Link } from 'react-router-dom';
import { useAudience } from '../context/AudienceContext';
import ExpandableInfo from '../components/ExpandableInfo';

const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAYS_ID = ['MINGGU','SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU'];
const FILTERS = ['All','Organic','Inorganic','Hazardous'];
const FILTERS_ID = { All: 'Semua', Organic: 'Organik', Inorganic: 'Anorganik', Hazardous: 'B3 (Bahaya)' };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktobers','November','Desember'];

export default function SchedulePage() {
  const [month, setMonth] = useState(9); // October
  const [filter, setFilter] = useState('All');
  const [selectedArea, setSelectedArea] = useState('Batu');
  const { audienceMode } = useAudience();

  const daysInMonth = new Date(2023, month+1, 0).getDate();
  const firstDay = new Date(2023, month, 1).getDay();
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  
  const getEvents = (d) => scheduleEvents.filter(e => e.day===d && (filter==='All' || e.type===filter.toLowerCase()));
  const badge = { ORGANIC: 'badge-emerald', INORGANIC: 'badge-blue', HAZARDOUS: 'badge-amber' };

  // Demographic content adapters
  const getHeadlines = () => {
    switch (audienceMode) {
      case 'anak':
        return {
          title: "Kalender Misi Hijau 📅🌟",
          subtitle: "Catat hari penjemputan sampahmu dan kumpulkan poin daur ulang sebanyak-banyaknya!",
          areaLabel: "Pilih Rumahmu:",
        };
      case 'lansia':
        return {
          title: "JADWAL PENJEMPUTAN SAMPAH KOTA BATU",
          subtitle: "Periksa hari dan jam kedatangan armada kebersihan DLH di wilayah RT/RW Anda.",
          areaLabel: "Pilih Wilayah Kecamatan:",
        };
      case 'pemerintah':
        return {
          title: "Kalender Retribusi & Jadwal Logistik Persampahan",
          subtitle: "Jadwal operasional pengangkutan truk sampah terpadu (organik, anorganik, residu) tingkat kecamatan.",
          areaLabel: "Pilih Lokasi Wilayah:",
        };
      default:
        return {
          title: "Jadwal Pengambilan Sampah",
          subtitle: "Lihat jadwal kedatangan truk pengangkut sampah terpilah di lingkungan Anda.",
          areaLabel: "Pilih Area Wilayah:",
        };
    }
  };

  const labels = getHeadlines();

  return (
    <div className="animate-fade-in pb-16">
      {/* Header Panel */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-2.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Logistik DLH Batu</span>
              </div>
              <h1 className="text-3xl font-bold text-white leading-tight">{labels.title}</h1>
              <p className="text-slate-400 mt-1 text-sm">{labels.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">{labels.areaLabel}</span>
                <select 
                  value={selectedArea}
                  onChange={e=>setSelectedArea(e.target.value)}
                  className="input-field !w-auto !py-2 text-xs"
                >
                  <option value="Batu">Kecamatan Batu</option>
                  <option value="Bumiaji">Kecamatan Bumiaji</option>
                  <option value="Junrejo">Kecamatan Junrejo</option>
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Filter Kategori:</span>
                <div className="flex">
                  {FILTERS.map(f => (
                    <button 
                      key={f} 
                      onClick={()=>setFilter(f)} 
                      className={`px-3 py-2 text-[10px] font-bold border first:rounded-l-lg last:rounded-r-lg transition-all ${
                        filter===f
                          ? 'bg-emerald-500 text-navy-950 border-emerald-500'
                          : 'bg-navy-800 text-slate-400 border-navy-600 hover:text-white'
                      }`}
                    >
                      {audienceMode === 'anak' && f === 'All' ? "Semua 🏡" : FILTERS_ID[f] || f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Schedule Display */}
          <div className="lg:col-span-2 glass-card p-6">
            
            {/* SENIOR MODE VIEW: Offers a simplified, high-contrast text table list instead of a dense grid calendar */}
            {audienceMode === 'lansia' ? (
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-navy-600/30 pb-4">
                  <h2 className="text-2xl font-extrabold text-yellow-300">Daftar Jadwal - {MONTHS_ID[month]} 2023</h2>
                  <div className="flex gap-2">
                    <button onClick={()=>setMonth(p=>Math.max(0,p-1))} className="btn-primary !py-1.5 !px-3 font-extrabold text-base">Sebelumnya</button>
                    <button onClick={()=>setMonth(p=>Math.min(11,p+1))} className="btn-primary !py-1.5 !px-3 font-extrabold text-base">Berikutnya</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {scheduleEvents.filter(e => filter === 'All' || e.type === filter.toLowerCase()).map((ev, i) => (
                    <div key={i} className="p-4 bg-navy-950 border-2 border-yellow-300 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="text-yellow-300 font-extrabold text-lg uppercase tracking-wide">
                          Tanggal {ev.day} {MONTHS_ID[month]} 2023
                        </div>
                        <div className="text-white text-base mt-1">
                          Kategori: <strong className="text-emerald-400">{ev.type.toUpperCase()}</strong>
                        </div>
                        <div className="text-slate-300 text-sm mt-0.5">
                          Kecamatan: {selectedArea}
                        </div>
                      </div>
                      <div className="flex items-center justify-start sm:justify-end">
                        <span className="bg-emerald-800 text-white font-extrabold px-3 py-1.5 rounded border border-white text-sm">
                          Armada Siaga
                        </span>
                      </div>
                    </div>
                  ))}
                  {scheduleEvents.filter(e => filter === 'All' || e.type === filter.toLowerCase()).length === 0 && (
                    <div className="p-6 text-center text-slate-300">
                      Tidak ada jadwal penjemputan terdaftar untuk filter kategori ini.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // GENERAL / KIDS / GOV VIEW: Calendar Grid Layout
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{audienceMode === 'anak' ? `Bulan ${MONTHS_ID[month]} 🌟` : `${MONTHS_ID[month]} 2023`}</h2>
                    <div className="flex gap-1">
                      <button onClick={()=>setMonth(p=>Math.max(0,p-1))} className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"><ChevronLeft className="w-4 h-4"/></button>
                      <button onClick={()=>setMonth(p=>Math.min(11,p+1))} className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"><ChevronRight className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <button className="btn-outline !py-2 text-xs font-semibold"><Calendar className="w-4 h-4"/>Berlangganan Kalender (ICS)</button>
                </div>

                <div className="grid grid-cols-7 gap-px bg-navy-600/20 rounded-xl overflow-hidden border border-navy-600/30">
                  {DAYS_ID.map(d => (
                    <div key={d} className="bg-navy-800/80 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.substring(0,3)}</div>
                  ))}
                  {cells.map((d,i) => {
                    const ev = d ? getEvents(d) : [];
                    const isToday = d === 8;
                    return (
                      <div 
                        key={i} 
                        className={`bg-navy-800/20 min-h-[90px] p-2 hover:bg-navy-700/20 transition-colors flex flex-col justify-between ${!d ? 'opacity-25' : ''} ${isToday ? 'ring-2 ring-emerald-500/50 bg-emerald-500/5' : ''}`}
                      >
                        {d && (
                          <>
                            <span className={`text-xs ${isToday ? 'text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded' : 'text-slate-300'}`}>{d}</span>
                            {ev.length > 0 && (
                              <div className="space-y-1 mt-2">
                                {ev.map((e, j) => (
                                  <div key={j} className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${e.color}`} />
                                    <span className="text-[9px] text-slate-300 font-medium truncate hidden md:block">
                                      {audienceMode === 'anak' && e.type === 'organic' ? '🍌 Organik' : audienceMode === 'anak' && e.type === 'inorganic' ? '🍼 Botol' : e.type}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area: Upcoming Pickups & Instructions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Penjemputan Terdekat</h3>
              </div>
              <div className="space-y-4">
                {upcomingPickups.filter(p => p.district.toLowerCase().includes(selectedArea.toLowerCase()) || selectedArea === 'Batu').map(p => (
                  <div key={p.id} className="glass-card p-4 hover:border-emerald-500/20 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className={badge[p.type]}>{p.type}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{p.timing}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-2">{p.title}</h4>
                    
                    <div className="space-y-1 text-slate-300 text-xs">
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0"/>
                        <span>{p.time} ({p.date})</span>
                      </p>
                      <p className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0"/>
                        <span className="truncate">{p.location}</span>
                      </p>
                    </div>

                    <div className="mt-3 p-2 bg-amber-500/5 rounded border border-amber-500/10 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0"/>
                      <span className="text-[10px] text-amber-400/90 leading-tight">{p.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Guideline with ExpandableInfo modal to keep layout tidy */}
            <div className="glass-card p-5 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                {audienceMode === 'anak' ? "Siapkan Sampahmu! 🎒" : "Panduan Persiapan Penjemputan"}
              </h4>
              
              <ExpandableInfo
                title="Panduan Persiapan Sebelum Truk Sampah Datang"
                shortText={audienceMode === 'anak' ? "Ayo pelajari cara menyusun botol dan plastik di rumah sebelum disetor ke petugas!" : "Pastikan sampah anorganik Anda disortir dan dibersihkan dengan benar agar lancar saat ditimbang."}
                buttonText={audienceMode === 'anak' ? "Baca Petunjuk Seru! 🧩" : "Baca Panduan Persiapan"}
                useModal={true}
              >
                <div className="space-y-4">
                  <h4 className="font-bold text-emerald-400 text-sm">Ketentuan Persiapan Daur Ulang:</h4>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <p><strong>1. Kering & Bersih:</strong> Bilas botol plastik, cup plastik, kaleng bekas, atau sisa susu/sirup agar tidak berbau dan mengundang lalat.</p>
                    <p><strong>2. Lipat & Pipihkan:</strong> Lipat box karton susu, kardus mie, dan kemasan kertas tebal lainnya secara datar guna menghemat tempat pengangkutan.</p>
                    <p><strong>3. Kumpulkan & Ikat:</strong> Satukan sampah sejenis (misal: botol plastik PET bening tersendiri, botol berwarna tersendiri, kardus tersendiri) lalu ikat rapi.</p>
                    <p><strong>4. Tempatkan Di Depan Rumah:</strong> Letakkan kantong sampah terpilah di depan pagar rumah atau gudang unit Bank Sampah 30 menit sebelum jadwal penjemputan truk operasional DLH.</p>
                  </div>
                  <div className="p-3 bg-navy-950/60 rounded border border-navy-600/30 text-[10px] text-slate-400">
                    *Truk operasional tidak berhak memungut biaya retribusi tambahan dari nasabah Bank Sampah resmi.
                  </div>
                </div>
              </ExpandableInfo>

              <div className="mt-4 pt-3 border-t border-navy-600/20 text-center">
                <Link to="/education-guidelines" className="text-emerald-400 text-xs font-bold inline-flex items-center gap-1 hover:underline">
                  Pelajari Lebih Lanjut <ArrowRight className="w-3 h-3"/>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
