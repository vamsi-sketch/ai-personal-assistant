import React, { useState, useEffect } from "react";
import { TopicMastery } from "../types";
import { api } from "../services/api";
import {
  BrainCircuit,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  Upload
} from "lucide-react";

interface MasteryPageProps {
  onSelectTopicForQuiz: (topic: string) => void;
  onNavigateToUpload?: () => void;
}

export const MasteryPage: React.FC<MasteryPageProps> = ({ onSelectTopicForQuiz, onNavigateToUpload }) => {
  const [masteries, setMasteries] = useState<TopicMastery[]>([]);
  const [averageMastery, setAverageMastery] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMastery();
  }, []);

  const loadMastery = async () => {
    try {
      const res = await api.getMastery();
      setMasteries(res.mastery_topics || []);
      setAverageMastery(res.average_mastery || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-slate-700" />
          <span>Deep Knowledge Tracing (DKT) Probabilistic State Model</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Real-time hidden state vector h(t) tracking student knowledge decay and acquisition dynamics
        </p>
      </div>

      {/* Model Architecture Explanatory Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Mathematical Framework: Piech et al. LSTM DKT Model
            </h3>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            PyTorch Ingestion Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900 font-mono">1. Input Encoding</div>
            <div className="text-slate-600 text-xs leading-relaxed">
              x(t) = q(t) + a(t) * Q encodes the question concept q(t) with student correctness a(t) in [0, 1].
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900 font-mono">2. Recurrent Cell</div>
            <div className="text-slate-600 text-xs leading-relaxed">
              h(t) = LSTM(x(t), h(t-1)) recurrently updates the student's latent knowledge state representation.
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900 font-mono">3. Output Probability</div>
            <div className="text-slate-600 text-xs leading-relaxed">
              y(t) = sigmoid(W * h(t) + b) yields mastery probability P(correct(t+1) | concept).
            </div>
          </div>
        </div>
      </div>

      {/* Topic Mastery Grid or Empty State */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Student Concept Masteries ({masteries.length} Syllabus Modules)
            </h3>
          </div>
          {masteries.length > 0 && (
            <div className="text-xs text-slate-500">
              Cohort Mean: <strong className="text-slate-900 font-mono">{averageMastery}%</strong>
            </div>
          )}
        </div>

        {masteries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No Topics Registered in Learning Space</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload study materials (PDF, DOCX, PPT, TXT) to extract your syllabus topics and initialize real-time Deep Knowledge Tracing state vectors.
            </p>
            {onNavigateToUpload && (
              <button
                onClick={onNavigateToUpload}
                className="mt-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Study Material</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {masteries.map(topic => (
              <div
                key={topic.topic_id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-2 flex-1 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
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
                    <h4 className="text-sm font-semibold text-slate-900">{topic.topic_name}</h4>
                    <span className="text-[10px] text-slate-400">({topic.category})</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    <span>
                      Probability: <strong className="text-slate-700 font-mono">{topic.total_attempts > 0 ? topic.dkt_mastery.toFixed(3) : "Untested"}</strong>
                    </span>
                    <span>•</span>
                    <span>Model Confidence: <strong className="text-slate-700 font-mono">{Math.round(topic.confidence * 100)}%</strong></span>
                    <span>•</span>
                    <span>Interactions: <strong className="text-slate-700 font-mono">{topic.total_attempts}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-900 font-mono">
                      {topic.total_attempts > 0 ? `${topic.mastery_percentage}%` : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Mastery State</span>
                  </div>

                  <button
                    onClick={() => onSelectTopicForQuiz(topic.topic_name)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors"
                  >
                    Test Mastery
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
