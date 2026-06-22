import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, ChevronRight, Phone, MessageCircle, Navigation, ArrowLeft, Download, BarChart2, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import WasteBreakdown from '../components/WasteBreakdown';

const districts = ['All Areas', 'Batu', 'Bumiaji', 'Junrejo'];

function parseCoordinates(coordinates) {
  if (!coordinates) return null;
  const normalized = String(coordinates).trim().replace(/,/g, ';').replace(/\s+/g, ' ');
  const matches = normalized.match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 2) return null;
  const lat = parseFloat(matches[0]);
  const lng = parseFloat(matches[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return [lat, lng];
}

export default function DirectoryPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Areas');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');

  // Map Refs
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bank_sampah')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data) {
          setBanks(data);
        }
      } catch (err) {
        console.error('Failed to load bank sampah:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  // Filter Logic
  const filtered = banks.filter((bank) => {
    // Status filter
    const statusValue = bank.status ? String(bank.status).trim() : '';
    const matchStatus = selectedStatus === 'All' || statusValue === selectedStatus;

    const districtText = (bank.district || bank.address || '').toLowerCase();
    const matchDistrict = selectedDistrict === 'All Areas' ||
      districtText.includes(selectedDistrict.toLowerCase()) ||
      (bank.code && bank.code.toLowerCase().startsWith(selectedDistrict.substring(0, 3).toLowerCase())) ||
      (bank.address && bank.address.toLowerCase().includes(selectedDistrict.toLowerCase()));

    const searchTarget = `${bank.name || ''} ${bank.address || ''} ${bank.manager || ''} ${bank.code || ''}`.toLowerCase();
    const matchSearch = searchTarget.includes(searchQuery.toLowerCase());

    return matchDistrict && matchSearch && matchStatus;
  });

  // Initialize Map
  useEffect(() => {
    if (!window.L) return;

    if (!leafletMapRef.current) {
      leafletMapRef.current = window.L.map('map-container').setView([-7.8716, 112.5267], 12);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    filtered.forEach(bank => {
      const coords = parseCoordinates(bank.coordinates);
      if (!coords) return;
      // Create colored icon based on status
      const statusValue = String(bank.status || 'Unknown');
      const statusColorMap = {
        Aktif: '#10b981',
        'Tidak Aktif': '#f59e0b',
        Dihapus: '#ef4444',
        Digabung: '#3b82f6'
      };
      const color = statusColorMap[statusValue] || '#8b5cf6';

      const customIcon = window.L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 10px; font-weight: bold;">♻️</span></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = window.L.marker([coords[0], coords[1]], { icon: customIcon })
          .addTo(leafletMapRef.current)
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 2px;">
              <b style="color: #0f172a; font-size: 13px;">${bank.name}</b><br/>
              <span style="font-size: 11px; color: #475569;">${bank.address}</span><br/>
              <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; font-size: 10px; font-weight: bold; border-radius: 4px; color: white; background-color: ${color}">
                Status: ${bank.status}
              </span>
            </div>
          `);

        marker._bankId = bank.id; // Assign bank ID to marker for list-click synchronization

        marker.on('click', () => {
          setSelectedBank(bank);
        });

        markersRef.current.push(marker);
    });

  }, [filtered, banks]);

  // Center on selected bank
  useEffect(() => {
    if (selectedBank && leafletMapRef.current) {
      // Find corresponding marker and trigger openPopup
      const marker = markersRef.current.find(m => m._bankId === selectedBank.id);
      if (marker) {
        marker.openPopup();
      }
      
      let coordsValid = false;
      const coords = parseCoordinates(selectedBank.coordinates);
      if (coords && coords.length === 2) {
        leafletMapRef.current.setView([coords[0], coords[1]], 15);
        coordsValid = true;
      }

      if (!coordsValid) {
        setErrorNotification(`Unit "${selectedBank.name}" tidak dapat terlihat di peta.`);
        setTimeout(() => setErrorNotification(''), 4000);
      }
    }
  }, [selectedBank]);

  // Calculate Statistics for Charts
  const stats = {
    total: filtered.length,
    active: filtered.filter(b => b.status === 'Aktif').length,
    vakum: filtered.filter(b => b.status === 'Vakum').length,
    inactive: filtered.filter(b => b.status === 'Tidak Aktif').length,
    totalVolume: filtered.reduce((acc, b) => acc + (parseFloat(b.volume) || 0), 0),
    avgVolume: filtered.length > 0 ? (filtered.reduce((acc, b) => acc + (parseFloat(b.volume) || 0), 0) / filtered.length).toFixed(1) : 0,
  };

  // District distribution
  const districtVolume = {
    Batu: filtered.filter(b => b.address.toLowerCase().includes('batu') || (b.code && b.code.startsWith('BAT'))).reduce((acc, b) => acc + (parseFloat(b.volume) || 0), 0),
    Bumiaji: filtered.filter(b => b.address.toLowerCase().includes('bumiaji') || (b.code && b.code.startsWith('BUM'))).reduce((acc, b) => acc + (parseFloat(b.volume) || 0), 0),
    Junrejo: filtered.filter(b => b.address.toLowerCase().includes('junrejo') || (b.code && b.code.startsWith('JUN'))).reduce((acc, b) => acc + (parseFloat(b.volume) || 0), 0),
  };

  const handleDownloadCSV = () => {
    const headers = ['Kode', 'Nama BSU', 'Status', 'Alamat', 'Pengurus', 'Jenis Sampah', 'Titik Koordinat', 'Kontak', 'Nomor SK', 'Volume Rata-rata (kg/bulan)', 'Jumlah Nasabah (KK)'];
    const rows = filtered.map(b => [
      b.code,
      b.name,
      b.status,
      b.address,
      b.manager,
      Array.isArray(b.materials) ? b.materials.join('; ') : b.accepted_materials || b.waste_types || '-',
      b.coordinates,
      b.phone,
      b.sk_number,
      b.volume,
      b.members
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Bank_Sampah_DLH_Batu_${selectedDistrict.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // Build simple printable HTML table with current filtered data
    const headers = ['Kode', 'Nama BSU', 'Status', 'Alamat', 'Pengurus', 'Jenis Sampah', 'Koordinat', 'Kontak', 'Volume (kg)', 'Nasabah'];
    const rows = filtered.map(b => [
      b.code,
      b.name,
      b.status,
      b.address,
      b.manager,
      Array.isArray(b.materials) ? b.materials.join('; ') : b.accepted_materials || b.waste_types || '-',
      b.coordinates,
      b.phone,
      b.volume,
      b.members
    ]);
    let html = `<!doctype html><html><head><meta charset="utf-8"><title>Export Direktori Bank Sampah</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#064e3b}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#05a86b;color:#fff}</style></head><body>`;
    html += `<h2>Direktori Bank Sampah - DLH Kota Batu</h2>`;
    html += '<table><thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    rows.forEach(r => { html += '<tr>' + r.map(c => `<td>${String(c || '')}</td>`).join('') + '</tr>'; });
    html += '</tbody></table>';
    html += '<p style="margin-top:16px;font-size:12px;color:#475569">Generated from WasteBank platform</p>';
    html += '</body></html>';
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      // give browser a moment then call print
      setTimeout(() => { win.print(); }, 300);
    } else {
      alert('Pop-up blocked. Izinkan pop-up untuk mengunduh PDF.');
    }
  };

  return (
    <div className="animate-fade-in bg-white">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)] lg:overflow-hidden">

        {/* MAP PANEL */}
        <div className="lg:w-[40%] bg-slate-100 relative h-72 lg:h-full border-r border-slate-200 shrink-0 order-1 lg:order-none">
          {errorNotification && (
            <div className="absolute top-4 left-4 right-4 bg-red-600/95 text-white px-4 py-3 rounded-lg shadow-lg z-[2000] text-xs font-bold flex items-center gap-2 border border-red-500/30 animate-slide-down">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorNotification}</span>
            </div>
          )}
          <div id="map-container" className="w-full h-full z-10" style={{ minHeight: '100%' }} />
        </div>

        {/* DIRECTORY PANEL */}
        <div className="lg:w-[35%] bg-white border-r border-slate-200 flex flex-col h-[500px] lg:h-full overflow-hidden shrink-0 order-3 lg:order-none">

          {/* Header & Controls */}
          <div className="p-5 border-b border-slate-200 bg-emerald-50/20">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-1">
                  ♻️ DIREKTORI BANK SAMPAH
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Dinas Lingkungan Hidup Kota Batu</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowChart(!showChart)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${showChart ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  title="Tampilkan Grafik Analisis"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Grafik</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  disabled={filtered.length === 0}
                  className="p-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={filtered.length === 0}
                  className="p-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Export PDF / Print"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7M7 7l5 5 5-5" /></svg>
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3 font-semibold">
              Menampilkan {filtered.length} unit dari total {banks.length} bank sampah terdaftar.
            </p>

            {/* Search */}
            <div className="relative mb-3.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama BSU, alamat, pengurus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field !pl-10 !py-2 text-xs"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-900 font-bold">Status:</span>
                {['All','Aktif','Dihapus','Tidak Aktif','Digabung'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${selectedStatus === s
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-emerald-200 text-slate-700 bg-white hover:border-emerald-500'
                      }`}
                  >
                    {s === 'All' ? 'Semua' : s}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-900 font-bold">Wilayah:</span>
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${selectedDistrict === d
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-emerald-200 text-slate-700 bg-white hover:border-emerald-500'
                      }`}
                  >
                    {d === 'All Areas' ? 'Semua Wilayah' : `Kec. ${d}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List or Chart representation */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-semibold">Memuat data dari database Supabase...</div>
            ) : showChart ? (
              // VISUAL CHARTS
              <div className="p-5 space-y-6 animate-fade-in">
                {/* 1. Status Ratio */}
                <div className="glass-card p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Distribusi Status Operasional</h3>
                  <div className="space-y-2">
                    {/* Progress Bar Status */}
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
                      <div style={{ width: `${(stats.active / stats.total || 0) * 100}%` }} className="bg-emerald-500 h-full" title="Aktif" />
                      <div style={{ width: `${(stats.vakum / stats.total || 0) * 100}%` }} className="bg-amber-500 h-full" title="Vakum" />
                      <div style={{ width: `${(stats.inactive / stats.total || 0) * 100}%` }} className="bg-slate-400 h-full" title="Tidak Aktif" />
                    </div>
                    <div className="grid grid-cols-3 text-center text-[10px] font-bold mt-2">
                      <div>
                        <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full mr-1" />
                        <span>Aktif: {stats.active}</span>
                      </div>
                      <div>
                        <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full mr-1" />
                        <span>Vakum: {stats.vakum}</span>
                      </div>
                      <div>
                        <span className="inline-block w-2.5 h-2.5 bg-slate-400 rounded-full mr-1" />
                        <span>Tidak Aktif: {stats.inactive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Volume per District Chart */}
                <div className="glass-card p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Volume Rata-rata per Kecamatan (Kg/Bulan)</h3>
                  <div className="space-y-3 pt-2">
                    {Object.entries(districtVolume).map(([distName, vol]) => {
                      const maxVol = Math.max(...Object.values(districtVolume)) || 1;
                      const percent = ((vol / maxVol) * 100).toFixed(0);
                      return (
                        <div key={distName} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600">
                            <span>Kecamatan {distName}</span>
                            <span>{vol.toLocaleString('id-ID')} Kg/bln</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div style={{ width: `${percent}%` }} className="bg-emerald-600 h-full rounded-full" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Summary metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Volume</p>
                    <p className="text-lg font-extrabold text-emerald-700">{stats.totalVolume.toLocaleString('id-ID')} <span className="text-xs text-slate-500">kg</span></p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Rata-rata/Unit</p>
                    <p className="text-lg font-extrabold text-emerald-700">{stats.avgVolume} <span className="text-xs text-slate-500">kg</span></p>
                  </div>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold">Tidak ada unit bank sampah yang cocok dengan filter.</div>
            ) : (
              // BANK SAMPAH LIST
              <div>
                {filtered.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-emerald-50/10 transition-all ${selectedBank?.id === bank.id ? 'bg-emerald-50/40 border-l-4 border-l-emerald-600' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${bank.status === 'Aktif'
                            ? 'bg-emerald-500 text-white'
                            : bank.status === 'Vakum'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-400 text-white'
                          }`}>
                          {bank.status === 'Aktif' ? 'Aktif' : bank.status === 'Vakum' ? 'Vakum' : 'Tutup'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">ID: {bank.code}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs">{bank.name}</h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{bank.address}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-bold">
                      <span>👤 {bank.manager || 'No manager'}</span>
                      <span>📞 {bank.phone || 'No phone'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className={`lg:w-[25%] bg-slate-50 border-l border-slate-200 overflow-y-auto order-2 lg:order-none ${selectedBank ? 'block' : 'hidden lg:block'}`}>
          {selectedBank ? (
            <div className="animate-fade-in">
              {/* Header Details */}
              <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white relative">
                <button
                  onClick={() => setSelectedBank(null)}
                  className="absolute top-4 left-4 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-white/25 rounded tracking-wider">
                      {selectedBank.status}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-100">KODE: {selectedBank.code}</span>
                  </div>
                  <h2 className="text-lg font-extrabold leading-tight text-white">{selectedBank.name}</h2>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Contact Actions */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${selectedBank.phone}`}
                    className="flex-1 btn-outline justify-center !px-3 !py-2 text-xs font-bold border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Hubungi</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedBank.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-primary justify-center !px-3 !py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Address */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-700 font-bold uppercase tracking-wider mb-0.5">Alamat Lengkap</p>
                      <p className="text-xs text-slate-900 font-medium leading-relaxed">{selectedBank.address}</p>
                    </div>
                  </div>
                </div>

                {/* SK Number */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Nomor SK DLH Terbaru</p>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">{selectedBank.sk_number || 'Belum Terbit/Sedang Proses'}</p>
                    </div>
                  </div>
                </div>

                {/* Manager / Contact Person */}
                <div className="glass-card p-4">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ketua / Pengurus Unit</p>
                  <p className="text-xs text-slate-800 font-bold">{selectedBank.manager || 'Belum terdaftar'}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Narahubung: {selectedBank.phone || '-'}</p>
                </div>

                {/* Waste Types */}
                <div className="glass-card p-4">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Jenis Sampah Diterima</p>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {Array.isArray(selectedBank.materials) ? selectedBank.materials.join(', ') : selectedBank.accepted_materials || selectedBank.waste_types || 'Belum tersedia'}
                  </p>
                </div>

                {/* Coordinates */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Koordinat</p>
                      {selectedBank.coordinates ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBank.coordinates)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-700 font-semibold hover:text-emerald-900"
                        >
                          {selectedBank.coordinates}
                        </a>
                      ) : (
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">Belum tersedia</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="glass-card p-4 bg-emerald-50/20">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Volume & Partisipasi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Rata-rata/Bulan</p>
                      <p className="text-base font-extrabold text-emerald-700">{parseFloat(selectedBank.volume || 0).toLocaleString('id-ID')} <span className="text-xs text-slate-500 font-normal">kg</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Nasabah Aktif</p>
                      <p className="text-base font-extrabold text-emerald-700">{selectedBank.members || 0} <span className="text-xs text-slate-500 font-normal">KK</span></p>
                    </div>
                  </div>
                </div>

                {/* Breakdown of waste types (from localStorage if present) */}
                <div className="glass-card p-4">
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3">Jenis Sampah Masuk</h3>
                  <WasteBreakdown bankId={selectedBank.id} bank={selectedBank} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center min-h-[250px]">
              <div>
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-bold text-xs">Pilih Unit Bank Sampah</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto">Klik salah satu unit pada daftar sebelah kiri atau klik marker pada peta untuk detail lengkap.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
