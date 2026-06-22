import { Link } from 'react-router-dom';
import { Leaf, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 18V5l12-1v7" />
    <circle cx="9" cy="18" r="3" />
  </svg>
);

const quickLinks = [
  { label: 'Dashboard Statistics', path: '/dashboard-statistics' },
  { label: 'Waste Bank Directory', path: '/directory' },
  { label: 'Collection Schedule', path: '/schedule' },
  { label: 'Education & Guidelines', path: '/education-guidelines' },
];

const services = [
  { label: 'Layanan Publik', path: '/layanan-publik' },
  { label: 'Register Waste Bank', path: '/registration' },
  { label: 'Guest Book', path: '/guest-book' },
  { label: 'Profil DLH', path: '/profil-dlh' },
];

export default function Footer() {
  return (
    <footer className="bg-emerald-900 border-t border-emerald-700/50 mt-20 text-white">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/external/logo_kota_batu.png"
                alt="DLH Kota Batu"
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg font-bold">
                <span className="text-white">DLH </span>
                <span className="text-emerald-300">Kota Batu</span>
              </span>
            </Link>
            <p className="text-white/85 text-sm leading-relaxed mb-6">
              Sistem Informasi & Pengelolaan Bank Sampah Dinas Lingkungan Hidup Kota Batu.
              Mewujudkan kota yang bersih, hijau, dan berkelanjutan.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-emerald-700/40 border border-emerald-400/50 flex items-center justify-center text-emerald-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-300 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-emerald-700/40 border border-emerald-400/50 flex items-center justify-center text-emerald-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-300 transition-all"
              >
                <TikTokIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-emerald-700/40 border border-emerald-400/50 flex items-center justify-center text-emerald-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-300 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                      to={link.path}
                      className="text-sm text-white hover:text-emerald-300 transition-colors"
                    >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-sm text-white hover:text-emerald-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                <span className="text-sm text-white">
                  Balaikota Among Tani, Gedung B Lantai 2, Jl. Panglima Sudirman No.507, Pesanggrahan, Kota Batu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-sm text-white">(0341) 596000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-sm text-white">dlh@batukota.go.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-700/50">
        <div className="page-container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white">
            © 2023 Dinas Lingkungan Hidup Kota Batu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white hover:text-emerald-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-white hover:text-emerald-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
