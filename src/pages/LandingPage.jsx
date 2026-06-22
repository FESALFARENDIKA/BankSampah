import { Link } from 'react-router-dom';
import {
  ArrowRight, Recycle, BarChart3, MapPin, CalendarDays, BookOpen,
  TrendingUp, Users, Building2, Leaf, ChevronRight, Clock
} from 'lucide-react';
import { landingActivities } from '../data/activities';

const services = [
  {
    icon: BarChart3,
    title: 'Dashboard Statistics',
    description: 'Monitor real-time data on waste collection, recycling rates, and Bank Sampah performance.',
    path: '/dashboard-statistics',
  },
  {
    icon: MapPin,
    title: 'Waste Bank Directory',
    description: 'Find the nearest Bank Sampah location, operating hours, and accepted materials.',
    path: '/directory',
  },
  {
    icon: CalendarDays,
    title: 'Collection Schedule',
    description: 'Check upcoming waste pickup schedules and subscribe to reminders for your area.',
    path: '/schedule',
  },
  {
    icon: BookOpen,
    title: 'Education Hub',
    description: 'Access guides, tips, and downloadable materials on proper waste management.',
    path: '/education-guidelines',
  },
];

const quickStats = [
  { value: '1,245', unit: 'Tons', label: 'Total Waste Collected', icon: Recycle },
  { value: '142', unit: 'Units', label: 'Active Waste Banks', icon: Building2 },
  { value: '12,400+', unit: '', label: 'Registered Participants', icon: Users },
  { value: '68%', unit: '', label: 'Recycling Rate', icon: TrendingUp },
];

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-3xl" />

        <div className="page-container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Dinas Lingkungan Hidup Kota Batu</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
                Sistem Informasi{' '}
                <span className="text-gradient">Bank Sampah</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Platform digital untuk mengelola, memantau, dan meningkatkan partisipasi masyarakat
                dalam program Bank Sampah di seluruh wilayah Kota Batu.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard-statistics" className="btn-primary text-base">
                  <BarChart3 className="w-5 h-5" />
                  Lihat Dashboard
                </Link>
                <Link to="/registration" className="btn-outline text-base">
                  Daftar Bank Sampah
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-navy-600/30">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-navy-700/50" />
                <img
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80"
                  alt="Waste Bank Management"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-navy-900/90 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="glass-card px-4 py-2">
                      <p className="text-2xl font-bold text-emerald-400">1,245</p>
                      <p className="text-xs text-slate-400">Tons Collected</p>
                    </div>
                    <div className="glass-card px-4 py-2">
                      <p className="text-2xl font-bold text-emerald-400">142</p>
                      <p className="text-xs text-slate-400">Active Banks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-navy-800/30 border-y border-navy-600/20">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center group hover:border-emerald-500/30 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-2xl md:text-3xl font-bold text-slate-100">
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-slate-400 ml-1">{stat.unit}</span>}
                </p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-title">Layanan Kami</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Akses berbagai layanan digital untuk mendukung pengelolaan sampah di Kota Batu
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <Link
                key={i}
                to={svc.path}
                className="glass-card-hover p-6 group"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <svc.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{svc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{svc.description}</p>
                <div className="mt-4 flex items-center text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Activities */}
      <section className="py-20 bg-navy-800/20">
        <div className="page-container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title">Aktivitas Terbaru</h2>
              <p className="section-subtitle">Kegiatan dan informasi terkini seputar Bank Sampah</p>
            </div>
            <Link to="/galeri-kegiatan" className="hidden sm:flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {landingActivities.map((item) => (
              <Link
                key={item.id}
                to={`/activities/${item.id}`}
                className="glass-card-hover overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="badge-emerald">{item.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                  <span className="inline-flex items-center text-emerald-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    Read more <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/galeri-kegiatan" className="btn-outline text-sm">
              View All Activities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container">
          <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent" />
            <div className="relative z-10">
              <Recycle className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                Bergabunglah dengan Program Bank Sampah
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                Daftarkan diri Anda atau kelompok masyarakat untuk membentuk Bank Sampah baru.
                Bersama kita wujudkan Kota Batu yang bersih dan berkelanjutan.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/registration" className="btn-primary text-base">
                  Daftar Sekarang <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/profil-dlh" className="btn-outline text-base">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
