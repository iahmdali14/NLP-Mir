import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const nodeTypes = { custom: CustomNode };

interface WorkflowState {
  retrieval: { chunks: number; latency: number };
  rerank: { inputChunks: number; keptChunks: number };
  synthesis: { tokens: number };
  evaluation: { faithfulness: number };
  status: 'idle' | 'retrieving' | 'reranking' | 'synthesizing' | 'evaluating' | 'complete';
}

export function AgenticWorkflow({ documentId, queryId }: { documentId: string; queryId: string }) {
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges] = useState<Edge[]>([
    { id: 'e1', source: 'retrieval', target: 'rerank', animated: true, style: { stroke: '#4f46e5', strokeWidth: 3, opacity: 0.8 } },
    { id: 'e2', source: 'rerank', target: 'synthesis', animated: true, style: { stroke: '#34d399', strokeWidth: 3, opacity: 0.8 } },
    { id: 'e3', source: 'synthesis', target: 'evaluation', animated: true, style: { stroke: '#4f46e5', strokeWidth: 3, opacity: 0.8 } },
  ]);

  // Subscribe to Firestore trace document
  useEffect(() => {
    if (!queryId || queryId === 'demo-query-001') {
      // Mock data for demo if no real queryId
      setTimeout(() => {
        setWorkflowState({
          retrieval: { chunks: 20, latency: 0.78 },
          rerank: { inputChunks: 20, keptChunks: 3 },
          synthesis: { tokens: 512 },
          evaluation: { faithfulness: 0.94 },
          status: 'complete',
        });
      }, 1000);
      return;
    }

    const unsub = onSnapshot(
      doc(db, 'retrieval_traces', queryId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setWorkflowState({
            retrieval: { chunks: 20, latency: data.retrievalLatencyMs / 1000 },
            rerank: { inputChunks: 20, keptChunks: data.selectedChunkIds?.length || 3 },
            synthesis: { tokens: data.llmTokens || 512 },
            evaluation: { faithfulness: data.contextPrecision || 0.94 },
            status: 'complete',
          });
        }
      },
      (error) => console.error("Firestore error:", error)
    );
    return () => unsub();
  }, [queryId]);

  // Update nodes when workflowState changes
  useEffect(() => {
    if (!workflowState) {
      // Initial idle state
      setNodes([
        { id: 'retrieval', type: 'custom', position: { x: 50, y: 50 }, data: { label: 'Vector Retrieval', subLabel: 'Waiting for query...', status: 'pending' } },
        { id: 'rerank', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'Cross-Encoder Re-Rank', subLabel: 'Pending', status: 'pending' } },
        { id: 'synthesis', type: 'custom', position: { x: 550, y: 50 }, data: { label: 'Claude Synthesis', subLabel: 'Pending', status: 'pending' } },
        { id: 'evaluation', type: 'custom', position: { x: 800, y: 50 }, data: { label: 'RAGAS Evaluation', subLabel: 'Pending', status: 'pending' } },
      ]);
      return;
    }

    setNodes([
      { id: 'retrieval', type: 'custom', position: { x: 50, y: 50 }, data: { label: 'Vector Retrieval', founderLabel: '🔍 Finding relevant info', subLabel: `${workflowState.retrieval.chunks} chunks, ${workflowState.retrieval.latency.toFixed(1)}s`, status: 'success', metrics: { 'Distance': 'COSINE', 'Index': 'Firestore' } } },
      { id: 'rerank', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'Cross-Encoder Re-Rank', founderLabel: '📊 Ranking by relevance', subLabel: `Kept ${workflowState.rerank.keptChunks}/${workflowState.rerank.inputChunks}`, status: 'success', metrics: { 'Model': 'ms-marco-MiniLM', 'Threshold': '0.75' } } },
      { id: 'synthesis', type: 'custom', position: { x: 550, y: 50 }, data: { label: 'Claude Synthesis', founderLabel: '✍️ Writing answer', subLabel: `${workflowState.synthesis.tokens} tokens`, status: 'success', metrics: { 'Model': 'Claude-3.5-Sonnet', 'Temp': '0.0' } } },
      { id: 'evaluation', type: 'custom', position: { x: 800, y: 50 }, data: { label: 'RAGAS Evaluation', founderLabel: '✅ Verifying accuracy', subLabel: `Faithfulness: ${workflowState.evaluation.faithfulness.toFixed(2)}`, status: 'success', metrics: { 'Judge': 'GPT-4o', 'Metric': 'Faithfulness' } } },
    ]);
  }, [workflowState]);

  return (
    <div className="h-[240px] w-full bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        zoomOnScroll={false}
        panOnDrag={true}
        className="bg-transparent"
      >
        <Background color="#1e293b" gap={24} size={1.2} />
        <Controls className="!bg-slate-800 !border-slate-700 !fill-white" />
      </ReactFlow>
    </div>
  );
}
