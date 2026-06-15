import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CalendarDays, ChevronRight, Camera, ArrowRight } from 'lucide-react';
import { activities } from '../data/activities';

const categoryColors = {
  'FEATURED EVENT': 'badge-emerald',
  'EDUCATION': 'badge-blue',
  'ANNOUNCEMENT': 'badge-amber',
  'COMMUNITY': 'badge-emerald',
  'WORKSHOP': 'badge-purple',
  'EXHIBITION': 'badge-blue',
  'MEETING': 'badge-amber',
};

export default function ActivitiesPage() {
  const [search, setSearch] = useState('');
  const featured = activities[0];
  const allActivities = activities.slice(1);

  return (
    <div className="animate-fade-in">
      <section className="bg-navy-800/40 border-b border-navy-600/30 py-8">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Latest Activities & Updates</h1>
              <p className="text-slate-400 mt-1">Stay informed about our latest community initiatives and events.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search activities..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field !pl-10 !py-2 !w-64 text-sm" />
              </div>
              <select className="input-field !w-auto !py-2 text-sm"><option>All Event Types</option><option>Education</option><option>Community</option></select>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-10">
        {/* Featured */}
        <Link to={`/activities/${featured.id}`} className="glass-card overflow-hidden mb-10 group block">
          <div className="grid md:grid-cols-2">
            <div className="h-64 md:h-auto overflow-hidden">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-emerald">{featured.category}</span>
                <span className="text-sm text-slate-400 flex items-center gap-1"><CalendarDays className="w-3 h-3"/>{featured.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{featured.title}</h2>
              <p className="text-slate-400 leading-relaxed mb-4">{featured.description}</p>
              <div className="flex gap-6 mb-6">
                <div><p className="text-2xl font-bold text-white">{featured.stats.collected}</p><p className="text-xs text-slate-500 uppercase">Tons Collected</p></div>
                <div><p className="text-2xl font-bold text-white">{featured.stats.volunteers}</p><p className="text-xs text-slate-500 uppercase">Volunteers</p></div>
              </div>
              <span className="btn-outline !w-fit">Read Full Story <ArrowRight className="w-4 h-4"/></span>
            </div>
          </div>
        </Link>

        {/* All Activities */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">All Activities</h2>
          <span className="text-sm text-slate-500">Showing 1-{allActivities.length} of {allActivities.length}</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allActivities.map(act=>(
            <Link key={act.id} to={`/activities/${act.id}`} className="glass-card-hover overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute top-3 right-3"><span className={categoryColors[act.category] || 'badge-emerald'}>{act.category}</span></div>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-2"><CalendarDays className="w-3 h-3"/>{act.date}</p>
                <h3 className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{act.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{act.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">Read more <ChevronRight className="w-4 h-4"/></span>
                  <Camera className="w-4 h-4 text-slate-600"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
