import Lab3D from '../components/Lab3D';
import { Panel } from '../components/UI';
import { Info, MousePointer2, Hand } from 'lucide-react';

export default function Lab() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-white">
            Laboratorium 3D
          </h2>
          <p className="text-xs text-slate-400">
            Hubungan Matahari, Bumi, dan Bulan — model skematis (tidak
            berskala)
          </p>
        </div>
      </div>

      <Panel className="py-2">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <MousePointer2 size={12} className="text-cyan-300" /> Seret untuk
            memutar tampilan
          </span>
          <span className="flex items-center gap-1">
            <Hand size={12} className="text-cyan-300" /> Gulir / cubit untuk
            memperbesar
          </span>
          <span className="flex items-center gap-1">
            <Info size={12} className="text-amber-300" /> Kecepatan animasi
            bukan kecepatan sebenarnya
          </span>
        </div>
      </Panel>

      <Lab3D />
    </div>
  );
}
