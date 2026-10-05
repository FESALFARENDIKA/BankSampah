import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, User, ShieldAlert, AlertCircle, ArrowLeft, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'forgot'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Forgot Password Wizard States
  const [forgotStep, setForgotStep] = useState(1); // 1: find user, 2: reset pass
  const [forgotUser, setForgotUser] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authView === 'register') {
      if (!usernameOrEmail || !password || !fullName) {
        setErrorMsg('Harap isi semua bidang input!');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Password dan konfirmasi password tidak cocok!');
        return;
      }

      try {
        // Check duplicate
        const { data: existing } = await supabase
          .from('users')
          .select('username')
          .or(`username.eq."${usernameOrEmail}",email.eq."${usernameOrEmail}"`)
          .maybeSingle();

        if (existing) {
          setErrorMsg('Username atau Email sudah terdaftar!');
          return;
        }

        // Insert
        const { data, error } = await supabase
          .from('users')
          .insert([{
            username: usernameOrEmail,
            full_name: fullName,
            email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@wastebank.id`,
            password: password,
            role: 'citizen'
          }])
          .select();

        if (error) {
          setErrorMsg('Registrasi gagal: ' + error.message);
          return;
        }

        localStorage.setItem('wastebank-user', JSON.stringify(data[0]));
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } catch (err) {
        setErrorMsg('Koneksi ke database gagal!');
      }
    } else {
      // Login
      if (!usernameOrEmail || !password) {
        setErrorMsg('Harap isi username/email dan password!');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .or(`username.eq."${usernameOrEmail}",email.eq."${usernameOrEmail}"`)
          .eq('password', password);

        if (error) {
          setErrorMsg('Database query error!');
          return;
        }

        if (!data || data.length === 0) {
          setErrorMsg('Username/Email atau Password salah!');
          return;
        }

        localStorage.setItem('wastebank-user', JSON.stringify(data[0]));
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } catch (err) {
        setErrorMsg('Koneksi ke server gagal!');
      }
    }
  };

  const handleForgotSearch = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!forgotUser) {
      setErrorMsg('Masukkan username atau email Anda!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.eq."${forgotUser}",email.eq."${forgotUser}"`)
        .maybeSingle();

      if (error || !data) {
        setErrorMsg('Pengguna tidak ditemukan!');
        return;
      }

      setTargetUser(data);
      setForgotStep(2);
    } catch (err) {
      setErrorMsg('Gagal mencari data user!');
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newPassword || !confirmNewPassword) {
      setErrorMsg('Harap lengkapi semua input password!');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', targetUser.id);

      if (error) {
        setErrorMsg('Gagal memperbarui password!');
        return;
      }

      setResetSuccess(true);
      setTimeout(() => {
        setAuthView('login');
        setForgotStep(1);
        setForgotUser('');
        setTargetUser(null);
        setNewPassword('');
        setConfirmNewPassword('');
        setResetSuccess(false);
      }, 3000);
    } catch (err) {
      setErrorMsg('Terjadi kesalahan update password!');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 text-slate-700 hover:text-emerald-600 flex items-center gap-1 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </button>

      <div className="w-full max-w-4xl bg-white border border-emerald-200 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2 min-h-[500px]">
        {/* LEFT PANEL: FIGMA REFERENCE BRANDING */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 flex flex-col justify-between text-white relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 20%, #ffffff 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <img
                  src="/external/logo_kota_batu.png"
                  alt="DLH Kota Batu"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                DLH<span className="text-white font-extrabold">Batu</span>
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-white">Dinas Lingkungan Hidup Kota Batu</h2>
            <p className="text-white/95 mt-2 text-sm leading-relaxed">Waste Bank Management System</p>
          </div>

          <div className="relative z-10 mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-300 rounded-full" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Lokasi Pelayanan</p>
                <p className="text-xs text-white/95 font-medium">KOTA BATU, JAWA TIMUR</p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-[11px] font-bold text-white uppercase tracking-widest pt-4 border-t border-white/10">
              <span>EST. 2023</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white/95">
                <Sparkles className="w-3.5 h-3.5" /> GREEN INITIATIVE
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE LOGIN / REGISTER / FORGOT FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white text-slate-800">
          
          {authView === 'forgot' ? (
            // FORGOT PASSWORD VIEW
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">RESET PASSWORD</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                  {forgotStep === 1 ? 'Langkah 1: Cari Akun Pengguna' : 'Langkah 2: Buat Password Baru'}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Password berhasil diperbarui! Mengalihkan ke halaman login...</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleForgotSearch} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Username / Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Masukkan username atau email Anda"
                        value={forgotUser}
                        onChange={e => setForgotUser(e.target.value)}
                        className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full btn-primary text-xs justify-center py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1 mt-4"
                  >
                    <span>CARI PENGGUNA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">User Ditemukan:</span>
                    <span className="text-xs font-bold text-emerald-800">{targetUser?.full_name} (@{targetUser?.username})</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Password Baru</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        placeholder="Masukkan password baru"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        placeholder="Masukkan ulang password baru"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full btn-primary text-xs justify-center py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1 mt-4"
                  >
                    <span>UPDATE PASSWORD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="mt-8 text-center pt-4 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => { setAuthView('login'); setForgotStep(1); setForgotUser(''); setErrorMsg(''); }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-wider underline"
                >
                  Kembali ke Login
                </button>
              </div>
            </div>
          ) : (
            // LOGIN / REGISTER VIEWS
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {authView === 'login' ? 'LOGIN AKUN PENGGUNA' : 'REGISTER AKUN BARU'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                  {authView === 'login' ? 'Silakan login terlebih dahulu' : 'Lengkapi data formulir pendaftaran'}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {authView === 'register' && (
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Masukkan nama lengkap Anda"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Username / Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Masukkan username atau email Anda"
                      value={usernameOrEmail}
                      onChange={e => setUsernameOrEmail(e.target.value)}
                      className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {authView === 'register' && (
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Konfirmasi Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        placeholder="Masukkan ulang password Anda"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="input-field !pl-10 !py-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {authView === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
                      onClick={() => { setAuthView('forgot'); setErrorMsg(''); }}
                    >
                      Lupa Password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full btn-primary text-xs justify-center py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1 mt-4"
                >
                  <span>{authView === 'login' ? 'LOGIN SEKARANG' : 'SUBMIT PENDAFTARAN'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-8 text-center pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  {authView === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
                </span>
                <button 
                  onClick={() => {
                    setAuthView(authView === 'login' ? 'register' : 'login');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-wider underline"
                >
                  {authView === 'login' ? 'Daftar Baru' : 'Login Disini'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
