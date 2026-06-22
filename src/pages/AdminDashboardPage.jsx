import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Building2, Calendar, AlertTriangle, MessageSquare, BookOpen, 
  Check, X, Plus, Trash2, ShieldAlert, Sparkles, Filter, Clock, MapPin, Edit3, Send, ChevronDown, Users, Search, Save, RotateCcw
} from 'lucide-react';

const confirmMessage = {
  deleteReport: 'Hapus laporan pengaduan ini secara permanen?',
  deleteGuest: 'Hapus ulasan buku tamu ini?',
  deleteApp: 'Hapus permohonan ini?',
};

import { supabase } from '../lib/supabase';

// ── Action Dropdown Menu Component ──────────────────────────────────────────
function HoverActionMenu({ items, label = 'Respon' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="px-2.5 py-1 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded text-[10px] font-bold transition-all flex items-center gap-1 shrink-0"
      >
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

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('bank_sampah');
  const [successMessage, setSuccessMessage] = useState('');

  // ────────────────────────────────────────────────────────────────────────────
  // STATE DEFINITIONS
  // ────────────────────────────────────────────────────────────────────────────
  const [userApplications, setUserApplications] = useState([]);
  const [bankSampahList, setBankSampahList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [reports, setReports] = useState([]);
  const [guestBook, setGuestBook] = useState([]);
  const [articles, setArticles] = useState([]);
  const [permohonanList, setPermohonanList] = useState([]);


  // Form State: unified Bank Sampah (Add / New)
  const [newBank, setNewBank] = useState({
    code: '', name: '', address: '', district: 'Batu', established: '',
    manager: '', phone: '', members: '', sk_number: '', status: 'Aktif',
    plastic: '', paper: '', iron: '', bottle: '', glass: '', oil: ''
  });

  // Edit State: Bank Sampah Modal
  const [editingBankId, setEditingBankId] = useState(null);
  const [editBankForm, setEditBankForm] = useState({
    code: '', name: '', address: '', district: 'Batu', established: '',
    manager: '', phone: '', members: '', sk_number: '', status: 'Aktif',
    plastic: '', paper: '', iron: '', bottle: '', glass: '', oil: ''
  });

  // Edit State: Schedule
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editScheduleForm, setEditScheduleForm] = useState({});

  // New Schedule State
  const [newSchedule, setNewSchedule] = useState({ title: '', type: 'organic', date: '', time: '08:00 - 12:00', district: 'Batu', location: '' });

  // Article Form State
  const [newArticle, setNewArticle] = useState({ title: '', category: 'RECYCLING', date: '15 Jun 2026' });
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [viewingApplication, setViewingApplication] = useState(null);

  // ────────────────────────────────────────────────────────────────────────────
  // SEARCH & FILTER STATES
  // ────────────────────────────────────────────────────────────────────────────
  const [filterBankDistrict, setFilterBankDistrict] = useState('All');
  const [filterBankStatus, setFilterBankStatus] = useState('All');
  const [searchBankQuery, setSearchBankQuery] = useState('');

  const [filterSchedDistrict, setFilterSchedDistrict] = useState('All');
  const [filterSchedType, setFilterSchedType] = useState('All');
  const [searchSchedQuery, setSearchSchedQuery] = useState('');

  const [filterAduanStatus, setFilterAduanStatus] = useState('All');
  const [filterAduanCategory, setFilterAduanCategory] = useState('All');
  const [searchAduanQuery, setSearchAduanQuery] = useState('');

  const [filterArticleCategory, setFilterArticleCategory] = useState('All');
  const [searchArticleQuery, setSearchArticleQuery] = useState('');

  // ────────────────────────────────────────────────────────────────────────────
  // NOTIFICATION TRIGGER
  // ────────────────────────────────────────────────────────────────────────────
  const triggerNotification = (msg) => {
    setSuccessMessage(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // SUPABASE DATA FETCHING
  // ────────────────────────────────────────────────────────────────────────────
  const fetchBankSampah = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bank_sampah')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) {
        setBankSampahList(data);
      }
    } catch (err) {
      console.error('Failed to fetch bank sampah:', err);
    }
  }, []);

  const handleExportBanksCSV = () => {
    const saved = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
    const headers = ['Kode','Nama','Status','Penanggung Jawab','Nasabah','JenisPlastik','JenisKertas','JenisBesi','JenisBotol','JenisBeling','JenisMinyak','Volume','Alamat','Phone'];
    const rows = bankSampahList.map(b => {
      const br = saved[b.id] || {};
      return [b.code, b.name, b.status, b.manager || '', b.members || 0, br.plastic || 0, br.paper || 0, br.iron || 0, br.bottle || 0, br.glass || 0, br.oil || 0, b.volume || 0, b.address || '', b.phone || ''];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `All_BankSampah_DLHBatu.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bank_sampah_applications')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data) {
        setUserApplications(data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  }, []);

  const fetchSchedulesReportsArticles = useCallback(async () => {
    try {

      const { data: scheds } = await supabase.from('schedules').select('*').order('date', { ascending: true });
      if (scheds) setSchedules(scheds);

      const { data: reps } = await supabase.from('reports').select('*').order('id', { ascending: false });
      if (reps) setReports(reps);

      const { data: arts } = await supabase.from('articles').select('*').order('id', { ascending: false });
      if (arts) setArticles(arts);
    } catch (err) {
      console.error('Failed to fetch schedules/reports/articles:', err);
    }
  }, []);

  const loadGuestbook = useCallback(async () => {

    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data) {
        setGuestBook(data);
      }
    } catch (err) {
      console.error('Failed to fetch guestbook:', err);
    }
  }, []);

  const loadPermohonan = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('permohonan')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPermohonanList(data);
    } catch (err) {
      console.error('Failed to fetch permohonan:', err);
    }
  }, []);

  useEffect(() => {
    fetchBankSampah();
    loadApplications();
    fetchSchedulesReportsArticles();
    loadGuestbook();
    loadPermohonan();

    window.addEventListener('applicationsChange', loadApplications);
    window.addEventListener('guestbookChange', loadGuestbook);
    window.addEventListener('permohonanChange', loadPermohonan);
    return () => {
      window.removeEventListener('applicationsChange', loadApplications);
      window.removeEventListener('guestbookChange', loadGuestbook);
      window.removeEventListener('permohonanChange', loadPermohonan);
    };
  }, [fetchBankSampah, loadApplications, fetchSchedulesReportsArticles, loadGuestbook, loadPermohonan]);

  // ────────────────────────────────────────────────────────────────────────────
  // BANK SAMPAH CRUD OPERATIONS
  // ────────────────────────────────────────────────────────────────────────────
  const handleAddBankSampah = async (e) => {
    e.preventDefault();
    if (!newBank.code || !newBank.name || !newBank.address) {
      alert('Harap lengkapi Kode, Nama BSU, dan Alamat!');
      return;
    }

    // Calculate sum of waste types
    const sumVolume = 
      (parseFloat(newBank.plastic) || 0) + 
      (parseFloat(newBank.paper) || 0) + 
      (parseFloat(newBank.iron) || 0) + 
      (parseFloat(newBank.bottle) || 0) + 
      (parseFloat(newBank.glass) || 0) + 
      (parseFloat(newBank.oil) || 0);

    const fullAddress = newBank.address.toLowerCase().includes(newBank.district.toLowerCase())
      ? newBank.address
      : `${newBank.address}, Kec. ${newBank.district}`;

    try {
      const { data, error } = await supabase
        .from('bank_sampah')
        .insert([{
          code: newBank.code,
          name: newBank.name,
          status: newBank.status || 'Aktif',
          address: fullAddress,
          manager: newBank.manager,
          coordinates: '-7.8716;112.5267', // default coordinate
          phone: newBank.phone,
          sk_number: newBank.sk_number,
          volume: sumVolume,
          members: parseInt(newBank.members) || 0,
          is_custom: true
        }])
        .select();

      if (error) {
        alert('Gagal menambah bank sampah: ' + error.message);
        return;
      }

      // Save breakdowns in LocalStorage
      if (data && data.length > 0) {
        const savedBreakdowns = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
        savedBreakdowns[data[0].id] = {
          established: newBank.established,
          plastic: newBank.plastic || '0',
          paper: newBank.paper || '0',
          iron: newBank.iron || '0',
          bottle: newBank.bottle || '0',
          glass: newBank.glass || '0',
          oil: newBank.oil || '0'
        };
        localStorage.setItem('bank_sampah_breakdowns', JSON.stringify(savedBreakdowns));
      }

      triggerNotification(`Unit Bank Sampah "${newBank.name}" berhasil didaftarkan secara resmi!`);
      setNewBank({
        code: '', name: '', address: '', district: 'Batu', established: '',
        manager: '', phone: '', members: '', sk_number: '', status: 'Aktif',
        plastic: '', paper: '', iron: '', bottle: '', glass: '', oil: ''
      });
      fetchBankSampah();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditBank = (bank) => {
    setEditingBankId(bank.id);
    const savedBreakdowns = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
    const b = savedBreakdowns[bank.id] || {};
    
    // Extract address clean of district suffix if possible
    let cleanAddress = bank.address;
    if (cleanAddress.toLowerCase().includes(', kec. ')) {
      cleanAddress = cleanAddress.substring(0, cleanAddress.toLowerCase().lastIndexOf(', kec. '));
    }

    setEditBankForm({
      code: bank.code || '',
      name: bank.name || '',
      address: cleanAddress,
      district: bank.address.toLowerCase().includes('bumiaji') ? 'Bumiaji' : bank.address.toLowerCase().includes('junrejo') ? 'Junrejo' : 'Batu',
      established: b.established || '',
      manager: bank.manager || '',
      phone: bank.phone || '',
      members: bank.members || '',
      sk_number: bank.sk_number || '',
      status: bank.status || 'Aktif',
      plastic: b.plastic || '',
      paper: b.paper || '',
      iron: b.iron || '',
      bottle: b.bottle || '',
      glass: b.glass || '',
      oil: b.oil || ''
    });
  };

  const handleUpdateBankSampah = async (e) => {
    e.preventDefault();
    const sumVolume = 
      (parseFloat(editBankForm.plastic) || 0) + 
      (parseFloat(editBankForm.paper) || 0) + 
      (parseFloat(editBankForm.iron) || 0) + 
      (parseFloat(editBankForm.bottle) || 0) + 
      (parseFloat(editBankForm.glass) || 0) + 
      (parseFloat(editBankForm.oil) || 0);

    const fullAddress = editBankForm.address.toLowerCase().includes(editBankForm.district.toLowerCase())
      ? editBankForm.address
      : `${editBankForm.address}, Kec. ${editBankForm.district}`;

    try {
      const { error } = await supabase
        .from('bank_sampah')
        .update({
          code: editBankForm.code,
          name: editBankForm.name,
          status: editBankForm.status,
          address: fullAddress,
          manager: editBankForm.manager,
          phone: editBankForm.phone,
          sk_number: editBankForm.sk_number,
          volume: sumVolume,
          members: parseInt(editBankForm.members) || 0
        })
        .eq('id', editingBankId);

      if (error) {
        alert('Gagal memperbarui data: ' + error.message);
        return;
      }

      // Save breakdowns
      const savedBreakdowns = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
      savedBreakdowns[editingBankId] = {
        established: editBankForm.established,
        plastic: editBankForm.plastic || '0',
        paper: editBankForm.paper || '0',
        iron: editBankForm.iron || '0',
        bottle: editBankForm.bottle || '0',
        glass: editBankForm.glass || '0',
        oil: editBankForm.oil || '0'
      };
      localStorage.setItem('bank_sampah_breakdowns', JSON.stringify(savedBreakdowns));

      triggerNotification(`Data Bank Sampah "${editBankForm.name}" berhasil diperbarui!`);
      setEditingBankId(null);
      fetchBankSampah();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBankSampah = async (id, name) => {
    if (!confirm(`Hapus Bank Sampah "${name}" secara permanen dari database?`)) return;
    try {
      const { error } = await supabase
        .from('bank_sampah')
        .delete()
        .eq('id', id);
      if (error) {
        alert('Gagal menghapus data: ' + error.message);
        return;
      }
      triggerNotification(`Bank Sampah "${name}" berhasil dihapus.`);
      fetchBankSampah();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAppStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('bank_sampah_applications')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) {
        alert('Gagal mengubah status permohonan: ' + error.message);
        return;
      }
      triggerNotification(`Permohonan status diubah menjadi: ${newStatus}`);
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApp = async (id) => {
    if (!confirm(confirmMessage.deleteApp)) return;
    try {
      const { error } = await supabase

        .from('bank_sampah_applications')
        .delete()
        .eq('id', id);
      if (error) {
        alert('Gagal menghapus permohonan: ' + error.message);
        return;
      }
      triggerNotification('Permohonan pendaftaran warga berhasil dihapus.');
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // JADWAL PICKUP OPERATIONS
  // ────────────────────────────────────────────────────────────────────────────
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.title || !newSchedule.date || !newSchedule.location) {
      alert('Harap lengkapi judul, tanggal, dan lokasi!');
      return;
    }
    try {
      const { error } = await supabase.from('schedules').insert([{
        title: newSchedule.title,
        type: newSchedule.type,
        date: newSchedule.date,
        time: newSchedule.time,
        district: newSchedule.district,
        location: newSchedule.location
      }]);
      if (error) {
        alert('Gagal menambahkan jadwal: ' + error.message);
        return;
      }
      triggerNotification(`Jadwal pengangkutan baru berhasil ditambahkan!`);
      setNewSchedule({ title: '', type: 'organic', date: '', time: '08:00 - 12:00', district: 'Batu', location: '' });
      fetchSchedulesReportsArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSchedule = async (id) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({
          title: editScheduleForm.title,
          date: editScheduleForm.date,
          time: editScheduleForm.time,
          district: editScheduleForm.district,
          location: editScheduleForm.location
        })
        .eq('id', id);

      if (error) {
        alert('Gagal memperbarui jadwal: ' + error.message);
        return;
      }
      setEditingScheduleId(null);
      triggerNotification('Jadwal pengangkutan berhasil diperbarui!');
      fetchSchedulesReportsArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!confirm('Batalkan dan hapus jadwal pengangkutan ini?')) return;
    try {
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus jadwal: ' + error.message);
        return;
      }
      triggerNotification(`Jadwal telah dihapus.`);
      fetchSchedulesReportsArticles();
    } catch (err) {
      console.error(err);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ADUAN & GUESTBOOK OPERATIONS
  // ────────────────────────────────────────────────────────────────────────────
  const handleReportStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', id);
      if (error) {
        alert('Gagal merubah status aduan: ' + error.message);
        return;
      }
      triggerNotification(`Laporan pengaduan diubah statusnya menjadi: ${newStatus}`);
      fetchSchedulesReportsArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!confirm(confirmMessage.deleteReport)) return;
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);

      if (error) {
        alert('Gagal menghapus laporan: ' + error.message);
        return;
      }
      triggerNotification(`Laporan pengaduan berhasil dihapus.`);
      fetchSchedulesReportsArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGuest = async (id) => {
    if (!confirm(confirmMessage.deleteGuest)) return;
    try {
      const { error } = await supabase.from('guestbook').delete().eq('id', id);

      if (error) {
        alert('Gagal menghapus ulasan: ' + error.message);
        return;
      }
      triggerNotification(`Komentar buku tamu berhasil dihapus.`);
      loadGuestbook();
    } catch (err) {
      console.error(err);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ARTIKEL EDUKASI OPERATIONS
  // ────────────────────────────────────────────────────────────────────────────
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    if (!newArticle.title) {
      alert('Judul artikel tidak boleh kosong!');
      return;
    }

    if (editingArticleId !== null) {
      try {
        const { error } = await supabase
          .from('articles')
          .update({ title: newArticle.title, category: newArticle.category })
          .eq('id', editingArticleId);
        if (error) {
          alert('Gagal mengupdate artikel: ' + error.message);
          return;
        }
        triggerNotification(`Artikel "${newArticle.title}" berhasil diperbarui!`);
        setEditingArticleId(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      try {
        const { error } = await supabase.from('articles').insert([{
          title: newArticle.title,
          category: newArticle.category,
          date: formattedDate
        }]);
        if (error) {
          alert('Gagal menerbitkan artikel: ' + error.message);
          return;
        }
        triggerNotification(`Artikel baru tentang "${newArticle.title}" berhasil diterbitkan!`);
      } catch (err) {
        console.error(err);
      }
    }
    setNewArticle({ title: '', category: 'RECYCLING', date: '15 Jun 2026' });
    fetchSchedulesReportsArticles();
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Hapus artikel edukasi ini secara permanen?')) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus artikel: ' + error.message);
        return;
      }
      triggerNotification(`Artikel berhasil dihapus dari database.`);
      fetchSchedulesReportsArticles();
    } catch (err) {
      console.error(err);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ────────────────────────────────────────────────────────────────────────────
  const filteredBanks = bankSampahList.filter(b => {
    const matchDistrict = filterBankDistrict === 'All' || b.address.toLowerCase().includes(filterBankDistrict.toLowerCase());
    const matchStatus = filterBankStatus === 'All' || b.status === filterBankStatus;
    const matchSearch = searchBankQuery === '' || 
      b.name.toLowerCase().includes(searchBankQuery.toLowerCase()) || 
      b.code.toLowerCase().includes(searchBankQuery.toLowerCase()) || 
      (b.manager && b.manager.toLowerCase().includes(searchBankQuery.toLowerCase()));
    return matchDistrict && matchStatus && matchSearch;
  });

  const filteredApps = userApplications.filter(a => {
    const matchDistrict = filterBankDistrict === 'All' || a.district.toLowerCase() === filterBankDistrict.toLowerCase();
    const matchStatus = filterBankStatus === 'All' || a.status === filterBankStatus;
    const matchSearch = searchBankQuery === '' || 
      a.name.toLowerCase().includes(searchBankQuery.toLowerCase()) ||
      (a.leader && a.leader.toLowerCase().includes(searchBankQuery.toLowerCase()));
    return matchDistrict && matchStatus && matchSearch;
  });

  const filteredSchedules = schedules.filter(s => {
    const matchDistrict = filterSchedDistrict === 'All' || s.district.toLowerCase() === filterSchedDistrict.toLowerCase();
    const matchType = filterSchedType === 'All' || s.type === filterSchedType;
    const matchSearch = searchSchedQuery === '' || s.title.toLowerCase().includes(searchSchedQuery.toLowerCase()) || s.location.toLowerCase().includes(searchSchedQuery.toLowerCase());
    return matchDistrict && matchType && matchSearch;
  });

  const filteredReports = reports.filter(r => {
    const matchStatus = filterAduanStatus === 'All' || r.status === filterAduanStatus;
    const matchCategory = filterAduanCategory === 'All' || r.category === filterAduanCategory;
    const matchSearch = searchAduanQuery === '' || r.reporter.toLowerCase().includes(searchAduanQuery.toLowerCase()) || r.description.toLowerCase().includes(searchAduanQuery.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const filteredGuestbook = guestBook.filter(g => {
    const matchSearch = searchAduanQuery === '' || g.name.toLowerCase().includes(searchAduanQuery.toLowerCase()) || g.message.toLowerCase().includes(searchAduanQuery.toLowerCase());
    return matchSearch;
  });

  const filteredArticles = articles.filter(a => {
    const matchCategory = filterArticleCategory === 'All' || a.category === filterArticleCategory;
    const matchSearch = searchArticleQuery === '' || a.title.toLowerCase().includes(searchArticleQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="animate-fade-in pb-16">
      {/* Header Console */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-3 w-fit">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs uppercase tracking-wider text-red-400 font-bold">Admin Console - DLH Batu</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Konsol Kelola Layanan Website</h1>
          <p className="text-slate-300 mt-1 text-sm">Kelola data terintegrasi bank sampah, jadwal penjemputan logistik, aduan warga, serta artikel edukasi.</p>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Banner Success */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium text-sm flex items-center gap-2 animate-slide-down">
            <Sparkles className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none border-b border-navy-700">
          {[
            { id: 'bank_sampah', label: 'Bank Sampah', icon: Building2 },
            { id: 'jadwal', label: 'Jadwal Pickup', icon: Calendar },
            { id: 'aduan_bukutamu', label: 'Buku Tamu (Ulasan,Permohonan,Aduan)', icon: MessageSquare, count: reports.filter(r=>r.status==='Baru').length },
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

        {/* ────────────────────────────────────────────────────────────────────
            TAB CONTENT: BANK SAMPAH (Consolidated)
            ──────────────────────────────────────────────────────────────────── */}
        {activeTab === 'bank_sampah' && (
          <div className="space-y-8 animate-fade-in">
            {/* Filter Panel for Bank Sampah */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari BSU, Kode, Ketua..." 
                  value={searchBankQuery}
                  onChange={e => setSearchBankQuery(e.target.value)}
                  className="input-field !pl-10 !py-2 text-xs text-white w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Filter:</span>
                </div>
                <select 
                  value={filterBankDistrict} 
                  onChange={e => setFilterBankDistrict(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-32"
                >
                  <option value="All">Semua Kec.</option>
                  <option value="Batu">Kec. Batu</option>
                  <option value="Bumiaji">Kec. Bumiaji</option>
                  <option value="Junrejo">Kec. Junrejo</option>
                </select>
                <select 
                  value={filterBankStatus} 
                  onChange={e => setFilterBankStatus(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-32"
                >
                  <option value="All">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Vakum">Vakum</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                  <option value="Pending">Pending (Warga)</option>
                  <option value="Approved">Approved (Warga)</option>
                </select>
              </div>
            </div>

            {/* Sub-section: Warga Applications */}
            {filteredApps.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Permohonan Registrasi Unit Baru (dari Warga)</h3>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{filteredApps.length}</span>
                </div>
                <div className="max-h-[200px] overflow-y-auto border border-navy-700/50 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-950/60 sticky top-0 z-10">
                      <tr className="border-b border-navy-700 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                        <th className="p-3">Nama Unit</th>
                        <th className="p-3">Ketua</th>
                        <th className="p-3">Kecamatan</th>
                        <th className="p-3">Alamat</th>
                        <th className="p-3">Anggota</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Aksi Respon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700/40">
                      {filteredApps.map(app => (
                        <tr key={app.id} className="hover:bg-navy-800/10 transition-colors">
                          <td className="p-3 font-bold text-white">{app.name}</td>
                          <td className="p-3 text-slate-300">{app.leader}</td>
                          <td className="p-3 text-slate-400">Kec. {app.district}</td>
                          <td className="p-3 text-slate-400 max-w-[150px] truncate" title={app.address}>{app.address}</td>
                          <td className="p-3 text-slate-400">{app.members} KK</td>
                          <td className="p-3">
                            <span className={`badge ${
                              app.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 
                              app.status === 'Ditolak' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <HoverActionMenu
                                label="Respon"
                                items={[
                                  { label: 'Detail',  cls: 'hover:bg-slate-700 text-slate-400',    onClick: () => setViewingApplication(app) },
                                  { label: 'Setujui', cls: 'hover:bg-emerald-500/20 text-emerald-400', onClick: () => handleAppStatus(app.id, 'Approved') },
                                  { label: 'Tolak',   cls: 'hover:bg-red-500/20 text-red-400',      onClick: () => handleAppStatus(app.id, 'Ditolak') },
                                  { divider: true },
                                  { label: 'Hapus',   cls: 'hover:bg-slate-700 text-slate-400',     onClick: () => handleDeleteApp(app.id) },
                                ]}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* List & Form Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Database Bank Sampah Table list */}
              <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-4 border-b border-navy-700 pb-3">
                  <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-emerald-400" /> Database BSU Terdaftar
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{filteredBanks.length} Unit</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={handleExportBanksCSV} className="btn-outline text-xs">Export All CSV</button>
                  </div>
                </div>
                <div className="max-h-[350px] overflow-y-auto border border-navy-700/50 rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-navy-950/60 sticky top-0 z-10">
                      <tr className="border-b border-navy-700 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                        <th className="p-3">Kode BSU</th>
                        <th className="p-3">Nama Unit</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Penanggung Jawab</th>
                        <th className="p-3">Nasabah</th>
                        <th className="p-3">Jenis</th>
                        <th className="p-3">Volume (kg)</th>
                        <th className="p-3 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700/40">
                      {filteredBanks.map(bank => (
                        <tr key={bank.id} className="hover:bg-navy-800/10 transition-colors">
                          <td className="p-3 font-mono font-bold text-emerald-400">{bank.code}</td>
                          <td className="p-3 font-semibold text-white max-w-[150px] truncate" title={bank.name}>{bank.name}</td>
                          <td className="p-3">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              bank.status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-400' :
                              bank.status === 'Vakum' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                            }`}>
                              {bank.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">{bank.manager || '-'}</td>
                          <td className="p-3 text-slate-400">{bank.members || 0} KK</td>
                          <td className="p-3 text-slate-400">
                            {(() => {
                              const saved = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
                              const b = saved[bank.id] || {};
                              const types = ['plastic','paper','iron','bottle','glass','oil'];
                              return types.filter(t => parseFloat(b[t] || 0) > 0).length;
                            })()}
                          </td>
                          <td className="p-3 font-bold text-slate-200">{parseFloat(bank.volume || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3 text-center">
                            <div className="flex gap-1.5 justify-center">
                              <button 
                                onClick={() => handleStartEditBank(bank)} 
                                className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-emerald-400 rounded transition-colors" 
                                title="Edit BSU"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBankSampah(bank.id, bank.name)} 
                                className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded transition-colors" 
                                title="Hapus BSU"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBanks.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-6 text-slate-500">Tidak ada data bank sampah cocok filter.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Input: Pendaftaran & Tambah BSU Baru */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-navy-700 pb-2 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" /> Penambahan Bank Sampah Baru
                </h3>
                <form onSubmit={handleAddBankSampah} className="space-y-4">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Nomor Induk BSU *</label>
                    <input 
                      type="text" 
                      required 
                      value={newBank.code}
                      onChange={e => setNewBank({ ...newBank, code: e.target.value })}
                      placeholder="Contoh: JUN-01-001" 
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Nama Bank Sampah *</label>
                    <input 
                      type="text" 
                      required 
                      value={newBank.name}
                      onChange={e => setNewBank({ ...newBank, name: e.target.value })}
                      placeholder="Contoh: Bank Sampah Mandiri" 
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Kecamatan *</label>
                      <select 
                        value={newBank.district}
                        onChange={e => setNewBank({ ...newBank, district: e.target.value })}
                        className="input-field !py-2 text-xs"
                      >
                        <option value="Batu">Batu</option>
                        <option value="Bumiaji">Bumiaji</option>
                        <option value="Junrejo">Junrejo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Tahun Berdiri</label>
                      <input 
                        type="number" 
                        value={newBank.established}
                        onChange={e => setNewBank({ ...newBank, established: e.target.value })}
                        placeholder="Contoh: 2015" 
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Lokasi Alamat Lengkap *</label>
                    <textarea 
                      rows={2} 
                      required 
                      value={newBank.address}
                      onChange={e => setNewBank({ ...newBank, address: e.target.value })}
                      placeholder="Jl. Ir. Soekarno Gg II No.2, RT 01 RW 01, Kel. Dadaprejo" 
                      className="input-field !py-2 text-xs resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Penanggung Jawab *</label>
                      <input 
                        type="text" 
                        required 
                        value={newBank.manager}
                        onChange={e => setNewBank({ ...newBank, manager: e.target.value })}
                        placeholder="Nama ketua" 
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Telp. Penganggung Jawab *</label>
                      <input 
                        type="text" 
                        required 
                        value={newBank.phone}
                        onChange={e => setNewBank({ ...newBank, phone: e.target.value })}
                        placeholder="85791210270" 
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">Jumlah Nasabah (KK)</label>
                      <input 
                        type="number" 
                        value={newBank.members}
                        onChange={e => setNewBank({ ...newBank, members: e.target.value })}
                        placeholder="133" 
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">NO SK Resmi</label>
                      <input 
                        type="text" 
                        value={newBank.sk_number}
                        onChange={e => setNewBank({ ...newBank, sk_number: e.target.value })}
                        placeholder="041/38/422.320.1/2015" 
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                  </div>

                  {/* Volume breakdown inputs */}
                  <div className="border-t border-navy-700/50 pt-3">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">Jenis Sampah Masuk Rata-rata (KG / Liter)</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Plastik (kg)</label>
                        <input type="number" placeholder="14100" value={newBank.plastic} onChange={e => setNewBank({...newBank, plastic: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Kertas (kg)</label>
                        <input type="number" placeholder="20100" value={newBank.paper} onChange={e => setNewBank({...newBank, paper: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Besi & Logam</label>
                        <input type="number" placeholder="20500" value={newBank.iron} onChange={e => setNewBank({...newBank, iron: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Botol (kg)</label>
                        <input type="number" placeholder="7900" value={newBank.bottle} onChange={e => setNewBank({...newBank, bottle: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Beling (kg)</label>
                        <input type="number" placeholder="1600" value={newBank.glass} onChange={e => setNewBank({...newBank, glass: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Minyak (L)</label>
                        <input type="number" placeholder="600" value={newBank.oil} onChange={e => setNewBank({...newBank, oil: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full btn-primary text-xs justify-center py-2.5 rounded-lg font-bold"
                  >
                    <Send className="w-4 h-4" /> Simpan ke Database
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            TAB CONTENT: JADWAL PICKUP
            ──────────────────────────────────────────────────────────────────── */}
        {activeTab === 'jadwal' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filters */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari lokasi, judul jadwal..." 
                  value={searchSchedQuery}
                  onChange={e => setSearchSchedQuery(e.target.value)}
                  className="input-field !pl-10 !py-2 text-xs text-white w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Filter:</span>
                </div>
                <select 
                  value={filterSchedDistrict} 
                  onChange={e => setFilterSchedDistrict(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-32"
                >
                  <option value="All">Semua Kec.</option>
                  <option value="Batu">Kec. Batu</option>
                  <option value="Bumiaji">Kec. Bumiaji</option>
                  <option value="Junrejo">Kec. Junrejo</option>
                </select>
                <select 
                  value={filterSchedType} 
                  onChange={e => setFilterSchedType(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-32"
                >
                  <option value="All">Semua Kategori</option>
                  <option value="organic">Organik</option>
                  <option value="inorganic">Anorganik</option>
                  <option value="hazardous">Bahaya (B3)</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* List Schedules */}
              <div className="lg:col-span-2 glass-card p-6">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-navy-700 pb-2">Daftar Pengangkutan Logistik</h3>
                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                  {filteredSchedules.map(item => (
                    <div key={item.id} className="bg-navy-900/40 rounded-xl border border-navy-700 overflow-hidden">
                      {editingScheduleId === item.id ? (
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <input 
                                type="text" 
                                value={editScheduleForm.title} 
                                onChange={e => setEditScheduleForm(p => ({ ...p, title: e.target.value }))} 
                                className="input-field !py-2 text-xs w-full" 
                                placeholder="Judul" 
                              />
                            </div>
                            <input type="date" value={editScheduleForm.date} onChange={e => setEditScheduleForm(p => ({ ...p, date: e.target.value }))} className="input-field !py-2 text-xs" />
                            <input type="text" value={editScheduleForm.time} onChange={e => setEditScheduleForm(p => ({ ...p, time: e.target.value }))} className="input-field !py-2 text-xs" placeholder="Jam" />
                            <select value={editScheduleForm.district} onChange={e => setEditScheduleForm(p => ({ ...p, district: e.target.value }))} className="input-field !py-2 text-xs">
                              <option value="Batu">Batu</option>
                              <option value="Bumiaji">Bumiaji</option>
                              <option value="Junrejo">Junrejo</option>
                            </select>
                            <input type="text" value={editScheduleForm.location} onChange={e => setEditScheduleForm(p => ({ ...p, location: e.target.value }))} className="input-field !py-2 text-xs" placeholder="Lokasi" />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingScheduleId(null)} className="btn-outline text-xs !py-1.5 !px-3 rounded">Batal</button>
                            <button onClick={() => handleUpdateSchedule(item.id)} className="btn-primary text-xs !py-1.5 !px-3 rounded">Simpan</button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 flex justify-between items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`badge ${item.type === 'organic' ? 'badge-emerald' : 'badge-blue'}`}>{item.type.toUpperCase()}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{item.date} • {item.time}</span>
                            </div>
                            <h4 className="font-bold text-white text-xs">{item.title}</h4>
                            <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>Kecamatan {item.district} ({item.location})</span>
                            </p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button 
                              onClick={() => { 
                                setEditingScheduleId(item.id); 
                                setEditScheduleForm({ title: item.title, date: item.date, time: item.time, district: item.district, location: item.location }); 
                              }} 
                              className="p-1.5 bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSchedule(item.id)} 
                              className="p-1.5 bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredSchedules.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-6">Tidak ada jadwal pengangkutan terdaftar.</p>
                  )}
                </div>
              </div>

              {/* Add Schedule Form */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-navy-700 pb-2 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" /> Tambah Jadwal Baru
                </h3>
                <form onSubmit={handleAddSchedule} className="space-y-4">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Judul Layanan / Kegiatan</label>
                    <input 
                      type="text" 
                      placeholder="Truk Pickup Kel. Beji"
                      value={newSchedule.title}
                      onChange={e => setNewSchedule(p => ({ ...p, title: e.target.value }))}
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Kategori</label>
                      <select
                        value={newSchedule.type}
                        onChange={e => setNewSchedule(p => ({ ...p, type: e.target.value }))}
                        className="input-field !py-2 text-xs"
                      >
                        <option value="organic">Organik</option>
                        <option value="inorganic">Anorganik</option>
                        <option value="hazardous">Bahaya (B3)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Kecamatan</label>
                      <select
                        value={newSchedule.district}
                        onChange={e => setNewSchedule(p => ({ ...p, district: e.target.value }))}
                        className="input-field !py-2 text-xs"
                      >
                        <option value="Batu">Batu</option>
                        <option value="Bumiaji">Bumiaji</option>
                        <option value="Junrejo">Junrejo</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Tanggal</label>
                      <input 
                        type="date"
                        value={newSchedule.date}
                        onChange={e => setNewSchedule(p => ({ ...p, date: e.target.value }))}
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Jam Operasional</label>
                      <input 
                        type="text"
                        placeholder="08:00 - 12:00"
                        value={newSchedule.time}
                        onChange={e => setNewSchedule(p => ({ ...p, time: e.target.value }))}
                        className="input-field !py-2 text-xs" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Kelurahan / Detail Lokasi</label>
                    <input 
                      type="text" 
                      placeholder="RT 02 RW 05 Kelurahan Beji"
                      value={newSchedule.location}
                      onChange={e => setNewSchedule(p => ({ ...p, location: e.target.value }))}
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary text-xs justify-center py-2.5 rounded-lg font-bold">
                    Terbitkan Jadwal
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            TAB CONTENT: ADUAN & BUKU TAMU
            ──────────────────────────────────────────────────────────────────── */}
        {activeTab === 'aduan_bukutamu' && (
          <div className="space-y-8 animate-fade-in">
            {/* Filter Search */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari nama, aduan, ulasan..." 
                  value={searchAduanQuery}
                  onChange={e => setSearchAduanQuery(e.target.value)}
                  className="input-field !pl-10 !py-2 text-xs text-white w-full"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto items-center justify-end">
                <select 
                  value={filterAduanStatus} 
                  onChange={e => setFilterAduanStatus(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-32"
                >
                  <option value="All">Semua Status</option>
                  <option value="Baru">Baru</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
                <select 
                  value={filterAduanCategory} 
                  onChange={e => setFilterAduanCategory(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-32"
                >
                  <option value="All">Semua Kategori</option>
                  <option value="Sampah Liar">Sampah Liar</option>
                  <option value="Sampah B3">Sampah B3</option>
                  <option value="TPS Penuh">TPS Penuh</option>
                </select>
              </div>
            </div>

            {/* Permohonan Table Section */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Permohonan Edukasi & Penyuluhan</h3>
                <p className="text-xs text-slate-400">Permohonan undangan tim penyuluh DLH Batu.</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto border border-navy-700/50 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-950/60 sticky top-0 z-10">
                    <tr className="border-b border-navy-700 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Instansi</th>
                      <th className="p-3">Tema</th>
                      <th className="p-3">Narahubung</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Peserta</th>
                      <th className="p-3">Deskripsi</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/40">
                    {permohonanList.map(p => (
                      <tr key={p.id} className="hover:bg-navy-800/10 transition-colors">
                        <td className="p-3 text-slate-400 font-semibold">{p.tanggal_pelaksanaan}</td>
                        <td className="p-3 font-bold text-white max-w-[160px] truncate" title={p.nama_instansi}>{p.nama_instansi}</td>
                        <td className="p-3">
                          <span className="badge badge-emerald">{p.tema}</span>
                        </td>
                        <td className="p-3 text-slate-300 max-w-[140px] truncate" title={p.nama_narahubung}>{p.nama_narahubung}</td>
                        <td className="p-3 text-slate-300 max-w-[140px] truncate" title={p.whatsapp_narahubung}>{p.whatsapp_narahubung || '-'}</td>
                        <td className="p-3 text-slate-400">{p.estimasi_peserta}</td>
                        <td className="p-3 text-slate-300 max-w-xs truncate" title={p.deskripsi}>{p.deskripsi}</td>
                        <td className="p-3">
                          <span className={`badge ${
                            p.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-400' :
                            p.status === 'Diproses' ? 'bg-blue-500/20 text-blue-400' :
                            p.status === 'Ditolak' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {permohonanList.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-6 text-slate-500">Belum ada permohonan edukasi.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reports Table Section */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Laporan Pengaduan & Sampah Liar</h3>
                <p className="text-xs text-slate-400">Tinjau aduan warga terkait kendala tumpukan sampah liar kota.</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto border border-navy-700/50 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-950/60 sticky top-0 z-10">
                    <tr className="border-b border-navy-700 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Pelapor</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Deskripsi</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Tindakan Respon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/40">
                    {filteredReports.map(r => (
                      <tr key={r.id} className="hover:bg-navy-800/10 transition-colors">
                        <td className="p-3 text-slate-400 font-semibold">{r.date}</td>
                        <td className="p-3 font-bold text-white">{r.reporter}</td>
                        <td className="p-3">
                          <span className={`badge ${r.category === 'Sampah B3' ? 'badge-amber' : 'badge-red'}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 max-w-xs truncate" title={r.description}>{r.description}</td>
                        <td className="p-3">
                          <span className={`badge ${
                            r.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-400' :
                            r.status === 'Diproses' ? 'bg-blue-500/20 text-blue-400' :
                            r.status === 'Ditolak' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <HoverActionMenu
                              label="Status"
                              items={[
                                { label: 'Selesai', cls: 'hover:bg-emerald-500/20 text-emerald-400', onClick: () => handleReportStatus(r.id, 'Selesai') },
                                { label: 'Proses',  cls: 'hover:bg-blue-500/20 text-blue-400',    onClick: () => handleReportStatus(r.id, 'Diproses') },
                                { label: 'Tolak',   cls: 'hover:bg-red-500/20 text-red-400',      onClick: () => handleReportStatus(r.id, 'Ditolak') },
                                { divider: true },
                                { label: 'Reset',   cls: 'hover:bg-slate-700 text-slate-400',     onClick: () => handleReportStatus(r.id, 'Baru') },
                              ]}
                            />
                            <button onClick={() => handleDeleteReport(r.id)} className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 rounded transition-colors" title="Hapus">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredReports.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-slate-500">Tidak ada pengaduan warga.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Guestbook Section */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Umpan Balik & Saran Buku Tamu</h3>
                <p className="text-xs text-slate-400">Daftar ulasan warga secara real-time.</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {filteredGuestbook.map(g => (
                  <div key={g.id} className="p-4 bg-navy-900/40 rounded-xl border border-navy-700 flex justify-between items-start gap-4 hover:border-navy-500/30 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-white text-xs">{g.name}</span>
                        <span className="badge-emerald text-[9px] uppercase tracking-wider">{g.category}</span>
                        {g.email && <span className="text-[9px] text-slate-500">({g.email})</span>}
                      </div>
                      <p className="text-xs text-slate-300 italic">"{g.message}"</p>
                      {g.image && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-navy-700 max-w-xs">
                          <img src={g.image} alt="Lampiran" className="max-h-32 w-auto object-cover" />
                        </div>
                      )}
                      <span className="text-[9px] text-slate-500 block mt-2">{g.date}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteGuest(g.id)}
                      className="p-1.5 bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-red-400 rounded transition-colors shrink-0"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {filteredGuestbook.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">Umpan balik buku tamu kosong.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            TAB CONTENT: ARTIKEL EDUKASI
            ──────────────────────────────────────────────────────────────────── */}
        {activeTab === 'edukasi' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Search */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari judul artikel..." 
                  value={searchArticleQuery}
                  onChange={e => setSearchArticleQuery(e.target.value)}
                  className="input-field !pl-10 !py-2 text-xs text-white w-full"
                />
              </div>
              <div>
                <select 
                  value={filterArticleCategory} 
                  onChange={e => setFilterArticleCategory(e.target.value)}
                  className="input-field !py-2 !px-3 text-xs w-48"
                >
                  <option value="All">Semua Kategori</option>
                  <option value="RECYCLING">Recycling (Daur Ulang)</option>
                  <option value="COMPOSTING">Composting (Kompos)</option>
                  <option value="REGULATIONS">Regulations (Aturan)</option>
                  <option value="HAZARDOUS">Hazardous (Bahaya B3)</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* List Articles */}
              <div className="lg:col-span-2 glass-card p-6">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-navy-700 pb-2">Daftar Publikasi Edukasi</h3>
                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                  {filteredArticles.map(art => (
                    <div key={art.id} className="p-4 bg-navy-900/40 rounded-xl border border-navy-700 flex justify-between items-center gap-4 hover:border-navy-600/30 transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge-emerald text-[9px]">{art.category}</span>
                          <span className="text-[10px] text-slate-500">{art.date}</span>
                        </div>
                        <h4 className="font-bold text-white text-xs">{art.title}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => handleStartEditArticle(art)}
                          className="p-1.5 bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-emerald-400 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredArticles.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-6">Tidak ada artikel edukasi diterbitkan.</p>
                  )}
                </div>
              </div>

              {/* Form Article */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-navy-700 pb-2 flex items-center gap-1.5">
                  {editingArticleId !== null ? <Edit3 className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
                  {editingArticleId !== null ? 'Ubah Artikel' : 'Terbitkan Artikel Baru'}
                </h3>
                <form onSubmit={handleArticleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Judul Artikel</label>
                    <input 
                      type="text" 
                      placeholder="Manfaat Memilah Kertas Daur Ulang"
                      value={newArticle.title}
                      onChange={e => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field !py-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Kategori</label>
                    <select
                      value={newArticle.category}
                      onChange={e => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                      className="input-field !py-2 text-xs"
                    >
                      <option value="RECYCLING">Recycling (Daur Ulang)</option>
                      <option value="COMPOSTING">Composting (Kompos)</option>
                      <option value="REGULATIONS">Regulations (Aturan)</option>
                      <option value="HAZARDOUS">Hazardous (Bahaya B3)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {editingArticleId !== null && (
                      <button 
                        type="button" 
                        onClick={handleCancelEditArticle}
                        className="w-1/2 btn-outline text-xs justify-center py-2 rounded font-bold"
                      >
                        Batal
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`btn-primary text-xs justify-center py-2 rounded font-bold ${editingArticleId !== null ? 'w-1/2' : 'w-full'}`}
                    >
                      {editingArticleId !== null ? 'Simpan' : 'Terbitkan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          MODAL: EDIT BANK SAMPAH DATA
          ──────────────────────────────────────────────────────────────────── */}
      {editingBankId !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-slide-up border border-emerald-500/30">
            <button 
              onClick={() => setEditingBankId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-navy-700 pb-2">
              <Edit3 className="w-5 h-5 text-emerald-400" /> Edit Data Bank Sampah Terdaftar
            </h3>
            <form onSubmit={handleUpdateBankSampah} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Nomor Induk BSU</label>
                  <input 
                    type="text" 
                    required 
                    value={editBankForm.code}
                    onChange={e => setEditBankForm({ ...editBankForm, code: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Nama Bank Sampah</label>
                  <input 
                    type="text" 
                    required 
                    value={editBankForm.name}
                    onChange={e => setEditBankForm({ ...editBankForm, name: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Kecamatan</label>
                  <select 
                    value={editBankForm.district}
                    onChange={e => setEditBankForm({ ...editBankForm, district: e.target.value })}
                    className="input-field !py-2 text-xs"
                  >
                    <option value="Batu">Batu</option>
                    <option value="Bumiaji">Bumiaji</option>
                    <option value="Junrejo">Junrejo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Status Operasional</label>
                  <select 
                    value={editBankForm.status}
                    onChange={e => setEditBankForm({ ...editBankForm, status: e.target.value })}
                    className="input-field !py-2 text-xs"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Vakum">Vakum</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Tahun Berdiri</label>
                  <input 
                    type="number" 
                    value={editBankForm.established}
                    onChange={e => setEditBankForm({ ...editBankForm, established: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Lokasi Alamat</label>
                <textarea 
                  rows={2} 
                  required 
                  value={editBankForm.address}
                  onChange={e => setEditBankForm({ ...editBankForm, address: e.target.value })}
                  className="input-field !py-2 text-xs resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Penanggung Jawab</label>
                  <input 
                    type="text" 
                    required 
                    value={editBankForm.manager}
                    onChange={e => setEditBankForm({ ...editBankForm, manager: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Telp. Penganggung Jawab</label>
                  <input 
                    type="text" 
                    required 
                    value={editBankForm.phone}
                    onChange={e => setEditBankForm({ ...editBankForm, phone: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">Jumlah Nasabah (KK)</label>
                  <input 
                    type="number" 
                    value={editBankForm.members}
                    onChange={e => setEditBankForm({ ...editBankForm, members: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-1">NO SK Resmi</label>
                  <input 
                    type="text" 
                    value={editBankForm.sk_number}
                    onChange={e => setEditBankForm({ ...editBankForm, sk_number: e.target.value })}
                    className="input-field !py-2 text-xs" 
                  />
                </div>
              </div>

              <div className="border-t border-navy-700/50 pt-3">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">Jenis Sampah Masuk Rata-rata (KG / Liter)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Plastik (kg)</label>
                    <input type="number" value={editBankForm.plastic} onChange={e => setEditBankForm({...editBankForm, plastic: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Kertas (kg)</label>
                    <input type="number" value={editBankForm.paper} onChange={e => setEditBankForm({...editBankForm, paper: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Besi & Logam</label>
                    <input type="number" value={editBankForm.iron} onChange={e => setEditBankForm({...editBankForm, iron: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Botol (kg)</label>
                    <input type="number" value={editBankForm.bottle} onChange={e => setEditBankForm({...editBankForm, bottle: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Beling (kg)</label>
                    <input type="number" value={editBankForm.glass} onChange={e => setEditBankForm({...editBankForm, glass: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                  </div>
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-semibold mb-0.5">Minyak (L)</label>
                    <input type="number" value={editBankForm.oil} onChange={e => setEditBankForm({...editBankForm, oil: e.target.value})} className="input-field !py-1 !px-2 text-[10px]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-navy-700/50 justify-end">
                <button 
                  type="button" 
                  onClick={() => setEditingBankId(null)}
                  className="btn-outline text-xs !py-2 !px-4"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs !py-2 !px-4"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW APPLICATION DETAIL */}
      {viewingApplication && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => setViewingApplication(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Detail Permohonan: {viewingApplication.name}</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div><strong>Ketua / Pengurus:</strong> {viewingApplication.leader}</div>
              <div><strong>Kecamatan:</strong> {viewingApplication.district}</div>
              <div><strong>Alamat:</strong> {viewingApplication.address}</div>
              <div><strong>Jumlah Nasabah:</strong> {viewingApplication.members} KK</div>
              <div><strong>Kontak:</strong> {viewingApplication.phone || '-'}</div>
              <div><strong>Status:</strong> {viewingApplication.status}</div>
              <div className="pt-2">
                <strong>Catatan / Data Tambahan</strong>
                <pre className="mt-2 p-3 bg-slate-50 border border-slate-100 text-xs rounded text-slate-700 overflow-auto">{JSON.stringify(viewingApplication, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
