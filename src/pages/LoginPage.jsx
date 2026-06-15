import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, User, ShieldAlert, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Added for guest book name binding!
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameOrEmail || !password) {
      setErrorMsg('Harap isi semua bidang input!');
      return;
    }

    if (!isLoginView) {
      if (!fullName) {
        setErrorMsg('Nama lengkap wajib diisi untuk pendaftaran!');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Password dan konfirmasi password tidak cocok!');
        return;
      }
    }

    // Determine role (simulate admin for specific names/emails to allow evaluation of Admin Dashboard)
    const isAdmin = usernameOrEmail.toLowerCase().includes('admin') || usernameOrEmail.toLowerCase() === 'dosen';
    const finalName = isLoginView 
      ? (usernameOrEmail.toLowerCase() === 'admin' ? 'Administrator DLH' : usernameOrEmail.split('@')[0]) 
      : fullName;

    const userObj = {
      username: usernameOrEmail,
      fullName: finalName,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@wastebank.id`,
      role: isAdmin ? 'admin' : 'citizen'
    };

    // Save session in localStorage
    localStorage.setItem('wastebank-user', JSON.stringify(userObj));

    // Force custom event to notify Navbar of auth state change
    window.dispatchEvent(new Event('authChange'));

    // Redirect to profile/about page (tampilan awal)
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </button>

      <div className="w-full max-w-4xl bg-navy-900 border border-navy-700/60 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2 min-h-[500px]">
        
        {/* LEFT PANEL: FIGMA REFERENCE BRANDING */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-emerald-600 via-emerald-800 to-navy-950 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, #10b981 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">DLH<span className="text-emerald-300">Batu</span></span>
            </div>
            
            <h2 className="text-3xl font-extrabold leading-tight">Dinas Lingkungan Hidup Kota Batu</h2>
            <p className="text-emerald-200 mt-2 text-sm leading-relaxed">Waste Bank Management System</p>
          </div>

          <div className="relative z-10 mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-400 rounded-full" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Lokasi Pelayanan</p>
                <p className="text-xs text-white font-medium">KOTA BATU, JAWA TIMUR</p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-[11px] font-bold text-emerald-100 uppercase tracking-widest pt-4 border-t border-white/10">
              <span>EST. 2023</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" /> GREEN INITIATIVE
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE LOGIN / REGISTER FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-navy-900 text-white">
          <div className="mb-6">
            <h3 className="text-2xl font-extrabold tracking-tight">
              {isLoginView ? 'LOGIN AKUN PENGGUNA' : 'REGISTER AKUN BARU'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
              {isLoginView ? 'Silakan login terlebih dahulu' : 'Lengkapi data formulir pendaftaran'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Show Full Name field ONLY during registration */}
            {!isLoginView && (
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Masukkan nama lengkap Anda"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="input-field !pl-10 !py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Username / Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Masukkan username atau email Anda"
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  className="input-field !pl-10 !py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field !pl-10 !py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Confirm Password field ONLY during registration */}
            {!isLoginView && (
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="Masukkan ulang password Anda"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field !pl-10 !py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {isLoginView && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                  onClick={() => alert('Sistem reset password disimulasikan!')}
                >
                  Lupa Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn-primary text-xs justify-center py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1 mt-4"
            >
              <span>{isLoginView ? 'LOGIN SEKARANG' : 'SUBMIT PENDAFTARAN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle panel */}
          <div className="mt-8 text-center pt-4 border-t border-navy-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              {isLoginView ? 'Belum punya akun?' : 'Sudah punya akun?'}
            </span>
            <button 
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMsg('');
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider underline"
            >
              {isLoginView ? 'Daftar Baru' : 'Login Disini'}
            </button>
          </div>
          
          <div className="mt-4 p-2 bg-navy-950 rounded-lg border border-navy-800 text-[9px] text-slate-500 text-center">
            Tips: Ketik username <strong>admin</strong> atau <strong>dosen</strong> untuk masuk sebagai Administrator.
          </div>
        </div>

      </div>
    </div>
  );
}
