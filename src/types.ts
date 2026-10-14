export type Difficulty = "Easy" | "Medium" | "Hard" | "Auto";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  target_exam: string;
  target_date: string;
  daily_study_hours: number;
  preferred_difficulty: string;
  created_at: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  file_type: string;
  size_bytes: number;
  char_count: number;
  page_count: number;
  detected_topics: string[];
  chunk_count: number;
  uploaded_at: string;
  status: "indexed" | "processing" | "ready";
}

export interface DocumentChunk {
  chunk_id: string;
  doc_id: string;
  doc_name: string;
  topic: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: "student" | "tutor";
  text: string;
  timestamp: string;
  sources?: string[];
  retrieved_chunks?: {
    chunk_id: string;
    doc_name: string;
    topic: string;
    snippet: string;
  }[];
}

export interface TopicMastery {
  topic_id: number;
  topic_name: string;
  category: string;
  dkt_mastery: number; // 0.0 to 1.0
  mastery_percentage: number;
  accuracy: number;
  total_attempts: number;
  status: "Strong" | "Moderate" | "Weak" | "Critical" | "Untested";
  recommended_difficulty: "Easy" | "Medium" | "Hard";
  confidence: number;
}

export interface QuizQuestionClient {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
  question: string;
  options?: string[];
}

export interface QuizSubmissionResult {
  attempt_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  accuracy: number;
  ai_feedback: {
    what_went_well: string;
    what_was_wrong: string;
    why_wrong: string;
    recommended_revision: string;
    next_action: string;
  };
  answers: {
    question_id: string;
    question: string;
    topic: string;
    difficulty: string;
    selected_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
  }[];
  updated_topic_mastery?: TopicMastery[];
}

export interface Recommendation {
  id: string;
  type: string;
  badge: string;
  title: string;
  topic: string;
  reason: string;
  difficulty: string;
  priority: "High" | "Medium" | "Normal";
  action_label: string;
  action_route: string;
}

export interface StudyPlanDay {
  day: number;
  date: string;
  subject: string;
  topic: string;
  activity: string;
  difficulty: string;
  estimated_minutes: number;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  exam_date: string;
  daily_hours: number;
  overall_progress: number;
  days: StudyPlanDay[];
}
