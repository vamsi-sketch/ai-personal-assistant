import React from "react";
import { QuizSubmissionResult } from "../types";
import {
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Bot,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen
} from "lucide-react";

interface QuizResultPageProps {
  result: QuizSubmissionResult;
  onRetakeQuiz: () => void;
  onOpenTutorWithQuestion: (question: string) => void;
  onViewMastery: () => void;
}

export const QuizResultPage: React.FC<QuizResultPageProps> = ({
  result,
  onRetakeQuiz,
  onOpenTutorWithQuestion,
  onViewMastery
}) => {
  const isHighScorer = result.percentage >= 75;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Score Header Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <BrainCircuit className="w-3.5 h-3.5 text-slate-600" />
              <span>Deep Knowledge Tracing State Updated</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quiz Evaluation Results
            </h2>
            <p className="text-xs text-slate-500">
              Your interaction sequence has been ingested by the LSTM model.
            </p>
          </div>

          {/* Big Score Badge */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl shrink-0">
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {result.score} / {result.total_questions}
              </div>
              <div className="text-xs font-medium text-slate-600">
                {result.percentage}% Accuracy
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base border ${
                isHighScorer
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {isHighScorer ? "A" : "B-"}
            </div>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Feedback Panel */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            AI Pedagogical Diagnostic Feedback
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* What went well */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What You Did Well
            </span>
            <p className="text-slate-600 leading-relaxed pt-1">
              {result.ai_feedback.what_went_well}
            </p>
          </div>

          {/* What was wrong */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-rose-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" /> What Was Wrong
            </span>
            <p className="text-slate-600 leading-relaxed pt-1">
              {result.ai_feedback.what_was_wrong}
            </p>
          </div>

          {/* Root Misconception */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-amber-800 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-amber-600" /> Root Misconception / Why Wrong
            </span>
            <p className="text-slate-600 leading-relaxed pt-1">
              {result.ai_feedback.why_wrong}
            </p>
          </div>

          {/* Recommended Revision & Next Action */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-600" /> Recommended Next Action
            </span>
            <p className="text-slate-600 leading-relaxed pt-1">
              <strong className="text-slate-900">Revision:</strong> {result.ai_feedback.recommended_revision}
              <br />
              <strong className="text-slate-900">Next Step:</strong> {result.ai_feedback.next_action}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Per-Question Breakdown */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Question-by-Question Breakdown ({result.answers.length})</span>
        </h3>

        <div className="space-y-3">
          {result.answers.map((ans, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border space-y-3 transition-colors ${
                ans.is_correct
                  ? "bg-slate-50/70 border-emerald-200"
                  : "bg-slate-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 p-0.5 rounded-full ${
                      ans.is_correct ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {ans.is_correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </span>
                  <div>
                    <span className="text-xs font-mono text-slate-400">Question {idx + 1}</span>
                    <h4 className="text-xs font-semibold text-slate-900 leading-relaxed mt-0.5">
                      {ans.question}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onOpenTutorWithQuestion(ans.question)}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ask Tutor</span>
                </button>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-md bg-white border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-[11px]">Your Selected Answer:</span>
                  <span
                    className={`font-medium ${
                      ans.is_correct ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {ans.selected_answer}
                  </span>
                </div>

                <div className="p-2.5 rounded-md bg-white border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-[11px]">Correct Answer:</span>
                  <span className="font-medium text-emerald-700">{ans.correct_answer}</span>
                </div>
              </div>

              {/* Explanation Note */}
              <div className="text-xs text-slate-600 bg-white p-3 rounded-md border border-slate-200 leading-relaxed">
                <strong className="text-slate-800">Explanation:</strong> {ans.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onRetakeQuiz}
          className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 border border-slate-200 transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Retake Quiz (Calibrated)</span>
        </button>

        <button
          onClick={onViewMastery}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>View Updated DKT Knowledge State</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
