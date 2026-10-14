import React from "react";
import { StudentProfile } from "../types";
import {
  GraduationCap,
  ArrowRight,
  BrainCircuit,
  FileText,
  UploadCloud,
  Bot,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Database,
  Search,
  BookOpen,
  User,
  LogIn
} from "lucide-react";

interface LandingPageProps {
  student: StudentProfile | null;
  onEnterWorkspace: () => void;
  onSignIn: () => void;
  onRegister: () => void;
  onQuickDemoUser: (name: string, email: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  student,
  onEnterWorkspace,
  onSignIn,
  onRegister,
  onQuickDemoUser
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                Adaptive AI
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                Deep Knowledge Tracing Assistant
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors">
              Architecture
            </a>
            <a href="#dkt" className="hover:text-slate-900 transition-colors">
              Deep Knowledge Tracing
            </a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">
              Workflow
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {student?.id ? (
              <button
                onClick={onEnterWorkspace}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Enter Workspace ({student.name || "Student"})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onRegister}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>College Final Year Project · AI in Education</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Adaptive AI Personal Learning Assistant
            <span className="block text-slate-500 text-2xl sm:text-3xl font-semibold mt-2">
              Using Deep Learning & Knowledge Tracing
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Upload your lecture notes, PDFs, slides, and textbooks. Our system parses chapters,
            constructs FAISS semantic embeddings, and uses an LSTM Deep Knowledge Tracing (DKT) model
            to trace your concept mastery and generate adaptive study materials.
          </p>

          {/* Strict Isolation Notice */}
          <p className="text-xs text-slate-500 font-medium">
            Strict Zero-Preset Design: Your workspace starts 100% clean. No hardcoded sample topics or fake data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onRegister}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Create Empty Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Sign In with Existing Account</span>
            </button>
          </div>

          {/* Fast Test Evaluator Shortcuts */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Instant Evaluator Logins:</span>
            <button
              onClick={() => onQuickDemoUser("Vamsi", "vamsi@assistant.edu")}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium border border-slate-200 transition-colors"
            >
              Enter as Vamsi
            </button>
            <button
              onClick={() => onQuickDemoUser("Alex Mercer", "alex@university.edu")}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium border border-slate-200 transition-colors"
            >
              Enter as Alex Mercer
            </button>
          </div>
        </div>

        {/* Visual Architecture Preview Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 md:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Deep Learning Knowledge Pipeline
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                PyTorch LSTM · FAISS RAG · Gemini AI
              </span>
            </div>

            {/* Pipeline Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="text-xs font-bold text-slate-900">Document Parsing</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Extracts text from PDF, DOCX, PPT, PPTX & TXT. Detects topic headings and segments text chunks.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="text-xs font-bold text-slate-900">FAISS Vector Index</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Computes high-dimensional dense embeddings for fast cosine similarity retrieval across lecture content.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="text-xs font-bold text-slate-900">LSTM DKT Model</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Traces student interaction sequence (question, correctness) to estimate hidden knowledge state vector.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h4 className="text-xs font-bold text-slate-900">Adaptive Assistant</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Generates calibrated quizzes, diagnostic reviews for weak topics, and exam revision timelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section id="features" className="py-16 md:py-24 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Features & Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              An End-to-End Personalized Learning Platform
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed specifically to satisfy every academic requirement for college final-year presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Multimodal Document Upload</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Accepts PDF, DOCX, PPT, PPTX, TXT, and scanned notes. Text is extracted, cleaned, and indexed without pre-populated subjects.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. RAG Contextual AI Tutor</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tutor answers student queries with strict grounding on your uploaded coursework. Includes Simple, Exam-Oriented, and Socratic pedagogical modes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Deep Knowledge Tracing (DKT)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sequential LSTM model dynamically updates topic mastery after each response, classifying concepts into Mastered, Progressing, or Needs Review.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">4. Dynamic Adaptive Quizzes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generates 5-10 question assessments dynamically with calibrated difficulty (Easy, Medium, Hard) strictly aligned to your documents.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">5. Weak Topic Diagnostics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pinpoints conceptual deficits with an error analysis breakdown and 1-click targeted remediation to reinforce learning gaps.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">6. Longitudinal Study Planner</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculates daily study allocations against your target exam date, producing a day-by-day revision checklist that adapts as you progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEEP KNOWLEDGE TRACING & MATHEMATICS SECTION */}
      <section id="dkt" className="py-16 md:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mathematical Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Deep Knowledge Tracing Formulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How our recurrent architecture continuously models cognitive state transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mathematical Spec */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recurrent Formulation
              </h4>
              <div className="space-y-3 text-xs text-slate-600 font-mono bg-white p-4 rounded-lg border border-slate-200">
                <p>
                  <strong className="text-slate-900">Interaction Vector:</strong><br />
                  x_t = [k_t, a_t] ∈ ℝ^(2M)
                </p>
                <p>
                  <strong className="text-slate-900">Hidden State Update:</strong><br />
                  h_t = tanh(W_xh · x_t + W_hh · h_(t-1) + b_h)
                </p>
                <p>
                  <strong className="text-slate-900">Predicted Mastery Probability:</strong><br />
                  y_t = σ(W_hy · h_t + b_y)
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Where <code className="font-mono text-slate-700">k_t</code> denotes the topic concept index,
                <code className="font-mono text-slate-700">a_t ∈ {'{0, 1}'}</code> records the binary answer correctness, and
                <code className="font-mono text-slate-700">y_t</code> outputs the estimated probability that the student will answer correctly on subsequent assessments.
              </p>
            </div>

            {/* DKT vs Traditional Comparison */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                DKT vs. Traditional Heuristics
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Traditional Spaced Repetition</div>
                  <p className="text-slate-500 text-[11px]">
                    Uses static forgetting curves (Leitner / SM-2) that ignore inter-topic dependencies and student-specific latent learning trajectories.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Deep Knowledge Tracing (Our System)</div>
                  <p className="text-slate-500 text-[11px]">
                    Leverages sequential LSTM memory cells to preserve temporal learning history, naturally generalizing across related prerequisites and predicting future mastery curves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW WALKTHROUGH */}
      <section id="workflow" className="py-16 md:py-24 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How the Assistant Works in 4 Steps
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Upload Course Material</h4>
                <p className="text-xs text-slate-500">
                  Select your PDF textbooks, lecture slide presentations, or notes. The system extracts raw text and discovers underlying topics automatically.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Ask the Grounded AI Tutor</h4>
                <p className="text-xs text-slate-500">
                  Receive step-by-step explanations, exam questions, or summaries strictly grounded in your specific documents without hallucination.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Take Adaptive Quizzes</h4>
                <p className="text-xs text-slate-500">
                  The system generates customized multiple-choice tests. Each attempt updates your DKT knowledge vector with instant feedback.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Follow Your Dynamic Study Roadmap</h4>
                <p className="text-xs text-slate-500">
                  Check off daily milestones, review diagnosed weak topics, and track your overall percentage mastery leading up to your exam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ready to Begin Your Adaptive Learning Space?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Create a fresh student account to experience zero pre-seeded data, or log in with one of our test evaluator profiles.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onRegister}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Get Started (Register)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium transition-colors shadow-2xs"
            >
              Sign In to Workspace
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto py-8 bg-slate-50 text-slate-500 text-xs border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-800">
              Adaptive AI Personal Learning Assistant
            </span>
            <span>· College Final-Year Project Demonstration</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>FastAPI Backend</span>
            <span>·</span>
            <span>PyTorch LSTM DKT</span>
            <span>·</span>
            <span>FAISS Vector RAG</span>
            <span>·</span>
            <span>React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
