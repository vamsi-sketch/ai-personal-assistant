import React, { useState } from "react";
import { StudentProfile } from "../types";
import { api } from "../services/api";
import { User, LogIn, UserPlus, GraduationCap, X, Sparkles, Lock, Mail, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (student: StudentProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (mode === "register" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const derivedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Student";
        const res = await api.register({
          email: cleanEmail,
          password: password,
          name: derivedName
        });
        if (res.student) {
          onAuthSuccess(res.student);
          onClose();
        } else {
          setError(res.error || "Could not create account.");
        }
      } else {
        const res = await api.login(cleanEmail, password);
        if (res.student) {
          onAuthSuccess(res.student);
          onClose();
        } else {
          setError(res.error || "Invalid credentials or account not found.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Authentication failed. Please check credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCreate = async (quickName: string, quickEmail: string) => {
    setEmail(quickEmail);
    setPassword("password123");
    setLoading(true);
    setError("");

    try {
      const res = await api.register({
        name: quickName,
        email: quickEmail,
        password: "password123"
      });
      if (res.student) {
        onAuthSuccess(res.student);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create demo evaluator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {mode === "register" ? "Create Student Account" : "Sign In to Learning Space"}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === "register"
              ? "Every new user gets a completely fresh, isolated learning environment."
              : "Access your saved documents, quiz history, and DKT mastery states."}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className={`py-1.5 rounded-md font-medium transition-colors ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); }}
            className={`py-1.5 rounded-md font-medium transition-colors ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. vamsi@university.edu"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {mode === "register" ? "Create Password" : "Password"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min 6 characters" : "Enter your password"}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {mode === "register" ? <UserPlus className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span>{loading ? "Processing..." : mode === "register" ? "Create Workspace" : "Sign In"}</span>
          </button>
        </form>

        {/* Quick One-Click New Student Shortcuts */}
        <div className="pt-3 border-t border-slate-200">
          <div className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">
            Or quick-test as fresh new student:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickCreate("Vamsi", "vamsi@assistant.edu")}
              className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span>Vamsi (New User)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickCreate("Alex Mercer", "alex@university.edu")}
              className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Alex (New User)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
