import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users, Share2, Download, ChevronRight, ArrowLeft } from 'lucide-react';
import { activities } from '../data/activities';

export default function ActivityDetailPage() {
  const { id } = useParams();
  const activity = activities.find(a => a.id === parseInt(id)) || activities[0];
  const catColors = { Edu:'badge-blue', News:'badge-amber', Comm:'badge-emerald', Work:'badge-purple' };

  return (
    <div className="animate-fade-in">
      <div className="page-container py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-emerald-400">Home</Link><ChevronRight className="w-3 h-3"/>
          <Link to="/galeri-kegiatan" className="hover:text-emerald-400">Latest Activities</Link><ChevronRight className="w-3 h-3"/>
          <span className="text-slate-300">Activity Detail</span>
        </div>
      </div>

      <div className="page-container pb-16">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <span className="badge-emerald mb-3 inline-block">{activity.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{activity.title}</h1>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              {activity.time && <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-emerald-400"/>{activity.date} • {activity.time}</p>}
              {activity.location && <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400"/>{activity.location}</p>}
              {activity.organizer && <p className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400"/>Organized by {activity.organizer}</p>}
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">{activity.description}</p>
            {activity.stats && (
              <div className="glass-card p-4 space-y-3">
                {Object.entries(activity.stats).map(([k,v])=>(
                  <div key={k} className="flex justify-between items-center py-1 border-b border-navy-600/20 last:border-0">
                    <span className="text-sm text-slate-400 capitalize">{k.replace(/([A-Z])/g,' $1')}</span>
                    <span className="text-emerald-400 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="rounded-xl overflow-hidden h-80">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover"/>
            </div>
            {activity.thumbnails && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {activity.thumbnails.map((t,i)=><div key={i} className="rounded-lg overflow-hidden h-20"><img src={t} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"/></div>)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {activity.content && (
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 prose prose-invert max-w-none">
              {activity.content.split('\n\n').map((p,i)=>{
                if(p.startsWith('"')) return <blockquote key={i} className="glass-card p-6 border-l-4 border-emerald-500 my-6 not-prose"><p className="text-slate-300 italic text-lg leading-relaxed">{p.split('\n')[0]}</p><p className="text-emerald-400 text-sm mt-3">{p.split('\n')[1]}</p></blockquote>;
                if(p.startsWith('#')) return null;
                const isHeading = p.match(/^[A-Z].*:$/);
                if(p.includes('Impact and Next Steps')) return <div key={i}><h2 className="text-xl font-bold text-white mt-8 mb-3">Impact and Next Steps</h2></div>;
                return <p key={i} className="text-slate-300 leading-relaxed mb-4">{p}</p>;
              })}
            </div>
            <div className="space-y-6">
              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Share This Activity</h4>
                <div className="flex gap-2">
                  {['f','𝕏','◯','🔗'].map((icon,i)=><button key={i} className="w-10 h-10 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">{icon}</button>)}
                </div>
              </div>
              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Media Resources</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg"><div className="flex items-center gap-3"><span className="text-red-400">📄</span><div><p className="text-sm text-white">Activity Report</p><p className="text-xs text-slate-500">PDF • 2.4 MB</p></div></div><Download className="w-4 h-4 text-slate-400 hover:text-emerald-400 cursor-pointer"/></div>
                  <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg"><div className="flex items-center gap-3"><span className="text-blue-400">📷</span><div><p className="text-sm text-white">Press Photos</p><p className="text-xs text-slate-500">ZIP • 15 MB</p></div></div><Download className="w-4 h-4 text-slate-400 hover:text-emerald-400 cursor-pointer"/></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related */}
        {activity.relatedActivities && (
          <div>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold text-white">Looking for more?</h2><Link to="/galeri-kegiatan" className="text-emerald-400 text-sm flex items-center gap-1">MORE <ArrowLeft className="w-3 h-3 rotate-180"/></Link></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activity.relatedActivities.map(r=>(
                <Link key={r.id} to={`/activities/${r.id}`} className="glass-card-hover p-5 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-navy-700 rounded-xl flex items-center justify-center text-2xl">♻️</div>
                  <p className="text-xs text-white font-semibold uppercase tracking-wider mb-1">{r.title}</p>
                  <span className={`${catColors[r.category]||'badge-emerald'} text-[10px]`}>{r.category}</span>
                  <p className="text-xs text-slate-500 mt-2">{r.location}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
