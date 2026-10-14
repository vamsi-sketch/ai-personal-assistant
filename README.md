# Adaptive AI Personal Learning Assistant Using Deep Learning and Knowledge Tracing

A full-stack, production-grade adaptive educational platform engineered for college and university students. The system dynamically measures student knowledge states using an **LSTM-based Deep Knowledge Tracing (DKT)** recurrent neural network, retrieves syllabus content using a **Retrieval-Augmented Generation (RAG)** pipeline with **Sentence Transformers** and **FAISS**, generates adaptive difficulty-calibrated assessments, and formulates automated day-by-day study schedules.

---

## 1. Problem Statement
Traditional digital learning systems treat all learners uniformly—presenting static quiz questions regardless of whether a student has mastered foundational prerequisites. Conversely, students frequently encounter:
1. **Inefficient Study Sessions**: Revisiting concepts they already understand or failing to identify latent knowledge gaps.
2. **Uncalibrated Assessments**: Taking tests that are either too simplistic or overwhelming.
3. **Information Overload**: Struggling to distill voluminous university course slides, textbook chapters, and lecture notes into high-yield revision summaries.

## 2. Solution Overview
This platform combines sequence-aware deep learning with semantic vector search:
- **Deep Knowledge Tracing (DKT)**: Models student learning as a temporal sequence of interactions $(q_t, a_t)$ via an LSTM network to predict the probability that a student will correctly answer future questions across every syllabus concept.
- **RAG Architecture**: Automatically extracts and chunks multi-format university materials (PDF, DOCX, PPT, PPTX, TXT) with PyMuPDF and python-docx, generates dense vector embeddings via Sentence Transformers (`all-MiniLM-L6-v2`), and indexes them into FAISS for context-grounded AI tutoring.
- **Adaptive Quiz Engine**: Automatically adjusts question difficulty (Easy / Medium / Hard) based on real-time DKT mastery and explains the pedagogical rationale behind each calibration.
- **Automated AI Diagnostic Feedback**: Generates granular pedagogical analysis after every quiz attempt—highlighting what went well, why errors occurred, root misconceptions, and immediate remedial steps.

---

## 3. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons                       |
|  - Student Dashboard               - AI Personal Tutor (RAG Chat)                 |
|  - FAISS Document Ingestion UI     - AI Academic Summarizer                       |
|  - Adaptive Quiz & Assessment      - Detailed AI Diagnostic Feedback              |
|  - Longitudinal Performance Gauge  - Weak Topic Diagnostic & Remediation          |
|  - LSTM DKT Mastery Visualizer     - Day-by-Day Automated Study Planner           |
+------------------------------------------+----------------------------------------+
                                           | HTTP REST APIs (/api/*)
                                           v
+-----------------------------------------------------------------------------------+
|                                 SERVER TIER                                       |
|  Full-Stack Express / FastAPI Modular Service Architecture (Port 3000)            |
|  - Auth & Profile Controller       - Document Ingestion & Chunking Pipeline       |
|  - RAG Retrieval Controller        - Adaptive Assessment & Session Evaluator      |
|  - Performance Analytics Service   - Study Schedule Generation Engine             |
+--------------------+-------------------------------------+------------------------+
                     |                                     |
                     v                                     v
+------------------------------------+   +------------------------------------------+
|       DEEP KNOWLEDGE TRACING       |   |       RAG & VECTOR SEARCH ENGINE         |
|  LSTM Sequence Model (PyTorch)     |   |  Dense Vector Search (FAISS Index)       |
|  x_t = q_t + a_t * Q               |   |  Sentence Transformer (all-MiniLM-L6-v2) |
|  h_t = LSTM(x_t, h_{t-1})          |   |  Text Chunking: 250 words / 50 overlap   |
|  y_t = Sigmoid(W_y * h_t + b_y)    |   |  PyMuPDF (PDF), python-docx, PPTX, TXT   |
|  Checkpoint: dkt_model.pth         |   |  Grounding via Gemini 3.8 Flash SDK      |
+------------------------------------+   +------------------------------------------+
```

---

## 4. Repository Structure

```
.
├── ai_models/
│   ├── dkt/
│   │   ├── model.py              # PyTorch LSTM Deep Knowledge Tracing architecture
│   │   ├── dataset.py            # Sequence padding, collate, and ASSISTments dataloader
│   │   ├── train.py              # Training loop with BCEWithLogitsLoss & Adam optimizer
│   │   └── predict.py            # Real-time mastery inference on student interaction history
│   ├── embeddings/
│   │   └── embedding_model.py    # SentenceTransformers & FAISS Vector Store manager
│   └── trained_models/
│       └── dkt_model.pth         # Serialized DKT neural network weights checkpoint
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── mongodb.py        # Asynchronous Motor MongoDB client connector
│   │   ├── document_processing/
│   │   │   ├── extractor.py      # Multi-format text extraction (PDF, DOCX, PPTX, TXT)
│   │   │   └── chunker.py        # Semantic sliding-window text chunker
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic schemas for APIs and validation
│   │   ├── services/
│   │   │   ├── rag_service.py    # RAG vector retrieval & Gemini model prompt context
│   │   │   ├── dkt_service.py    # DKT sequence management & mastery calculation
│   │   │   └── recommendation_service.py # Multi-objective recommendation synthesis
│   │   └── main.py               # FastAPI application with REST endpoints
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Backend environment variables
├── data/
│   ├── raw/
│   │   └── assistments_sample.csv # Raw skill builder interaction dataset
│   └── processed/
│       └── dkt_interaction_sequences.json # Cleaned interaction sequences
├── notebooks/
│   └── DKT_Model_Exploration.ipynb # Jupyter notebook documenting DKT math and metrics
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Top application bar with streak and DKT status
│   │   └── Sidebar.tsx           # Responsive learning navigation sidebar
│   ├── pages/
│   │   ├── DashboardPage.tsx     # Student summary metrics & recommended next steps
│   │   ├── TutorPage.tsx         # AI Personal Tutor chat with RAG chunk citations
│   │   ├── UploadPage.tsx        # Study material ingestion & FAISS vector indexing
│   │   ├── SummaryPage.tsx       # AI Summarization (Chapter, Notes, Formulas)
│   │   ├── QuizPage.tsx          # Adaptive quiz generator with dynamic difficulty
│   │   ├── QuizResultPage.tsx    # Evaluation results with granular AI pedagogical feedback
│   │   ├── PerformancePage.tsx   # Visual learning trajectories & difficulty metrics
│   │   ├── WeakTopicsPage.tsx    # Weak topic diagnostic & root misconception analysis
│   │   ├── MasteryPage.tsx       # Deep Knowledge Tracing state & mathematical visualizer
│   │   ├── RecommendationsPage.tsx # Multi-objective adaptive recommendations
│   │   ├── StudyPlanPage.tsx     # Automated day-by-day study schedule with checkboxes
│   │   └── ProfilePage.tsx       # Student profile & exam settings
│   ├── services/
│   │   └── api.ts                # Client API service wrapper
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                   # Root router and global state provider
│   └── main.tsx                  # React entry point
├── tests/
│   ├── test_dkt.py               # Unit tests verifying PyTorch DKT forward and backward passes
│   └── test_api.py               # Integration tests for REST endpoints
├── server.ts                     # Full-stack Node.js server with Vite middleware & APIs
├── package.json                  # Scripts and dependencies
└── README.md
```

---

## 5. How Deep Knowledge Tracing (DKT) Works

1. **Input Encoding**: At each time step $t$, the student answers a question on concept $q_t \in \{0, \dots, Q-1\}$ with binary correctness $a_t \in \{0, 1\}$. This is converted into an input vector:
   $$x_t = q_t + a_t \cdot Q$$
2. **LSTM Cell**: An embedding layer projects $x_t$ into dimension $d_E$, which feeds into an LSTM recurrent neural network:
   $$h_t, c_t = \text{LSTM}(x_t, h_{t-1}, c_{t-1})$$
3. **Mastery Prediction**: A linear projection followed by a sigmoid activation generates a vector of predicted accuracies across all $Q$ concepts:
   $$y_t = \sigma(W_y h_t + b_y), \quad y_t \in [0, 1]^Q$$
4. **Adaptive Calibration**: If $y_t[k] < 0.50$, the system automatically selects an **Easy** quiz difficulty to rebuild fundamental concepts. If $0.50 \le y_t[k] < 0.75$, **Medium** is selected. If $y_t[k] \ge 0.75$, the student is challenged with **Hard** competition-grade exercises.

---

## 6. How Retrieval-Augmented Generation (RAG) Works

1. **Document Ingestion**: The student uploads lecture slides, syllabi, or textbook PDFs (`.pdf`, `.docx`, `.pptx`, `.txt`).
2. **Text Cleaning & Semantic Chunking**: PyMuPDF extracts raw text, strips noise, and creates sliding-window chunks of 250 words with 50-word overlaps.
3. **Dense Vector Embeddings**: Sentence Transformers (`all-MiniLM-L6-v2`) encode chunks into 384-dimensional dense vectors.
4. **FAISS Indexing**: Embeddings are stored in an inner-product / L2 FAISS index.
5. **Contextual Augmentation**: When the student queries the AI Tutor, the top-$k$ nearest document chunks are retrieved and prepended to the Gemini 3.8 Flash prompt, guaranteeing verified academic grounding and eliminating hallucinations.

---

## 7. Setup & Execution Instructions

### Node.js Full-Stack Application (Interactive Web UI & APIs)
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env
# GEMINI_API_KEY="your-google-gemini-api-key"

# 3. Start development server on port 3000
npm run dev

# 4. Build and run production bundle
npm run build
npm start
```

### Python Backend & DKT ML Pipeline (Optional Standalone Service)
```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install requirements
pip install -r backend/requirements.txt

# 3. Run DKT Model Unit Tests
python -m unittest tests/test_dkt.py

# 4. Train DKT Model
python ai_models/dkt/train.py

# 5. Launch FastAPI backend service
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 8. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check and Gemini status |
| `GET` | `/api/auth/me` | Fetch active student profile and targets |
| `POST` | `/api/auth/update-profile` | Update target exam, date, and study hours |
| `GET` | `/api/documents` | List all indexed course materials |
| `POST` | `/api/documents/upload` | Ingest and index new lecture notes into FAISS |
| `DELETE` | `/api/documents/:id` | Remove document and associated vector chunks |
| `POST` | `/api/chat` | AI Personal Tutor response grounded via RAG |
| `POST` | `/api/summarize` | Generate chapter, topic, or revision summaries |
| `POST` | `/api/quiz/generate` | Adaptively generate questions based on DKT mastery |
| `POST` | `/api/quiz/submit` | Evaluate answers, update DKT history, generate AI feedback |
| `GET` | `/api/performance` | Return historical quiz metrics and learning trajectories |
| `GET` | `/api/weak-topics` | Return detected weak topics with root misconceptions |
| `GET` | `/api/mastery` | Return real-time DKT topic probability vector |
| `GET` | `/api/recommendations` | Return multi-objective learning action cards |
| `GET` | `/api/study-plan` | Return active day-by-day study schedule |
| `POST` | `/api/study-plan` | Regenerate optimized schedule based on goals |
| `PATCH` | `/api/study-plan/toggle-day/:day` | Toggle day task completion status |

---

## 9. Future Enhancements
- **Multi-Modal Document Parsing**: Diagram OCR and schematic parsing for engineering circuit diagrams and flowcharts.
- **DKT+ Graph Neural Networks (G-DKT)**: Explicit modeling of prerequisite concept graph dependencies.
- **Collaborative Group Study Rooms**: Real-time collaborative peer study lobbies with shared vector notes.
