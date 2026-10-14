import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UploadedDocument } from "../types";
import { api } from "../services/api";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  ChevronDown,
  Info,
  Clock,
  Layers,
  Upload,
  User,
  ArrowRight
} from "lucide-react";

interface TutorPageProps {
  initialTopic?: string;
  onNavigateToUpload?: () => void;
}

export const TutorPage: React.FC<TutorPageProps> = ({ initialTopic, onNavigateToUpload }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [explanationMode, setExplanationMode] = useState<"standard" | "simple" | "example" | "exam">("standard");
  const [loading, setLoading] = useState(false);
  const [activeChunkModal, setActiveChunkModal] = useState<any[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);

      if (docs.length > 0) {
        const topicList = Array.from(new Set(docs.flatMap(d => d.detected_topics))).slice(0, 3);
        const welcomeText = `Hello! I am your Adaptive AI Personal Tutor. I have indexed your course material (${docs.map(d => d.name).join(", ")}). How can I assist you with ${topicList.join(", ") || "your concepts"} today?`;

        setMessages([
          {
            id: "m_init",
            sender: "tutor",
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: docs.map(d => d.name)
          }
        ]);
      } else {
        setMessages([
          {
            id: "m_empty",
            sender: "tutor",
            text: "Welcome to your AI Personal Tutor! I don't see any uploaded study materials in your space yet. Please upload your textbook notes, lecture PDFs, or syllabus to enable grounded Q&A with direct source citations.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Derive dynamic quick prompts based on user's actual uploaded topics
  const allTopics = Array.from(new Set(documents.flatMap(d => d.detected_topics)));
  const primaryTopic = initialTopic && initialTopic !== "All Topics" && allTopics.includes(initialTopic)
    ? initialTopic
    : allTopics[0] || "";

  const quickPrompts = primaryTopic
    ? [
        { text: `Explain ${primaryTopic} in simple terms.`, mode: "simple" as const },
        { text: `Give me a real-world example of ${primaryTopic}.`, mode: "example" as const },
        { text: `Format key exam points and formulas for ${primaryTopic}.`, mode: "exam" as const },
        { text: allTopics[1] ? `What is the relationship between ${primaryTopic} and ${allTopics[1]}?` : `What are the common pitfalls in ${primaryTopic}?`, mode: "standard" as const }
      ]
    : [];

  const handleSend = async (textToSend?: string, modeOverride?: "standard" | "simple" | "example" | "exam") => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const currentMode = modeOverride || explanationMode;
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "student",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await api.sendTutorMessage({
        message: text,
        explanation_mode: currentMode
      });

      const tutorMsg: ChatMessage = {
        id: `tutor_${Date.now()}`,
        sender: "tutor",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources,
        retrieved_chunks: res.retrieved_chunks
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `tutor_err_${Date.now()}`,
          sender: "tutor",
          text: "I encountered an issue retrieving the vector context. Please try again or check your server connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-slate-700" />
            <span>AI Personal Tutor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in your uploaded study materials. Answers cite your specific documents.
          </p>
        </div>

        {/* Explanation Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs">
          <span className="px-2 py-1 text-slate-500 text-[11px] font-medium">Mode:</span>
          {(["standard", "simple", "example", "exam"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setExplanationMode(mode)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors text-xs font-medium ${
                explanationMode === mode
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {mode === "simple" ? "Simple" : mode === "exam" ? "Exam Ready" : mode}
            </button>
          ))}
        </div>
      </div>

      {/* If 0 documents, show alert banner */}
      {documents.length === 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-600 shrink-0" />
            <p className="text-xs text-slate-600">
              No study materials uploaded yet. Upload a document to unlock grounded AI explanations with citations.
            </p>
          </div>
          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shrink-0 transition-colors"
            >
              Upload Material
            </button>
          )}
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 md:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-4 shadow-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "tutor" && (
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-xl p-4 text-xs leading-relaxed ${
                msg.sender === "student"
                  ? "bg-slate-900 text-white rounded-tr-none shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none space-y-2.5"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Citations & Source Pills for Tutor Replies */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    <span>Sources:</span>
                  </span>
                  {msg.sources.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]"
                    >
                      {s}
                    </span>
                  ))}

                  {msg.retrieved_chunks && msg.retrieved_chunks.length > 0 && (
                    <button
                      onClick={() => setActiveChunkModal(msg.retrieved_chunks || null)}
                      className="text-slate-700 hover:text-slate-900 underline font-medium ml-auto text-[11px]"
                    >
                      View vector excerpts ({msg.retrieved_chunks.length})
                    </button>
                  )}
                </div>
              )}

              <div className={`text-[10px] font-mono text-right ${msg.sender === "student" ? "text-slate-300" : "text-slate-400"}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === "student" && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-300 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
              <span className="animate-pulse">Retrieving vector chunks and formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Suggested Prompts (Grounded in User's Material) */}
      {quickPrompts.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>Suggested questions from your uploaded syllabus:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.text, q.mode)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-left shadow-2xs"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={
            documents.length > 0
              ? "Ask a question about your study material..."
              : "Upload study materials first to ask questions..."
          }
          disabled={documents.length === 0}
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 disabled:opacity-50 shadow-xs"
        />

        <button
          type="submit"
          disabled={loading || !inputText.trim() || documents.length === 0}
          className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Modal for viewing retrieved chunk snippets */}
      {activeChunkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <span>RAG Vector Excerpts</span>
              </h3>
              <button
                onClick={() => setActiveChunkModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2.5">
              {activeChunkModal.map((chunk, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-800 font-mono">
                    <span className="font-semibold">{chunk.doc_name}</span>
                    <span className="text-slate-500 font-sans">{chunk.topic}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{chunk.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
