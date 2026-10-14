import React, { useState, useEffect } from "react";
import { StudyPlan, UploadedDocument } from "../types";
import { api } from "../services/api";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Plus,
  Upload
} from "lucide-react";

interface StudyPlanPageProps {
  onNavigateToUpload?: () => void;
}

export const StudyPlanPage: React.FC<StudyPlanPageProps> = ({ onNavigateToUpload }) => {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Form fields
  const [examDate, setExamDate] = useState("2026-12-15");
  const [dailyHours, setDailyHours] = useState(2.5);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [planData, docsData] = await Promise.all([
        api.getStudyPlan(),
        api.getDocuments()
      ]);
      setPlan(planData);
      setDocuments(docsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (dayNumber: number) => {
    try {
      const updated = await api.toggleStudyPlanDay(dayNumber);
      setPlan(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const updated = await api.generateStudyPlan({
        exam_date: examDate,
        available_hours_per_day: dailyHours
      });
      setPlan(updated);
      setShowConfigModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-600 mx-auto mb-2" />
        Loading your personal study roadmap...
      </div>
    );
  }

  // 1. If user has no documents uploaded:
  if (documents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mx-auto shadow-xs">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">No Study Materials Uploaded Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload your course documents or textbook chapters first. The system will then generate a tailored day-by-day study roadmap based strictly on your syllabus.
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

  // 2. If user has documents but no study plan generated yet:
  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-700" />
            <span>Generate Adaptive Study Plan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build a personalized, day-by-day revision schedule based on your uploaded syllabus topics.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">
                Target Exam Date:
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">
                Daily Study Hours:
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={dailyHours}
                onChange={e => setDailyHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Subjects & Topics in Syllabus:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {documents.flatMap(d => d.detected_topics).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded text-xs font-normal bg-white text-slate-700 border border-slate-200 shadow-2xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-300" />
              <span>{generating ? "Calibrating Schedule..." : "Generate Personalized Study Plan"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Render active study plan
  const completedCount = plan.days.filter(d => d.completed).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-700" />
            <span>Personalized Study Plan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Day-by-day revision schedule dynamically arranged for your upcoming examination
          </p>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Regenerate Schedule</span>
        </button>
      </div>

      {/* Progress & Target Summary */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Longitudinal Schedule
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              Target Exam Date: <span className="text-slate-800 font-mono">{plan.exam_date}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Target Allocation: <strong className="text-slate-700">{plan.daily_hours} hours/day</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block font-mono">Completed Days</span>
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {completedCount} / {plan.days.length}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Roadmap Progress</span>
            <span className="font-semibold text-slate-700">{plan.overall_progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-900 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${plan.overall_progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Roadmap Schedule */}
      <div className="space-y-2.5">
        {plan.days.map(d => (
          <div
            key={d.day}
            onClick={() => handleToggle(d.day)}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
              d.completed
                ? "bg-slate-50/80 border-slate-200 opacity-75"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                  d.completed
                    ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                    : "border-slate-300 bg-white text-transparent"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    Day {d.day}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• {d.date}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {d.subject}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                    {d.difficulty}
                  </span>
                </div>

                <h3
                  className={`text-xs font-semibold ${
                    d.completed ? "line-through text-slate-400" : "text-slate-900"
                  }`}
                >
                  {d.topic}
                </h3>
                <p className="text-xs text-slate-500">{d.activity}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 self-end sm:self-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{d.estimated_minutes} mins</span>
            </div>
          </div>
        ))}
      </div>

      {/* Re-generate Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-slate-900">Regenerate Study Schedule</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Daily Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  value={dailyHours}
                  onChange={e => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePlan}
                disabled={generating}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors"
              >
                {generating ? "Generating..." : "Apply & Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
