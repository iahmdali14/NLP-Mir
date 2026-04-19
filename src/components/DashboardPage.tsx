import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AgenticWorkflow } from '@/components/workflow/AgenticWorkflow';
import { SourceViewer } from '@/components/ui/SourceViewer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, Search, MessageSquare, Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProcessingStatus } from '@/components/ui/ProcessingStatus';

import { useFounderMode } from '@/hooks/useFounderMode';

export default function DashboardPage() {
  const { documentId } = useParams();
  const { isFounderMode } = useFounderMode();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastQueryId, setLastQueryId] = useState<string | null>(documentId ? 'demo-query-001' : null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setActiveJobId(data.jobId);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const mockWorkflowState = {
    retrieval: { chunks: 20, latency: 0.78 },
    rerank: { inputChunks: 20, keptChunks: 3 },
    synthesis: { tokens: 512 },
    evaluation: { faithfulness: 0.94 },
    status: 'complete',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Technical Core</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Real-time pipeline monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          {activeJobId && (
            <div className="w-64">
              <ProcessingStatus jobId={activeJobId} onComplete={() => console.log("Job finished!")} />
            </div>
          )}
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-500 h-9 font-bold px-4"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileUp className="w-4 h-4 mr-2" />}
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button size="sm" variant="outline" className="border-white/10 text-slate-400 h-9 hover:bg-white/5">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-slate-900/40 border-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">
          <CardHeader className="py-3 px-6 border-b border-white/5 bg-slate-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-tight">Agentic Chat Trace</CardTitle>
                  <CardDescription className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 font-mono">ID: demo-session-882</CardDescription>
                </div>
              </div>
              <SourceViewer title="State" data={mockWorkflowState} />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pipeline Visualization</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <AgenticWorkflow documentId={documentId || 'demo-doc'} queryId={lastQueryId || 'demo-query-001'} />
            </div>

            <div className="bg-[#020617]/50 rounded-lg p-5 border border-white/5 space-y-4 shadow-inner">
               <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 bg-indigo-600/20 border border-indigo-500/30">
                    <span className="text-[10px] font-black text-indigo-400">Q</span>
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-semibold text-slate-200 tracking-tight">What are the non-compete terms in the Series A agreement?</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 bg-emerald-600/20 border border-emerald-500/30">
                    <span className="text-[10px] font-black text-emerald-400">A</span>
                  </div>
                  <div className="flex-1 space-y-3">
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">Based on the analysis of the <strong>Legal Obligations</strong> section (p. 4), the non-compete terms specify that the Company shall not, without prior written consent from 75% of the Series A Investors, engage in any business activities directly competitive with the current primary business for a duration of <strong>24 months</strong> following closing.</p>
                     <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-slate-900 border-white/5 text-slate-500 font-mono text-[8px] px-2 py-0">
                           {isFounderMode ? "📦 Source: term-sheet.pdf" : "CHUNKS: 0, 1"}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-900 border-white/5 text-emerald-500 font-mono text-[8px] px-2 py-0">
                           {isFounderMode ? "✓ Verified" : "FAITHFULNESS: 0.94"}
                        </Badge>
                     </div>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900/40 border-white/5 shadow-xl backdrop-blur-sm">
             <CardHeader className="py-3 px-5 border-b border-white/5">
                <CardTitle className="text-sm font-bold tracking-tight">{isFounderMode ? "Business Insights" : "Entities"}</CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{isFounderMode ? "Key terms identified" : "NLP extraction result"}</CardDescription>
             </CardHeader>
             <CardContent className="p-3 space-y-2">
                {[
                  { label: "ORG", value: "Acme Corp", founderValue: "🏢 Counterparty: Acme Corp", color: "text-blue-400 bg-blue-400/10" },
                  { label: "MONEY", value: "$5,000,000", founderValue: "💰 Terms: $5M", color: "text-emerald-400 bg-emerald-400/10" },
                  { label: "DATE", value: "2024-03-15", founderValue: "📅 Target: Mar 2024", color: "text-amber-400 bg-amber-400/10" },
                  { label: "LAW", value: "Non-Compete", founderValue: "⚖️ Legal: Non-Compete", color: "text-purple-400 bg-purple-400/10" },
                ].map((entity) => (
                  <div key={entity.value} className="flex items-center justify-between p-2.5 rounded-md bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                    <span className="text-[11px] font-bold text-slate-300">
                       {isFounderMode && entity.founderValue ? entity.founderValue : entity.value}
                    </span>
                    {!isFounderMode && <Badge className={`${entity.color} border-none font-mono text-[8px] h-4 px-1 leading-none`}>{entity.label}</Badge>}
                  </div>
                ))}
                <div className="pt-2">
                  <SourceViewer title="Raw" data={{ entities: ["Acme Corp", "$5M", "2024-03-15"] }} />
                </div>
             </CardContent>
          </Card>

          <Card className="bg-slate-900/20 border-white/5 border-dashed">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
               <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5">
                  <Info className="w-5 h-5 text-slate-500" />
               </div>
               <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-tighter">Performance</h4>
                  <p className="text-[9px] text-slate-500 font-mono">450ms Latency | @trace:x7291a</p>
               </div>
               <Button variant="link" className="text-indigo-400 text-[9px] p-0 h-auto font-bold uppercase tracking-widest">Full Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
