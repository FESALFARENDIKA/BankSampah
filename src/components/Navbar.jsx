import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, ChevronDown, Compass, Award, Building, BookOpen, Calendar, HelpCircle, BarChart2, ShieldAlert, LogOut, LogIn, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'profil', 'layanan', 'edukasi'
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load and listen to Auth Session state
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('wastebank-user');
      setCurrentUser(user ? JSON.parse(user) : null);
    };
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (name) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
  };

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wastebank-user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const menuGroups = {
    profil: {
      label: 'Profil & Hubungan',
      items: [
        { label: 'Tentang DLH & Visi', path: '/profil-dlh', desc: 'Misi, visi, pilar ekologi, dan informasi operasional Dinas Lingkungan Hidup.' },
        { label: 'Buku Tamu Digital', path: '/guest-book', desc: 'Isi kehadiran dan berikan saran untuk pengelolaan kota yang bersih.' },
      ]
    },
    layanan: {
      label: 'Layanan Warga',
      items: [
        { label: 'Layanan Publik', path: '/layanan-publik', desc: 'Hubungi kontak dinas dan lakukan pengaduan kebersihan.' },
        { label: 'Direktori Bank Sampah', path: '/directory', desc: 'Temukan unit Bank Sampah terdekat di Kota Batu.' },
        { label: 'Jadwal Pengambilan', path: '/schedule', desc: 'Cek jadwal pengangkutan dan pickup sampah daur ulang.' },
      ]
    },
    edukasi: {
      label: 'Data & Edukasi',
      items: [
        { label: 'Data Pengelolaan (Statistik)', path: '/dashboard-statistics', desc: 'Pantau grafik volume sampah, daur ulang, dan dampak lingkungan.' },
        { label: 'Galeri Kegiatan', path: '/galeri-kegiatan', desc: 'Dokumentasi acara sosialisasi, aksi bersih, dan Adiwiyata.' },
        { label: 'Panduan & Edukasi', path: '/education-guidelines', desc: 'Pelajari teknik pilah sampah, pembuatan kompos, dan nilai ekonomi.' },
      ]
    }
  };

  // Add Admin Console option only for authenticated administrator users
  const getProfilItems = () => {
    const items = [...menuGroups.profil.items];
    if (currentUser && currentUser.role === 'admin') {
      items.push({
        label: 'Admin Console (Kelola)',
        path: '/admin-dashboard',
        desc: 'Panel administrator untuk kelola registrasi, jadwal, aduan, dan edukasi.'
      });
    }
    return items;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-600/30">
      <div className="page-container">
        <div className="flex items-center justify-between h-16" ref={dropdownRef}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              DLH<span className="text-emerald-400">Batu</span>
            </span>
          </Link>

          {/* Desktop Nav dengan Dropdowns */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Dropdown 1: Profil */}
            <div
              className="relative py-2 -my-2"
              onMouseEnter={() => handleMouseEnter('profil')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('profil')}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-1 ${activeDropdown === 'profil' || location.pathname === '/profil-dlh' || location.pathname === '/guest-book' || location.pathname === '/admin-dashboard'
                    ? 'text-emerald-400 bg-navy-800'
                    : 'text-slate-300 hover:text-emerald-300 hover:bg-navy-800/50'
                  }`}
              >
                PROFIL <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'profil' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'profil' && (
                <div className="absolute left-0 mt-2 w-80 bg-navy-800 border border-navy-600/50 rounded-xl shadow-2xl p-2 animate-slide-down">
                  {getProfilItems().map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className={`block p-3 rounded-lg hover:bg-navy-700/60 transition-colors ${location.pathname === item.path ? 'bg-navy-700/40 text-emerald-400 font-semibold' : 'text-white'
                        }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-sm">
                        {item.path === '/admin-dashboard' && <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                        <span className={item.path === '/admin-dashboard' ? 'text-red-400' : ''}>{item.label}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: Layanan */}
            <div
              className="relative py-2 -my-2"
              onMouseEnter={() => handleMouseEnter('layanan')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('layanan')}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-1 ${activeDropdown === 'layanan' || ['/layanan-publik', '/directory', '/schedule'].includes(location.pathname)
                    ? 'text-emerald-400 bg-navy-800'
                    : 'text-slate-300 hover:text-emerald-300 hover:bg-navy-800/50'
                  }`}
              >
                LAYANAN <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'layanan' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'layanan' && (
                <div className="absolute left-0 mt-2 w-96 bg-navy-800 border border-navy-600/50 rounded-xl shadow-2xl p-2 animate-slide-down">
                  <div className="grid grid-cols-1 gap-1">
                    {menuGroups.layanan.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className={`block p-3 rounded-lg hover:bg-navy-700/60 transition-colors ${location.pathname === item.path ? 'bg-navy-700/40 text-emerald-400' : 'text-white'
                          }`}
                      >
                        <div className="font-semibold text-sm">{item.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 3: Data & Edukasi */}
            <div
              className="relative py-2 -my-2"
              onMouseEnter={() => handleMouseEnter('edukasi')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('edukasi')}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-1 ${activeDropdown === 'edukasi' || ['/dashboard-statistics', '/galeri-kegiatan', '/education-guidelines'].includes(location.pathname)
                    ? 'text-emerald-400 bg-navy-800'
                    : 'text-slate-300 hover:text-emerald-300 hover:bg-navy-800/50'
                  }`}
              >
                DATA & EDUKASI <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'edukasi' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'edukasi' && (
                <div className="absolute right-0 lg:left-0 mt-2 w-96 bg-navy-800 border border-navy-600/50 rounded-xl shadow-2xl p-2 animate-slide-down">
                  {menuGroups.edukasi.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className={`block p-3 rounded-lg hover:bg-navy-700/60 transition-colors ${location.pathname === item.path ? 'bg-navy-700/40 text-emerald-400' : 'text-white'
                        }`}
                    >
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side CTA: Dynamic Login/Register or Logout Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-navy-800/60 border border-navy-700/50 rounded-full px-3 py-1.5 text-xs text-slate-300 font-semibold">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Halo, {currentUser.fullName.split(' ')[0]}!</span>
                  {currentUser.role === 'admin' && <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded ml-1 font-bold">Admin</span>}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-xs !px-3 !py-2 shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-xs !px-4 !py-2 shrink-0 flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full font-bold">
                {currentUser.fullName.split(' ')[0]}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isOpen && (
          <div className="lg:hidden pb-6 animate-slide-down max-h-[80vh] overflow-y-auto">
            <div className="space-y-4 pt-2">
              {/* Profil Group */}
              <div>
                <div className="text-xs text-slate-500 font-bold px-4 uppercase tracking-wider mb-1">
                  {menuGroups.profil.label}
                </div>
                <div className="space-y-1">
                  {getProfilItems().map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-2 text-sm rounded-lg transition-all ${location.pathname === item.path
                          ? 'text-emerald-400 bg-navy-800'
                          : 'text-slate-300 hover:text-emerald-300'
                        }`}
                    >
                      <span className={item.path === '/admin-dashboard' ? 'text-red-400 font-bold' : ''}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Layanan Group */}
              <div>
                <div className="text-xs text-slate-500 font-bold px-4 uppercase tracking-wider mb-1">
                  {menuGroups.layanan.label}
                </div>
                <div className="space-y-1">
                  {menuGroups.layanan.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-2 text-sm rounded-lg transition-all ${location.pathname === item.path
                          ? 'text-emerald-400 bg-navy-800'
                          : 'text-slate-300 hover:text-emerald-300'
                        }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Edukasi Group */}
              <div>
                <div className="text-xs text-slate-500 font-bold px-4 uppercase tracking-wider mb-1">
                  {menuGroups.edukasi.label}
                </div>
                <div className="space-y-1">
                  {menuGroups.edukasi.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-2 text-sm rounded-lg transition-all ${location.pathname === item.path
                          ? 'text-emerald-400 bg-navy-800'
                          : 'text-slate-300 hover:text-emerald-300'
                        }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pt-2 px-4 flex flex-col gap-2">
                {currentUser ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="btn-outline text-sm justify-center py-2.5 rounded-lg border-red-500/40 text-red-400"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary text-sm justify-center py-2.5 rounded-lg flex items-center gap-1"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login / Register</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
