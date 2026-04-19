import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProcessingJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  currentStage: string;
  progressPercentage: number;
  fileName: string;
  error?: string;
}

export function ProcessingStatus({ jobId, onComplete }: { jobId: string; onComplete?: () => void }) {
  const [job, setJob] = useState<ProcessingJob | null>(null);

  useEffect(() => {
    if (!jobId) return;

    // Frontend subscribes to this document using Firestore real-time listeners (Answer 1)
    const unsub = onSnapshot(doc(db, 'processing_jobs', jobId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ProcessingJob;
        setJob(data);
        if (data.status === 'completed' && onComplete) {
           onComplete();
        }
      }
    });

    return () => unsub();
  }, [jobId]);

  if (!job) return null;

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           {job.status === 'processing' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
           {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
           {job.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
           <span className="text-xs font-bold text-slate-200 uppercase tracking-tight truncate max-w-[150px]">
             {job.fileName}
           </span>
        </div>
        <Badge variant="outline" className={`text-[9px] uppercase font-black px-2 py-0 h-4 border-none ${
          job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
          job.status === 'failed' ? 'bg-red-500/10 text-red-500' :
          'bg-indigo-500/10 text-indigo-400'
        }`}>
          {job.status}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          <span>{job.currentStage.replace(/_/g, ' ')}</span>
          <span>{job.progressPercentage}%</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              job.status === 'failed' ? 'bg-red-500' : 
              job.status === 'completed' ? 'bg-emerald-500' : 
              'bg-indigo-500'
            }`}
            style={{ width: `${job.progressPercentage}%` }}
          />
        </div>
      </div>

      {job.error && (
        <p className="text-[10px] text-red-400 font-medium leading-tight">
          Error: {job.error}
        </p>
      )}
    </div>
  );
}
