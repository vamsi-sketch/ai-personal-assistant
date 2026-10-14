"""
FastAPI Application Entry Point
Adaptive AI Personal Learning Assistant Using Deep Learning and Knowledge Tracing
"""

import sys
import os

# Automatically add Project Root, Backend, and App directories to sys.path
# This guarantees that python -m uvicorn, python main.py, or running from any directory works!
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))               # .../backend/app
BACKEND_DIR = os.path.dirname(CURRENT_DIR)                             # .../backend
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)                            # .../ (project root)

for path in [PROJECT_ROOT, BACKEND_DIR, CURRENT_DIR]:
    if path and path not in sys.path:
        sys.path.insert(0, path)

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

try:
    from backend.app.database.mongodb import connect_to_mongo, close_mongo_connection
    from backend.app.services.dkt_service import dkt_service
    from backend.app.services.rag_service import vector_store, get_rag_context
    from backend.app.services.recommendation_service import RecommendationEngine
    from backend.app.models.schemas import (
        StudentRegister, StudentLogin, ChatRequest, SummarizeRequest,
        QuizGenerateRequest, QuizSubmission, StudyPlanGenerateRequest
    )
except ImportError:
    try:
        from app.database.mongodb import connect_to_mongo, close_mongo_connection
        from app.services.dkt_service import dkt_service
        from app.services.rag_service import vector_store, get_rag_context
        from app.services.recommendation_service import RecommendationEngine
        from app.models.schemas import (
            StudentRegister, StudentLogin, ChatRequest, SummarizeRequest,
            QuizGenerateRequest, QuizSubmission, StudyPlanGenerateRequest
        )
    except ImportError:
        from database.mongodb import connect_to_mongo, close_mongo_connection
        from services.dkt_service import dkt_service
        from services.rag_service import vector_store, get_rag_context
        from services.recommendation_service import RecommendationEngine
        from models.schemas import (
            StudentRegister, StudentLogin, ChatRequest, SummarizeRequest,
            QuizGenerateRequest, QuizSubmission, StudyPlanGenerateRequest
        )

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing Adaptive AI Learning Assistant Backend...")
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Adaptive AI Personal Learning Assistant API",
    description="Backend API with Deep Knowledge Tracing (DKT), RAG, and Adaptive Learning Engine",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "Adaptive AI Personal Learning Assistant Using Deep Learning and Knowledge Tracing",
        "status": "online",
        "dkt_engine": "PyTorch LSTM DKT",
        "vector_search": "Sentence Transformers + FAISS",
        "llm_engine": "Gemini 3.8 Flash"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "adaptive-ai-backend"}

# --- AUTH ROUTES ---
@app.post("/api/auth/register")
def register_student(payload: StudentRegister):
    return {
        "success": True,
        "token": "demo-jwt-token-xyz-12345",
        "student": {
            "id": "demo_student",
            "name": payload.name,
            "email": payload.email,
            "target_exam": payload.target_exam,
            "target_date": payload.target_date,
            "daily_study_hours": payload.daily_study_hours,
            "created_at": "2026-09-22T00:00:00Z"
        }
    }

@app.post("/api/auth/login")
def login_student(payload: StudentLogin):
    return {
        "success": True,
        "token": "demo-jwt-token-xyz-12345",
        "student": {
            "id": "demo_student",
            "name": "Alex Mercer",
            "email": payload.email,
            "target_exam": "Computer Science Final Review",
            "target_date": "2026-12-15",
            "daily_study_hours": 3.0,
            "created_at": "2026-09-01T10:00:00Z"
        }
    }

# --- DOCUMENT ROUTES ---
@app.get("/api/documents")
def list_documents():
    return [
        {
            "id": "doc_os_core",
            "name": "Operating_Systems_Fundamentals.pdf",
            "file_type": ".pdf",
            "size_bytes": 1420500,
            "char_count": 48200,
            "page_count": 28,
            "detected_topics": ["Deadlocks", "CPU Scheduling", "Process Synchronization", "Virtual Memory"],
            "chunk_count": 52,
            "uploaded_at": "2026-09-18T14:32:00Z",
            "status": "indexed"
        },
        {
            "id": "doc_algo_core",
            "name": "Data_Structures_and_Algorithms_Notes.docx",
            "file_type": ".docx",
            "size_bytes": 850200,
            "char_count": 31500,
            "page_count": 19,
            "detected_topics": ["Binary Search Trees", "Dynamic Programming", "Graph Traversal"],
            "chunk_count": 34,
            "uploaded_at": "2026-09-19T09:15:00Z",
            "status": "indexed"
        }
    ]

# --- CHAT & RAG ROUTES ---
@app.post("/api/chat")
def chat_with_tutor(req: ChatRequest):
    rag_info = get_rag_context(req.message, top_k=2)
    return {
        "reply": f"Based on your course materials in {', '.join(rag_info['sources'])}:\n\n{rag_info['context_text']}",
        "sources": rag_info["sources"],
        "retrieved_chunks": [c["chunk_id"] for c in rag_info["retrieved_chunks"]]
    }

# --- MASTERY & DKT ROUTES ---
@app.get("/api/mastery")
def get_mastery(student_id: str = "demo_student"):
    return dkt_service.calculate_topic_mastery(student_id)

# --- RECOMMENDATIONS & STUDY PLAN ---
@app.get("/api/recommendations")
def get_recommendations(student_id: str = "demo_student"):
    return RecommendationEngine.get_recommendations(student_id)

@app.post("/api/study-plan")
def generate_study_plan(req: StudyPlanGenerateRequest):
    return RecommendationEngine.generate_study_plan(
        exam_date=req.exam_date,
        available_hours_per_day=req.available_hours_per_day,
        subjects=req.subjects,
        learning_goals=req.learning_goals
    )

if __name__ == "__main__":
    import uvicorn
    # Allows running directly via `python main.py`
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
