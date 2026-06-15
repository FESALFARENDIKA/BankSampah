import { Link } from 'react-router-dom';
import { Leaf, Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

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
    <footer className="bg-navy-950 border-t border-navy-600/30 mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                DLH<span className="text-emerald-400">Batu</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistem Informasi & Pengelolaan Bank Sampah Dinas Lingkungan Hidup Kota Batu.
              Mewujudkan kota yang bersih, hijau, dan berkelanjutan.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-navy-800 border border-navy-600/50 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  Balaikota Among Tani, Gedung B Lantai 2, Jl. Panglima Sudirman No.507, Pesanggrahan, Kota Batu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">(0341) 596000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">dlh@batukota.go.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-600/20">
        <div className="page-container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2023 Dinas Lingkungan Hidup Kota Batu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
