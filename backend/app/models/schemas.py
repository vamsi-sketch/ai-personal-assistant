"""
Pydantic Schemas and Data Models for Adaptive Learning Assistant
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- Auth & Student ---
class StudentRegister(BaseModel):
    name: str
    email: str
    password: str
    target_exam: Optional[str] = "Computer Science Core Exams"
    target_date: Optional[str] = "2026-12-15"
    daily_study_hours: Optional[float] = 2.5

class StudentLogin(BaseModel):
    email: str
    password: str

class StudentProfile(BaseModel):
    id: str
    name: str
    email: str
    target_exam: str
    target_date: str
    daily_study_hours: float
    preferred_difficulty: str = "Medium"
    created_at: str

# --- Documents ---
class DocumentItem(BaseModel):
    id: str
    name: str
    file_type: str
    size_bytes: int
    char_count: int
    page_count: int
    detected_topics: List[str]
    chunk_count: int
    uploaded_at: str
    status: str = "indexed" # "uploading", "processing", "indexed", "failed"

# --- RAG & Chat ---
class ChatMessage(BaseModel):
    sender: str # "student" or "tutor"
    text: str
    timestamp: str
    source_documents: Optional[List[str]] = None
    retrieved_chunks: Optional[List[str]] = None

class ChatRequest(BaseModel):
    message: str
    document_filter: Optional[str] = None # None means all documents
    explanation_mode: Optional[str] = "standard" # "simple", "example", "exam", "deep"

# --- Summarization ---
class SummarizeRequest(BaseModel):
    summary_type: str # "chapter", "topic", "revision_notes", "important_points", "short_explanation"
    topic: Optional[str] = None
    document_id: Optional[str] = None

# --- Quiz & Questions ---
class QuizQuestion(BaseModel):
    id: str
    topic: str
    difficulty: str # "Easy", "Medium", "Hard"
    type: str # "mcq", "true_false", "short_answer", "conceptual"
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str

class QuizGenerateRequest(BaseModel):
    topic: Optional[str] = "All Topics"
    num_questions: int = 5
    adaptive_mode: bool = True
    requested_difficulty: Optional[str] = "Auto"

class QuizSubmissionAnswer(BaseModel):
    question_id: str
    topic: str
    difficulty: str
    selected_answer: str
    time_taken_seconds: int

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[QuizSubmissionAnswer]
    total_time_seconds: int

class QuizAttemptResult(BaseModel):
    id: str
    student_id: str
    score: int
    total_questions: int
    percentage: float
    topic_breakdown: Dict[str, Dict[str, Any]]
    ai_feedback: Dict[str, Any]
    detailed_answers: List[Dict[str, Any]]
    attempted_at: str

# --- DKT & Topic Mastery ---
class TopicMasteryItem(BaseModel):
    topic_id: int
    topic_name: str
    dkt_mastery: float # 0.0 to 1.0 (LSTM DKT predicted probability)
    accuracy: float
    total_attempts: int
    status: str # "Strong", "Moderate", "Weak", "Critical"
    recommended_difficulty: str

# --- Recommendations ---
class RecommendationItem(BaseModel):
    type: str # "next_topic", "revision_needed", "practice_quiz", "prerequisite"
    title: str
    topic: str
    reason: str
    difficulty: str
    priority: str # "High", "Medium", "Normal"
    action_label: str

# --- Study Plan ---
class StudyPlanGenerateRequest(BaseModel):
    exam_date: str
    available_hours_per_day: float
    subjects: List[str]
    learning_goals: str

class StudyPlanDay(BaseModel):
    day: int
    date: str
    subject: str
    topic: str
    activity: str
    difficulty: str
    estimated_minutes: int
    completed: bool = False

class StudyPlan(BaseModel):
    id: str
    student_id: str
    exam_date: str
    daily_hours: float
    overall_progress: float
    days: List[StudyPlanDay]
    created_at: str
