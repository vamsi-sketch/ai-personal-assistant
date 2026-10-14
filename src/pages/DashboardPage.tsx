import React from "react";
import { StudentProfile, TopicMastery, Recommendation, StudyPlan, UploadedDocument } from "../types";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  BrainCircuit,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Bot,
  Upload,
  FileText,
  Clock,
  Trash2,
  CheckCircle2,
  Layers
} from "lucide-react";

interface DashboardPageProps {
  student: StudentProfile;
  documents: UploadedDocument[];
  masteries: TopicMastery[];
  recommendations: Recommendation[];
  studyPlan: StudyPlan | null;
  onNavigate: (tabId: string) => void;
  onSelectTopicForQuiz: (topic: string) => void;
  onDeleteDocument?: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  documents,
  masteries,
  recommendations,
  studyPlan,
  onNavigate,
  onSelectTopicForQuiz,
  onDeleteDocument
}) => {
  const hasDocuments = documents.length > 0;
  const testedTopics = masteries.filter(m => m.total_attempts > 0);
  const strongTopics = masteries.filter(m => m.total_attempts > 0 && m.dkt_mastery >= 0.70);
  const weakTopics = masteries.filter(m => m.total_attempts > 0 && m.dkt_mastery < 0.60);

  // Overall mastery: only calculate if there are topics; if none tested, 0%
  const avgMastery = testedTopics.length > 0
    ? Math.round((testedTopics.reduce((acc, m) => acc + m.dkt_mastery, 0) / testedTopics.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header / Welcome Banner */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <BrainCircuit className="w-3.5 h-3.5 text-slate-600" />
              <span>Adaptive AI Knowledge Tracing</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome, {student.name || "Student"} 👋
            </h1>

            {!hasDocuments ? (
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Your learning space is ready. Upload your study material to get started.
              </p>
            ) : (
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Your syllabus is active with <span className="font-semibold text-slate-900">{documents.length} study material{documents.length > 1 ? "s" : ""}</span> and <span className="font-semibold text-slate-900">{masteries.length} tracked topic{masteries.length > 1 ? "s" : ""}</span>. Current average mastery is <span className="font-semibold text-emerald-700">{avgMastery}%</span>.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("upload")}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-xs flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>+ Upload Study Material</span>
            </button>

            {hasDocuments && (
              <button
                onClick={() => onNavigate("tutor")}
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 flex items-center gap-2 transition-colors"
              >
                <Bot className="w-4 h-4 text-slate-500" />
                <span>Ask AI Tutor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Overview Stat Cards - STRICT REAL DATA (0/empty state for new users) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Mastery Card */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Current Mastery (DKT)</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {testedTopics.length > 0 ? `${avgMastery}%` : "—"}
            </span>
            <span className="text-xs text-slate-500">
              {testedTopics.length > 0 ? `${testedTopics.length} topics tested` : "No quizzes taken"}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-900 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${avgMastery}%` }}
            />
          </div>
        </div>

        {/* Recent Quiz Score */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Recent Quiz Score</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {testedTopics.length > 0 ? `${masteries.find(m => m.total_attempts > 0)?.mastery_percentage || 0}%` : "—"}
            </span>
            <span className="text-xs text-slate-500">
              {testedTopics.length > 0 ? "Latest attempt" : "Awaiting first quiz"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {hasDocuments ? "Take quizzes to measure mastery" : "Upload documents first"}
          </p>
        </div>

        {/* Weak Topics Identified */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Weak Topics Identified</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{weakTopics.length}</span>
            <span className="text-xs text-slate-500">Need attention</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {weakTopics.length > 0
              ? weakTopics[0].topic_name
              : testedTopics.length > 0
              ? "All tested topics are strong"
              : "Discovered via quizzes"}
          </p>
        </div>

        {/* Study Plan Progress */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Study Plan Progress</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {studyPlan ? `${studyPlan.overall_progress}%` : "—"}
            </span>
            <span className="text-xs text-slate-500">
              {studyPlan ? `${studyPlan.days.filter(d => d.completed).length} / ${studyPlan.days.length} completed` : "Not created"}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-900 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${studyPlan?.overall_progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. My Learning Materials Section */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-700" />
              <span>My Learning Materials</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Documents and textbooks uploaded to your personal knowledge base.
            </p>
          </div>

          <button
            onClick={() => onNavigate("upload")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Material</span>
          </button>
        </div>

        {!hasDocuments ? (
          /* Empty Learning State */
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mb-3 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No study materials uploaded yet.</h3>
            <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed">
              Upload your lecture notes, textbook PDFs, PPT slides, or course outlines. The assistant will parse your syllabus, extract topics, and generate custom quizzes and summaries.
            </p>
            <button
              onClick={() => onNavigate("upload")}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs flex items-center gap-2 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Study Material</span>
            </button>
          </div>
        ) : (
          /* Real Uploaded Documents List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-slate-300 transition-colors space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="uppercase font-medium text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                          {doc.file_type.replace(".", "")}
                        </span>
                        <span>•</span>
                        <span>{doc.chunk_count} chunks indexed</span>
                        <span>•</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {onDeleteDocument && (
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Detected Topics Tags */}
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-2 uppercase tracking-wider">
                    Topics Detected:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.detected_topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-xs font-normal bg-white text-slate-700 border border-slate-200 shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                  <button
                    onClick={() => onNavigate("tutor")}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ask Tutor</span>
                  </button>
                  <button
                    onClick={() => onNavigate("summary")}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Summary</span>
                  </button>
                  {doc.detected_topics.length > 0 && (
                    <button
                      onClick={() => onSelectTopicForQuiz(doc.detected_topics[0])}
                      className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                      <span>Take Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Active Syllabus Topics & Knowledge States */}
      {hasDocuments && masteries.length > 0 && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-slate-700" />
                <span>Tracked Topics & DKT State</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Extracted from your uploaded study materials. Deep Knowledge Tracing tracks your retention state.
              </p>
            </div>
            <button
              onClick={() => onNavigate("mastery")}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full DKT Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masteries.map(topic => (
              <div
                key={topic.topic_id}
                className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{topic.topic_name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      topic.status === "Strong"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : topic.status === "Moderate"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : topic.status === "Weak"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : topic.status === "Critical"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>DKT Probability</span>
                  <span className="font-semibold text-slate-800">
                    {topic.total_attempts > 0 ? `${topic.mastery_percentage}%` : "Untested"}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      topic.status === "Strong"
                        ? "bg-emerald-500"
                        : topic.status === "Moderate"
                        ? "bg-blue-500"
                        : topic.status === "Weak"
                        ? "bg-amber-500"
                        : topic.status === "Critical"
                        ? "bg-rose-500"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${topic.total_attempts > 0 ? topic.mastery_percentage : 0}%` }}
                  />
                </div>

                <button
                  onClick={() => onSelectTopicForQuiz(topic.topic_name)}
                  className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Practice Quiz</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recommendations Banner (If available) */}
      {recommendations.length > 0 && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Recommended Next Action</span>
            </h3>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{recommendations[0].badge}</span>
          </div>
          <p className="text-sm text-slate-600">{recommendations[0].reason}</p>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => {
                if (recommendations[0].action_route === "quiz") {
                  onSelectTopicForQuiz(recommendations[0].topic);
                } else {
                  onNavigate(recommendations[0].action_route);
                }
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs flex items-center gap-2 transition-colors"
            >
              <span>{recommendations[0].action_label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
