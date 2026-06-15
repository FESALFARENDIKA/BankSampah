import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building2, Truck, Users, AlertTriangle, PhoneCall, Sparkles, HelpCircle, ArrowLeft, Send, ShieldAlert, LogIn } from 'lucide-react';
import { publicServices, serviceFlow } from '../data/services';
import ExpandableInfo from '../components/ExpandableInfo';
import Toast from '../components/Toast';
import { supabase } from '../lib/supabase';

export default function LayananPublikPage() {
  const [activeForm, setActiveForm] = useState(null); // 'pendaftaran' | 'edukasi' | null
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Load user session
  useEffect(() => {
    const user = localStorage.getItem('wastebank-user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // 1. Form State: Pendaftaran Bank Sampah
  const [regForm, setRegForm] = useState({
    bankName: '', district: '', village: '', address: '',
    managerName: '', managerPhone: '', memberCount: ''
  });

  // 2. Form State: Edukasi & Sosialisasi
  const [eduForm, setEduForm] = useState({
    instName: '', eventDate: '', managerName: '', managerPhone: '',
    participantCount: '', theme: 'RECYCLING', desc: ''
  });

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.bankName || !regForm.district || !regForm.village || !regForm.address || !regForm.managerName || !regForm.managerPhone) {
      alert('Harap lengkapi semua bidang yang ditandai bintang (*)');
      return;
    }

    // Save to user applications database in localStorage
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

    const saved = localStorage.getItem('wastebank-user-applications');
    const apps = saved ? JSON.parse(saved) : defaultApplications;
    
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const newApp = {
      id: Date.now(),
      name: regForm.bankName,
      leader: regForm.managerName,
      district: regForm.district,
      village: regForm.village,
      address: regForm.address,
      members: regForm.memberCount || '0',
      status: 'Pending',
      date: formattedDate
    };

    // Attempt to save to Supabase
    try {
      const { error } = await supabase.from('bank_sampah_applications').insert([{
        name: regForm.bankName,
        leader: regForm.managerName,
        district: regForm.district,
        village: regForm.village,
        address: regForm.address,
        members: parseInt(regForm.memberCount) || 0,
        status: 'Pending',
        date: formattedDate
      }]);
      if (error) console.error('Supabase error:', error.message);
    } catch (err) {
      console.error('Failed to sync to Supabase:', err);
    }

    const updated = [newApp, ...apps];
    localStorage.setItem('wastebank-user-applications', JSON.stringify(updated));
    window.dispatchEvent(new Event('applicationsChange'));

    setToastMessage(`Pendaftaran "${regForm.bankName}" berhasil dikirim! Silakan tunggu verifikasi DLH.`);
    setShowToast(true);
    
    // Reset form & return
    setRegForm({
      bankName: '', district: '', village: '', address: '',
      managerName: '', managerPhone: '', memberCount: ''
    });
    setActiveForm(null);
  };

  const handleEduSubmit = (e) => {
    e.preventDefault();
    if (!eduForm.instName || !eduForm.eventDate || !eduForm.managerName || !eduForm.managerPhone) {
      alert('Harap lengkapi semua bidang yang ditandai bintang (*)');
      return;
    }

    setToastMessage(`Permohonan sosialisasi untuk "${eduForm.instName}" telah dikirim! Tim penyuluh akan menghubungi Anda.`);
    setShowToast(true);

    // Reset form & return
    setEduForm({
      instName: '', eventDate: '', managerName: '', managerPhone: '',
      participantCount: '', theme: 'RECYCLING', desc: ''
    });
    setActiveForm(null);
  };

  // Helper to map icons from string key
  const renderIcon = (iconName) => {
    const iconClass = "w-6 h-6 text-emerald-400";
    switch (iconName) {
      case 'Building2': return <Building2 className={iconClass} />;
      case 'Truck': return <Truck className={iconClass} />;
      case 'Users': return <Users className={iconClass} />;
      case 'AlertTriangle': return <AlertTriangle className={iconClass} />;
      default: return <HelpCircle className={iconClass} />;
    }
  };

  return (
    <div className="animate-fade-in pb-16">
      {/* Hero Section */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-10">
        <div className="page-container">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Layanan Warga DLH</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">Layanan Publik DLH Batu</h1>
          <p className="text-slate-400 mt-1 max-w-xl text-sm leading-relaxed">Daftar layanan administrasi dan teknis yang disediakan oleh Dinas Lingkungan Hidup Kota Batu terkait pengelolaan sampah.</p>
        </div>
      </section>

      <div className="page-container py-10">
        
        {/* CONDITIONAL VIEWS: MAIN SERVICES GRID VS INLINE FORMS */}
        {activeForm === null ? (
          <div>
            {/* Services Grid */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Layanan Yang Dapat Diakses
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {publicServices.map(service => (
                  <div key={service.id} className="glass-card p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                          {renderIcon(service.icon)}
                        </div>
                        <h3 className="text-lg font-bold text-white">{service.title}</h3>
                      </div>

                      {/* ExpandableInfo requirements modal */}
                      <ExpandableInfo
                        title={`Persyaratan & Prosedur: ${service.title}`}
                        shortText={service.description}
                        buttonText="Syarat & Ketentuan"
                        useModal={true}
                      >
                        <div className="space-y-4 text-xs text-slate-300">
                          <h4 className="font-bold text-emerald-400 text-sm">Dokumen & Persyaratan yang Diperlukan:</h4>
                          
                          {service.id === 1 && (
                            <ul className="list-disc pl-5 space-y-1.5">
                              <li><strong>Surat Rekomendasi:</strong> Pengantar dari Ketua RT/RW setempat.</li>
                              <li><strong>Data Anggota:</strong> Minimal 20 kepala keluarga (KK) terdaftar sebagai nasabah aktif.</li>
                              <li><strong>Susunan Pengurus:</strong> Ketua, Sekretaris, Bendahara, dan 2 Petugas Penimbang.</li>
                              <li><strong>Lokasi Fisik:</strong> Memiliki tempat penyimpanan/gudang sampah sementara yang layak (aman dari hujan).</li>
                            </ul>
                          )}

                          {service.id === 2 && (
                            <ul className="list-disc pl-5 space-y-1.5">
                              <li><strong>Kuantitas Minimum:</strong> Berat total sampah anorganik yang terkumpul minimal 100 kg.</li>
                              <li><strong>Jenis Terpilah:</strong> Sampah plastik, logam, kardus sudah diikat dan dipilah rapi per kategori.</li>
                              <li><strong>Jadwal Request:</strong> Pengajuan penjemputan dikirim via website minimal 1 hari sebelumnya.</li>
                              <li><strong>Akses Jalan:</strong> Lokasi gudang unit dapat dijangkau oleh truk/pickup operasional DLH.</li>
                            </ul>
                          )}

                          {service.id === 3 && (
                            <ul className="list-disc pl-5 space-y-1.5">
                              <li><strong>Surat Permohonan Resmi:</strong> Ditujukan kepada Kepala Dinas Lingkungan Hidup Kota Batu.</li>
                              <li><strong>Waktu Pengajuan:</strong> Dikirim minimal 5 hari kerja sebelum tanggal pelaksanaan acara.</li>
                              <li><strong>Fasilitas:</strong> Pihak pemohon menyediakan proyektor, pengeras suara, dan area demonstrasi pilah.</li>
                              <li><strong>Jumlah Peserta:</strong> Minimal 30 peserta untuk tingkat umum atau 1 kelas untuk sekolah/kampus.</li>
                            </ul>
                          )}

                          {service.id === 4 && (
                            <ul className="list-disc pl-5 space-y-1.5">
                              <li><strong>Foto Bukti:</strong> Foto tumpukan sampah yang dilaporkan dengan menyertakan penanda lokasi (geolocation).</li>
                              <li><strong>Lokasi Jelas:</strong> Koordinat Google Maps atau deskripsi jalan/alamat pembuangan liar.</li>
                              <li><strong>Identitas Pelapor:</strong> Nama dan no HP pelapor (dirahasiakan demi keamanan).</li>
                              <li><strong>Catatan Khusus:</strong> Melaporkan timbulan liar, bukan wadah sampah TPS resmi kelurahan.</li>
                            </ul>
                          )}

                          <div className="p-3 bg-navy-950/60 rounded border border-navy-600/20 mt-3 text-[10px] text-slate-400">
                            *Layanan ini bebas biaya (Gratis 100%). Dikelola oleh Bidang Kebersihan & Peningkatan Lingkungan Hidup.
                          </div>
                        </div>
                      </ExpandableInfo>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-navy-600/10 pt-4">
                      <span className="text-[10px] text-slate-500">Estimasi Respon: 24-48 Jam Kerja</span>
                      {service.id === 1 ? (
                        <button 
                          onClick={() => setActiveForm('pendaftaran')}
                          className="btn-outline text-xs !px-4 !py-1.5 rounded-lg flex items-center gap-1"
                        >
                          Akses Formulir <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : service.id === 2 ? (
                        <Link 
                          to="/schedule"
                          className="btn-outline text-xs !px-4 !py-1.5 rounded-lg flex items-center gap-1"
                        >
                          Akses Jadwal <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : service.id === 3 ? (
                        <button 
                          onClick={() => setActiveForm('edukasi')}
                          className="btn-outline text-xs !px-4 !py-1.5 rounded-lg flex items-center gap-1"
                        >
                          Akses Formulir <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <Link 
                          to={service.link}
                          className="btn-outline text-xs !px-4 !py-1.5 rounded-lg flex items-center gap-1"
                        >
                          Akses Formulir <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Steps Flow */}
            <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-navy-800 to-navy-900 border border-emerald-500/20 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-wider">
                Alur Permohonan Layanan
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-navy-600"></div>
                {serviceFlow.map((step) => (
                  <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-lg shadow-lg shadow-emerald-500/20 mb-4 border-4 border-navy-900">
                      {step.step}
                    </div>
                    <h4 className="text-base font-bold text-white mb-1.5">{step.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !currentUser ? (
          
          /* LOCK PANEL: BUTUH LOGIN */
          <div className="glass-card p-8 max-w-md mx-auto text-center animate-slide-up my-12 border border-red-500/20">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Silakan Login Terlebih Dahulu</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Anda harus masuk ke akun pengguna terlebih dahulu untuk mengakses dan mengisi formulir layanan publik DLH Kota Batu.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/login"
                className="btn-primary w-full justify-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Register Akun</span>
              </Link>
              <button
                onClick={() => setActiveForm(null)}
                className="btn-outline w-full justify-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Kembali ke Layanan
              </button>
            </div>
          </div>
        ) : activeForm === 'pendaftaran' ? (
          
          /* INLINE SECTION: FORMULIR PENDAFTARAN BANK SAMPAH */
          <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6 border-b border-navy-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Formulir Pengajuan Unit Baru</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Daftarkan kelompok Bank Sampah mandiri Anda.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveForm(null)}
                className="btn-outline text-xs !py-1.5 !px-3 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            </div>

            <form onSubmit={handleRegSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Nama Unit Bank Sampah *</label>
                  <input 
                    type="text" 
                    required 
                    value={regForm.bankName} 
                    onChange={e => setRegForm({...regForm, bankName: e.target.value})}
                    placeholder="Contoh: Bank Sampah Melati Asri" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Kecamatan *</label>
                  <select 
                    required 
                    value={regForm.district}
                    onChange={e => setRegForm({...regForm, district: e.target.value})}
                    className="input-field text-xs text-white"
                  >
                    <option value="">Pilih kecamatan...</option>
                    <option value="Batu">Kecamatan Batu</option>
                    <option value="Bumiaji">Kecamatan Bumiaji</option>
                    <option value="Junrejo">Kecamatan Junrejo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Kelurahan / Desa *</label>
                  <input 
                    type="text" 
                    required 
                    value={regForm.village} 
                    onChange={e => setRegForm({...regForm, village: e.target.value})}
                    placeholder="Contoh: Beji" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Alamat Lengkap *</label>
                  <textarea 
                    rows={2} 
                    required 
                    value={regForm.address} 
                    onChange={e => setRegForm({...regForm, address: e.target.value})}
                    placeholder="Jl. Sukarno Hatta No. 45, RT 02 RW 01..." 
                    className="input-field resize-none text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Nama Ketua Pengurus *</label>
                  <input 
                    type="text" 
                    required 
                    value={regForm.managerName} 
                    onChange={e => setRegForm({...regForm, managerName: e.target.value})}
                    placeholder="Nama Lengkap Ketua" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">WhatsApp / No. Telp *</label>
                  <input 
                    type="tel" 
                    required 
                    value={regForm.managerPhone} 
                    onChange={e => setRegForm({...regForm, managerPhone: e.target.value})}
                    placeholder="Contoh: 08123456789" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Estimasi Jumlah Anggota (KK)</label>
                  <input 
                    type="number" 
                    value={regForm.memberCount} 
                    onChange={e => setRegForm({...regForm, memberCount: e.target.value})}
                    placeholder="e.g. 25" 
                    className="input-field text-xs text-white" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-navy-700/50">
                <button 
                  type="button" 
                  onClick={() => {
                    setRegForm({ bankName: '', district: '', village: '', address: '', managerName: '', managerPhone: '', memberCount: '' });
                    setActiveForm(null);
                  }}
                  className="btn-outline text-xs !px-5 !py-2.5"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs !px-5 !py-2.5"
                >
                  <Send className="w-4 h-4" />
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        ) : (
          
          /* INLINE SECTION: FORMULIR EDUKASI & SOSIALISASI */
          <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6 border-b border-navy-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Permohonan Edukasi & Penyuluhan</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Undang tim penyuluh DLH Batu ke sekolah atau komunitas Anda.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveForm(null)}
                className="btn-outline text-xs !py-1.5 !px-3 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            </div>

            <form onSubmit={handleEduSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Nama Sekolah / Instansi / Komunitas *</label>
                  <input 
                    type="text" 
                    required 
                    value={eduForm.instName} 
                    onChange={e => setEduForm({...eduForm, instName: e.target.value})}
                    placeholder="Contoh: SDN 01 Batu, Karang Taruna Kel. Beji" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Tanggal Rencana Pelaksanaan *</label>
                  <input 
                    type="date" 
                    required 
                    value={eduForm.eventDate} 
                    onChange={e => setEduForm({...eduForm, eventDate: e.target.value})}
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Tema Sosialisasi *</label>
                  <select 
                    required
                    value={eduForm.theme}
                    onChange={e => setEduForm({...eduForm, theme: e.target.value})}
                    className="input-field text-xs text-white"
                  >
                    <option value="RECYCLING">Pilah Sampah & 3R (Daur Ulang)</option>
                    <option value="COMPOSTING">Pembuatan Kompos Organik</option>
                    <option value="ADIWIYATA">Sekolah Adiwiyata & Ramah Anak</option>
                    <option value="GENERAL">Sosialisasi Umum Perda Kebersihan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Nama Narahubung *</label>
                  <input 
                    type="text" 
                    required 
                    value={eduForm.managerName} 
                    onChange={e => setEduForm({...eduForm, managerName: e.target.value})}
                    placeholder="Nama Lengkap Penanggung Jawab" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">WhatsApp Narahubung *</label>
                  <input 
                    type="tel" 
                    required 
                    value={eduForm.managerPhone} 
                    onChange={e => setEduForm({...eduForm, managerPhone: e.target.value})}
                    placeholder="Contoh: 08123456789" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Estimasi Jumlah Peserta (Orang)</label>
                  <input 
                    type="number" 
                    value={eduForm.participantCount} 
                    onChange={e => setEduForm({...eduForm, participantCount: e.target.value})}
                    placeholder="e.g. 50" 
                    className="input-field text-xs text-white" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Deskripsi Tambahan / Rincian Acara</label>
                  <textarea 
                    rows={2} 
                    value={eduForm.desc} 
                    onChange={e => setEduForm({...eduForm, desc: e.target.value})}
                    placeholder="Tuliskan format acara, fasilitas yang tersedia, dll..." 
                    className="input-field resize-none text-xs text-white" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-navy-700/50">
                <button 
                  type="button" 
                  onClick={() => {
                    setEduForm({ instName: '', eventDate: '', managerName: '', managerPhone: '', participantCount: '', theme: 'RECYCLING', desc: '' });
                    setActiveForm(null);
                  }}
                  className="btn-outline text-xs !px-5 !py-2.5"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs !px-5 !py-2.5"
                >
                  <Send className="w-4 h-4" />
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Emergency/Direct Support Contact */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Butuh Kontak Cepat / Layanan Telepon?</h4>
              <p className="text-xs text-slate-400">
                Hubungi langsung nomor operasional DLH Batu atau WhatsApp Pelayanan kami. Telepon: <span className="text-white font-semibold">(0341) 592200</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="btn-outline text-xs !px-4 !py-2 border-amber-500 text-amber-400 hover:bg-amber-500/10 rounded-lg shrink-0">
              WhatsApp Layanan
            </a>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
