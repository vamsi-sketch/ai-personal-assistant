import React, { useState, useEffect } from "react";
import { QuizQuestionClient, QuizSubmissionResult, UploadedDocument } from "../types";
import { api } from "../services/api";
import {
  HelpCircle,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  Upload,
  AlertCircle
} from "lucide-react";

interface QuizPageProps {
  initialTopic?: string;
  onQuizCompleted: (result: QuizSubmissionResult) => void;
  onNavigateToUpload?: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ initialTopic, onQuizCompleted, onNavigateToUpload }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [difficultyMode, setDifficultyMode] = useState<string>("Auto");
  const [numQuestions, setNumQuestions] = useState<number>(4);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [activeQuiz, setActiveQuiz] = useState<{
    quiz_id: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    adaptive_reason: string;
    questions: QuizQuestionClient[];
  } | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDocs();
  }, [initialTopic]);

  const loadDocs = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
      const allTopics = Array.from(new Set(docs.flatMap(d => d.detected_topics)));
      if (allTopics.length > 0) {
        if (initialTopic && allTopics.includes(initialTopic)) {
          setTopic(initialTopic);
        } else {
          setTopic(allTopics[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let timer: any;
    if (activeQuiz && !submitting) {
      timer = setInterval(() => {
        setTimeSpentSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, submitting]);

  const allTopics = Array.from(new Set(documents.flatMap(d => d.detected_topics)));

  const handleStartQuiz = async () => {
    if (!topic) return;
    setLoadingQuiz(true);
    setErrorMsg("");
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeSpentSeconds(0);

    try {
      const res = await api.generateQuiz({
        topic,
        requested_difficulty: difficultyMode,
        num_questions: numQuestions
      });

      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      if (res.questions && res.questions.length > 0) {
        setActiveQuiz(res);
      } else {
        setErrorMsg("Failed to generate quiz questions for this topic.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("An error occurred while generating your quiz. Please try again.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);

    const submissionAnswers = activeQuiz.questions.map(q => ({
      question_id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      selected_answer: userAnswers[q.id] || "No Answer"
    }));

    try {
      const result = await api.submitQuiz({
        quiz_id: activeQuiz.quiz_id,
        answers: submissionAnswers,
        time_taken_seconds: timeSpentSeconds
      });

      onQuizCompleted(result);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // If 0 documents uploaded, show clean empty state
  if (documents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto border border-indigo-500/20">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Topics Available for Quizzing</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Upload study materials (PDF, DOCX, PPT, or TXT) first. The system will extract your syllabus chapters and dynamically generate adaptive, grounded quizzes.
          </p>
        </div>
        {onNavigateToUpload && (
          <button
            onClick={onNavigateToUpload}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Study Material</span>
          </button>
        )}
      </div>
    );
  }

  // Quiz Setup Screen
  if (!activeQuiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-700" />
            <span>Adaptive Quiz Generation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions are generated from your uploaded notes. Deep Knowledge Tracing automatically calibrates difficulty.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
          {/* Topic Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">
              Select Topic from Your Syllabus:
            </label>
            <div className="flex flex-wrap gap-2">
              {allTopics.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    topic === t
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Setting */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">
              Difficulty Mode:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "Auto", label: "Auto (DKT)", desc: "LSTM Dynamic Calibration" },
                { id: "Easy", label: "Easy", desc: "Core Definitions" },
                { id: "Medium", label: "Medium", desc: "Algorithmic Reasoning" },
                { id: "Hard", label: "Hard", desc: "Edge Cases & Proofs" }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficultyMode(d.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    difficultyMode === d.id
                      ? "bg-slate-100 border-slate-400 text-slate-900 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="text-xs font-bold">{d.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">
              Number of Questions:
            </label>
            <div className="flex gap-2">
              {[3, 4, 5, 8].map(n => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    numQuestions === n
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {n} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingQuiz && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Sparkles className="w-5 h-5 text-slate-700 animate-spin mx-auto" />
              <div className="text-xs font-bold text-slate-900">Gemini 3.8 Flash is Generating Questions</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Analyzing extracted document vectors for "{topic}" to formulate {numQuestions} calibrated {difficultyMode} questions...
              </p>
            </div>
          )}

          {/* Start Quiz Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleStartQuiz}
              disabled={loadingQuiz || !topic}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-slate-300" />
              <span>{loadingQuiz ? "Generating Grounded Quiz..." : "Start Adaptive Quiz"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz In-Progress
  const currentQ = activeQuiz.questions[currentIdx];
  const selectedAns = userAnswers[currentQ?.id];
  const isLastQuestion = currentIdx === activeQuiz.questions.length - 1;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-12">
      {/* Quiz Top Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {activeQuiz.topic}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {activeQuiz.difficulty}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Question {currentIdx + 1} of {activeQuiz.questions.length}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {Math.floor(timeSpentSeconds / 60)}:{(timeSpentSeconds % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Adaptive Reason Note */}
      {activeQuiz.adaptive_reason && (
        <div className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <BrainCircuit className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{activeQuiz.adaptive_reason}</span>
        </div>
      )}

      {/* Question Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
        <h3 className="text-base font-semibold text-slate-900 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Multiple Choice Options */}
        <div className="space-y-2.5">
          {currentQ.options?.map((opt, optIdx) => {
            const isSelected = selectedAns === opt;
            const letter = String.fromCharCode(65 + optIdx);
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, opt)}
                className={`w-full p-3.5 rounded-lg border text-left transition-colors flex items-start gap-3 ${
                  isSelected
                    ? "bg-slate-100 border-slate-900 text-slate-900 font-medium"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {letter}
                </div>
                <span className="text-xs leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Stepper Footer Controls */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-500 font-mono">
            Answered {answeredCount} / {activeQuiz.questions.length}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || answeredCount === 0}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium shadow-xs flex items-center gap-2 transition-colors"
            >
              <span>{submitting ? "Evaluating DKT..." : "Submit Quiz"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(activeQuiz.questions.length - 1, prev + 1))}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
