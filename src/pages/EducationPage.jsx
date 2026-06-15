import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Download, HelpCircle, ChevronDown, ChevronUp, BookOpen, Lightbulb, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { educationCategories, featuredGuide, quickTips, articles, downloadMaterials, faqItems } from '../data/education';
import { useAudience } from '../context/AudienceContext';
import ExpandableInfo from '../components/ExpandableInfo';

const catColors = { 
  COMPOSTING: 'badge-emerald', 
  RECYCLING: 'badge-blue', 
  REGULATIONS: 'badge-amber', 
  HAZARDOUS: 'badge-red' 
};

export default function EducationPage() {
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [openFaq, setOpenFaq] = useState(1);
  const [search, setSearch] = useState('');
  const { audienceMode } = useAudience();

  // Content tailoring based on Audience Mode
  const getPageConfig = () => {
    switch (audienceMode) {
      case 'anak':
        return {
          title: "Sekolah Daur Ulang Cilik! 🎒",
          subtitle: "Belajar memilah sampah sambil bermain dan menabung untuk bumi kita tercinta!",
          searchPlaceholder: "Cari game daur ulang atau panduan asyik...",
          featuredTitle: "Petualangan Hebat Kompos Organik 🌱",
          featuredDesc: "Hai teman-teman! Tahukah kamu bahwa sisa buah, sayuran, dan dedaunan bisa disulap menjadi 'tanah ajaib' yang menyuburkan bunga-bunga? Yuk ikuti petualangan ajaib ini!",
          tipsTitle: "Trik Pintar Sampah Cilik 💡",
        };
      case 'lansia':
        return {
          title: "PANDUAN & EDUKASI PEMILAHAN SAMPAH",
          subtitle: "Panduan praktis pengelolaan sampah mandiri di rumah untuk menjaga kesehatan keluarga dan kenyamanan lingkungan Kota Batu.",
          searchPlaceholder: "Ketik topik yang ingin Anda cari (Contoh: cara memilah plastik)...",
          featuredTitle: "Pilah Sampah Mudah & Praktis Dari Rumah",
          featuredDesc: "Memisahkan sampah dapur basah dengan sampah plastik kering sangat bermanfaat untuk mencegah bau tak sedap dan perkembangbiakan kuman penyakit di rumah kita.",
          tipsTitle: "Tips Ringkas Rumah Nyaman 💡",
        };
      case 'pemerintah':
        return {
          title: "Portal Edukasi & Regulasi Kebersihan Daerah",
          subtitle: "Dokumen sosialisasi, kebijakan JAKSTRADA, dan manual pengelolaan sampah sirkular Kota Batu untuk instansi, sekolah, dan fasilitator lingkungan.",
          searchPlaceholder: "Cari regulasi, surat keputusan, atau manual teknis...",
          featuredTitle: "Panduan Pembuatan Kompos Rumah Tangga Skala Kota",
          featuredDesc: "Kebijakan strategis Dinas Lingkungan Hidup untuk menekan timbunan sampah basah rumah tangga organik hingga 30% melalui optimalisasi komposter komunal.",
          tipsTitle: "Pedoman Teknis Kebijakan 💡",
        };
      default:
        return {
          title: "Pusat Panduan & Edukasi",
          subtitle: "Temukan artikel, pedoman praktis, dan materi edukasi daur ulang sampah yang disiapkan oleh DLH Kota Batu.",
          searchPlaceholder: "Cari artikel, panduan, atau poster edukasi...",
          featuredTitle: featuredGuide.title,
          featuredDesc: featuredGuide.description,
          tipsTitle: "Tips Cepat Pengelolaan 💡",
        };
    }
  };

  const config = getPageConfig();

  // Custom rendering for Kids Mode Articles
  const getTailoredArticles = () => {
    if (audienceMode === 'anak') {
      return [
        {
          id: 1,
          title: "Kisah Botol Plastik yang Ingin Jadi Mainan Baru! 🤖",
          description: "Ikuti cerita seru si Botol Plastik Plastila yang disulap menjadi mobil-mobilan keren setelah ditabung ke Bank Sampah!",
          category: "RECYCLING",
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
          date: "Baru!"
        },
        {
          id: 2,
          title: "Ayo Bikin Komposter Ajaib di Rumah! 🍃",
          description: "Yuk ajak Mama dan Papa membuat pot tanaman ajaib berisi pupuk organik buatanmu sendiri dari sisa kulit jeruk!",
          category: "COMPOSTING",
          image: "https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=400&q=80",
          date: "Kemarin"
        }
      ];
    }
    return articles;
  };

  const displayArticles = getTailoredArticles();

  return (
    <div className="animate-fade-in pb-16">
      {/* Header Search Section */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-10">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Edu-Hub DLH Batu</span>
              </div>
              <h1 className="text-3xl font-bold text-white leading-tight">{config.title}</h1>
              <p className="text-slate-400 mt-1 max-w-xl text-sm leading-relaxed">{config.subtitle}</p>
              
              <div className="relative mt-5 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                <input 
                  type="text" 
                  placeholder={config.searchPlaceholder} 
                  value={search} 
                  onChange={e=>setSearch(e.target.value)} 
                  className="input-field !pl-10 !pr-24"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
                  {audienceMode === 'anak' ? "Ayo Cari! 🔍" : "Cari"}
                </button>
              </div>
            </div>
            <div className="flex gap-8 shrink-0">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-emerald-400">45+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Materi Unduhan</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-emerald-400">120+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Artikel Edukasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Category Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {educationCategories.map(cat=>(
            <button 
              key={cat} 
              onClick={()=>setActiveCategory(cat)} 
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeCategory===cat
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              {audienceMode === 'anak' && cat === 'All Resources' ? "🏠 Semua Materi" : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Featured Guide + Quick Tips */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              {audienceMode === 'anak' ? "Pilihan Hari Ini! 🌟" : "Materi Unggulan"}
            </h2>
            
            <div className="glass-card overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
              <div className="grid md:grid-cols-2">
                <div className="relative h-52 md:h-auto overflow-hidden">
                  <img 
                    src={featuredGuide.image} 
                    alt={featuredGuide.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">HOT NEW</span>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-emerald">{featuredGuide.category}</span>
                      <span className="text-xs text-slate-500">⏱ {featuredGuide.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {config.featuredTitle}
                    </h3>
                  </div>

                  {/* Expandable modal containing full article instructions */}
                  <div className="mt-3">
                    <ExpandableInfo
                      title={config.featuredTitle}
                      shortText={config.featuredDesc}
                      buttonText={audienceMode === 'anak' ? "Ayo Baca Cerita! 📖" : "Baca Panduan Lengkap"}
                      useModal={true}
                    >
                      <div className="space-y-4">
                        <img 
                          src={featuredGuide.image} 
                          alt={featuredGuide.title} 
                          className="w-full h-48 object-cover rounded-xl border border-navy-600/30"
                        />
                        <h4 className="font-bold text-emerald-400 text-base">Kompos Mandiri: Langkah-Langkah Detil</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Membuat kompos mandiri di pekarangan rumah adalah cara terbaik mengeliminasi tumpukan sampah dapur basah. Berikut adalah langkah praktis pembuatan komposter sederhana:
                        </p>
                        <div className="space-y-2 text-xs text-slate-300">
                          <p><strong>1. Wadah Komposter:</strong> Gunakan ember cat bekas berukuran 20-30 Liter, lubangi sisi bawahnya untuk aerasi udara.</p>
                          <p><strong>2. Bahan Hijau (Nitrogen):</strong> Sisa sayur dapur, kulit buah, sisa teh/kopi.</p>
                          <p><strong>3. Bahan Cokelat (Karbon):</strong> Daun kering halaman, serbuk gergaji halus, atau robekan kertas kardus polos.</p>
                          <p><strong>4. Aktivator EM4:</strong> Campurkan 1 tutup botol cairan EM4 dengan air gula sebagai mikroba pengurai alami.</p>
                          <p><strong>5. Pemeliharaan:</strong> Susun secara berlapis (hijau - cokelat - hijau). Sirami EM4 secukupnya, lalu aduk perlahan seminggu sekali. Dalam 4-6 minggu, kompos siap digunakan untuk menyuburkan tanaman hias dan sayur.</p>
                        </div>
                        <div className="p-3 bg-navy-950/60 rounded border border-navy-600/20 text-[10px] text-slate-400">
                          Panduan Teknis Resmi - Bidang Pengelolaan Persampahan DLH Kota Batu.
                        </div>
                      </div>
                    </ExpandableInfo>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Lightbulb className="w-5 h-5 text-amber-400"/>
              {config.tipsTitle}
            </h2>
            <div className="space-y-3">
              {quickTips.map((tip,i)=>(
                <div key={i} className="glass-card p-4 flex items-start gap-3 hover:border-emerald-500/20 transition-colors">
                  <span className="text-2xl shrink-0">{tip.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                    
                    {/* Expandable detail for quick tips to save page height */}
                    <ExpandableInfo
                      title={tip.title}
                      shortText={tip.description}
                      buttonText="Trik Detail"
                      useModal={false}
                    >
                      <p className="text-[11px] text-emerald-300 mt-1">
                        {tip.icon === '🧴' 
                          ? 'Membasuh botol bekas kecap atau susu dengan sedikit air mencegah timbulnya semut dan bau busuk yang mengundang lalat di tempat penampungan sementara.'
                          : tip.icon === '📦'
                          ? 'Melipat kardus secara pipih menghemat ruang penyimpanan di rumah hingga 70% dan memudahkan pengikatan saat ditimbang di Bank Sampah.'
                          : 'Sisa potongan sayur dan sisa teh bisa diletakkan langsung di pot tanaman hias sebagai mulsa organik pelindung kelembapan tanah pekarangan Anda.'
                        }
                      </p>
                    </ExpandableInfo>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Articles + Downloads Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                {audienceMode === 'anak' ? "Dongeng Lingkungan 📖" : "Artikel Edukasi Terbaru"}
              </h2>
              <Link to="/galeri-kegiatan" className="text-emerald-400 text-xs font-bold hover:underline">LIHAT SEMUA</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {displayArticles.map(art=>(
                <div key={art.id} className="glass-card-hover overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="h-40 overflow-hidden relative">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      <span className="absolute top-2 right-2 badge-emerald text-[9px]">{art.category}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-slate-500 mb-1">{art.date}</p>
                      <h3 className="font-bold text-white text-sm mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {art.title}
                      </h3>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    {/* Article modal popup */}
                    <ExpandableInfo
                      title={art.title}
                      shortText={art.description}
                      buttonText={audienceMode === 'anak' ? "Buka Cerita 🔮" : "Baca Selengkapnya"}
                      useModal={true}
                    >
                      <div className="space-y-4">
                        <img src={art.image} alt={art.title} className="w-full h-44 object-cover rounded-xl" />
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          {art.description}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {art.id === 1 
                            ? 'Dahulu kala, ada sebuah botol plastik bernama Plastila. Ia sedih karena dibuang sembarangan di taman. Beruntung, ada anak baik yang mengambilnya lalu menyetorkannya ke Bank Sampah DLH Batu. Di pabrik daur ulang, Plastila dicairkan secara modern lalu dicetak ulang menjadi sebuah mainan robot astronot berwarna merah cerah! Sekarang Plastila senang sekali karena bisa menemani anak-anak bermain setiap hari tanpa mengotori bumi!'
                            : 'Membuat tanah ajaib itu seru dan mudah! Pertama, siapkan pot pot plastik bekas. Lapisi bagian paling bawah dengan sekam atau serbuk kayu kering. Kedua, masukkan potongan kulit buah, tangkai sayur sisa masak di dapur. Ketiga, tuang EM4 sedikit saja untuk menghilangkan bau. Keempat, tutup rapat selama 3 minggu. Wah, saat dibuka, sisa makanan sudah berubah menjadi tanah pupuk hitam legam yang sangat harum dan kaya nutrisi! Tanaman buahmu pasti tumbuh super subur!'
                          }
                        </p>
                      </div>
                    </ExpandableInfo>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-5 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-emerald-400"/>
                {audienceMode === 'anak' ? "Poster Lucu & Stiker! 🎨" : "Brosur & Dokumen PDF"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {audienceMode === 'anak' ? "Cetak poster lucu ini dan tempel di kamarmu!" : "Poster dan panduan praktis yang siap dicetak untuk dipajang di kantor atau rumah."}
              </p>
              
              <div className="space-y-3">
                {downloadMaterials.map((m,i)=>(
                  <div key={i} className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg border border-navy-600/10">
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 text-xl">{m.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {audienceMode === 'anak' && m.name.includes('Composting') ? "Poster Kompos Ceria" : m.name}
                        </p>
                        <p className="text-[9px] text-slate-500">{m.type} • {m.size}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 border-l-4 border-amber-500">
              <h4 className="font-bold text-white text-sm mb-1">Butuh Bantuan Khusus?</h4>
              <p className="text-xs text-slate-400 mb-3">Jika Anda ingin mengundang fasilitator DLH untuk memberikan sosialisasi di tingkat RW atau sekolah, tim penyuluh kami siap datang membantu secara gratis.</p>
              <Link to="/layanan-publik" className="text-emerald-400 text-xs font-bold flex items-center gap-0.5 hover:underline">
                Hubungi Penyuluh DLH <ChevronRight className="w-3.5 h-3.5"/>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
            <HelpCircle className="w-5 h-5 text-amber-400"/>
            Pertanyaan Yang Sering Diajukan (FAQ)
          </h2>
          <div className="space-y-3">
            {faqItems.map((faq,i)=>(
              <div key={i} className="glass-card overflow-hidden">
                <button 
                  onClick={()=>setOpenFaq(openFaq===i?-1:i)} 
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs md:text-sm text-white"
                >
                  <span className="pr-4">{faq.question}</span>
                  {openFaq===i ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0"/> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0"/>}
                </button>
                {openFaq===i && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-navy-600/10 pt-3 animate-slide-down">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
