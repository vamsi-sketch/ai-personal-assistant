import React, { useState, useEffect } from "react";
import { Recommendation } from "../types";
import { api } from "../services/api";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  Bookmark,
  BookOpen,
  Upload
} from "lucide-react";

interface RecommendationsPageProps {
  onNavigate: (tabId: string) => void;
  onSelectTopicForQuiz: (topic: string) => void;
  onNavigateToUpload?: () => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  onNavigate,
  onSelectTopicForQuiz,
  onNavigateToUpload
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecs();
  }, []);

  const loadRecs = async () => {
    try {
      const data = await api.getRecommendations();
      setRecommendations(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-600 mx-auto mb-2" />
        Synthesizing personalized curriculum recommendations...
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mx-auto shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">No Recommendations Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload study materials and complete quizzes. The adaptive recommendation engine will dynamically suggest targeted revisions, diagnostic quizzes, and syllabus progression.
          </p>
        </div>
        {onNavigateToUpload && (
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs inline-flex items-center gap-2 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Study Material</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-slate-700" />
          <span>Personalized Adaptive Learning Recommendations</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Dynamic pedagogical suggestions synthesized from your DKT mastery states, error rates, and syllabus goals
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityStyle(
                    rec.priority
                  )}`}
                >
                  {rec.badge}
                </span>
                <span className="text-xs text-slate-500">
                  Difficulty: <strong className="text-slate-800">{rec.difficulty}</strong>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 tracking-tight">{rec.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{rec.topic}</span>
              <button
                onClick={() => {
                  if (rec.action_route === "quiz") {
                    onSelectTopicForQuiz(rec.topic);
                  } else {
                    onNavigate(rec.action_route);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>{rec.action_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
