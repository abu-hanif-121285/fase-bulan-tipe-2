import PhaseExplorer from '../components/PhaseExplorer';
import { Panel } from '../components/UI';
import { Info, Sun, Eye } from 'lucide-react';

export default function Fase({
  jumpDay,
  jumpNonce,
}: {
  jumpDay: number | null;
  jumpNonce: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-extrabold text-white">
          Eksplorasi Fase Bulan
        </h2>
        <p className="text-xs text-slate-400">
          Amati posisi Matahari, Bumi, dan Bulan serta sudut pandang dari Bumi
        </p>
      </div>

      <Panel className="py-2">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <Sun size={12} className="text-amber-300" /> Matahari di tengah
            sebagai sumber cahaya
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} className="text-pink-300" /> Garis bantu
            memperlihatkan sudut pandang pengamat di Bumi
          </span>
          <span className="flex items-center gap-1">
            <Info size={12} className="text-cyan-300" /> Geser slider hari
            untuk menggerakkan Bulan pada orbitnya
          </span>
        </div>
      </Panel>

      <PhaseExplorer jumpDay={jumpDay} jumpNonce={jumpNonce} />
    </div>
  );
}
