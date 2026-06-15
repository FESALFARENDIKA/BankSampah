import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Building2, Calendar, AlertTriangle, MessageSquare, BookOpen, 
  Check, X, Plus, Trash2, ShieldAlert, Sparkles, Filter, Clock, MapPin, Eye, Edit3, Upload, Send, ChevronDown, ChevronUp, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Reusable hover dropdown with delay ──────────────────────────────────────
function HoverActionMenu({ items, label = 'Respon' }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="px-2.5 py-1 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded text-[10px] font-bold transition-all flex items-center gap-1 shrink-0">
        <span>{label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-navy-800 border border-navy-600/50 rounded-lg shadow-2xl py-1 z-50 animate-slide-down">
          {items.map((item, idx) =>
            item.divider ? (
              <div key={idx} className="border-t border-navy-700 my-1" />
            ) : (
              <button
                key={idx}
                onClick={() => { item.onClick(); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] font-bold transition-colors ${item.cls}`}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('registrasi');
  const [successMessage, setSuccessMessage] = useState('');

  // User-submitted applications from LocalStorage
  const defaultApplications = [
    {
      id: 101,
      name: 'Bank Sampah Melati',
      leader: 'Budi Santoso',
      district: 'Batu',
      village: 'Pesanggrahan',
      address: 'Jl. Melati No. 12, Pesanggrahan',
      members: '24',
      status: 'Pending',
      date: '01 Jun 2026'
    },
    {
      id: 102,
      name: 'Bank Sampah Asri Jaya',
      leader: 'Siti Rahma',
      district: 'Junrejo',
      village: 'Beji',
      address: 'RT 03 RW 02, Kel. Beji',
      members: '18',
      status: 'Pending',
      date: '08 Jun 2026'
    },
    {
      id: 103,
      name: 'Bank Sampah Hijau Lestari',
      leader: 'Agus Salim',
      district: 'Bumiaji',
      village: 'Tulungrejo',
      address: 'Jl. Raya Tulungrejo No. 45',
      members: '32',
      status: 'Approved',
      date: '15 Mei 2026'
    }
  ];

  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const { data, error } = await supabase
          .from('bank_sampah_applications')
          .select('*')
          .order('id', { ascending: false });
        
        if (!error && data && data.length > 0) {
          setUserApplications(data);
          localStorage.setItem('wastebank-user-applications', JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error('Failed to fetch applications from Supabase:', err);
      }

      // Fallback
      const saved = localStorage.getItem('wastebank-user-applications');
      if (saved) {
        setUserApplications(JSON.parse(saved));
      } else {
        localStorage.setItem('wastebank-user-applications', JSON.stringify(defaultApplications));
        setUserApplications(defaultApplications);
      }
    };
    loadApps();
    window.addEventListener('applicationsChange', loadApps);
    return () => window.removeEventListener('applicationsChange', loadApps);
  }, []);

  const handleAppStatus = async (id, newStatus) => {
    const updated = userApplications.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setUserApplications(updated);
    localStorage.setItem('wastebank-user-applications', JSON.stringify(updated));
    window.dispatchEvent(new Event('applicationsChange'));

    try {
      const { error } = await supabase
        .from('bank_sampah_applications')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        const appObj = userApplications.find(a => a.id === id);
        if (appObj) {
          await supabase
            .from('bank_sampah_applications')
            .update({ status: newStatus })
            .eq('name', appObj.name);
        }
      }
    } catch (err) {
      console.error('Failed to update status in Supabase:', err);
    }
    triggerNotification(`Permohonan status diubah menjadi: ${newStatus}`);
  };

  const handleDeleteApp = async (id) => {
    const updated = userApplications.filter(a => a.id !== id);
    setUserApplications(updated);
    localStorage.setItem('wastebank-user-applications', JSON.stringify(updated));
    window.dispatchEvent(new Event('applicationsChange'));

    try {
      const { error } = await supabase
        .from('bank_sampah_applications')
        .delete()
        .eq('id', id);
      
      if (error) {
        const appObj = userApplications.find(a => a.id === id);
        if (appObj) {
          await supabase
            .from('bank_sampah_applications')
            .delete()
            .eq('name', appObj.name);
        }
      }
    } catch (err) {
      console.error('Failed to delete application in Supabase:', err);
    }
    triggerNotification(`Permohonan berhasil dihapus.`);
  };

  // Schedule edit state
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editScheduleForm, setEditScheduleForm] = useState({});

  // 1. Form State: Pendaftaran Bank Sampah Baru (Direct Form)
  const [regForm, setRegForm] = useState({
    bankName: '', district: '', village: '', address: '', postalCode: '',
    managerName: '', managerPhone: '', managerEmail: '',
    memberCount: '', established: '', description: '',
    materials: [],
  });

  const materialOptions = [
    'Plastik (PET, HDPE)', 'Kertas & Karton', 'Kaca', 
    'Logam (Aluminium, Seng)', 'Organik / Kompos', 
    'Sampah Elektronik (B3)', 'Tekstil'
  ];

  const handleMaterial = (mat) => {
    setRegForm((prev) => ({
      ...prev,
      materials: prev.materials.includes(mat)
        ? prev.materials.filter((m) => m !== mat)
        : [...prev.materials, mat],
    }));
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    if (!regForm.bankName || !regForm.district || !regForm.village || !regForm.address || !regForm.managerName || !regForm.managerPhone) {
      alert('Harap isi kolom bertanda bintang (*)!');
      return;
    }
    // Perform instant validation & mock registration
    triggerNotification(`Registrasi unit "${regForm.bankName}" berhasil disubmit dan divalidasi aktif oleh DLH!`);
    handleRegCancel();
  };

  const handleRegCancel = () => {
    setRegForm({
      bankName: '', district: '', village: '', address: '', postalCode: '',
      managerName: '', managerPhone: '', managerEmail: '',
      memberCount: '', established: '', description: '',
      materials: [],
    });
  };

  // 2. Mock State: Jadwal Pengangkutan
  const [schedules, setSchedules] = useState([
    { id: 1, title: 'Pengambilan Sampah Organik', type: 'organic', date: '2026-06-18', time: '08:00 - 11:00', district: 'Batu', location: 'Kelurahan Pesanggrahan' },
    { id: 2, title: 'Pengumpulan Plastik & Kardus', type: 'inorganic', date: '2026-06-22', time: '09:00 - 13:00', district: 'Junrejo', location: 'Kelurahan Dadaprejo' },
  ]);

  // Forms for adding schedule
  const [newSchedule, setNewSchedule] = useState({ title: '', type: 'organic', date: '', time: '08:00 - 12:00', district: 'Batu', location: '' });

  // 3. Mock State: Pengaduan Tumpukan Sampah (Aduan Warga)
  const [reports, setReports] = useState([]);
  const [guestBook, setGuestBook] = useState([]);

  useEffect(() => {
    const loadGuestbook = async () => {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('id', { ascending: false });
        
        if (!error && data) {
          setGuestBook(data);
          localStorage.setItem('wastebank-guestbook', JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error('Failed to fetch guestbook from Supabase:', err);
      }

      const saved = localStorage.getItem('wastebank-guestbook');
      if (saved) {
        setGuestBook(JSON.parse(saved));
      }
    };
    loadGuestbook();
  }, []);

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchSchedulesReportsArticles = async () => {
      try {
        const { data: scheds } = await supabase.from('schedules').select('*').order('id', { ascending: true });
        if (scheds) setSchedules(scheds);

        const { data: reps } = await supabase.from('reports').select('*').order('id', { ascending: true });
        if (reps) setReports(reps);

        const { data: arts } = await supabase.from('articles').select('*').order('id', { ascending: true });
        if (arts) setArticles(arts);
      } catch (err) {
        console.error('Failed to fetch from Supabase:', err);
      }
    };
    fetchSchedulesReportsArticles();
  }, []);

  const [newArticle, setNewArticle] = useState({ title: '', category: 'RECYCLING', date: '15 Jun 2026' });
  const [editingArticleId, setEditingArticleId] = useState(null);

  const triggerNotification = (msg) => {
    setSuccessMessage(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.title || !newSchedule.date || !newSchedule.location) {
      alert('Harap lengkapi semua bidang form!');
      return;
    }
    const newId = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
    const itemObj = { id: newId, ...newSchedule };
    setSchedules(prev => [...prev, itemObj]);

    try {
      await supabase.from('schedules').insert([{
        title: newSchedule.title,
        type: newSchedule.type,
        date: newSchedule.date,
        time: newSchedule.time,
        district: newSchedule.district,
        location: newSchedule.location
      }]);
    } catch (err) {
      console.error(err);
    }

    triggerNotification(`Jadwal pengangkutan baru berhasil ditambahkan!`);
    setNewSchedule({ title: '', type: 'organic', date: '', time: '08:00 - 12:00', district: 'Batu', location: '' });
  };

  const handleDeleteSchedule = async (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    try {
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) {
        const sObj = schedules.find(s => s.id === id);
        if (sObj) {
          await supabase.from('schedules').delete().eq('title', sObj.title);
        }
      }
    } catch (err) {
      console.error(err);
    }
    triggerNotification(`Jadwal telah dibatalkan/dihapus.`);
  };

  const handleReportStatus = async (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    try {
      const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', id);
      if (error) {
        const rObj = reports.find(r => r.id === id);
        if (rObj) {
          await supabase.from('reports').update({ status: newStatus }).eq('reporter', rObj.reporter);
        }
      }
    } catch (err) {
      console.error(err);
    }
    triggerNotification(`Laporan pengaduan diubah statusnya menjadi: ${newStatus}`);
  };

  const handleDeleteReport = async (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) {
        const rObj = reports.find(r => r.id === id);
        if (rObj) {
          await supabase.from('reports').delete().eq('reporter', rObj.reporter);
        }
      }
    } catch (err) {
      console.error(err);
    }
    triggerNotification(`Laporan pengaduan berhasil dihapus.`);
  };

  const handleDeleteGuest = async (id) => {
    const updated = guestBook.filter(g => g.id !== id);
    setGuestBook(updated);
    localStorage.setItem('wastebank-guestbook', JSON.stringify(updated));

    try {
      const { error } = await supabase.from('guestbook').delete().eq('id', id);
      if (error) {
        const gObj = guestBook.find(g => g.id === id);
        if (gObj) {
          await supabase.from('guestbook').delete().eq('message', gObj.message);
        }
      }
    } catch (err) {
      console.error(err);
    }
    triggerNotification(`Komentar buku tamu/aduan telah dihapus.`);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    if (!newArticle.title) {
      alert('Judul artikel tidak boleh kosong!');
      return;
    }

    if (editingArticleId !== null) {
      setArticles(prev => prev.map(a => a.id === editingArticleId ? { ...a, title: newArticle.title, category: newArticle.category } : a));
      try {
        const { error } = await supabase.from('articles').update({ title: newArticle.title, category: newArticle.category }).eq('id', editingArticleId);
        if (error) {
          const aObj = articles.find(a => a.id === editingArticleId);
          if (aObj) {
            await supabase.from('articles').update({ title: newArticle.title, category: newArticle.category }).eq('title', aObj.title);
          }
        }
      } catch (err) {
        console.error(err);
      }
      triggerNotification(`Artikel "${newArticle.title}" berhasil diperbarui!`);
      setEditingArticleId(null);
    } else {
      const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
      const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      setArticles(prev => [...prev, { id: newId, ...newArticle, date: formattedDate }]);
      try {
        await supabase.from('articles').insert([{
          title: newArticle.title,
          category: newArticle.category,
          date: formattedDate
        }]);
      } catch (err) {
        console.error(err);
      }
      triggerNotification(`Artikel baru tentang "${newArticle.title}" berhasil diterbitkan!`);
    }
    setNewArticle({ title: '', category: 'RECYCLING', date: '15 Jun 2026' });
  };

  const handleStartEditArticle = (art) => {
    setEditingArticleId(art.id);
    setNewArticle({
      title: art.title,
      category: art.category,
      date: art.date
    });
  };

  const handleCancelEditArticle = () => {
    setEditingArticleId(null);
    setNewArticle({ title: '', category: 'RECYCLING', date: '15 Jun 2026' });
  };

  const handleDeleteArticle = async (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    if (editingArticleId === id) {
      setEditingArticleId(null);
      setNewArticle({ title: '', category: 'RECYCLING', date: '15 Jun 2026' });
    }
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) {
        const aObj = articles.find(a => a.id === id);
        if (aObj) {
          await supabase.from('articles').delete().eq('title', aObj.title);
        }
      }
    } catch (err) {
      console.error(err);
    }
    triggerNotification(`Artikel telah dihapus dari database.`);
  };

  return (
    <div className="animate-fade-in pb-16">
      {/* Header Panel */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-3 w-fit">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs uppercase tracking-wider text-red-400 font-bold">Admin Console - DLH Batu</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Konsol Kelola Layanan Website</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola seluruh data permohonan pendaftaran, jadwal logistik penjemputan, aduan sampah liar, komentar buku tamu, dan artikel edukasi.</p>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium text-sm flex items-center gap-2 animate-slide-down">
            <Sparkles className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none border-b border-navy-700">
          {[
            { id: 'registrasi', label: 'Registrasi Unit', icon: Building2 },
            { id: 'jadwal', label: 'Jadwal Pickup', icon: Calendar },
            { id: 'aduan_bukutamu', label: 'Aduan & Buku Tamu', icon: MessageSquare, count: reports.filter(r=>r.status==='Baru').length },
            { id: 'edukasi', label: 'Artikel Edukasi', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-navy-800/50'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-navy-800/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: 1. REGISTRASI UNIT */}
        {activeTab === 'registrasi' && (
          <div className="space-y-6">

            {/* User Applications Table */}
            {userApplications.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Permohonan Masuk dari Warga</h3>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{userApplications.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-navy-700 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="pb-3">Nama Unit</th>
                        <th className="pb-3">Ketua</th>
                        <th className="pb-3">Kecamatan</th>
                        <th className="pb-3">Alamat</th>
                        <th className="pb-3">Anggota</th>
                        <th className="pb-3">Tgl Daftar</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700/50">
                      {userApplications.map(app => (
                        <tr key={app.id} className="hover:bg-navy-800/10">
                          <td className="py-3 font-bold text-white">{app.name}</td>
                          <td className="py-3 text-slate-300">{app.leader}</td>
                          <td className="py-3 text-slate-400">{app.district}</td>
                          <td className="py-3 text-slate-400 max-w-[150px] truncate" title={app.address}>{app.address}</td>
                          <td className="py-3 text-slate-400">{app.members} KK</td>
                          <td className="py-3 text-slate-500">{app.date}</td>
                          <td className="py-3">
                            <span className={`badge ${
                              app.status === 'Approved' || app.status === 'Selesai'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : app.status === 'Ditolak'
                                ? 'bg-red-500/20 text-red-400'
                                : app.status === 'Diproses' || app.status === 'Proses'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <HoverActionMenu
                                label="Respon"
                                items={[
                                  { label: 'Setuju / Selesai', cls: 'hover:bg-emerald-500/20 text-emerald-400', onClick: () => handleAppStatus(app.id, 'Approved') },
                                  { label: 'Proses',           cls: 'hover:bg-blue-500/20 text-blue-400',    onClick: () => handleAppStatus(app.id, 'Diproses') },
                                  { label: 'Tolak',            cls: 'hover:bg-red-500/20 text-red-400',      onClick: () => handleAppStatus(app.id, 'Ditolak') },
                                  { divider: true },
                                  { label: 'Reset',            cls: 'hover:bg-slate-700 text-slate-400',     onClick: () => handleAppStatus(app.id, 'Pending') },
                                ]}
                              />
                              <button onClick={()=>handleDeleteApp(app.id)} className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded transition-colors" title="Hapus">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="glass-card p-6 md:p-8">
            <div className="mb-6 border-b border-navy-700 pb-4">
              <h3 className="text-xl font-bold text-white">Formulir Pendaftaran Unit Bank Sampah Baru</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daftarkan kelompok warga, instansi, atau RT/RW sebagai unit Bank Sampah resmi DLH Kota Batu.</p>
            </div>

            <form onSubmit={handleRegSubmit} className="space-y-6">
              {/* Seksi 1: Data Bank Sampah */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Informasi Unit Bank Sampah
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Nama Unit Bank Sampah *</label>
                    <input 
                      type="text" 
                      required 
                      value={regForm.bankName} 
                      onChange={(e) => setRegForm({ ...regForm, bankName: e.target.value })} 
                      placeholder="Contoh: Bank Sampah Melati Indah" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Kecamatan *</label>
                    <select 
                      required 
                      value={regForm.district} 
                      onChange={(e) => setRegForm({ ...regForm, district: e.target.value })} 
                      className="input-field text-xs text-white"
                    >
                      <option value="">Pilih kecamatan...</option>
                      <option value="Batu">Kecamatan Batu</option>
                      <option value="Bumiaji">Kecamatan Bumiaji</option>
                      <option value="Junrejo">Kecamatan Junrejo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Kelurahan / Desa *</label>
                    <input 
                      type="text" 
                      required 
                      value={regForm.village} 
                      onChange={(e) => setRegForm({ ...regForm, village: e.target.value })} 
                      placeholder="Contoh: Pesanggrahan" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Alamat Lengkap Unit *</label>
                    <textarea 
                      rows={2} 
                      required 
                      value={regForm.address} 
                      onChange={(e) => setRegForm({ ...regForm, address: e.target.value })} 
                      placeholder="Tuliskan RT, RW, nama jalan..." 
                      className="input-field resize-none text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Kode Pos</label>
                    <input 
                      type="text" 
                      value={regForm.postalCode} 
                      onChange={(e) => setRegForm({ ...regForm, postalCode: e.target.value })} 
                      placeholder="65313" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Tanggal Berdiri</label>
                    <input 
                      type="date" 
                      value={regForm.established} 
                      onChange={(e) => setRegForm({ ...regForm, established: e.target.value })} 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 2: Informasi Ketua / Narahubung */}
              <div className="border-t border-navy-700/50 pt-5">
                <h4 className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Informasi Ketua / Pengurus
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Nama Lengkap Ketua *</label>
                    <input 
                      type="text" 
                      required 
                      value={regForm.managerName} 
                      onChange={(e) => setRegForm({ ...regForm, managerName: e.target.value })} 
                      placeholder="Nama lengkap beserta gelar jika ada" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Nomor WhatsApp / Telp *</label>
                    <input 
                      type="tel" 
                      required 
                      value={regForm.managerPhone} 
                      onChange={(e) => setRegForm({ ...regForm, managerPhone: e.target.value })} 
                      placeholder="Contoh: 081234567890" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Alamat Email Narahubung</label>
                    <input 
                      type="email" 
                      value={regForm.managerEmail} 
                      onChange={(e) => setRegForm({ ...regForm, managerEmail: e.target.value })} 
                      placeholder="contoh@domain.com" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Estimasi Jumlah Anggota (KK)</label>
                    <input 
                      type="number" 
                      value={regForm.memberCount} 
                      onChange={(e) => setRegForm({ ...regForm, memberCount: e.target.value })} 
                      placeholder="Contoh: 30" 
                      className="input-field text-xs text-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 3: Jenis Sampah yang Diterima */}
              <div className="border-t border-navy-700/50 pt-5">
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">
                  Jenis Sampah Daur Ulang yang Diterima
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {materialOptions.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => handleMaterial(mat)}
                      className={`p-2.5 rounded-lg text-xs font-semibold border transition-all text-left ${
                        regForm.materials.includes(mat)
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-navy-900/50 border-navy-600/30 text-slate-400 hover:border-navy-500'
                      }`}
                    >
                      {regForm.materials.includes(mat) ? '✓ ' : ''}{mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seksi 4: Deskripsi Tambahan */}
              <div className="border-t border-navy-700/50 pt-5">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Catatan / Keterangan Tambahan</label>
                  <textarea 
                    rows={3} 
                    value={regForm.description} 
                    onChange={(e) => setRegForm({ ...regForm, description: e.target.value })} 
                    placeholder="Tuliskan misi operasional, sarana yang dimiliki, atau keterangan lainnya..." 
                    className="input-field resize-none text-xs text-white" 
                  />
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 pt-4 border-t border-navy-700/50">
                <button 
                  type="button" 
                  onClick={handleRegCancel}
                  className="btn-outline text-xs !px-5 !py-2.5"
                >
                  Batal / Reset
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs !px-5 !py-2.5"
                >
                  <Send className="w-4 h-4" />
                  Simpan & Validasi Unit
                </button>
              </div>
            </form>
          </div>
          </div>
        )}

        {/* TAB CONTENT: 2. JADWAL PICKUP */}
        {activeTab === 'jadwal' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* List Schedule */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Daftar Pengangkutan Logistik</h3>
              <div className="space-y-4">
                {schedules.map(item => (
                  <div key={item.id} className="bg-navy-900/50 rounded-xl border border-navy-700 overflow-hidden">
                    {editingScheduleId === item.id ? (
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2"><input type="text" value={editScheduleForm.title} onChange={e=>setEditScheduleForm(p=>({...p,title:e.target.value}))} className="input-field !py-2 text-xs w-full" placeholder="Judul" /></div>
                          <input type="date" value={editScheduleForm.date} onChange={e=>setEditScheduleForm(p=>({...p,date:e.target.value}))} className="input-field !py-2 text-xs" />
                          <input type="text" value={editScheduleForm.time} onChange={e=>setEditScheduleForm(p=>({...p,time:e.target.value}))} className="input-field !py-2 text-xs" placeholder="Jam" />
                          <select value={editScheduleForm.district} onChange={e=>setEditScheduleForm(p=>({...p,district:e.target.value}))} className="input-field !py-2 text-xs">
                            <option value="Batu">Batu</option><option value="Bumiaji">Bumiaji</option><option value="Junrejo">Junrejo</option>
                          </select>
                          <input type="text" value={editScheduleForm.location} onChange={e=>setEditScheduleForm(p=>({...p,location:e.target.value}))} className="input-field !py-2 text-xs" placeholder="Lokasi" />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={()=>setEditingScheduleId(null)} className="btn-outline text-xs !py-1.5 !px-3">Batal</button>
                          <button onClick={()=>{ setSchedules(prev=>prev.map(s=>s.id===item.id?{...s,...editScheduleForm}:s)); setEditingScheduleId(null); triggerNotification('Jadwal diperbarui!'); }} className="btn-primary text-xs !py-1.5 !px-3">Simpan</button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 flex justify-between items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`badge ${item.type === 'organic' ? 'badge-emerald' : 'badge-blue'}`}>{item.type.toUpperCase()}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{item.date} • {item.time}</span>
                          </div>
                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Kecamatan {item.district} ({item.location})</span>
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={()=>{ setEditingScheduleId(item.id); setEditScheduleForm({title:item.title,date:item.date,time:item.time,district:item.district,location:item.location}); }} className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={()=>handleDeleteSchedule(item.id)} className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {schedules.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">Tidak ada jadwal pengangkutan terdaftar.</p>
                )}
              </div>
            </div>

            {/* Add Schedule Form */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-emerald-400" />
                Tambah Jadwal Baru
              </h3>
              
              <form onSubmit={handleAddSchedule} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Judul Layanan / Kegiatan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Pickup Truk Organik Kel. Beji"
                    value={newSchedule.title}
                    onChange={e => setNewSchedule(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Kategori Sampah</label>
                    <select
                      value={newSchedule.type}
                      onChange={e => setNewSchedule(prev => ({ ...prev, type: e.target.value }))}
                      className="input-field !py-2 text-xs"
                    >
                      <option value="organic">Organik</option>
                      <option value="inorganic">Anorganik</option>
                      <option value="hazardous">Bahaya (B3)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Kecamatan</label>
                    <select
                      value={newSchedule.district}
                      onChange={e => setNewSchedule(prev => ({ ...prev, district: e.target.value }))}
                      className="input-field !py-2 text-xs"
                    >
                      <option value="Batu">Batu</option>
                      <option value="Bumiaji">Bumiaji</option>
                      <option value="Junrejo">Junrejo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Tanggal</label>
                    <input 
                      type="date"
                      value={newSchedule.date}
                      onChange={e => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Jam Operasional</label>
                    <input 
                      type="text"
                      placeholder="08:00 - 12:00"
                      value={newSchedule.time}
                      onChange={e => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Kelurahan / Detail Lokasi</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: RT 02 RW 05 Kelurahan Beji"
                    value={newSchedule.location}
                    onChange={e => setNewSchedule(prev => ({ ...prev, location: e.target.value }))}
                    className="input-field !py-2 text-xs" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full btn-primary text-xs justify-center py-2.5 rounded-lg mt-2"
                >
                  Terbitkan Jadwal
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. ADUAN & BUKU TAMU (Merged Tab) */}
        {activeTab === 'aduan_bukutamu' && (
          <div className="space-y-8">
            
            {/* Section 1: Aduan Sampah Liar */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Laporan Pengaduan & Sampah Liar</h3>
                <p className="text-xs text-slate-400 mt-0.5">Tinjau aduan warga terkait tumpukan sampah liar dan kendala TPS.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-navy-700 text-slate-500 uppercase tracking-wider font-bold">
                      <th className="pb-3">Tanggal</th>
                      <th className="pb-3">Nama Pelapor</th>
                      <th className="pb-3">Kategori</th>
                      <th className="pb-3">Deskripsi Masalah</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-center">Tindakan Respon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/50 text-slate-300">
                    {reports.map(r => (
                      <tr key={r.id} className="hover:bg-navy-800/10">
                        <td className="py-4 text-slate-500 font-semibold">{r.date}</td>
                        <td className="py-4 font-bold text-white">{r.reporter}</td>
                        <td className="py-4">
                          <span className={`badge ${r.category === 'Sampah B3' ? 'badge-amber' : 'badge-red'}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="py-4 text-slate-400 max-w-xs truncate" title={r.description}>
                          {r.description}
                        </td>
                        <td className="py-4">
                          <span className={`badge ${
                            r.status === 'Selesai' || r.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : r.status === 'Diproses' || r.status === 'Proses'
                              ? 'bg-blue-500/20 text-blue-400'
                              : r.status === 'Ditolak'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <HoverActionMenu
                              label="Respon"
                              items={[
                                { label: 'Setuju / Selesai', cls: 'hover:bg-emerald-500/20 text-emerald-400', onClick: () => handleReportStatus(r.id, 'Selesai') },
                                { label: 'Proses',           cls: 'hover:bg-blue-500/20 text-blue-400',    onClick: () => handleReportStatus(r.id, 'Diproses') },
                                { label: 'Tolak',            cls: 'hover:bg-red-500/20 text-red-400',      onClick: () => handleReportStatus(r.id, 'Ditolak') },
                                { divider: true },
                                { label: 'Reset',            cls: 'hover:bg-slate-700 text-slate-400',     onClick: () => handleReportStatus(r.id, 'Baru') },
                              ]}
                            />
                            <button onClick={() => handleDeleteReport(r.id)} className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded transition-colors" title="Hapus">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Buku Tamu Digital */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Umpan Balik & Saran Buku Tamu</h3>
                <p className="text-xs text-slate-400 mt-0.5">Daftar ulasan, masukan, dan gambar pengaduan yang dikirim warga secara real-time.</p>
              </div>
              <div className="space-y-4">
                {guestBook.map(g => (
                  <div key={g.id} className="p-4 bg-navy-900/50 rounded-xl border border-navy-700 flex justify-between items-start gap-4 hover:border-navy-500/30 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-white text-sm">{g.name}</span>
                        <span className="badge-emerald text-[9px] uppercase tracking-wider">{g.category}</span>
                        {g.email && <span className="text-[10px] text-slate-500">({g.email})</span>}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{g.message}"</p>
                      
                      {/* Show Attached Image if uploaded by user */}
                      {g.image && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-navy-700 max-w-sm">
                          <img 
                            src={g.image} 
                            alt="Attachment" 
                            className="max-h-40 w-auto object-cover rounded" 
                          />
                        </div>
                      )}
                      
                      <span className="text-[9px] text-slate-600 block mt-2">{g.date}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteGuest(g.id)}
                      className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded-lg transition-colors shrink-0"
                      title="Hapus Ulasan Warga"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {guestBook.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">Buku tamu kosong.</p>
                )}
              </div>
            </div>

            {/* Section 3: Completed Reports - Pesan & Pengaduan Terbaru */}
            {reports.filter(r => r.status === 'Selesai').length > 0 && (
              <div className="glass-card p-6 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Pesan & Pengaduan Terbaru (Selesai)</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{reports.filter(r=>r.status==='Selesai').length}</span>
                </div>
                <div className="space-y-3">
                  {reports.filter(r => r.status === 'Selesai').map(r => (
                    <div key={r.id} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm">{r.reporter}</span>
                          <span className="badge badge-emerald text-[9px]">Selesai</span>
                          <span className="badge badge-red text-[9px]">{r.category}</span>
                        </div>
                        <p className="text-xs text-slate-400">{r.description}</p>
                        <span className="text-[10px] text-slate-600">{r.date}</span>
                      </div>
                      <button onClick={() => handleReportStatus(r.id, 'Diproses')} className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 rounded text-[10px] font-bold transition-all shrink-0">↩ Buka Ulang</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB CONTENT: 4. ARTIKEL EDUKASI */}
        {activeTab === 'edukasi' && (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* List Articles */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Daftar Publikasi Edukasi</h3>
              <div className="space-y-4">
                {articles.map(art => (
                  <div key={art.id} className="p-4 bg-navy-900/50 rounded-xl border border-navy-700 flex justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-emerald">{art.category}</span>
                        <span className="text-[10px] text-slate-500">{art.date}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{art.title}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleStartEditArticle(art)}
                        className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors"
                        title="Edit Artikel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add/Edit Article Form */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-1.5">
                {editingArticleId !== null ? <Edit3 className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
                {editingArticleId !== null ? 'Ubah Artikel' : 'Terbitkan Artikel Baru'}
              </h3>
              
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Judul Artikel</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Manfaat Memilah Kertas Daur Ulang"
                    value={newArticle.title}
                    onChange={e => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field !py-2 text-xs" 
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Kategori</label>
                  <select
                    value={newArticle.category}
                    onChange={e => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field !py-2 text-xs"
                  >
                    <option value="RECYCLING">Recycling (Daur Ulang)</option>
                    <option value="COMPOSTING">Composting (Pembuatan Kompos)</option>
                    <option value="REGULATIONS">Regulations (Aturan Resmi)</option>
                    <option value="HAZARDOUS">Hazardous (Bahaya/B3)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  {editingArticleId !== null && (
                    <button 
                      type="button"
                      onClick={handleCancelEditArticle}
                      className="w-1/2 btn-outline text-xs justify-center py-2.5 rounded-lg mt-2"
                    >
                      Batal
                    </button>
                  )}
                  <button 
                    type="submit"
                    className={`btn-primary text-xs justify-center py-2.5 rounded-lg mt-2 ${editingArticleId !== null ? 'w-1/2' : 'w-full'}`}
                  >
                    {editingArticleId !== null ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
