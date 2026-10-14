import {
  StudentProfile,
  UploadedDocument,
  TopicMastery,
  QuizQuestionClient,
  QuizSubmissionResult,
  Recommendation,
  StudyPlan
} from "../types";

const USER_KEY = "adaptive_ai_user_id";

export function getCurrentUserId(): string {
  let uid = localStorage.getItem(USER_KEY);
  if (!uid) {
    // Default fresh user ID for initial load
    uid = "user_vamsi";
    localStorage.setItem(USER_KEY, uid);
  }
  return uid;
}

export function setCurrentUserId(userId: string) {
  localStorage.setItem(USER_KEY, userId);
}

export function clearCurrentUserId() {
  localStorage.removeItem(USER_KEY);
}

function getHeaders(contentType: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {
    "x-user-id": getCurrentUserId(),
    "Authorization": `Bearer ${getCurrentUserId()}`
  };
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export const api = {
  // Auth
  async getProfile(): Promise<{ student: StudentProfile }> {
    const res = await fetch("/api/auth/me", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  async register(payload: {
    email: string;
    password?: string;
    name?: string;
    target_exam?: string;
    target_date?: string;
    daily_study_hours?: number;
  }): Promise<{ success: boolean; token: string; user_id: string; student: StudentProfile; error?: string }> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.user_id) {
      setCurrentUserId(data.user_id);
    }
    return data;
  },

  async login(email: string, password?: string): Promise<{ success: boolean; token: string; user_id: string; student: StudentProfile; error?: string }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.user_id) {
      setCurrentUserId(data.user_id);
    }
    return data;
  },

  async updateProfile(updates: Partial<StudentProfile>): Promise<{ success: boolean; student: StudentProfile }> {
    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async resetData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/reset-data", {
      method: "POST",
      headers: getHeaders()
    });
    return res.json();
  },

  // Documents
  async getDocuments(): Promise<UploadedDocument[]> {
    const res = await fetch("/api/documents", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  async uploadDocument(payload: {
    filename: string;
    file_type: string;
    text_content?: string;
    base64_content?: string;
    detected_topics?: string[];
  }): Promise<{
    success: boolean;
    document: UploadedDocument;
    detected_topics: string[];
    total_user_documents: number;
    total_user_topics: number;
  }> {
    const res = await fetch("/api/documents/upload", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
      headers: getHeaders(false)
    });
    return res.json();
  },

  // Chat & Tutor
  async sendTutorMessage(payload: {
    message: string;
    explanation_mode?: "standard" | "simple" | "example" | "exam";
  }): Promise<{
    reply: string;
    sources: string[];
    retrieved_chunks: { chunk_id: string; doc_name: string; topic: string; snippet: string }[];
  }> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Summarize
  async summarize(payload: {
    summary_type: string;
    topic?: string;
    document_id?: string;
  }): Promise<{ summary: string; topic: string; summary_type: string; sources: string[] }> {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Quiz
  async generateQuiz(payload: {
    topic: string;
    requested_difficulty?: string;
    num_questions?: number;
  }): Promise<{
    quiz_id: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    adaptive_reason: string;
    total_questions: number;
    questions: QuizQuestionClient[];
    error?: string;
  }> {
    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async submitQuiz(payload: {
    quiz_id: string;
    answers: { question_id: string; topic: string; difficulty: string; selected_answer: string }[];
    time_taken_seconds: number;
  }): Promise<QuizSubmissionResult> {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Analytics & Mastery
  async getPerformance(): Promise<any> {
    const res = await fetch("/api/performance", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  async getMastery(): Promise<{ model: string; mastery_topics: TopicMastery[]; average_mastery: number }> {
    const res = await fetch("/api/mastery", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  async getWeakTopics(): Promise<{ total_weak: number; weak_topics: any[] }> {
    const res = await fetch("/api/weak-topics", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  // Recommendations & Study Plan
  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch("/api/recommendations", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  async getStudyPlan(): Promise<StudyPlan | null> {
    const res = await fetch("/api/study-plan", {
      headers: getHeaders(false)
    });
    return res.json();
  },

  async generateStudyPlan(payload: {
    exam_date: string;
    available_hours_per_day: number;
  }): Promise<StudyPlan> {
    const res = await fetch("/api/study-plan", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async toggleStudyPlanDay(day: number): Promise<StudyPlan> {
    const res = await fetch(`/api/study-plan/toggle-day/${day}`, {
      method: "PATCH",
      headers: getHeaders(false)
    });
    return res.json();
  }
};
