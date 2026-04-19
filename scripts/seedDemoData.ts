import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
} catch (e) {
  console.warn("⚠️ service-account.json not found. Seeding script requires admin credentials.");
  process.exit(1);
}

initializeApp({ 
  credential: cert(serviceAccount), 
  storageBucket: `${serviceAccount.project_id}.appspot.com` 
});

const db = getFirestore();
const bucket = getStorage().bucket();

const sampleDocs = [
  { name: 'term-sheet.pdf', type: 'legal', pages: 8 },
  { name: 'research-paper.pdf', type: 'academic', pages: 12 },
  { name: 'vendor-contract.pdf', type: 'legal', pages: 15 },
];

const generateMockEmbedding = (seed: number): number[] => {
  return Array.from({ length: 768 }, (_, i) => Math.sin(seed + i) * 0.1);
};

const sampleChunks = [
  {
    text: "This Term Sheet summarizes the principal terms of a proposed Series A financing of Acme Corp, a Delaware corporation...",
    primarySection: "Financial Terms",
    sectionConfidence: 0.94,
    containsEntity: ["ORG:Acme Corp", "MONEY:$5,000,000", "DATE:2024-03-15"],
  },
  {
    text: "The Company shall not, without prior written consent of the Investors, engage in any business competitive with...",
    primarySection: "Legal Obligations",
    sectionConfidence: 0.89,
    containsEntity: ["LAW:Non-Compete", "DATE:2026-03-15"],
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    for (const docInfo of sampleDocs) {
      const filePath = path.join(__dirname, '../sample-docs', docInfo.name);
      if (fs.existsSync(filePath)) {
        await bucket.upload(filePath, { destination: `documents/${docInfo.name}` });
        console.log(`✅ Uploaded ${docInfo.name}`);
      } else {
        console.warn(`⚠️ Sample PDF not found: ${docInfo.name}.`);
      }
    }

    const docId = 'demo-doc-001';
    await db.collection('documents').doc(docId).set({
      filename: 'term-sheet.pdf',
      uploadedAt: FieldValue.serverTimestamp(),
      status: 'processed',
      pageCount: 8,
      extractedEntities: ['ORG:Acme Corp', 'MONEY:$5,000,000', 'ORG:Venture Partners LLC'],
      sections: [
        { label: 'Financial Terms', confidence: 0.94 },
        { label: 'Legal Obligations', confidence: 0.89 },
        { label: 'Executive Summary', confidence: 0.91 },
      ],
    });

    for (let i = 0; i < sampleChunks.length; i++) {
      const chunk = sampleChunks[i];
      await db.collection('document_chunks').add({
        documentId: docId,
        chunkId: `${docId}_chunk_${i}`,
        text: chunk.text,
        cleanText: chunk.text.toLowerCase().replace(/[^\w\s]/g, ''),
        embedding: generateMockEmbedding(i), // FieldValue.vector is specific to some environments, using array
        primarySection: chunk.primarySection,
        sectionConfidence: chunk.sectionConfidence,
        containsEntity: chunk.containsEntity,
        pageNumber: Math.floor(i / 3) + 1,
        tokenCount: chunk.text.split(' ').length,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ Created ${sampleChunks.length} chunks`);

    await db.collection('retrieval_traces').doc('demo-query-001').set({
      queryId: 'demo-query-001',
      query: 'What are the non-compete terms?',
      documentId: docId,
      retrievedChunkIds: ['chunk_0', 'chunk_1', 'chunk_2'],
      crossEncoderScores: [0.92, 0.87, 0.45],
      selectedChunkIds: ['chunk_0', 'chunk_1'],
      contextPrecision: 1.0,
      retrievalLatencyMs: 780,
      llmTokens: 512,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log('✅ Seeding complete! Demo is ready.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedDatabase();
