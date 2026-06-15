import { useState } from 'react';
import { Search, MapPin, Clock, ChevronRight, Phone, MessageCircle, Navigation, ArrowLeft } from 'lucide-react';
import { wasteBanks, districts } from '../data/directoryData';

export default function DirectoryPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);

  const filtered = wasteBanks.filter((bank) => {
    const matchDistrict = selectedDistrict === 'All Areas' || bank.address.includes(selectedDistrict);
    const matchSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDistrict && matchSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Map Placeholder */}
        <div className="lg:w-[45%] bg-navy-950 relative overflow-hidden h-64 lg:h-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-800/50 to-navy-900/90" />
          {/* Stylized map background */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, #10b981 1px, transparent 1px),
              radial-gradient(circle at 60% 30%, #10b981 1px, transparent 1px),
              radial-gradient(circle at 45% 70%, #10b981 1px, transparent 1px),
              radial-gradient(circle at 70% 60%, #10b981 1px, transparent 1px)`,
            backgroundSize: '100% 100%',
          }} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Map pins */}
          {wasteBanks.map((bank, i) => (
            <div
              key={bank.id}
              className={`absolute cursor-pointer transition-transform hover:scale-125 ${
                selectedBank?.id === bank.id ? 'scale-125' : ''
              }`}
              style={{ left: `${25 + i * 20}%`, top: `${30 + i * 15}%` }}
              onClick={() => setSelectedBank(bank)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bank.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-500'
              } shadow-lg shadow-emerald-500/20`}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            <button className="w-8 h-8 bg-navy-700 border border-navy-600 rounded flex items-center justify-center text-white hover:bg-navy-600 transition-colors">+</button>
            <button className="w-8 h-8 bg-navy-700 border border-navy-600 rounded flex items-center justify-center text-white hover:bg-navy-600 transition-colors">−</button>
          </div>
        </div>

        {/* Directory List */}
        <div className="lg:w-[30%] bg-navy-900 border-x border-navy-600/30 flex flex-col">
          <div className="p-6 border-b border-navy-600/30">
            <h1 className="text-2xl font-bold text-white mb-1">Waste Bank Directory</h1>
            <p className="text-sm text-slate-400 mb-4">Find and connect with {wasteBanks.length} active waste banks in Kota Batu.</p>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, area, or waste type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field !pl-10"
              />
            </div>
            {/* District Filter */}
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedDistrict === d
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'border-navy-600 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`p-5 border-b border-navy-600/20 cursor-pointer hover:bg-navy-800/50 transition-all ${
                  selectedBank?.id === bank.id ? 'bg-navy-800/60 border-l-2 border-l-emerald-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${bank.status === 'ACTIVE' ? 'badge-emerald' : 'bg-slate-500/20 text-slate-400'}`}>
                      {bank.status}
                    </span>
                    <span className="text-xs text-slate-500">{bank.distance}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-semibold text-white mb-1">{bank.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" /> {bank.address}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {bank.materials.map((m) => (
                    <span key={m} className="text-[10px] px-2 py-0.5 bg-navy-700/50 text-slate-400 rounded border border-navy-600/30">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> {bank.hours}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:w-[25%] bg-navy-950 border-navy-600/30 overflow-y-auto">
          {selectedBank ? (
            <div className="animate-fade-in">
              {/* Image */}
              <div className="relative h-48">
                <img src={selectedBank.image} alt={selectedBank.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                <button
                  onClick={() => setSelectedBank(null)}
                  className="absolute top-4 left-4 w-8 h-8 bg-navy-900/80 rounded-full flex items-center justify-center text-white hover:bg-navy-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-emerald">{selectedBank.status}</span>
                    <span className="text-xs text-slate-400 bg-navy-800/80 px-2 py-0.5 rounded">ID: {selectedBank.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedBank.name}</h2>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Get Directions */}
                <button className="w-full btn-primary justify-center">
                  <Navigation className="w-4 h-4" /> Get Directions
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 btn-outline justify-center !px-3">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="flex-1 btn-outline justify-center !px-3">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Address */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Address</p>
                      <p className="text-sm text-slate-300">{selectedBank.fullAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Operating Hours</p>
                      {Object.entries(selectedBank.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm py-1">
                          <span className={hours === 'Closed' ? 'text-slate-500' : 'text-emerald-400'}>{day}</span>
                          <span className="text-slate-300">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Manager */}
                <div className="glass-card p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Manager / Contact Person</p>
                  <p className="text-sm text-white font-medium">{selectedBank.manager}</p>
                </div>

                {/* Accepted Materials */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Accepted Materials</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBank.acceptedMaterials.map((mat) => (
                      <div key={mat.name} className={`glass-card p-3 ${mat.disabled ? 'opacity-40' : ''}`}>
                        <span className="text-lg">{mat.icon}</span>
                        <p className="text-sm font-medium text-white mt-1">{mat.name}</p>
                        <p className="text-[10px] text-slate-400">{mat.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-white mb-3">Monthly Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Volume Processed</p>
                      <p className="text-xl font-bold text-emerald-400">{selectedBank.performance.volume}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Active Members</p>
                      <p className="text-xl font-bold text-emerald-400">{selectedBank.performance.members} <span className="text-xs text-slate-400 font-normal">households</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <div>
                <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Select a Waste Bank</p>
                <p className="text-sm text-slate-500 mt-1">Click on a waste bank from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
