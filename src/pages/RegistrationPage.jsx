import { useState } from 'react';
import { Send, Building2, MapPin, User, Phone, FileText, Upload } from 'lucide-react';
import Toast from '../components/Toast';

export default function RegistrationPage() {
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    bankName: '', district: '', village: '', address: '', postalCode: '',
    coordinates: '',
    managerName: '', managerPhone: '', managerEmail: '',
    memberCount: '', established: '', description: '',
    materials: [],
  });

  const materialOptions = ['Plastic (PET, HDPE)', 'Paper & Cardboard', 'Glass', 'Metals (Aluminum, Tin)', 'Organic / Compost', 'E-Waste', 'Textiles'];

  const handleMaterial = (mat) => {
    setForm((prev) => ({
      ...prev,
      materials: prev.materials.includes(mat)
        ? prev.materials.filter((m) => m !== mat)
        : [...prev.materials, mat],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setForm({
      bankName: '', district: '', village: '', address: '', postalCode: '',
      coordinates: '',
      managerName: '', managerPhone: '', managerEmail: '',
      memberCount: '', established: '', description: '',
      materials: [],
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold text-white">Waste Bank Registration</h1>
          <p className="text-slate-400 mt-1">Register your community waste bank to join the Kota Batu network.</p>
        </div>
      </section>

      <div className="page-container py-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Waste Bank Info */}
          <div className="glass-card p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Waste Bank Information</h2>
                <p className="text-sm text-slate-400">Basic details about the waste bank</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Waste Bank Name *</label>
                <input type="text" required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="e.g., Bank Sampah Melati Indah" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">District (Kecamatan) *</label>
                <select required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="input-field">
                  <option value="">Select district...</option>
                  <option value="Batu">Kecamatan Batu</option>
                  <option value="Bumiaji">Kecamatan Bumiaji</option>
                  <option value="Junrejo">Kecamatan Junrejo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Village (Kelurahan/Desa) *</label>
                <input type="text" required value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} placeholder="e.g., Pesanggrahan" className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Address *</label>
                <textarea rows={2} required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Jl. Panglima Sudirman No. 12, RT 03 RW 05..." className="input-field resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Koordinat Google Maps</label>
                <input type="text" value={form.coordinates} onChange={(e) => setForm({ ...form, coordinates: e.target.value })} placeholder="-7.8661377, 112.5133019" className="input-field" />
                <p className="text-xs text-slate-400 mt-1">Format: latitude, longitude. Contoh: -7.8661377, 112.5133019</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Postal Code</label>
                <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="65313" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Date Established</label>
                <input type="date" value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} className="input-field" />
              </div>
            </div>
          </div>

          {/* Manager Info */}
          <div className="glass-card p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Manager / Contact Person</h2>
                <p className="text-sm text-slate-400">Person responsible for the waste bank</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Manager Full Name *</label>
                <input type="text" required value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} placeholder="Bpk./Ibu Full Name" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number *</label>
                <input type="tel" required value={form.managerPhone} onChange={(e) => setForm({ ...form, managerPhone: e.target.value })} placeholder="+62 812 3456 7890" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                <input type="email" value={form.managerEmail} onChange={(e) => setForm({ ...form, managerEmail: e.target.value })} placeholder="manager@email.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Number of Members</label>
                <input type="number" value={form.memberCount} onChange={(e) => setForm({ ...form, memberCount: e.target.value })} placeholder="e.g., 50" className="input-field" />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="glass-card p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Jenis Sampah Diterima</h2>
                <p className="text-sm text-slate-400">Pilih jenis sampah yang akan dikumpulkan oleh bank ini.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {materialOptions.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleMaterial(mat)}
                  className={`p-3 rounded-lg text-sm font-medium border transition-all text-left ${
                    form.materials.includes(mat)
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-navy-900/50 border-navy-600/30 text-slate-400 hover:border-navy-500'
                  }`}
                >
                  {form.materials.includes(mat) ? '✓ ' : ''}{mat}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Upload */}
          <div className="glass-card p-6 md:p-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Additional Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell us about your waste bank's mission, community engagement..." className="input-field resize-none" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Supporting Documents</label>
              <div className="border-2 border-dashed border-navy-600/50 rounded-xl p-8 text-center hover:border-emerald-500/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Drag & drop files here or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">
              <Send className="w-4 h-4" />
              Submit Registration
            </button>
          </div>
        </form>
      </div>

      <Toast
        message="Registration submitted successfully! We'll review your application."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
