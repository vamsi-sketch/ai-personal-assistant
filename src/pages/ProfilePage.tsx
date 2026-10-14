import React, { useState } from "react";
import { StudentProfile } from "../types";
import { api } from "../services/api";
import {
  User,
  Calendar,
  Save,
  CheckCircle,
  GraduationCap,
  RotateCcw,
  LogOut,
  AlertTriangle
} from "lucide-react";

interface ProfilePageProps {
  student: StudentProfile;
  onProfileUpdated: (student: StudentProfile) => void;
  onOpenAuth: () => void;
  onResetWorkspace: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  student,
  onProfileUpdated,
  onOpenAuth,
  onResetWorkspace
}) => {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [targetExam, setTargetExam] = useState(student.target_exam);
  const [targetDate, setTargetDate] = useState(student.target_date);
  const [dailyHours, setDailyHours] = useState(student.daily_study_hours);
  const [difficulty, setDifficulty] = useState(student.preferred_difficulty);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await api.updateProfile({
        name,
        email,
        target_exam: targetExam,
        target_date: targetDate,
        daily_study_hours: dailyHours,
        preferred_difficulty: difficulty
      });
      if (res.success) {
        onProfileUpdated(res.student);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await api.resetData();
      setShowResetConfirm(false);
      onResetWorkspace();
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-slate-700" />
          <span>Student Learning Profile & Academic Targets</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Calibrate your target examinations, daily learning allocation, and personalized assistant preferences
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              {student.name ? student.name[0].toUpperCase() : "S"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{student.name || "Student"}</h3>
              <p className="text-xs text-slate-500 font-mono">{student.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Switch Account</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Examination</label>
              <input
                type="text"
                value={targetExam}
                onChange={e => setTargetExam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Exam Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Daily Study Allocation (Hours)</label>
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

            <div>
              <label className="block font-medium text-slate-700 mb-1">Preferred Baseline Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              >
                <option value="Easy">Easy (Conceptual Fundamentals)</option>
                <option value="Medium">Medium (Algorithmic & Applied)</option>
                <option value="Hard">Hard (Competition / Rigorous)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">
              Workspace ID: {student.id}
            </span>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone / Reset Learning Workspace */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Reset Student Learning Space</span>
        </h3>
        <p className="text-xs text-slate-500">
          Wipe all uploaded documents, detected topics, DKT interaction histories, and quiz scores for this student account to start completely fresh.
        </p>

        {showResetConfirm ? (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 space-y-3">
            <div className="text-xs font-medium text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Are you sure you want to reset this user's workspace?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetData}
                disabled={resetting}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors"
              >
                {resetting ? "Resetting..." : "Yes, Reset Everything"}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-medium transition-colors shadow-2xs"
          >
            Clear All Data & Start Fresh
          </button>
        )}
      </div>
    </div>
  );
};
