import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, User, MessageSquare, Clock, ShieldAlert, LogIn, Image, X } from 'lucide-react';
import { guestBookEntries, visitorCategories } from '../data/guestbook';
import Toast from '../components/Toast';
import { supabase } from '../lib/supabase';

export default function GuestBookPage() {
  const [entries, setEntries] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({ category: '', message: '' });
  const [selectedImage, setSelectedImage] = useState(null); // base64 representation
  const navigate = useNavigate();

  // Load user session and guestbook data on mount
  useEffect(() => {
    const user = localStorage.getItem('wastebank-user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const loadGuestbook = async () => {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('id', { ascending: false });
        
        if (!error && data && data.length > 0) {
          setEntries(data);
          localStorage.setItem('wastebank-guestbook', JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error('Failed to fetch guestbook from Supabase:', err);
      }

      // Initialize or load guest book entries from localStorage as fallback
      const savedEntries = localStorage.getItem('wastebank-guestbook');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      } else {
        localStorage.setItem('wastebank-guestbook', JSON.stringify(guestBookEntries));
        setEntries(guestBookEntries);
      }
    };

    loadGuestbook();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newEntry = {
      id: Date.now(), // Unique ID
      name: currentUser.fullName || currentUser.username,
      initials: (currentUser.fullName || currentUser.username)
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      email: currentUser.email,
      category: form.category,
      message: form.message,
      date: 'Baru saja',
      color: 'bg-emerald-500',
      image: selectedImage, // save base64 image representation
    };

    // Attempt to save to Supabase
    try {
      const { error } = await supabase.from('guestbook').insert([{
        name: newEntry.name,
        initials: newEntry.initials,
        email: newEntry.email,
        category: newEntry.category,
        message: newEntry.message,
        date: newEntry.date,
        image: newEntry.image
      }]);
      if (error) console.error('Supabase error:', error.message);
    } catch (err) {
      console.error('Failed to sync guestbook to Supabase:', err);
    }

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('wastebank-guestbook', JSON.stringify(updatedEntries));
    
    // Trigger custom event so admin console updates if open
    window.dispatchEvent(new Event('guestbookChange'));

    setForm({ category: '', message: '' });
    setSelectedImage(null);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
    
    setShowToast(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold text-white">Buku Tamu Digital & Pengaduan</h1>
          <p className="text-slate-400 mt-1 text-sm">Sampaikan masukan, ulasan, atau aduan sampah liar beserta lampiran gambar untuk mendukung kebersihan Kota Batu.</p>
        </div>
      </section>

      <div className="page-container py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Form / Lock Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-24">
              
              {!currentUser ? (
                // 1. UNATHENTICATED LOCK PANEL
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Silakan Login Terlebih Dahulu</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Anda harus masuk ke akun pengguna untuk mengisi Buku Tamu atau melaporkan tumpukan sampah liar.
                  </p>
                  <Link 
                    to="/login"
                    className="btn-primary w-full justify-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login / Register Akun</span>
                  </Link>
                </div>
              ) : (
                // 2. AUTHENTICATED WRITING FORM
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Berikan Ulasan / Pengaduan</h2>
                  <p className="text-xs text-slate-400 mb-4">Ulasan Anda membantu kami meningkatkan layanan pengelolaan kota.</p>
                  
                  {/* Logged in User Profile Info */}
                  <div className="mb-4 p-3 rounded-lg bg-navy-950/60 border border-navy-600/20 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                      {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Kategori Pengunjung *</label>
                      <select
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="input-field !py-2.5 text-xs text-white"
                      >
                        <option value="">Pilih kategori Anda...</option>
                        {visitorCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Isi Pesan / Saran *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tulis ulasan, kritik, atau detail laporan aduan Anda..."
                        className="input-field resize-none !py-2 text-xs text-white"
                      />
                    </div>

                    {/* Image Attachment File Selector */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                        Lampiran Foto (Opsional)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-800 border border-navy-600/30 text-slate-300 hover:text-white cursor-pointer transition-colors text-xs font-semibold">
                          <Image className="w-4 h-4 text-emerald-400" />
                          <span>Pilih Gambar</span>
                          <input 
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {selectedImage && (
                          <span className="text-[10px] text-emerald-400 font-semibold truncate max-w-[150px]">
                            Gambar dipilih
                          </span>
                        )}
                      </div>

                      {/* Image Preview Thumbnail */}
                      {selectedImage && (
                        <div className="relative mt-3 w-fit rounded-lg overflow-hidden border border-navy-600/40 bg-navy-950/40 p-1">
                          <img 
                            src={selectedImage} 
                            alt="Attachment preview" 
                            className="h-20 w-auto rounded object-cover max-w-[200px]" 
                          />
                          <button 
                            type="button" 
                            onClick={removeSelectedImage}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center py-2.5 text-xs uppercase tracking-wider font-bold">
                      <Send className="w-4 h-4" />
                      Kirim Ulasan / Laporan
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Entries list */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Pesan & Pengaduan Terbaru</h2>
              <span className="text-xs text-slate-400 font-semibold">{entries.length} pesan terdaftar</span>
            </div>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="glass-card p-5 hover:border-navy-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 ${entry.color || 'bg-emerald-500'} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {entry.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{entry.name}</h4>
                          <span className="badge-emerald text-[9px] uppercase tracking-wider">{entry.category}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          {entry.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{entry.message}</p>
                      
                      {/* Attached Image display */}
                      {entry.image && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-navy-700/50 max-w-sm">
                          <img 
                            src={entry.image} 
                            alt="Citizen report attachment" 
                            className="w-full max-h-60 object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-6">Belum ada ulasan atau pengaduan warga.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast
        message="Terima kasih! Pesan ulasan Anda berhasil dikirim."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
