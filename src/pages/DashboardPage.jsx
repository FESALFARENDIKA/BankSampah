import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Recycle, Trash2, Zap, Building2, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { statsData, monthlyTrends, wasteCategories, wasteBankLocations } from '../data/statistics';

const statCards = [
  { key: 'totalCollected', label: 'Total Waste Collected', icon: Trash2, color: 'emerald' },
  { key: 'successfullyRecycled', label: 'Successfully Recycled', icon: Recycle, color: 'blue' },
  { key: 'processedForEnergy', label: 'Processed for Energy', icon: Zap, color: 'amber' },
  { key: 'activeWasteBanks', label: 'Active Waste Banks', icon: Building2, color: 'purple' },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 !bg-navy-800 border-navy-600">
        <p className="text-sm text-white font-medium mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value} tons
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [wasteTypeTotals, setWasteTypeTotals] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
      const totals = { plastic:0, paper:0, iron:0, bottle:0, glass:0, oil:0 };
      Object.values(saved).forEach(b => {
        totals.plastic += parseFloat(b.plastic || 0);
        totals.paper += parseFloat(b.paper || 0);
        totals.iron += parseFloat(b.iron || 0);
        totals.bottle += parseFloat(b.bottle || 0);
        totals.glass += parseFloat(b.glass || 0);
        totals.oil += parseFloat(b.oil || 0);
      });
      const arr = [
        { name: 'Plastik', value: totals.plastic, color: '#10b981' },
        { name: 'Kertas', value: totals.paper, color: '#3b82f6' },
        { name: 'Logam', value: totals.iron, color: '#f97316' },
        { name: 'Botol', value: totals.bottle, color: '#a3e635' },
        { name: 'Beling', value: totals.glass, color: '#60a5fa' },
        { name: 'Minyak', value: totals.oil, color: '#f59e0b' },
      ];
      setWasteTypeTotals(arr);
    } catch (err) {
      console.error(err);
    }
  }, []);
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold text-white">Dashboard Statistics</h1>
          <p className="text-slate-400 mt-1">Real-time waste management performance overview for Kota Batu.</p>
        </div>
      </section>

      <div className="page-container py-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map(({ key, label, icon: Icon, color }) => {
            const data = statsData[key];
            const c = colorMap[color];
            return (
              <div key={key} className={`glass-card p-6 border-l-4 ${c.border}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {data.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={data.change > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {data.change}%
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {data.value.toLocaleString()}
                  <span className="text-sm font-normal text-slate-400 ml-1">{data.unit}</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">{label}</p>
                {data.period && <p className="text-xs text-slate-500 mt-2">{data.period}</p>}
                {data.label && <p className="text-xs text-slate-500 mt-2">{data.label}</p>}
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Area Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Waste Collection Trends</h3>
            <p className="text-sm text-slate-400 mb-6">Monthly collected vs recycled (tons)</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    stroke="#10b981"
                    fill="url(#colorCollected)"
                    strokeWidth={2}
                    name="Collected"
                  />
                  <Area
                    type="monotone"
                    dataKey="recycled"
                    stroke="#3b82f6"
                    fill="url(#colorRecycled)"
                    strokeWidth={2}
                    name="Recycled"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Waste Categories</h3>
            <p className="text-sm text-slate-400 mb-6">Distribution by type</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteCategories}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {wasteCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f1729', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Waste Bank Distribution */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Waste Bank Distribution</h3>
              <p className="text-sm text-slate-400">Active waste banks across Kota Batu</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wasteBankLocations.map((bank) => (
              <div key={bank.id} className="glass-card-hover p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{bank.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{bank.district}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-emerald-400 text-sm font-semibold">{bank.volume} kg</span>
                      <span className="text-xs text-slate-500">{bank.lastCollection}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Aggregated types pie chart */}
        <div className="glass-card p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Total Jenis Sampah Terdaftar</h3>
              <p className="text-sm text-slate-400">Ringkasan akumulasi jenis sampah dari data bank sampah</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wasteTypeTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {wasteTypeTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
