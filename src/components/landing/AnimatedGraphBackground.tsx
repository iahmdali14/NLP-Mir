import React from 'react';
import ReactFlow, { Background, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 50, y: 100 }, data: { label: 'Query' }, style: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Retrieve' }, style: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' } },
  { id: '3', position: { x: 350, y: 100 }, data: { label: 'Re-rank' }, style: { background: '#818cf8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' } },
  { id: '4', position: { x: 500, y: 100 }, data: { label: 'Generate' }, style: { background: '#a5b4fc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' } },
  { id: '5', position: { x: 650, y: 100 }, data: { label: 'Evaluate' }, style: { background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4f46e5' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#6366f1' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#818cf8' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#a5b4fc' } },
];

export function AnimatedGraphBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background color="#4f46e5" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
