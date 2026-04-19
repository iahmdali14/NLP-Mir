import { Handle, Position } from 'reactflow';
import { useFounderMode } from '@/hooks/useFounderMode';

interface CustomNodeProps {
  data: {
    label: string;
    subLabel: string;
    status: 'pending' | 'running' | 'success' | 'error';
    metrics?: Record<string, any>;
    founderLabel?: string;
  };
}

const statusColors = {
  pending: 'border-slate-700 bg-slate-900/90',
  running: 'border-indigo-500 bg-indigo-950/40 shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-pulse',
  success: 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
  error: 'border-red-500 bg-red-950/40',
};

export function CustomNode({ data }: CustomNodeProps) {
  const { isFounderMode } = useFounderMode();

  return (
    <div className={`px-4 py-3 rounded-xl border-2 ${statusColors[data.status]} backdrop-blur-md min-w-[200px] transition-all duration-500 relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
      <Handle type="target" position={Position.Left} className="!bg-slate-600 !w-2 !h-2 border-none" />
      <div className="font-mono text-[11px] font-bold text-white tracking-tight relative z-10">
        {isFounderMode && data.founderLabel ? data.founderLabel : data.label}
      </div>
      <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-widest font-bold relative z-10">{data.subLabel}</div>
      {data.metrics && !isFounderMode && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 text-[8px] text-slate-500 font-mono relative z-10">
          {Object.entries(data.metrics).map(([k, v]) => (
            <div key={k} className="flex justify-between uppercase">
              <span className="opacity-50">{k}:</span>
              <span className="text-slate-400 font-bold">{v}</span>
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-slate-600 !w-2 !h-2 border-none" />
    </div>
  );
}
