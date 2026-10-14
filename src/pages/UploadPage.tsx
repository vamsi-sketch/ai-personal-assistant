import React, { useState, useEffect, useRef } from "react";
import { UploadedDocument } from "../types";
import { api } from "../services/api";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Database,
  Cpu,
  Trash2,
  FileCheck,
  Plus,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface UploadPageProps {
  onDocumentUploaded?: () => void;
  onNavigateToSummary?: (topic?: string) => void;
  onNavigateToQuiz?: (topic?: string) => void;
  onNavigateToTutor?: (topic?: string) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  onDocumentUploaded,
  onNavigateToSummary,
  onNavigateToQuiz,
  onNavigateToTutor
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<number>(0);
  const [activeFileName, setActiveFileName] = useState<string>("");
  const [activeFileType, setActiveFileType] = useState<string>("");
  const [activeFileSize, setActiveFileSize] = useState<number>(0);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<UploadedDocument | null>(null);

  // Manual Paste Tab
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [pastedTitle, setPastedTitle] = useState("");
  const [pastedSubject, setPastedSubject] = useState("");
  const [pastedContent, setPastedContent] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const processAndUpload = async (file: File) => {
    setUploading(true);
    setActiveFileName(file.name);
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase() || ".txt";
    setActiveFileType(ext);
    setActiveFileSize(file.size);
    setUploadStage(1); // 1. Extracting Text

    try {
      let textContent = "";
      let base64Content = "";

      if (file.type.startsWith("text/") || ext === ".txt") {
        textContent = await file.text();
      } else {
        // Read as base64 for PDF, DOCX, PPT, or Image processing on server
        base64Content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // strip data:...;base64, prefix
            const b64 = result.includes(",") ? result.split(",")[1] : result;
            resolve(b64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      await new Promise(r => setTimeout(r, 600));
      setUploadStage(2); // 2. Cleaning & Detecting Topics

      await new Promise(r => setTimeout(r, 700));
      setUploadStage(3); // 3. Chunking & Sentence Transformers

      await new Promise(r => setTimeout(r, 600));
      setUploadStage(4); // 4. FAISS Vector Indexing & Knowledge Tracing Setup

      const res = await api.uploadDocument({
        filename: file.name,
        file_type: ext,
        text_content: textContent,
        base64_content: base64Content
      });

      if (res.success) {
        setLastUploadedDoc(res.document);
        setDocuments(prev => [res.document, ...prev]);
        if (onDocumentUploaded) onDocumentUploaded();
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      setUploadStage(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedContent.trim()) return;

    setUploading(true);
    const fname = pastedTitle.trim() ? `${pastedTitle.trim().replace(/\s+/g, "_")}.txt` : "Course_Notes.txt";
    setActiveFileName(fname);
    setActiveFileType(".txt");
    setActiveFileSize(pastedContent.length);
    setUploadStage(1);

    await new Promise(r => setTimeout(r, 500));
    setUploadStage(2);
    await new Promise(r => setTimeout(r, 500));
    setUploadStage(3);
    await new Promise(r => setTimeout(r, 500));
    setUploadStage(4);

    try {
      const res = await api.uploadDocument({
        filename: fname,
        file_type: ".txt",
        text_content: pastedContent
      });

      if (res.success) {
        setLastUploadedDoc(res.document);
        setDocuments(prev => [res.document, ...prev]);
        setPastedTitle("");
        setPastedSubject("");
        setPastedContent("");
        if (onDocumentUploaded) onDocumentUploaded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setUploadStage(0);
    }
  };

  const handleLoadSample = async (subject: "dbms" | "os" | "cn") => {
    let filename = "";
    let content = "";

    if (subject === "dbms") {
      filename = "Database_Management_Systems_Core.pdf";
      content = `Database Management Systems (DBMS) - Comprehensive Academic Notes
Chapter 1: Relational Data Model and Relational Algebra
The relational model represents data as relations (tables) consisting of tuples (rows) and attributes (columns). Fundamental relational algebra operations include: Selection (sigma) which filters rows satisfying a predicate; Projection (pi) which extracts specified columns; Cartesian Product (cross product); Union and Set Difference. Derived operations include Theta Join, Equijoin, and Natural Join.

Chapter 2: Normalization and Functional Dependencies
Normalization eliminates insertion, update, and deletion anomalies.
First Normal Form (1NF): Requires atomic attribute domains (no repeating groups).
Second Normal Form (2NF): Must be in 1NF and every non-prime attribute must be fully functionally dependent on the primary key (no partial dependencies).
Third Normal Form (3NF): Must be in 2NF and have no transitive functional dependencies (X -> Y requires X is superkey or Y is prime).
Boyce-Codd Normal Form (BCNF): Stricter than 3NF; for every non-trivial functional dependency X -> Y, X must be a superkey.

Chapter 3: Transaction Management and ACID Properties
A transaction is a logical unit of database processing. The ACID properties guarantee reliability:
- Atomicity: All operations in the transaction execute completely or none do (enforced by write-ahead logging).
- Consistency: Execution preserves all database integrity constraints and invariants.
- Isolation: Concurrent transactions execute without mutual interference (Serializability, 2-Phase Locking protocol).
- Durability: Once committed, updates persist even in the event of system power failure.

Chapter 4: Database Indexing and B+ Trees
Indexes accelerate data retrieval. B+ Trees maintain balanced depth O(log N) where all data records reside in leaf nodes connected as a doubly linked list, enabling efficient range scans.`;
    } else if (subject === "os") {
      filename = "Operating_Systems_Concurrency_Deadlocks.pdf";
      content = `Operating Systems & Concurrency Theory
Chapter 1: Concurrency and Process Synchronization
In multi-programmed operating systems, concurrent threads share address spaces. The critical section problem requires three conditions: Mutual Exclusion (only one process in critical region), Progress (selection of next process cannot be postponed indefinitely), and Bounded Waiting (finite limit on wait time). Synchronization primitives include Mutex Locks, Counting Semaphores (with atomic wait() / signal() operations), and Monitors.

Chapter 2: Deadlocks and Coffman Conditions
A deadlock occurs when processes are unable to proceed because each holds a resource requested by another. The four necessary Coffman conditions are:
1. Mutual Exclusion: At least one resource held non-shareably.
2. Hold and Wait: A process holds resources while requesting additional ones.
3. No Preemption: Resources cannot be forcibly seized.
4. Circular Wait: A closed chain of processes waiting for circular resources.

Chapter 3: Deadlock Handling & Banker's Algorithm
Strategies:
- Prevention: Deny at least one Coffman condition (e.g. strict global resource numbering prevents circular wait).
- Avoidance: Dijkstra's Banker's Algorithm evaluates Maximum Claim, Allocation, and Available resource vectors to ensure every grant maintains a Safe Sequence.
- Detection and Recovery: Maintain Wait-For Graphs and abort cycle nodes.

Chapter 4: Virtual Memory and Page Replacement
Demand Paging swaps pages upon reference. Key algorithms: FIFO (exhibits Belady's anomaly), LRU (Least Recently Used), and Optimal (clairvoyant). Translation Lookaside Buffers (TLB) cache page-to-frame translations.`;
    } else {
      filename = "Computer_Networks_Protocols.pdf";
      content = `Computer Networks & Distributed Systems
Chapter 1: The OSI and TCP/IP Reference Architectures
The 7-layer OSI model: Physical, Data Link, Network, Transport, Session, Presentation, Application. In TCP/IP, the Transport layer provides end-to-end communication via TCP (reliable, connection-oriented, stream-based, congestion-controlled) and UDP (unreliable, connectionless datagrams).

Chapter 2: IP Addressing, Routing, and CIDR
IPv4 utilizes 32-bit addresses formatted as dotted-quads. Classless Inter-Domain Routing (CIDR) uses variable-length subnet masks (e.g., /24). Routing protocols include Distance-Vector (Bellman-Ford, RIP) and Link-State (Dijkstra's shortest path, OSPF).

Chapter 3: TCP Congestion Control and Reliability
TCP implements sequence numbers, cumulative acknowledgments, and sliding window flow control. Congestion control phases: Slow Start (exponential window growth), Congestion Avoidance (additive increase / multiplicative decrease AIMD), Fast Retransmit, and Fast Recovery.

Chapter 4: Network Security and TLS/SSL
Transport Layer Security (TLS) uses public key cryptography (RSA, ECC) for authentication and symmetric ciphers (AES-GCM) for encrypted data transmission.`;
    }

    setUploading(true);
    setActiveFileName(filename);
    setActiveFileType(".pdf");
    setActiveFileSize(content.length);
    setUploadStage(1);
    await new Promise(r => setTimeout(r, 500));
    setUploadStage(2);
    await new Promise(r => setTimeout(r, 600));
    setUploadStage(3);
    await new Promise(r => setTimeout(r, 600));
    setUploadStage(4);

    try {
      const res = await api.uploadDocument({
        filename,
        file_type: ".pdf",
        text_content: content
      });
      if (res.success) {
        setLastUploadedDoc(res.document);
        setDocuments(prev => [res.document, ...prev]);
        if (onDocumentUploaded) onDocumentUploaded();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
      setUploadStage(0);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (lastUploadedDoc && lastUploadedDoc.id === id) {
        setLastUploadedDoc(null);
      }
      if (onDocumentUploaded) onDocumentUploaded();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-slate-700" />
          <span>Upload Study Material</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload your course documents to generate your personalized AI tutor, adaptive quizzes, and knowledge tracing models.
        </p>
      </div>

      {/* Upload Methods Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("file")}
          className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "file"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upload File (PDF, DOCX, PPT, TXT, Image)</span>
        </button>
        <button
          onClick={() => setActiveTab("paste")}
          className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "paste"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Paste Notes Directly</span>
        </button>
      </div>

      {/* Main Upload Box */}
      {activeTab === "file" ? (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-8 md:p-10 text-center bg-white hover:bg-slate-50/50 transition-colors flex flex-col items-center justify-center space-y-4 cursor-pointer group shadow-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.ppt,.pptx,.txt,image/*"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Upload your study material</h3>
            <p className="text-xs text-slate-500">
              Drag & drop files here, or <span className="text-slate-900 underline font-semibold">Choose File</span>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Supports PDF, DOCX, PPT, PPTX, TXT, PNG, JPG
            </p>
          </div>

          {/* Quick Demo Pre-load buttons for College Exam Demonstration */}
          <div className="pt-4 border-t border-slate-100 w-full max-w-lg mt-2" onClick={e => e.stopPropagation()}>
            <div className="text-[11px] font-medium text-slate-500 mb-2 uppercase tracking-wider">
              Or quick-load sample course syllabus:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample("dbms")}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
              >
                + DBMS Syllabus (PDF)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("os")}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
              >
                + Operating Systems (PDF)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("cn")}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
              >
                + Computer Networks (PDF)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Paste Notes Form */
        <form onSubmit={handlePasteSubmit} className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                value={pastedTitle}
                onChange={e => setPastedTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Notes"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subject Area (Optional)</label>
              <input
                type="text"
                value={pastedSubject}
                onChange={e => setPastedSubject(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Paste Lecture Text / Concepts</label>
            <textarea
              rows={8}
              value={pastedContent}
              onChange={e => setPastedContent(e.target.value)}
              placeholder="Paste lecture notes, textbook chapters, formulas, or syllabus content here..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 placeholder:text-slate-400 font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !pastedContent.trim()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium shadow-xs flex items-center gap-2 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Process & Index Notes</span>
            </button>
          </div>
        </form>
      )}

      {/* Uploading Status Stepper */}
      {uploading && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center animate-spin">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{activeFileName}</h4>
                <p className="text-xs text-slate-500 font-mono">
                  {activeFileType.toUpperCase()} • {Math.round(activeFileSize / 1024)} KB
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Processing Pipeline Active
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
            {[
              { num: 1, title: "1. Text Extraction", desc: "PyMuPDF / OCR Parser" },
              { num: 2, title: "2. Topic Detection", desc: "Syllabus Analysis" },
              { num: 3, title: "3. Chunking", desc: "Sentence Transformers" },
              { num: 4, title: "4. Indexing", desc: "FAISS Vector Store" }
            ].map(step => (
              <div
                key={step.num}
                className={`p-3 rounded-lg border text-xs transition-colors ${
                  uploadStage === step.num
                    ? "bg-slate-100 border-slate-400 text-slate-900 font-semibold"
                    : uploadStage > step.num
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {uploadStage > step.num ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="font-mono">{step.num}.</span>
                  )}
                  <span className="truncate">{step.title}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Success Banner for Last Uploaded Document */}
      {lastUploadedDoc && !uploading && (
        <div className="rounded-xl bg-white border border-emerald-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Study Material Successfully Indexed!</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  <span className="font-medium text-slate-900">{lastUploadedDoc.name}</span> has been processed into{" "}
                  <span className="font-medium text-slate-900">{lastUploadedDoc.chunk_count} vector chunks</span> and registered in your knowledge graph.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              {onNavigateToSummary && (
                <button
                  onClick={() => onNavigateToSummary(lastUploadedDoc.detected_topics[0])}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Summary</span>
                </button>
              )}
              {onNavigateToQuiz && (
                <button
                  onClick={() => onNavigateToQuiz(lastUploadedDoc.detected_topics[0])}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Take Quiz</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600 mb-2">Detected Topics in this Document:</div>
            <div className="flex flex-wrap gap-1.5">
              {lastUploadedDoc.detected_topics.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded text-xs font-normal bg-slate-50 text-slate-700 border border-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List of Uploaded Documents */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <span>Uploaded Learning Materials ({documents.length})</span>
        </h2>

        {documents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No study materials uploaded yet. Upload a PDF, DOCX, PPT, or TXT file above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map(doc => (
              <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{doc.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-medium text-slate-700 border border-slate-200">
                        {doc.file_type.replace(".", "")}
                      </span>
                      <span>•</span>
                      <span>{doc.chunk_count} chunks</span>
                      <span>•</span>
                      <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {doc.detected_topics.map((t, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {onNavigateToSummary && doc.detected_topics.length > 0 && (
                    <button
                      onClick={() => onNavigateToSummary(doc.detected_topics[0])}
                      className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      title="Summarize document"
                    >
                      Summarize
                    </button>
                  )}
                  {onNavigateToQuiz && doc.detected_topics.length > 0 && (
                    <button
                      onClick={() => onNavigateToQuiz(doc.detected_topics[0])}
                      className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      title="Take quiz"
                    >
                      Quiz
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
