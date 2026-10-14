import React from "react";
import { StudentProfile } from "../types";
import { Calendar, User, Zap, LogOut, ShieldCheck, UserCheck, Home } from "lucide-react";

interface NavbarProps {
  student: StudentProfile;
  currentTab: string;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onGoLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  currentTab,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  onGoLanding
}) => {
  const getTabTitle = (id: string) => {
    switch (id) {
      case "dashboard": return "Student Knowledge Dashboard";
      case "tutor": return "AI Personal Tutor (RAG Grounded)";
      case "upload": return "Document Upload & Processing";
      case "summary": return "AI Academic Summarizer";
      case "quiz": return "Adaptive Quiz Generation";
      case "quiz-result": return "Quiz Evaluation & AI Feedback";
      case "performance": return "Performance Analytics";
      case "weak-topics": return "Weak Topic Diagnostic";
      case "mastery": return "Deep Knowledge Tracing (DKT)";
      case "recommendations": return "Personalized Recommendations";
      case "study-plan": return "Adaptive Study Planner";
      case "profile": return "Student Profile";
      default: return "Adaptive Learning System";
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {getTabTitle(currentTab)}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DKT Online</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Landing Page Link */}
        <button
          onClick={onGoLanding}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors shadow-2xs"
          title="Return to Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Landing Page</span>
        </button>

        {/* Target Exam Badge */}
        {student.target_exam && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-800">{student.target_exam}</span>
          </div>
        )}

        {/* User Account Switch / Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-left transition-colors"
            title="View Student Profile"
          >
            <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {student.name ? student.name[0].toUpperCase() : "S"}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {student.name || "Student"}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {student.email || "Workspace"}
              </span>
            </div>
          </button>

          <button
            onClick={onOpenAuth}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
            title="Switch User / Create Account"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Switch</span>
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 text-xs transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
