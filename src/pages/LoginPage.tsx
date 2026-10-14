import React, { useState } from "react";
import { StudentProfile } from "../types";
import { api } from "../services/api";
import {
  GraduationCap,
  ArrowLeft,
  LogIn,
  UserPlus,
  Sparkles,
  User,
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle2
} from "lucide-react";

interface LoginPageProps {
  initialMode?: "login" | "register";
  onAuthSuccess: (student: StudentProfile) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = "login",
  onAuthSuccess,
  onBackToHome
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "register" && password.length < 6) {
      setError("Password must be at least 6 characters long.");
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
        } else {
          setError(res.error || "Could not create workspace. Please try again.");
        }
      } else {
        const res = await api.login(cleanEmail, password);
        if (res.student) {
          onAuthSuccess(res.student);
        } else {
          setError(res.error || "Incorrect credentials or account not found.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Authentication error. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEvaluator = async (quickName: string, quickEmail: string) => {
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
      }
    } catch (err) {
      console.error(err);
      setError("Failed to initialize demo evaluator session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Back Nav */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {mode === "login" ? "Sign In to Your Learning Space" : "Create Empty Student Workspace"}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {mode === "login"
              ? "Access your uploaded study materials, quiz attempts, and Deep Knowledge Tracing mastery model."
              : "Starts 100% clean without predefined demo topics or fake statistics."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 md:p-8 space-y-6">
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

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Address */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. student@university.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password / Create Password */}
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
                  placeholder={mode === "register" ? "Create a secure password (min 6 characters)" : "Enter your password"}
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
              {mode === "register" && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Must be at least 6 characters long
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {mode === "register" ? (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{loading ? "Creating..." : "Create Pristine Workspace"}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Evaluator One-Click Logins */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick Evaluator Sign-In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickEvaluator("Vamsi", "vamsi@assistant.edu")}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Vamsi (Fresh)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickEvaluator("Alex Mercer", "alex@university.edu")}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Alex (Fresh)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Academic Note */}
        <div className="text-center mt-6 text-[11px] text-slate-400 space-y-1">
          <p>Adaptive AI Personal Learning Assistant</p>
          <p>Zero Pre-Seeded Clutter · Multi-User Data Isolation</p>
        </div>
      </div>
    </div>
  );
};
