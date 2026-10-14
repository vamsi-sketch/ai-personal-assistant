import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { UploadedDocument } from "../types";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ListOrdered,
  Bookmark,
  Zap,
  BookMarked,
  Upload,
  RefreshCw,
  HelpCircle,
  MessageSquare
} from "lucide-react";

interface SummaryPageProps {
  initialTopic?: string;
  onNavigateToUpload?: () => void;
  onNavigateToQuiz?: (topic: string) => void;
  onNavigateToTutor?: (topic: string) => void;
}

export const SummaryPage: React.FC<SummaryPageProps> = ({
  initialTopic,
  onNavigateToUpload,
  onNavigateToQuiz,
  onNavigateToTutor
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [topic, setTopic] = useState<string>(initialTopic || "");
  const [summaryType, setSummaryType] = useState("revision_notes");
  const [loading, setLoading] = useState(false);
  const [summaryContent, setSummaryContent] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const summaryTypes = [
    { id: "revision_notes", label: "Revision Notes", desc: "Bulleted formulas & key criteria", icon: Zap },
    { id: "chapter", label: "Chapter Breakdown", desc: "Structural theory & principles", icon: BookMarked },
    { id: "topic", label: "Concept Deep Dive", desc: "In-depth mechanism analysis", icon: FileText },
    { id: "important_points", label: "7 High-Yield Points", desc: "Must-memorize exam facts", icon: ListOrdered },
    { id: "short_explanation", label: "Executive Digest", desc: "Quick 3-paragraph summary", icon: Bookmark }
  ];

  useEffect(() => {
    loadDocs();
  }, [initialTopic]);

  const loadDocs = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
      const allTopics = Array.from(new Set(docs.flatMap(d => d.detected_topics)));
      
      let chosenTopic = topic;
      if (initialTopic && allTopics.includes(initialTopic)) {
        chosenTopic = initialTopic;
      } else if (!chosenTopic && allTopics.length > 0) {
        chosenTopic = allTopics[0];
      }

      if (chosenTopic) {
        setTopic(chosenTopic);
        triggerGenerate(chosenTopic, summaryType);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const allTopics = Array.from(new Set(documents.flatMap(d => d.detected_topics)));

  const triggerGenerate = async (targetTopic: string, targetType: string) => {
    if (!targetTopic) return;
    setLoading(true);
    setCopied(false);

    try {
      const res = await api.summarize({
        topic: targetTopic,
        summary_type: targetType
      });
      setSummaryContent(res.summary);
      setSources(res.sources || []);
    } catch (e) {
      console.error(e);
      setSummaryContent("Failed to generate summary from vector index.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (newTopic: string) => {
    setTopic(newTopic);
    triggerGenerate(newTopic, summaryType);
  };

  const handleSelectType = (newType: string) => {
    setSummaryType(newType);
    triggerGenerate(topic, newType);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (documents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mx-auto shadow-xs">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">No Study Materials Uploaded Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload your lecture notes, textbook chapters, or syllabus documents. The AI will analyze your materials and generate customized summaries, revision sheets, and exam key points.
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <span>AI Syllabus Summaries & Revision Notes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grounded strictly in your uploaded course materials using Gemini 3.8 Flash & Vector RAG.
          </p>
        </div>

        <button
          onClick={() => triggerGenerate(topic, summaryType)}
          disabled={loading || !topic}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-2xs self-start transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-slate-400" : "text-slate-500"}`} />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Selectors Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-xs">
        {/* 1. Select Topic */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              1. Select Topic From Your Documents ({allTopics.length}):
            </label>
            <span className="text-[11px] text-slate-400">Click any topic to summarize instantly</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTopics.map(t => (
              <button
                key={t}
                onClick={() => handleSelectTopic(t)}
                disabled={loading}
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

        {/* 2. Choose Format */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            2. Choose Summary Format:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {summaryTypes.map(st => {
              const IconComp = st.icon;
              const isSelected = summaryType === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectType(st.id)}
                  disabled={loading}
                  className={`p-3 rounded-lg border text-left transition-colors space-y-1 ${
                    isSelected
                      ? "bg-slate-100 border-slate-400 text-slate-900 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? "text-slate-900" : "text-slate-500"}`} />
                  <div className="text-xs font-semibold text-slate-900">{st.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{st.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading State Animation */}
      {loading && (
        <div className="rounded-xl bg-white border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-5 h-5 text-slate-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Generating Grounded Summary for "{topic}"
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Gemini 3.8 Flash is analyzing extracted document vectors to formulate structured revision notes...
            </p>
          </div>
        </div>
      )}

      {/* Generated Summary Output */}
      {summaryContent && !loading && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {summaryTypes.find(s => s.id === summaryType)?.label}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{topic}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Notes"}</span>
              </button>

              {onNavigateToQuiz && (
                <button
                  onClick={() => onNavigateToQuiz(topic)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Test with Quiz</span>
                </button>
              )}

              {onNavigateToTutor && (
                <button
                  onClick={() => onNavigateToTutor(topic)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ask Tutor</span>
                </button>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="prose max-w-none text-slate-800 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
            {summaryContent}
          </div>

          {/* Source Grounding Citation */}
          {sources.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Verified Grounding From Documents:</span>
              {sources.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
