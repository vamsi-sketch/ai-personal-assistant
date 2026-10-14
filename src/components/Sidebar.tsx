import React from "react";
import {
  LayoutDashboard,
  Bot,
  UploadCloud,
  FileText,
  HelpCircle,
  BarChart3,
  AlertTriangle,
  BrainCircuit,
  Sparkles,
  CalendarCheck,
  User,
  GraduationCap,
  Home
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed?: boolean;
}

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload Material", icon: UploadCloud, highlight: true },
  { id: "tutor", label: "AI Personal Tutor", icon: Bot },
  { id: "summary", label: "AI Summary", icon: FileText },
  { id: "quiz", label: "Adaptive Quiz", icon: HelpCircle },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "weak-topics", label: "Weak Topics", icon: AlertTriangle },
  { id: "mastery", label: "Topic Mastery (DKT)", icon: BrainCircuit },
  { id: "recommendations", label: "Recommendations", icon: Sparkles },
  { id: "study-plan", label: "Study Plan", icon: CalendarCheck },
  { id: "profile", label: "Student Profile", icon: User }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
            Adaptive AI
          </span>
          <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
            Learning Assistant
          </span>
        </div>
      </div>

      {/* DKT Model State Indicator */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-[11px] font-medium text-slate-700">
            LSTM DKT Engine
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          Active
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : item.highlight
                  ? "text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : item.highlight ? "text-slate-800" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onSelectTab("landing")}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Landing Page</span>
          </div>
          <span className="text-[10px] text-slate-400">Home ↗</span>
        </button>

        <div className="px-1 text-[11px] text-slate-500 space-y-0.5">
          <div className="font-medium text-slate-700">College Project Edition</div>
          <div className="text-[10px] text-slate-400">FAISS RAG • LSTM DKT</div>
        </div>
      </div>
    </aside>
  );
};
