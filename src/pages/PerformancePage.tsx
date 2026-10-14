import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Clock,
  Layers,
  Calendar,
  Sparkles,
  HelpCircle
} from "lucide-react";

interface PerformancePageProps {
  onNavigateToQuiz?: () => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({ onNavigateToQuiz }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      const res = await api.getPerformance();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <BarChart3 className="w-8 h-8 text-indigo-500 animate-pulse mx-auto mb-2" />
        Loading performance analytics...
      </div>
    );
  }

  // Pure Empty State if user has not completed any quizzes yet
  if (data.total_quizzes === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mx-auto shadow-xs">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">No Quiz Attempts Recorded Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Complete your first quiz to see your performance analytics, accuracy trends, difficulty breakdowns, and longitudinal Deep Knowledge Tracing graphs.
          </p>
        </div>
        {onNavigateToQuiz && (
          <button
            onClick={onNavigateToQuiz}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs inline-flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Take Your First Quiz</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-700" />
          <span>Student Performance & Evaluation Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Historical scores, accuracy metrics, and longitudinal DKT progress
        </p>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Average Quiz Score</span>
            <Award className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.overall_score}%</div>
          <div className="text-[11px] text-slate-400">Across {data.total_quizzes} completed quizzes</div>
        </div>

        {/* Overall Accuracy */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Overall Question Accuracy</span>
            <Target className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.overall_accuracy}%</div>
          <div className="text-[11px] text-slate-400">{data.total_interactions} total questions answered</div>
        </div>

        {/* Hard Difficulty Success */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Hard Difficulty Success</span>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {data.difficulty_breakdown?.find((d: any) => d.difficulty === "Hard")?.accuracy || 0}%
          </div>
          <div className="text-[11px] text-slate-400">Advanced mastery questions</div>
        </div>

        {/* Quizzes Completed */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Evaluated Sets</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.total_quizzes}</div>
          <div className="text-[11px] text-slate-400">All saved in student portfolio</div>
        </div>
      </div>

      {/* Progress Over Time Trajectory Graph (CSS Bar-Chart Visualization) */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <span>Learning Trajectory Over Time (Recent Quiz Scores)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Score vs Quiz Order</span>
        </div>

        {data.progress_over_time && data.progress_over_time.length > 0 ? (
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4">
            {data.progress_over_time.map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.score}%
                </span>
                <div
                  className="w-full max-w-[40px] rounded-t-md bg-slate-900 hover:bg-slate-800 transition-colors"
                  style={{ height: `${Math.max(15, item.score)}%` }}
                />
                <span className="text-[10px] text-slate-500 truncate max-w-[65px] text-center">
                  {item.topic.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No quiz history recorded yet. Complete an adaptive quiz to see trajectory.
          </div>
        )}
      </div>

      {/* Topic-Wise Breakdown & Difficulty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Topic Mastery Bars */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Curriculum Topic Mastery (DKT Output)</h3>
          <div className="space-y-4 pt-1">
            {data.topic_performance?.map((t: any) => (
              <div key={t.topic_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{t.topic_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {t.total_attempts} attempts
                    </span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        t.dkt_mastery >= 0.75
                          ? "text-emerald-700"
                          : t.dkt_mastery >= 0.55
                          ? "text-blue-700"
                          : "text-amber-700"
                      }`}
                    >
                      {t.total_attempts > 0 ? `${t.mastery_percentage}%` : "Untested"}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      t.dkt_mastery >= 0.75
                        ? "bg-emerald-600"
                        : t.dkt_mastery >= 0.55
                        ? "bg-blue-600"
                        : "bg-amber-600"
                    }`}
                    style={{ width: `${t.total_attempts > 0 ? t.mastery_percentage : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Difficulty Breakdown */}
        <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Performance by Difficulty</h3>
          <div className="space-y-3 pt-1">
            {data.difficulty_breakdown?.map((diff: any) => (
              <div key={diff.difficulty} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{diff.difficulty}</span>
                  <span className="font-mono text-slate-900 font-bold">{diff.accuracy}% Accuracy</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {diff.correct} correct out of {diff.total} attempted
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-900 h-1.5 rounded-full"
                    style={{ width: `${diff.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz History Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-700" />
            <span>Complete Quiz History ({data.quiz_history?.length || 0})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Topic</th>
                <th className="p-3.5">Difficulty</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.quiz_history?.map((attempt: any) => (
                <tr key={attempt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-medium text-slate-900">{attempt.topic}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                      {attempt.difficulty}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-slate-900">
                    {attempt.score} / {attempt.total_questions}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-mono font-semibold ${
                        attempt.percentage >= 70 ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {attempt.percentage}%
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {attempt.time_taken_seconds}s
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {new Date(attempt.attempted_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
