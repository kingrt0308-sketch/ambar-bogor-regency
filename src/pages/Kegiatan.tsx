import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Activity } from '../types';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Kegiatan() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('tanggal', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setActivities(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Activity)));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
          <Calendar className="text-teal-600" size={28} />
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Kegiatan Warga</h1>
        <p className="mt-2 text-slate-500">Agenda dan kegiatan di Perumahan Ambar Bogor Regency</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-teal-600" size={32} />
        </div>
      ) : activities.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
          <p className="text-slate-500">Belum ada kegiatan yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((act) => (
            <article key={act.id} className="card flex flex-col sm:flex-row gap-5">
              {act.gambarUrl && (
                <img
                  src={act.gambarUrl}
                  alt={act.judul}
                  className="h-40 w-full sm:w-48 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold text-slate-900">{act.judul}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {format(new Date(act.tanggal), 'd MMMM yyyy', { locale: id })}
                  </span>
                  {act.lokasi && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {act.lokasi}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {act.deskripsi}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
