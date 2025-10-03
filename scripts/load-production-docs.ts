/**
 * Production Document Loader Script
 * 
 * This script loads documents from data/text_csv/ directory into the production
 * Supabase vector database in batches to avoid timeout issues.
 * 
 * Usage:
 * 1. Set SUPABASE_SERVICE_KEY environment variable
 * 2. Ensure OPENAI_API_KEY is set in .env.local
 * 3. Run: npx ts-node scripts/load-production-docs.ts
 */

import { createClient } from "@supabase/supabase-js";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Production Supabase Configuration
const SUPABASE_URL = "https://jtjclplfdpwalxdrrtmx.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Validate environment variables
if (!SUPABASE_SERVICE_KEY) {
  console.error("❌ Error: SUPABASE_SERVICE_KEY not found in environment variables");
  console.error("Please set it using: $env:SUPABASE_SERVICE_KEY='your-key-here'");
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}

/**
 * Load a batch of documents
 */
async function loadDocumentsBatch(batchIndex: number, batchSize: number = 3) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔄 Loading Batch ${batchIndex}`);
  console.log(`${"=".repeat(60)}\n`);
  
  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY!);
  
  // List all files
  const dataDir = path.join(process.cwd(), "data", "text_csv");
  
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Data directory not found: ${dataDir}`);
  }
  
  const allFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.txt') || file.endsWith('.csv'))
    .sort();
  
  console.log(`📁 Total files in directory: ${allFiles.length}`);
  console.log(`📄 Files: ${allFiles.join(', ')}\n`);
  
  // Select files for this batch
  const startIndex = batchIndex * batchSize;
  const endIndex = Math.min(startIndex + batchSize, allFiles.length);
  const filesToProcess = allFiles.slice(startIndex, endIndex);
  
  console.log(`📦 Batch ${batchIndex}: Processing files ${startIndex + 1}-${endIndex} of ${allFiles.length}`);
  console.log(`📄 Files in this batch: ${filesToProcess.join(', ')}\n`);
  
  if (filesToProcess.length === 0) {
    console.log(`✅ No files in batch ${batchIndex} - skipping`);
    return {
      batch: batchIndex,
      files: 0,
      documents: 0,
      chunks: 0
    };
  }
  
  // Delete existing data (only on first batch)
  if (batchIndex === 0) {
    console.log("🗑️ Deleting existing documents from database...");
    
    const { count: existingCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });
    
    if (existingCount && existingCount > 0) {
      console.log(`   Found ${existingCount} existing documents`);
      
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .neq('id', 0);
      
      if (deleteError) {
        console.error("❌ Delete error:", deleteError);
        throw deleteError;
      }
      console.log(`   ✅ Deleted ${existingCount} existing documents\n`);
    } else {
      console.log("   No existing documents found\n");
    }
  } else {
    console.log("⏭️ Skipping delete (not first batch)\n");
  }
  
  // Load documents
  console.log("📖 Loading documents from files...");
  const rawDocs = [];
  
  for (const fileName of filesToProcess) {
    const filePath = path.join(dataDir, fileName);
    console.log(`   Loading: ${fileName}`);
    
    try {
      let loader;
      if (fileName.endsWith('.txt')) {
        loader = new TextLoader(filePath);
      } else if (fileName.endsWith('.csv')) {
        loader = new CSVLoader(filePath, {
          column: undefined,
          separator: ","
        });
      }
      
      if (loader) {
        const docs = await loader.load();
        rawDocs.push(...docs);
        const totalChars = docs.reduce((sum, doc) => sum + doc.pageContent.length, 0);
        console.log(`   ✅ Loaded: ${docs.length} documents (${totalChars} characters)`);
      }
    } catch (error) {
      console.error(`   ❌ Error loading ${fileName}:`, error);
      throw error;
    }
  }
  
  console.log(`\n📄 Total documents loaded: ${rawDocs.length}`);
  const totalChars = rawDocs.reduce((sum, doc) => sum + doc.pageContent.length, 0);
  console.log(`📝 Total characters: ${totalChars.toLocaleString()}\n`);
  
  // Split documents
  console.log("✂️ Splitting documents into chunks...");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const splitDocs = await textSplitter.splitDocuments(rawDocs);
  console.log(`   ✅ Created ${splitDocs.length} chunks\n`);
  
  // Create embeddings and store
  console.log("🔮 Creating embeddings and storing in vector database...");
  console.log("   This may take 30-60 seconds...");
  
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY!,
    modelName: "text-embedding-3-small",
  });
  
  const startTime = Date.now();
  
  await SupabaseVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ✅ Embeddings created and stored (${duration}s)\n`);
  
  console.log(`✅ Batch ${batchIndex} completed successfully!`);
  
  // Return stats
  return {
    batch: batchIndex,
    files: filesToProcess.length,
    documents: rawDocs.length,
    chunks: splitDocs.length,
    duration: parseFloat(duration)
  };
}

/**
 * Main function
 */
async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Production Document Loader");
  console.log("=".repeat(60));
  console.log(`📅 Started: ${new Date().toLocaleString()}`);
  console.log(`🌐 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 OpenAI API Key: ${OPENAI_API_KEY?.substring(0, 20)}...`);
  console.log("=".repeat(60) + "\n");
  
  const batchSize = 3;
  const totalBatches = 3; // 9 files / 3 per batch = 3 batches
  
  const results = [];
  const overallStartTime = Date.now();
  
  for (let i = 0; i < totalBatches; i++) {
    try {
      const result = await loadDocumentsBatch(i, batchSize);
      results.push(result);
      
      // Wait 2 seconds between batches (to avoid rate limits)
      if (i < totalBatches - 1) {
        console.log("\n⏳ Waiting 2 seconds before next batch...\n");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`\n❌ Batch ${i} failed:`, error);
      console.error("\n🛑 Stopping execution due to error");
      process.exit(1);
    }
  }
  
  const overallDuration = ((Date.now() - overallStartTime) / 1000).toFixed(1);
  
  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 All batches completed successfully!");
  console.log("=".repeat(60));
  console.log("\n📊 Summary:");
  console.log("-".repeat(60));
  
  results.forEach(r => {
    console.log(`  Batch ${r.batch}: ${r.files} files, ${r.documents} documents, ${r.chunks} chunks (${r.duration}s)`);
  });
  
  console.log("-".repeat(60));
  
  const totalFiles = results.reduce((sum, r) => sum + r.files, 0);
  const totalDocuments = results.reduce((sum, r) => sum + r.documents, 0);
  const totalChunks = results.reduce((sum, r) => sum + r.chunks, 0);
  
  console.log(`\n📁 Total files processed: ${totalFiles}`);
  console.log(`📄 Total documents loaded: ${totalDocuments}`);
  console.log(`📝 Total chunks created: ${totalChunks}`);
  console.log(`⏱️ Total time: ${overallDuration}s`);
  console.log(`\n✅ Production database updated successfully!`);
  console.log(`\n🔗 Verify at: https://supabase.com/dashboard/project/jtjclplfdpwalxdrrtmx/editor`);
  console.log(`   Run: SELECT COUNT(*) FROM documents;`);
  console.log(`   Expected: ~${totalChunks} rows\n`);
}

// Run the script
main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});

