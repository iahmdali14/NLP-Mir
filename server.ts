import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import admin from "firebase-admin";
import { PDFDocument } from "pdf-lib";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import fetch from "node-fetch";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- SECRET MANAGEMENT (Answer 2) ---
const _secret_cache: Record<string, string> = {};

async function getSecret(secretId: string): Promise<string> {
  if (_secret_cache[secretId]) return _secret_cache[secretId];

  // Fallback for local/emulator
  if (process.env.FUNCTIONS_EMULATOR === 'true' || !process.env.GCLOUD_PROJECT) {
    const val = process.env[secretId];
    if (val) {
        _secret_cache[secretId] = val;
        return val;
    }
  }

  try {
    const client = new SecretManagerServiceClient();
    const name = `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretId}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    const secretValue = version.payload?.data?.toString();
    if (!secretValue) throw new Error(`Secret ${secretId} not found`);
    
    _secret_cache[secretId] = secretValue;
    return secretValue;
  } catch (error) {
    console.warn(`Failed to access secret ${secretId} from Secret Manager, falling back to ENV`);
    return process.env[secretId] || "";
  }
}

// --- CLOUD FUNCTION WORKER SIMULATION (Answer 1) ---
async function processDocumentWorker(jobId: string, filePath: string, fileName: string) {
  const jobRef = db.collection("processing_jobs").doc(jobId);
  
  try {
    // 1. Idempotency Check
    const jobSnap = await jobRef.get();
    const jobData = jobSnap.data();
    if (jobData?.status === 'completed' || jobData?.status === 'processing' && (Date.now() - jobData.updatedAt?.toMillis() < 60000)) {
       console.log("Job already active or completed. Exiting.");
       return;
    }

    await jobRef.update({ 
        status: 'processing', 
        currentStage: 'extracting_text', 
        progressPercentage: 5,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Load PDF and analyze size (Answer 1 requirement)
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pageCount = pdfDoc.getPageCount();
    
    // Batch processing (Batch size of 25 as requested)
    const BATCH_SIZE = 25;
    const totalBatches = Math.ceil(pageCount / BATCH_SIZE);

    for (let i = 0; i < totalBatches; i++) {
      const startPage = i * BATCH_SIZE;
      const endPage = Math.min((i + 1) * BATCH_SIZE, pageCount);
      
      await jobRef.update({ 
          currentStage: `processing_batch_${i+1}_of_${totalBatches}`,
          progressPercentage: Math.floor(10 + (i / totalBatches) * 80)
      });

      // Simulation of PyMuPDF + spaCy behavior (Node counterpart)
      console.log(`Processing batch ${i+1}: Pages ${startPage} to ${endPage}`);
      
      // Extract dummy text for now (Real implementation would use a parser)
      const batchChunks = [`Placeholder text from pages ${startPage}-${endPage}`];
      
      for (const text of batchChunks) {
        const chunkId = `${jobId}_batch_${i}_chunk_${uuidv4().slice(0, 8)}`;
        
        // --- External API Call with Backoff (Answer 1) ---
        const classification = await callHuggingFaceWithBackoff(text);

        await db.collection("document_chunks").doc(chunkId).set({
          chunkId,
          documentId: jobId, // Using jobId as docId for demo
          jobId,
          text,
          cleanText: text.toLowerCase().replace(/[^\w\s]/g, ''),
          primarySection: classification.label,
          sectionConfidence: classification.score,
          pageNumber: startPage + 1,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    await jobRef.update({ 
        status: 'completed', 
        currentStage: 'idle', 
        progressPercentage: 100,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

  } catch (error) {
    console.error("Worker error:", error);
    await jobRef.update({ 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } finally {
    // Cleanup temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

async function callHuggingFaceWithBackoff(text: string, retries = 3, delay = 1000): Promise<{ label: string, score: number }> {
    const HF_TOKEN = await getSecret('HUGGINGFACE_API_KEY');
    
    for (let i = 0; i < retries; i++) {
        try {
            // Simulated call - replace with actual HF API endpoint
            // const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-mnli", { ... });
            
            // Mocking for production safety if key is missing
            if (!HF_TOKEN) return { label: 'Unclassified', score: 0 };

            return { label: 'Legal Obligations', score: 0.92 };
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
        }
    }
    return { label: 'Error', score: 0 };
}

// --- ORCHESTRATOR API (Answer 1) ---
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit from prompt
});

app.post("/api/upload", upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const jobId = uuidv4();
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  // Validate size check
  if (req.file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: "File too large (> 50MB)" });
  }

  // Create Firestore entry (Answer 1)
  await db.collection("processing_jobs").doc(jobId).set({
    jobId,
    fileName,
    status: 'queued',
    currentStage: 'queued',
    progressPercentage: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Simulation of Pub/Sub (Fire and forget worker)
  processDocumentWorker(jobId, filePath, fileName);

  // Return immediately within < 2s (Answer 1)
  res.json({ jobId, status: 'queued' });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
