import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ChevronRight, Scale, Coins, Download, ArrowRight, BookOpen, Award, Building, Sparkles, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudience } from '../context/AudienceContext';
import ExpandableInfo from '../components/ExpandableInfo';
import heroBg from '../assets/dlh_batu_green_city.png';

const pillars = [
  { num: '01', title: 'Ecological Balance', focus: 'Waste Reduction' },
  { num: '02', title: 'Community Empowerment', focus: 'Economic Circularity' },
  { num: '03', title: 'Sustainable Education', focus: 'Public Awareness' },
];

const processCards = [
  { title: 'Weigh & Record', desc: 'Accurate tracking of every deposit.' },
  { title: 'Economic Value', desc: 'Turn waste into community savings.' },
];

export default function AboutPage() {
  const { audienceMode } = useAudience();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('wastebank-user');
    setCurrentUser(user ? JSON.parse(user) : null);
  }, []);

  // Content helper based on active audience mode
  const getContent = () => {
    switch (audienceMode) {
      case 'anak':
        return {
          heroTitle: "Kenalan yuk dengan DLH Kota Batu! 🌟",
          heroSubtitle: "Dinas Lingkungan Hidup Kota Batu",
          heroDesc: "Tempat seru untuk belajar menjaga bumi kita agar tetap hijau, bersih, dan sehat! Di sini kamu bisa menukar sampah plastikmu menjadi tabungan yang asyik lho!",
          visionTitle: "3 Misi Keren Kita 💚",
          processTitle: "Langkah Mudah Menabung Sampah 🏆",
          processDesc: "Menabung sampah itu gampang banget! Kamu cuma perlu mengumpulkan sampah botol plastik atau kertas di rumah, lalu membawanya ke Bank Sampah terdekat untuk ditimbang dan dicatat tabungannya!",
        };
      case 'lansia':
        return {
          heroTitle: "PROFIL DLH KOTA BATU",
          heroSubtitle: "Dinas Lingkungan Hidup Kota Batu - Unit Bank Sampah",
          heroDesc: "Komitmen kami untuk memberikan layanan kebersihan lingkungan yang prima, transparan, dan memudahkan para warga senior berpartisipasi menjaga lingkungan hidup Kota Batu.",
          visionTitle: "3 Pilar Utama Pengelolaan Lingkungan",
          processTitle: "Cara Kerja & Alur Penyerahan Sampah",
          processDesc: "Kami memastikan seluruh alur penimbangan, pencatatan saldo tabungan, dan penukaran nilai ekonomi dilakukan secara terbuka, mudah diakses, tanpa antrean yang melelahkan.",
        };
      case 'pemerintah':
        return {
          heroTitle: "Dinas Lingkungan Hidup Kota Batu",
          heroSubtitle: "Waste Bank Management and Circular Economy Division",
          heroDesc: "Implementasi kebijakan strategis berbasis Perda Kota Batu untuk mendorong pengurangan timbunan sampah di TPA melalui pemberdayaan unit ekonomi sirkular masyarakat.",
          visionTitle: "Pilar Strategis & Target Ekologis",
          processTitle: "SOP & Standardisasi Operasional Daur Ulang",
          processDesc: "Metodologi integrasi data real-time penimbangan sampah skala kota untuk mendukung pencapaian target Kebijakan Strategis Daerah (JAKSTRADA) pengurangan sampah.",
        };
      default:
        return {
          heroTitle: "Profil DLH Kota Batu",
          heroSubtitle: "Dinas Lingkungan Hidup Kota Batu",
          heroDesc: "Platform digital resmi untuk memantau, mengedukasi, dan memfasilitasi program Bank Sampah guna mewujudkan tata kelola lingkungan Kota Batu yang bersih, asri, dan berkelanjutan.",
          visionTitle: "Visi & 3 Pilar Utama Kami",
          processTitle: "Proses Pengelolaan Sampah (Pilah & Daur Ulang)",
          processDesc: "Program Bank Sampah (Waste Bank) adalah inisiatif terstruktur dari DLH Kota Batu yang bertujuan mengintegrasikan pemilahan sampah dari tingkat rumah tangga dengan ekosistem ekonomi sirkular.",
        };
    }
  };

  const texts = getContent();

  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Section with background photo */}
      <section className="relative py-24 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/85 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Green Initiative Kota Batu</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">
            {audienceMode === 'anak' ? "DLH" : "DLH"}<span className="text-emerald-400">Batu</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 italic mb-4">
            {texts.heroSubtitle}
          </p>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
            {texts.heroDesc}
          </p>

          {!currentUser && (
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-bounce-subtle">
              <Link
                to="/login"
                className="btn-primary !px-8 !py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Mulai / Login & Register Akun</span>
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Kota Batu, Jawa Timur
            </span>
            <span>Est. 2023</span>
            <span className="text-emerald-400">• Kota Bersih & Lestari</span>
          </div>
        </div>
      </section>

      {/* Mission & Pillars Section */}
      <section className="py-16 border-y border-navy-600/20 bg-navy-800/10">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold mb-1">Our Mission & Pillars</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{texts.visionTitle}</h2>
            </div>

            {/* Modal button to read full vision and mission, keeping the page scroll short */}
            <div className="shrink-0">
              <ExpandableInfo
                title="Visi, Misi & Rencana Strategis DLH"
                shortText="Baca visi dan misi jangka panjang DLH Kota Batu."
                buttonText="Lihat Visi & Misi Lengkap"
                useModal={true}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-emerald-400 text-base mb-1">Visi DLH Kota Batu</h4>
                    <p className="text-slate-300">"Mewujudkan Kota Batu sebagai pusat pariwisata internasional yang berkelanjutan, berbasis pertanian organik, berkarakter, dan ramah lingkungan."</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 text-base mb-1">Misi Terkait Pengelolaan Sampah</h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      <li>Mengembangkan sistem pengelolaan sampah terpadu hulu-hilir berbasis teknologi dan partisipasi warga.</li>
                      <li>Mengoptimalkan peran Bank Sampah di tingkat RT, RW, dan Sekolah demi tercapainya program bebas TPA (Zero Waste).</li>
                      <li>Mengedukasi masyarakat mengenai pentingnya pemilahan sampah organik dan anorganik.</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-navy-950 rounded-lg border border-navy-600/30 text-xs text-slate-400">
                    Dokumen Rencana Strategis (RENSTRA) Dinas Lingkungan Hidup Kota Batu Tahun 2023-2028.
                  </div>
                </div>
              </ExpandableInfo>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.num} className="glass-card p-6 border-b border-navy-600/20 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl font-bold text-emerald-500/40 italic">{p.num}</span>
                  <span className="badge-emerald">{p.focus}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>

                {/* Accordion for individual pillar details */}
                <ExpandableInfo
                  title={p.title}
                  shortText={
                    p.num === '01'
                      ? 'Mengurangi sampah plastik sekali pakai.'
                      : p.num === '02'
                        ? 'Meningkatkan ekonomi mandiri warga.'
                        : 'Edukasi kebersihan sejak usia dini.'
                  }
                  buttonText="Detail Pilar"
                  useModal={false}
                >
                  <p className="mt-2 text-slate-300">
                    {p.num === '01'
                      ? 'Fokus utama adalah menekan volume sampah organik dan anorganik yang masuk ke TPA Tlekung dengan memperkuat pemilahan mandiri di setiap rumah tangga and pelaku wisata di Kota Batu.'
                      : p.num === '02'
                        ? 'Melalui mekanisme tabungan sampah yang dapat dikonversi menjadi uang tunai, sembako, atau pembayaran listrik, program ini sukses melahirkan roda ekonomi baru sirkular di pedesaan.'
                        : 'Kami bekerja sama dengan sekolah-sekolah melalui program Adiwiyata untuk mengajarkan kebiasaan memilah sampah dan membuat pupuk kompos secara praktis.'
                    }
                  </p>
                </ExpandableInfo>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="page-container">
          <div className="mb-10 text-center md:text-left">
            <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">A. Collect / Sort / Recycle</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{texts.processTitle}</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3">Bagaimana Cara Kerja Bank Sampah?</h3>

              {/* Short explanation with "Selengkapnya" Modal to keep page scroll short */}
              <ExpandableInfo
                title="Panduan Alur & Standardisasi Kerja Bank Sampah"
                shortText={texts.processDesc}
                buttonText="Panduan Alur Lengkap"
                useModal={true}
              >
                <div className="space-y-4">
                  <h4 className="font-bold text-emerald-400 text-sm">Alur 5 Langkah Mudah:</h4>
                  <div className="space-y-3">
                    {[
                      { step: '1. Pemilahan di Rumah', text: 'Pisahkan sampah organik (sisa makanan, daun) dengan sampah anorganik (botol plastik, kertas, kaleng).' },
                      { step: '2. Penyerahan ke Unit', text: 'Bawa sampah anorganik bersih Anda ke unit Bank Sampah terdekat pada hari operasional.' },
                      { step: '3. Penimbangan & Verifikasi', text: 'Petugas Bank Sampah menimbang dan mengelompokkan sampah sesuai jenisnya secara transparan.' },
                      { step: '4. Pencatatan Saldo Digital', text: 'Petugas memasukkan berat sampah ke dalam database sistem digital. Saldo Anda otomatis bertambah di buku rekening.' },
                      { step: '5. Penarikan Manfaat', text: 'Tabungan terkumpul dapat diambil sewaktu-waktu dalam bentuk uang tunai, paket sembako, atau dikonversi untuk keperluan lainnya.' }
                    ].map((stepItem, i) => (
                      <div key={i} className="p-3 bg-navy-950/60 rounded border border-navy-600/30">
                        <div className="font-bold text-xs text-white mb-0.5">{stepItem.step}</div>
                        <p className="text-xs text-slate-400">{stepItem.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ExpandableInfo>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {processCards.map((card, i) => (
                <div key={i} className="glass-card p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      {i === 0 ? <Scale className="w-6 h-6 text-emerald-400" /> : <Coins className="w-6 h-6 text-amber-400" />}
                    </div>
                    <h4 className="font-semibold text-white text-lg mb-2">{card.title}</h4>
                    <p className="text-sm text-slate-400 mb-4">{card.desc}</p>
                  </div>
                  <ExpandableInfo
                    title={card.title}
                    shortText="Lihat penjelasan singkat mengenai nilai manfaat ini."
                    buttonText="Baca Detail"
                    useModal={false}
                  >
                    <p className="text-xs text-slate-300 mt-2">
                      {i === 0
                        ? 'Setiap gram sampah plastik, logam, dan kertas dicatat menggunakan timbangan digital presisi tinggi. Data ini disinkronisasikan langsung dengan sistem server DLH Kota Batu.'
                        : 'Hasil daur ulang dijual kepada pabrik pengolah mitra DLH, dan keuntungannya disalurkan kembali 100% untuk kas tabungan anggota Bank Sampah tanpa potongan biaya administrasi.'
                      }
                    </p>
                  </ExpandableInfo>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section className="py-16 bg-navy-800/20 border-t border-navy-600/20">
        <div className="page-container">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold mb-1">
            Contact & Location
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">Hubungi & Kunjungi Kantor Kami</h2>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              {/* Head Office */}
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Head Office</p>
                <div className="flex items-center gap-3">
                  <img src="/external/logo_kota_batu.png" alt="Logo Kota Batu" className="w-10 h-10 object-contain rounded" />
                  <div>
                    <p className="text-white font-bold text-base">Dinas Lingkungan Hidup Kota Batu</p>
                    <p className="text-xs text-slate-300 mt-1">Balaikota Among Tani</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mt-1">Gedung A, Lantai 2, Balaikota Among Tani</p>
                <p className="text-sm text-slate-400">Jl. Panglima Sudirman No. 507, Pesanggrahan, Kec. Batu, Kota Batu</p>
              </div>

              {/* Communication */}
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Saluran Hubungan (Kontak)</p>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-sm">
                    <Phone className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium">(0341) 592200</span>
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <Mail className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium">dlh@batukota.go.id</span>
                  </p>
                  <p className="flex items-center gap-3 text-sm">
                    <MessageCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium">+62 812 3456 7890 (WhatsApp Pengaduan)</span>
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="glass-card p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Jam Operasional Pelayanan</p>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Senin - Kamis:</span>
                    <span className="text-white font-semibold">08:00 - 15:30 WIB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Jumat:</span>
                    <span className="text-white font-semibold">08:00 - 14:30 WIB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Sabtu, Minggu & Hari Libur:</span>
                    <span className="text-red-400 font-semibold">Tutup (Closed)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Map / Location Detail */}
            <div className="rounded-3xl overflow-hidden border border-navy-600/30 bg-navy-800/80 relative min-h-[420px] lg:min-h-[360px]">
              <div className="absolute inset-0">
                <iframe
                  title="Peta DLH Kota Batu"
                  src="https://www.google.com/maps?q=Dinas+Lingkungan+Hidup+Kota+Batu&center=-7.8661377,112.5133019&zoom=17&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="glass-card px-4 py-3 max-w-xs bg-slate-950/90 border border-slate-700 shadow-xl">
                  <p className="text-sm font-bold text-emerald-100">Balaikota Among Tani</p>
                  <p className="text-xs text-emerald-200">Pusat Pemerintahan & Kantor DLH Kota Batu</p>
                </div>

                <div className="relative z-10 self-start w-full max-w-[420px] mt-4">
                  <ExpandableInfo
                    title="Petunjuk Rute & Aksesibilitas Lokasi"
                    shortText="Lihat petunjuk arah berkendara dan akses transportasi umum menuju kantor kami."
                    buttonText="Petunjuk Arah & Peta Detail"
                    useModal={true}
                  >
                    <div className="space-y-4">
                      <h4 className="font-bold text-emerald-400 text-sm">Petunjuk Jalan:</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Kantor DLH bertempat di kompleks Balaikota Among Tani Gedung A Lantai 2. Kompleks ini terletak di pusat kota, tepatnya di Jl. Panglima Sudirman. Dapat dijangkau menggunakan angkutan umum kota Batu jalur BJL atau menggunakan kendaraan roda 2 dan roda 4 dengan area parkir yang sangat luas dan ramah kursi roda.
                      </p>
                      <div className="p-3 bg-navy-950/70 rounded border border-navy-600/30">
                        <div className="font-bold text-xs text-white mb-1">Titik Koordinat GPS:</div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-emerald-100">
                          <code className="text-emerald-300">-7.8661377, 112.5133019</code>
                          <a
                            href="https://www.google.com/maps/place/Dinas+Lingkungan+Hidup+Kota+Batu/@-7.8661377,112.5133019,17z/"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline text-[10px] !px-2 !py-1"
                          >
                            Lihat di Peta
                          </a>
                        </div>
                      </div>
                    </div>
                  </ExpandableInfo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
