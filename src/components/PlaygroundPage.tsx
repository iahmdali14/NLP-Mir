import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Send, Code, Layers, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PlaygroundPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">API Playground</h2>
        <p className="text-slate-400 mt-1">Direct access to the DocIntel inference engine and RAG pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-slate-800 shadow-xl">
           <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                 <Terminal className="w-5 h-5 text-indigo-400" />
                 JSON Request
              </CardTitle>
              <CardDescription>Target: /api/v1/extract</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 min-h-[200px]">
                 <pre>{`{
  "document": "demo-doc-001",
  "query": "What are the interest rates?",
  "pipeline": {
    "retrieval": "faiss",
    "rerank": true,
    "strategy": "hyde"
  }
}`}</pre>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
                <Send className="w-4 h-4 mr-2" />
                Execute Request
              </Button>
           </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 shadow-xl">
           <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                 <Code className="w-5 h-5 text-emerald-400" />
                 Response Stream
              </CardTitle>
              <CardDescription>Real-time execution log</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-[10px] text-slate-500 min-h-[200px]">
                 <p className="text-indigo-400 animate-pulse">Waiting for execution...</p>
                 <div className="mt-4 space-y-1">
                    <p>// POST /api/v1/extract</p>
                    <p>// [2ms] Authenticated as user_982</p>
                    <p>// [12ms] Cache miss for doc:demo-doc-001</p>
                    <p>// [450ms] Vector search complete (200 docs scanned)</p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { title: "Classification head", icon: Layers, status: "Active" },
           { title: "Cross-encoder", icon: Activity, status: "Healthy" },
           { title: "LangGraph Engine", icon: Send, status: "Standby" },
         ].map((item) => (
            <Card key={item.title} className="bg-slate-900/50 border-slate-800 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-300">{item.title}</span>
               </div>
               <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-500">{item.status}</Badge>
            </Card>
         ))}
      </div>
    </div>
  );
}
