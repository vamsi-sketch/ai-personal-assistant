import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  AlertTriangle,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface WeakTopicsPageProps {
  onPracticeTopic: (topic: string) => void;
  onOpenSummaryForTopic: (topic: string) => void;
}

export const WeakTopicsPage: React.FC<WeakTopicsPageProps> = ({
  onPracticeTopic,
  onOpenSummaryForTopic
}) => {
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeakTopics();
  }, []);

  const loadWeakTopics = async () => {
    try {
      const res = await api.getWeakTopics();
      setWeakTopics(res.weak_topics || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
        Analyzing DKT knowledge state matrices for student weaknesses...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Weak Topic Diagnostic & Automated Remediation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            DKT threshold &lt; 65% triggers targeted pedagogical intervention and root misconception identification
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800 self-start sm:self-auto flex items-center gap-1.5">
          <span>{weakTopics.length} Topics Need Intervention</span>
        </div>
      </div>

      {/* Weak Topics Diagnostic Cards */}
      {weakTopics.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-12 text-center space-y-2 shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
          <h3 className="text-base font-bold text-slate-900">No Critical Weaknesses Detected</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All curriculum topics currently exhibit DKT mastery above the 65% benchmark.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {weakTopics.map(item => (
            <div
              key={item.topic_id}
              className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.severity === "Critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.severity} Gap
                    </span>
                    <span className="text-xs text-slate-500">
                      Category: {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {item.topic_name}
                  </h3>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">DKT Mastery</span>
                    <span className="text-lg font-bold text-amber-700 font-mono">
                      {item.mastery_percentage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Error Rate</span>
                    <span className="text-lg font-bold text-rose-700 font-mono">
                      {item.error_rate || 75}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Root Misconception & Remedial Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-slate-600" />
                    Identified Root Misconception
                  </span>
                  <p className="text-slate-600 leading-relaxed pt-0.5">
                    {item.root_misconception}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-slate-600" />
                    Recommended Remedial Action
                  </span>
                  <p className="text-slate-600 leading-relaxed pt-0.5">
                    {item.recommended_action}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-500">
                  Target difficulty: <strong className="text-slate-900">{item.recommended_difficulty}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSummaryForTopic(item.topic_name)}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition-colors shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Read AI Summary</span>
                  </button>

                  <button
                    onClick={() => onPracticeTopic(item.topic_name)}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Practice Remedial Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
