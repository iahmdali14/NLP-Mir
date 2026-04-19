import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 z-10 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8"
      >
        <Sparkles className="w-3 h-3" />
        Now entering Production Beta
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6"
      >
        DocIntel
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent max-w-2xl leading-tight mb-10 uppercase tracking-tighter"
      >
        DistilBERT (91% F1) → FAISS → Cross-Encoder → LangGraph → RAGAS
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 text-sm font-black uppercase tracking-widest rounded-lg shadow-2xl shadow-indigo-500/20 group">
          <Link to="/dashboard" className="flex items-center">
            Upload Document
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="border-white/10 text-slate-400 hover:bg-white/5 h-12 text-sm font-black uppercase tracking-widest rounded-lg px-8">
          Full Pipeline Details
        </Button>
      </motion.div>
    </div>
  );
}
