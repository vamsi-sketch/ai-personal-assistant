import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TutorPage } from "./pages/TutorPage";
import { UploadPage } from "./pages/UploadPage";
import { SummaryPage } from "./pages/SummaryPage";
import { QuizPage } from "./pages/QuizPage";
import { QuizResultPage } from "./pages/QuizResultPage";
import { PerformancePage } from "./pages/PerformancePage";
import { WeakTopicsPage } from "./pages/WeakTopicsPage";
import { MasteryPage } from "./pages/MasteryPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { StudyPlanPage } from "./pages/StudyPlanPage";
import { ProfilePage } from "./pages/ProfilePage";

import { StudentProfile, UploadedDocument, TopicMastery, Recommendation, StudyPlan, QuizSubmissionResult } from "./types";
import { api, clearCurrentUserId, getCurrentUserId } from "./services/api";

export function App() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const [student, setStudent] = useState<StudentProfile>({
    id: getCurrentUserId(),
    name: "Vamsi",
    email: "vamsi@assistant.edu",
    target_exam: "Final Semester Examination",
    target_date: "2026-12-15",
    daily_study_hours: 2.5,
    preferred_difficulty: "Medium",
    created_at: new Date().toISOString()
  });

  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [masteries, setMasteries] = useState<TopicMastery[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [lastQuizResult, setLastQuizResult] = useState<QuizSubmissionResult | null>(null);
  const [quizTopic, setQuizTopic] = useState<string>("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [profileRes, docsRes, masteryRes, recsRes, planRes] = await Promise.all([
        api.getProfile(),
        api.getDocuments(),
        api.getMastery(),
        api.getRecommendations(),
        api.getStudyPlan()
      ]);

      if (profileRes?.student) setStudent(profileRes.student);
      if (docsRes) setDocuments(docsRes);
      if (masteryRes?.mastery_topics) setMasteries(masteryRes.mastery_topics);
      if (recsRes) setRecommendations(recsRes);
      setStudyPlan(planRes || null);

      if (docsRes && docsRes.length > 0) {
        const allT = Array.from(new Set(docsRes.flatMap((d: UploadedDocument) => d.detected_topics)));
        if (allT.length > 0) setQuizTopic(allT[0]);
      } else {
        setQuizTopic("");
      }
    } catch (e) {
      console.error("User data load notice:", e);
    }
  };

  const handleStartQuizForTopic = (topic: string) => {
    setQuizTopic(topic);
    setCurrentTab("quiz");
  };

  const handleQuizCompleted = async (result: QuizSubmissionResult) => {
    setLastQuizResult(result);
    if (result.updated_topic_mastery) {
      setMasteries(result.updated_topic_mastery);
    }
    // Refresh recommendations
    try {
      const recs = await api.getRecommendations();
      setRecommendations(recs);
    } catch (e) {}

    setCurrentTab("quiz-result");
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await api.deleteDocument(id);
      await loadUserData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    clearCurrentUserId();
    setCurrentTab("landing");
  };

  const handleQuickDemoUser = async (quickName: string, quickEmail: string) => {
    try {
      const res = await api.register({
        name: quickName,
        email: quickEmail,
        target_exam: "Final Semester Examination",
        daily_study_hours: 2.5
      });
      if (res.student) {
        setStudent(res.student);
        setCurrentTab("dashboard");
        await loadUserData();
      }
    } catch (e) {
      console.error(e);
      setCurrentTab("dashboard");
    }
  };

  const handleAuthSuccess = (updatedStudent: StudentProfile) => {
    setStudent(updatedStudent);
    setCurrentTab("dashboard");
    loadUserData();
  };

  // 1. Full-screen Landing Page
  if (currentTab === "landing") {
    return (
      <LandingPage
        student={student}
        onEnterWorkspace={() => setCurrentTab("dashboard")}
        onSignIn={() => setCurrentTab("login")}
        onRegister={() => setCurrentTab("register")}
        onQuickDemoUser={handleQuickDemoUser}
      />
    );
  }

  // 2. Full-screen Login & Register Page
  if (currentTab === "login" || currentTab === "register") {
    return (
      <LoginPage
        initialMode={currentTab === "register" ? "register" : "login"}
        onAuthSuccess={handleAuthSuccess}
        onBackToHome={() => setCurrentTab("landing")}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tabId => setCurrentTab(tabId)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          student={student}
          currentTab={currentTab}
          onOpenProfile={() => setCurrentTab("profile")}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onGoLanding={() => setCurrentTab("landing")}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {currentTab === "dashboard" && (
            <DashboardPage
              student={student}
              documents={documents}
              masteries={masteries}
              recommendations={recommendations}
              studyPlan={studyPlan}
              onNavigate={tabId => setCurrentTab(tabId)}
              onSelectTopicForQuiz={handleStartQuizForTopic}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {currentTab === "tutor" && (
            <TutorPage
              initialTopic={quizTopic}
              onNavigateToUpload={() => setCurrentTab("upload")}
            />
          )}

          {currentTab === "upload" && (
            <UploadPage
              onDocumentUploaded={() => loadUserData()}
              onNavigateToSummary={(topic) => {
                if (topic) setQuizTopic(topic);
                setCurrentTab("summary");
              }}
              onNavigateToQuiz={(topic) => {
                if (topic) setQuizTopic(topic);
                setCurrentTab("quiz");
              }}
              onNavigateToTutor={(topic) => {
                if (topic) setQuizTopic(topic);
                setCurrentTab("tutor");
              }}
            />
          )}

          {currentTab === "summary" && (
            <SummaryPage
              initialTopic={quizTopic}
              onNavigateToUpload={() => setCurrentTab("upload")}
              onNavigateToQuiz={(topic) => {
                if (topic) setQuizTopic(topic);
                setCurrentTab("quiz");
              }}
              onNavigateToTutor={(topic) => {
                if (topic) setQuizTopic(topic);
                setCurrentTab("tutor");
              }}
            />
          )}

          {currentTab === "quiz" && (
            <QuizPage
              initialTopic={quizTopic}
              onQuizCompleted={handleQuizCompleted}
              onNavigateToUpload={() => setCurrentTab("upload")}
            />
          )}

          {currentTab === "quiz-result" && lastQuizResult && (
            <QuizResultPage
              result={lastQuizResult}
              onRetakeQuiz={() => setCurrentTab("quiz")}
              onOpenTutorWithQuestion={q => {
                setQuizTopic(q);
                setCurrentTab("tutor");
              }}
              onViewMastery={() => setCurrentTab("mastery")}
            />
          )}

          {currentTab === "performance" && (
            <PerformancePage
              onNavigateToQuiz={() => setCurrentTab("quiz")}
            />
          )}

          {currentTab === "weak-topics" && (
            <WeakTopicsPage
              onPracticeTopic={handleStartQuizForTopic}
              onOpenSummaryForTopic={t => {
                setQuizTopic(t);
                setCurrentTab("summary");
              }}
            />
          )}

          {currentTab === "mastery" && (
            <MasteryPage
              onSelectTopicForQuiz={handleStartQuizForTopic}
              onNavigateToUpload={() => setCurrentTab("upload")}
            />
          )}

          {currentTab === "recommendations" && (
            <RecommendationsPage
              onNavigate={tabId => setCurrentTab(tabId)}
              onSelectTopicForQuiz={handleStartQuizForTopic}
              onNavigateToUpload={() => setCurrentTab("upload")}
            />
          )}

          {currentTab === "study-plan" && (
            <StudyPlanPage
              onNavigateToUpload={() => setCurrentTab("upload")}
            />
          )}

          {currentTab === "profile" && (
            <ProfilePage
              student={student}
              onProfileUpdated={updated => setStudent(updated)}
              onOpenAuth={() => setAuthModalOpen(true)}
              onResetWorkspace={() => loadUserData()}
            />
          )}
        </main>
      </div>

      {/* Auth Modal for Switching Account or Registering New User */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
