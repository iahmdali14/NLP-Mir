import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const indicators = [
  {
    title: "95% Extraction Accuracy",
    tooltip: "Validated on held-out arXiv + Legal contracts corpus",
  },
  {
    title: "Sub-2s Vector Retrieval",
    tooltip: "Firestore Vector Index, COSINE distance",
  },
  {
    title: "RAGAS Faithfulness ≥ 0.92",
    tooltip: "LLM-as-judge evaluation on every response",
  },
];

export function TrustIndicators() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4 mt-12 pb-24">
      <TooltipProvider>
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Tooltip>
              <TooltipTrigger>
                <div className="bg-slate-900/40 border border-slate-700/50 backdrop-blur-lg hover:border-emerald-500/30 transition-all cursor-help p-4 rounded-xl flex items-center gap-3">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                   </div>
                   <div className="text-left">
                      <div className="text-sm font-bold text-white tracking-tight leading-none mb-1">{indicator.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-tighter">VERIFIED METRIC</div>
                   </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 border-slate-800 text-slate-300">
                <p>{indicator.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </TooltipProvider>
    </div>
  );
}
