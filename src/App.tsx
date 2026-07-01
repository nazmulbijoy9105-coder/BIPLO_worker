import React, { useState, useEffect } from "react";
import { 
  Globe, GraduationCap, Search, Award, MapPin, Briefcase, Clock, 
  ArrowRight, User, BookOpen, Sparkles, TrendingUp, Coins, 
  ShieldCheck, CheckCircle2, X, ChevronRight, FileText, Send, 
  Plus, Check, Loader2, Building, Users, QrCode, AlertTriangle,
  Download, Facebook, Linkedin
} from "lucide-react";

import Header from "./components/Header";
import FeedbackModal from "./components/FeedbackModal";
import FaqSection from "./components/FaqSection";
import { generatePdfFromMarkdown } from "./utils/pdfGenerator";
import { 
  TRADE_COURSES, LANGUAGE_COURSES, COUNTRIES, SUCCESS_STORIES, 
  JOBS, MOCK_LESSONS, MOCK_CERTIFICATES 
} from "./data";
import { UserRole, UserProfile, AssessmentProfile, AssessmentResult } from "./types";

export default function App() {
  // Navigation & Authentication
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("country-japan");
  const [selectedProfessionTrade, setSelectedProfessionTrade] = useState<string>("Caregiver");

  // Profile and Persistence
  const [profile, setProfile] = useState<UserProfile>({
    id: "STU-4921",
    fullName: "Muhammad Rafiq",
    email: "rafiq@example.com",
    role: "student",
    phone: "+880 1712-345678",
    passportStatus: "Valid Passport",
    preferredDestination: "Japan",
    budgetBDT: 150000,
    languages: { english: "Conversational", japanese: "NAT-TEST N5 Ongoing" },
    eligibilityScore: 78
  });

  // AI Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "model"; content: string }>>([
    { role: "model", content: "Assalamu Alaikum! I am the **BIPLOB AI Assistant**. How can I assist you with your skills training, language exam prep, or overseas career plans today?" }
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // AI Career Assessment State
  const [assessmentForm, setAssessmentForm] = useState<AssessmentProfile>({
    age: 24,
    gender: "Male",
    education: "HSC (Higher Secondary Certificate)",
    experience: "1 Year general service assistant",
    passportStatus: "Valid Passport",
    trade: "Caregiver",
    englishLevel: "Basic",
    japaneseLevel: "Basic (N5 Ongoing)",
    koreanLevel: "None",
    germanLevel: "None",
    preferredDestination: "Japan",
    budgetBDT: "200000"
  });
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // AI Resume Builder State
  const [resumeForm, setResumeForm] = useState({
    fullName: "Muhammad Rafiq",
    email: "rafiq@example.com",
    phone: "+880 1712-345678",
    education: "HSC / Equivalent - Dhaka Board",
    experience: "1 Year volunteer healthcare assistant in local community clinic",
    skills: "Elderly support, vital signs logging, safety compliance, basic first aid",
    languages: "Bengali (Native), English (Conversational), Japanese (N5 Prep)",
    targetTrade: "Certified Professional Caregiver",
    targetCountry: "Japan"
  });
  const [resumeResult, setResumeResult] = useState<{ resumeMarkdown: string; coverLetterMarkdown: string } | null>(null);
  const [resumeLoading, setResumeLoading] = useState<boolean>(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  // Online Learning System (LMS) State
  const [activeCourseId, setActiveCourseId] = useState<string>("course-1");
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [unlockedCert, setUnlockedCert] = useState<boolean>(false);

  // Feedback Submission Modal State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackCourseId, setFeedbackCourseId] = useState<string>("");
  const [feedbackCourseTitle, setFeedbackCourseTitle] = useState<string>("");
  const [feedbackLessonId, setFeedbackLessonId] = useState<string>("");
  const [feedbackLessonTitle, setFeedbackLessonTitle] = useState<string>("");

  // Certificate Verification State
  const [verificationInput, setVerificationInput] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [hasSearchedCert, setHasSearchedCert] = useState<boolean>(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Job Application List (Simulated)
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [jobFilterCountry, setJobFilterCountry] = useState<string>("All");
  const [jobFilterTrade, setJobFilterTrade] = useState<string>("All");

  // Portal lists
  const [dbJobs, setDbJobs] = useState<any[]>(JOBS);
  const [dbCourses, setDbCourses] = useState<any[]>(TRADE_COURSES);
  
  // Trainer state
  const [trainerLessonTitle, setTrainerLessonTitle] = useState<string>("");
  const [trainerLessonNotes, setTrainerLessonNotes] = useState<string>("");
  const [trainerSuccessMsg, setTrainerSuccessMsg] = useState<string>("");

  // Employer state
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    country: "Japan",
    trade: "Caregiver",
    salary: "",
    contractDuration: "3 Years",
    languageRequired: "Japanese N5",
    accommodation: true,
    food: true
  });
  const [employerSuccessMsg, setEmployerSuccessMsg] = useState<string>("");

  // Countdown batch timer
  const [daysRemaining, setDaysRemaining] = useState<number>(4);

  // Toggle Login/Logout
  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    if (!isLoggedIn) {
      // Re-initialize default profile
      setProfile({
        id: "STU-4921",
        fullName: "Muhammad Rafiq",
        email: "rafiq@example.com",
        role: "student",
        eligibilityScore: 78
      });
    }
  };

  // Change user role/portal
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  // -------------------------------------------------------------------------
  // 1. Submit AI Chat Message
  // -------------------------------------------------------------------------
  const submitChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatMessage("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: chatHistory })
      });
      if (!res.ok) {
        throw new Error(`Failed to contact BIPLOB AI Chat. Server returned status ${res.status}.`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setChatHistory(prev => [...prev, { role: "model", content: data.text || "I was unable to formulate a response. Please ask another question!" }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { 
        role: "model", 
        content: `⚠️ **AI Service Latency Notice**: ${err.message || "We are currently experiencing heavy traffic on our skills-coaching API. Please retry your question or consult our handbook sections below."}` 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 2. Submit AI Career Assessment
  // -------------------------------------------------------------------------
  const submitCareerAssessment = async () => {
    setAssessmentLoading(true);
    setAssessmentResult(null);
    setAssessmentError(null);

    try {
      const res = await fetch("/api/career-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentForm)
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status} during profile profiling.`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAssessmentResult(data);
      
      // Update profile score based on AI output
      setProfile(prev => ({
        ...prev,
        eligibilityScore: data.estimatedTimelineMonths ? Math.min(100, Math.max(50, 95 - data.estimatedTimelineMonths * 3)) : 80
      }));
    } catch (err: any) {
      console.error(err);
      setAssessmentError(err.message || "An unexpected error occurred while analyzing your training timeline. Please try again.");
    } finally {
      setAssessmentLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 3. Submit AI Resume Builder
  // -------------------------------------------------------------------------
  const submitResumeBuilder = async (e: React.FormEvent) => {
    e.preventDefault();
    setResumeLoading(true);
    setResumeResult(null);
    setResumeError(null);

    try {
      const res = await fetch("/api/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeForm)
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status} while compiling resume markdown files.`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResumeResult(data);
    } catch (err: any) {
      console.error(err);
      setResumeError(err.message || "Failed to formulate CV layout files. Please verify input characters and try again.");
    } finally {
      setResumeLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 4. Submit MCQ quiz
  // -------------------------------------------------------------------------
  const currentLessons = MOCK_LESSONS.filter(l => l.courseId === activeCourseId);
  const activeLesson = currentLessons[currentLessonIndex] || currentLessons[0];

  const handleAnswerSelect = (mcqIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [mcqIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    if (!activeLesson || !activeLesson.mcqs) return;
    let score = 0;
    activeLesson.mcqs.forEach((mcq, idx) => {
      if (selectedAnswers[idx] === mcq.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setIsQuizSubmitted(true);

    // Auto trigger feedback submission modal
    const activeCourse = dbCourses.find(c => c.id === activeCourseId) || TRADE_COURSES[0];
    setFeedbackCourseId(activeCourseId);
    setFeedbackCourseTitle(activeCourse ? activeCourse.title : "Trade Course");
    if (activeLesson) {
      setFeedbackLessonId(activeLesson.id);
      setFeedbackLessonTitle(activeLesson.title);
    } else {
      setFeedbackLessonId("");
      setFeedbackLessonTitle("");
    }

    setTimeout(() => {
      setIsFeedbackOpen(true);
    }, 1500);

    // Track completed lessons
    if (activeLesson) {
      if (!completedLessons.includes(activeLesson.id)) {
        const updated = [...completedLessons, activeLesson.id];
        setCompletedLessons(updated);
        // Unlock certificate if they finish all lessons for active course
        const courseLessons = MOCK_LESSONS.filter(l => l.courseId === activeCourseId);
        const finishedAll = courseLessons.every(cl => updated.includes(cl.id));
        if (finishedAll) {
          setUnlockedCert(true);
        }
      }
    }
  };

  const handleNextLesson = () => {
    setSelectedAnswers({});
    setQuizScore(null);
    setIsQuizSubmitted(false);
    if (currentLessonIndex < currentLessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  // -------------------------------------------------------------------------
  // 5. Verify Digital Certificate Unique ID
  // -------------------------------------------------------------------------
  const verifyCertificateHash = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearchedCert(true);
    const searchStr = verificationInput.trim();
    if (!searchStr) {
      setVerificationResult(null);
      return;
    }

    // Match either hash or Certificate ID
    const match = MOCK_CERTIFICATES.find(
      c => c.id.toLowerCase() === searchStr.toLowerCase() || 
           c.uniqueHash.toLowerCase().includes(searchStr.toLowerCase())
    );

    if (match) {
      setVerificationResult(match);
    } else {
      setVerificationResult(null);
    }
  };

  // Apply to Job helper
  const handleApplyJob = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs(prev => [...prev, jobId]);
    }
  };

  // Trainer adds lesson helper
  const handleTrainerAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerLessonTitle || !trainerLessonNotes) return;
    
    // Simulate adding lesson to database
    const newLesson = {
      id: `lesson-${Date.now()}`,
      courseId: "course-1",
      title: trainerLessonTitle,
      duration: "30 mins",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      notes: trainerLessonNotes,
      assignment: "Review the vocabulary and submit practice checklist.",
      mcqs: [
        {
          question: "Which of the following is correct regarding trade safety regulations?",
          options: ["Safety PPE is optional", "Proper gear must be worn at all times", "Only supervisors wear gear", "Safety is only for indoors"],
          correctIndex: 1
        }
      ]
    };

    MOCK_LESSONS.push(newLesson);
    setTrainerLessonTitle("");
    setTrainerLessonNotes("");
    setTrainerSuccessMsg("Lesson added successfully! Students can now access this lesson in the Caregiver trade course.");
    setTimeout(() => setTrainerSuccessMsg(""), 5000);
  };

  // Employer posts job helper
  const handleEmployerPostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.salary) return;

    const newJob = {
      id: `job-${Date.now()}`,
      title: newJobForm.title,
      employerName: "My Verified Company Ltd",
      country: newJobForm.country,
      trade: newJobForm.trade,
      salary: newJobForm.salary,
      experience: "No previous experience required",
      contractDuration: newJobForm.contractDuration,
      languageRequired: newJobForm.languageRequired,
      accommodation: newJobForm.accommodation,
      food: newJobForm.food,
      insurance: true,
      medical: true,
      overtime: true,
      status: "Open" as const,
      postedDate: new Date().toISOString().split('T')[0]
    };

    setDbJobs(prev => [newJob, ...prev]);
    setEmployerSuccessMsg("Job Posted Successfully! It has been instantly updated to the main BIPLOB Job Board.");
    setNewJobForm({
      title: "",
      country: "Japan",
      trade: "Caregiver",
      salary: "",
      contractDuration: "3 Years",
      languageRequired: "Japanese N5",
      accommodation: true,
      food: true
    });
    setTimeout(() => setEmployerSuccessMsg(""), 5000);
  };

  // Selected country details
  const activeCountry = COUNTRIES.find(c => c.id === selectedCountryId) || COUNTRIES[0];

  // Search filter
  const filteredCourses = dbCourses.filter(course => {
    const text = (course.title + " " + course.trade + " " + course.description).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredJobs = dbJobs.filter(job => {
    const matchCountry = jobFilterCountry === "All" || job.country === jobFilterCountry;
    const matchTrade = jobFilterTrade === "All" || job.trade === jobFilterTrade;
    return matchCountry && matchTrade;
  });

  // Share Individual Success Stories on Facebook or LinkedIn
  const handleShareStory = (story: any, platform: "facebook" | "linkedin") => {
    const text = `Inspiring success story from BIPLOB Skills Academy! 🌍\n\nMeet ${story.studentName} from ${story.homeDistrict}, who successfully transitioned to ${story.country} as a certified ${story.trade}, now earning a remittance salary of ${story.salary}.\n\nBIPLOB empowers Bangladesh's workforce with world-class certified trade training, intensive language academy coaching, and verified global employer pathways.\n\nLearn more and build your global career roadmap today: https://biplo-worker.vercel.app`;
    
    // Copy the pre-filled post text to clipboard for ultimate reliability across platforms
    navigator.clipboard.writeText(text).then(() => {
      let shareUrl = "";
      if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://biplo-worker.vercel.app")}&quote=${encodeURIComponent(text)}`;
      } else if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://biplo-worker.vercel.app")}`;
      }
      
      try {
        window.open(shareUrl, "_blank", "width=600,height=400");
      } catch (openErr) {
        console.warn("Popup blocked by browser sandbox");
      }
      
      setShareMessage(`Story details copied to clipboard! Paste (Ctrl+V) directly into your ${platform === "facebook" ? "Facebook" : "LinkedIn"} post.`);
      setTimeout(() => {
        setShareMessage(null);
      }, 5000);
    }).catch(err => {
      console.error("Could not copy share content: ", err);
      // Fallback behavior if clipboard write is blocked
      let shareUrl = "";
      if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://biplo-worker.vercel.app")}`;
      } else if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://biplo-worker.vercel.app")}`;
      }
      try {
        window.open(shareUrl, "_blank", "width=600,height=400");
      } catch (openErr) {
        console.warn("Popup blocked by browser sandbox");
      }
      setShareMessage(`Sharing on ${platform === "facebook" ? "Facebook" : "LinkedIn"}...`);
      setTimeout(() => {
        setShareMessage(null);
      }, 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased selection:bg-[#B8860B]/20 selection:text-[#1A1A1A]" id="biplob-app-root">
      
      {/* Dynamic Editorial Toast Notification */}
      {shareMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black text-[#FAF9F6] border-2 border-[#B8860B] px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase tracking-widest flex items-center space-x-3 rounded-none animate-bounce" id="biplob-toast-notification">
          <CheckCircle2 className="w-5 h-5 text-[#B8860B] shrink-0 animate-pulse" />
          <span>{shareMessage}</span>
        </div>
      )}

      {/* Editorial Header */}
      <Header 
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLoginToggle={handleLoginToggle}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Visa Disclaimer Bar */}
        <div className="bg-[#E4E3E0] border border-black/10 px-6 py-3 flex items-start space-x-3 mb-8" id="disclaimer-bar">
          <AlertTriangle className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
          <p className="text-xs text-black/75 leading-relaxed">
            <span className="font-bold uppercase tracking-wider text-black">Official Regulatory Notice:</span> BIPLOB is a skills training and preparation ecosystem. We do not guarantee overseas employment, visa approvals, or residency sponsorships. All migration and visa permissions are granted solely by respective sovereign government embassies, immigration authorities, and verified employers. Keep safe and consult verified licensed platforms.
          </p>
        </div>

        {/* TAB 1: HOME (Magazine Dashboard) */}
        {activeTab === "home" && (
          <div className="space-y-16" id="home-tab-view">
            
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-black/10 pb-12">
              <div className="lg:col-span-7 flex flex-col justify-between pr-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#B8860B] mb-4">
                    Version 1.0 • Global Skilled Workforce Platform
                  </p>
                  <h1 className="text-5xl sm:text-6xl lg:text-[76px] leading-[0.9] font-black uppercase tracking-tighter mb-6">
                    Build Your Skills.<br/>
                    <span className="text-transparent" style={{ WebkitTextStroke: "1px #1A1A1A" }}>Build Your</span><br/>
                    Global Career.
                  </h1>
                  <p className="text-lg text-black/60 max-w-xl font-serif italic mb-8 leading-relaxed">
                    Empowering the next generation of Bangladesh's workforce with world-class certified trade training, intensive language academy coaching, and verified employer pathways.
                  </p>
                  
                  {/* Search Bar Widget */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md">
                    <div className="relative flex-grow">
                      <Search className="w-4 h-4 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search trades, countries or courses..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-black/10 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => { setActiveTab("courses"); }}
                      className="bg-black hover:bg-black/90 text-white px-6 py-3 font-bold uppercase text-xs tracking-wider transition-all"
                    >
                      Find Path
                    </button>
                  </div>
                </div>

                {/* Counter & Upcoming Batch Notification */}
                <div className="mt-8 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#E4E3E0]/30 p-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B] block">Upcoming Live Trade Class</span>
                    <span className="text-sm font-semibold text-black/90 block">Caregiver & Japanese N5 (Batch 42)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-black text-[#FAF9F6] px-3 py-1.5 font-mono text-xs font-bold tracking-tight">
                      {daysRemaining} DAYS REMAINING
                    </div>
                    <button 
                      onClick={() => {
                        setActiveCourseId("course-1");
                        setActiveTab("courses");
                      }}
                      className="text-xs font-bold uppercase tracking-wider border-b border-black hover:text-[#B8860B] pb-0.5 transition-all"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Hero Frame: Interactive Mini Modules */}
              <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black/10 pt-8 lg:pt-0 lg:pl-8">
                
                {/* AI Portal Prompt Box */}
                <div className="p-8 bg-black text-white flex flex-col justify-between h-72 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 border border-white/5 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 border border-white/10 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#B8860B] block mb-2">AI Career Agent</span>
                    <h2 className="text-3xl font-black uppercase leading-none mb-3 tracking-tighter">
                      Discover Your<br/>Global Potential
                    </h2>
                    <p className="text-xs text-white/60 max-w-xs leading-relaxed mb-4">
                      Let BIPLOB AI scan your background, age, language levels, and budget to compute your target destinations, recommended trade programs, and complete preparation cost.
                    </p>
                  </div>

                  <button 
                    onClick={() => setActiveTab("assessment")}
                    className="text-xs font-bold uppercase tracking-widest text-[#B8860B] hover:text-white border-b border-[#B8860B] hover:border-white pb-1 w-max transition-all"
                  >
                    Start AI Assessment →
                  </button>
                </div>

                {/* Statistics Bar */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 border border-black/5 bg-white">
                    <span className="text-3xl font-black tracking-tight block">14,200+</span>
                    <span className="text-[10px] uppercase tracking-widest text-black/50 font-bold block">Trained Students</span>
                  </div>
                  <div className="p-4 border border-black/5 bg-white">
                    <span className="text-3xl font-black tracking-tight block">240+</span>
                    <span className="text-[10px] uppercase tracking-widest text-black/50 font-bold block">Verified Employers</span>
                  </div>
                </div>

                {/* Verified Trust Seals */}
                <div className="mt-6 border border-black/10 bg-[#FAF9F6] p-4" id="verified-trust-seals">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 block mb-3 text-center sm:text-left">
                    Verified Trust & Compliance Seals
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center sm:items-start p-2.5 bg-white border border-black/5 hover:border-black/20 transition-all text-center sm:text-left">
                      <div className="flex items-center space-x-1.5 text-[#B8860B] mb-1">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-black">ISO Certified</span>
                      </div>
                      <p className="text-[9px] text-black/50 font-mono">ISO 9001:2015 Quality Standards</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-start p-2.5 bg-white border border-black/5 hover:border-black/20 transition-all text-center sm:text-left">
                      <div className="flex items-center space-x-1.5 text-[#B8860B] mb-1">
                        <Building className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-black">Govt Partner</span>
                      </div>
                      <p className="text-[9px] text-black/50 font-mono">Registered Skills Provider</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-start p-2.5 bg-white border border-black/5 hover:border-black/20 transition-all text-center sm:text-left">
                      <div className="flex items-center space-x-1.5 text-[#B8860B] mb-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-black">Secure Payments</span>
                      </div>
                      <p className="text-[9px] text-black/50 font-mono">100% Secure Fee Shield</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Skilled Trades Grid */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-black/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Global Opportunities</span>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">High-Demand Skilled Trades</h2>
                </div>
                <button 
                  onClick={() => setActiveTab("courses")}
                  className="text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black mt-2 sm:mt-0 flex items-center space-x-1"
                >
                  <span>Explore Course Catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Industrial Electrician", code: "Japan, Saudi Arabia, Germany", icon: <TrendingUp className="w-5 h-5 text-[#B8860B]" /> },
                  { name: "Certified Caregiver", code: "Japan, Germany, UK, Australia", icon: <Award className="w-5 h-5 text-[#B8860B]" /> },
                  { name: "AWS Certified Welder", code: "South Korea, Singapore, Saudi Arabia", icon: <Briefcase className="w-5 h-5 text-[#B8860B]" /> },
                  { name: "Commercial Culinary Cook", code: "UAE, Saudi Arabia, Germany", icon: <BookOpen className="w-5 h-5 text-[#B8860B]" /> }
                ].map((trade, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedProfessionTrade(trade.name.includes("Caregiver") ? "Caregiver" : trade.name.includes("Welder") ? "Welder" : "Industrial Electrician");
                      setActiveTab("courses");
                    }}
                    className="p-6 border border-black/5 bg-white hover:border-black group cursor-pointer transition-all flex flex-col justify-between h-40"
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-[#FAF9F6] border border-black/5">
                        {trade.icon}
                      </div>
                      <span className="text-xs font-mono text-black/30 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-tight group-hover:text-[#B8860B] transition-colors">{trade.name}</h3>
                      <p className="text-[10px] text-black/40 uppercase tracking-wider mt-1">{trade.code}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive World Country Section */}
            <div className="bg-[#FAF9F6] border border-black/10 p-8 lg:p-12">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block mb-2">Interactive Migration Atlas</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Compare Target Destinations</h2>
                <p className="text-sm text-black/60 font-serif italic mt-2">
                  Select a country tab below to instantly view current demand level, average salary conversion in Bangladeshi Taka, standard weekly working hours, visa pathways, and official portal references.
                </p>
              </div>

              {/* Country Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-black/10 pb-4 mb-8">
                {COUNTRIES.map(country => (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountryId(country.id)}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                      selectedCountryId === country.id 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-black/60 border-black/5 hover:border-black/20"
                    }`}
                  >
                    {country.name}
                  </button>
                ))}
              </div>

              {/* Selected Country Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                  <div className="flex items-center space-x-4 bg-white p-4 border border-black/5">
                    <img src={activeCountry.flagUrl} alt={activeCountry.name} className="w-12 h-8 object-cover border border-black/5" />
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">{activeCountry.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-800 uppercase tracking-widest rounded-sm">
                        Demand: {activeCountry.demandLevel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-4 border border-black/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Average Monthly Salary</span>
                      <span className="text-sm font-bold text-[#B8860B]">{activeCountry.avgSalary}</span>
                    </div>
                    <div className="bg-white p-4 border border-black/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Weekly Working Hours</span>
                      <span className="text-sm font-semibold">{activeCountry.workingHours}</span>
                    </div>
                    <div className="bg-white p-4 border border-black/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Living Cost Estimate</span>
                      <span className="text-sm text-black/70 leading-relaxed block">{activeCountry.livingCost}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 border border-black/10">
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-3 border-b border-black/5 pb-2">Visa Pathways & Eligibility Requirements</h4>
                    <ul className="space-y-3">
                      {activeCountry.visaPathways.map((path, i) => (
                        <li key={i} className="text-sm leading-relaxed text-black/80 flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/5">
                    <div>
                      <span className="text-xs font-bold uppercase text-[#B8860B] block">Language Requirement</span>
                      <p className="text-xs text-black/70 mt-1">{activeCountry.languageRequirement}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-[#B8860B] block">Accommodation</span>
                      <p className="text-xs text-black/70 mt-1">{activeCountry.accommodation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-black/60 block">Worker Rights & Safety</span>
                      <p className="text-xs text-black/70 mt-1">{activeCountry.workerRights}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-black/60 block">Taxation & Pension</span>
                      <p className="text-xs text-black/70 mt-1">{activeCountry.taxes}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/40 block">Verified Government Information Links</span>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {activeCountry.officialLinks.map((link, i) => (
                        <a 
                          key={i} 
                          href={`https://${link}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline font-mono"
                        >
                          {link} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stories Section */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">From Bangladesh to the World</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">BIPLOB Alumni Success Stories</h2>
                <p className="text-sm text-black/60 font-serif italic mt-2">
                  Real stories from determined workers who transformed their lives through professional training, native languages acquisition, and certified careers abroad.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SUCCESS_STORIES.map(story => (
                  <div key={story.id} className="bg-white border border-black/10 flex flex-col justify-between">
                    <div className="p-6 border-b border-black/5 bg-[#E4E3E0]/10">
                      <div className="flex items-center space-x-4 mb-4">
                        <img 
                          src={story.photoUrl} 
                          alt={story.studentName} 
                          className="w-14 h-14 rounded-full object-cover border border-[#B8860B]/30"
                        />
                        <div>
                          <h4 className="text-sm font-bold uppercase">{story.studentName}</h4>
                          <span className="text-[10px] text-black/40 uppercase font-mono">From: {story.homeDistrict}</span>
                        </div>
                      </div>
                      <p className="text-sm italic font-serif text-black/80 leading-relaxed">
                        "{story.quote}"
                      </p>
                    </div>

                    <div className="p-6 bg-white space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold uppercase text-black/50">Trade:</span>
                        <span className="font-semibold">{story.trade}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold uppercase text-black/50">Country:</span>
                        <span className="font-semibold">{story.country}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold uppercase text-[#B8860B]">Remittance Salary:</span>
                        <span className="font-mono font-bold text-[#B8860B]">{story.salary}</span>
                      </div>
                      <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                        <div className="text-green-700 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>{story.achievement}</span>
                        </div>
                        <div className="flex items-center space-x-1.5" id={`share-story-${story.id}`}>
                          <span className="text-[9px] font-mono text-black/40 normal-case font-normal">Share:</span>
                          <button
                            onClick={() => handleShareStory(story, "linkedin")}
                            className="p-1 hover:bg-black/5 border border-black/10 hover:border-black/30 transition-all flex items-center justify-center"
                            title="Share on LinkedIn"
                          >
                            <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                          </button>
                          <button
                            onClick={() => handleShareStory(story, "facebook")}
                            className="p-1 hover:bg-black/5 border border-black/10 hover:border-black/30 transition-all flex items-center justify-center"
                            title="Share on Facebook"
                          >
                            <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action Bar */}
            <div className="bg-black text-white p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#B8860B] block mb-2">Ready to Start Your Journey?</span>
                <h3 className="text-3xl font-black uppercase tracking-tight">Generate Your Complete International Career Roadmap Now</h3>
                <p className="text-sm text-white/60 max-w-xl mt-2 leading-relaxed">
                  Provide your age, background, budget, and language levels to get a fully calculated pathway recommending ideal trades, language training, and visa steps.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <button 
                  onClick={() => setActiveTab("assessment")}
                  className="bg-[#B8860B] hover:bg-[#a07409] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-amber-900/10"
                >
                  Start Assessment Free
                </button>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <FaqSection />

          </div>
        )}

        {/* TAB 2: AI CAREER ASSESSMENT */}
        {activeTab === "assessment" && (
          <div className="bg-white border border-black/10 p-6 sm:p-10 max-w-4xl mx-auto" id="assessment-tab-view">
            <div className="border-b border-black/10 pb-6 mb-8">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Intelligent Career Matcher</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">AI Career Assessment</h1>
              <p className="text-sm text-black/60 font-serif italic mt-2">
                Scan public requirements instantly to compute your target destinations, recommended trade programs, and complete preparation budget.
              </p>
            </div>

            {/* Assessment Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Your Age</label>
                <input 
                  type="number" 
                  value={assessmentForm.age}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, age: parseInt(e.target.value) || 20 }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Gender (eligibility parameter for specific countries)</label>
                <select 
                  value={assessmentForm.gender}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Highest Education Level</label>
                <select 
                  value={assessmentForm.education}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="SSC (Secondary School Certificate)">SSC (Secondary School Certificate)</option>
                  <option value="HSC (Higher Secondary Certificate)">HSC (Higher Secondary Certificate)</option>
                  <option value="Diploma Graduate">Diploma Graduate</option>
                  <option value="Bachelor Degree">Bachelor Degree</option>
                  <option value="Below SSC / Literal Trades">Below SSC / Vocational Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Previous Work Experience</label>
                <input 
                  type="text" 
                  value={assessmentForm.experience}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g. 1 Year in electronics shop or None"
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Passport Status</label>
                <select 
                  value={assessmentForm.passportStatus}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, passportStatus: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="Valid Passport">Valid Passport (Ready for immediate match)</option>
                  <option value="Applied">Applied & Waiting</option>
                  <option value="Not Applied">Not Applied yet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Preferred Trade / Skill</label>
                <select 
                  value={assessmentForm.trade}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, trade: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="Caregiver">Certified Professional Caregiver</option>
                  <option value="Welder">AWS Shielded Metal Arc Welder</option>
                  <option value="Industrial Electrician">Industrial Electrical Maintenance</option>
                  <option value="Commercial Cook">Commercial Cook / Hospitality</option>
                  <option value="HVAC">HVAC Maintenance Technician</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Preparation Budget in BDT</label>
                <select 
                  value={assessmentForm.budgetBDT}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, budgetBDT: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="50000">Below BDT 50,000</option>
                  <option value="150000">BDT 50,000 - BDT 150,000</option>
                  <option value="300000">BDT 150,000 - BDT 300,000</option>
                  <option value="500000">Above BDT 300,000 (Self-funded / Premium path)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2">Preferred Destination</label>
                <select 
                  value={assessmentForm.preferredDestination}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, preferredDestination: e.target.value }))}
                  className="w-full bg-[#FAF9F6] border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="Japan">Japan (Highly Recommended for Caregiving/Trades)</option>
                  <option value="Germany">Germany (Ausbildung / Vocational Train & Earn)</option>
                  <option value="South Korea">South Korea (EPS Skilled Manufactures)</option>
                  <option value="Saudi Arabia">Saudi Arabia (Middle-East Fast Track)</option>
                </select>
              </div>
            </div>

            {/* Language competency grids */}
            <div className="mb-8 bg-[#FAF9F6] p-4 border border-black/5">
              <span className="text-xs font-bold uppercase text-black/50 block mb-3">Language Training Status</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">English Level</label>
                  <select 
                    value={assessmentForm.englishLevel}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, englishLevel: e.target.value }))}
                    className="w-full bg-white border border-black/10 px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="IELTS 5.0+">IELTS 5.0+</option>
                    <option value="IELTS 6.0+">IELTS 6.0+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Japanese Level</label>
                  <select 
                    value={assessmentForm.japaneseLevel}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, japaneseLevel: e.target.value }))}
                    className="w-full bg-white border border-black/10 px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="None">None</option>
                    <option value="Basic (N5 Ongoing)">N5 Ongoing</option>
                    <option value="N5 Passed">JLPT N5 Passed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Korean Level</label>
                  <select 
                    value={assessmentForm.koreanLevel}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, koreanLevel: e.target.value }))}
                    className="w-full bg-white border border-black/10 px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="None">None</option>
                    <option value="TOPIK Ongoing">TOPIK Ongoing</option>
                    <option value="TOPIK Passed">TOPIK Passed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">German Level</label>
                  <select 
                    value={assessmentForm.germanLevel}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, germanLevel: e.target.value }))}
                    className="w-full bg-[#FAF9F6] border border-black/10 px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="None">None</option>
                    <option value="A1 Passed">A1 Passed</option>
                    <option value="A2/B1 Ongoing">A2/B1 Ongoing</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={submitCareerAssessment}
              disabled={assessmentLoading}
              className="w-full bg-black hover:bg-black/95 text-white font-bold py-4 uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {assessmentLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B8860B]" />
                  <span>AI Agent Scanning Databases & Formulating Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#B8860B]" />
                  <span>Execute AI Career Assessment</span>
                </>
              )}
            </button>

            {assessmentError && (
              <div className="mt-6 border-2 border-red-500 bg-red-50/10 p-5 space-y-3" id="assessment-error-banner">
                <div className="flex items-start space-x-2.5 text-red-700">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-black">AI Calculation Interrupted</h4>
                    <p className="text-[9px] text-red-600 uppercase font-mono mt-0.5">Latency or Connection Threshold Breached</p>
                  </div>
                </div>
                <p className="text-xs text-black/75 font-serif leading-relaxed italic">
                  "{assessmentError}"
                </p>
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={submitCareerAssessment}
                    className="bg-black hover:bg-black/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all"
                  >
                    Retry Calculation Now
                  </button>
                  <button
                    onClick={() => setAssessmentError(null)}
                    className="border border-black/20 hover:bg-black/5 text-black font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* ASSESSMENT RESULTS RENDER */}
            {assessmentResult && (
              <div className="mt-12 pt-8 border-t-2 border-black space-y-8" id="assessment-result-card">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#E4E3E0]/30 p-6 border border-black/5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">AI Calculated Roadmap</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight mt-1">Recommended Occupations</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {assessmentResult.suitableOccupations.map((occ, i) => (
                        <span key={i} className="bg-white border border-black/10 px-3 py-1 text-xs font-semibold rounded-none">
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black text-white px-5 py-4 text-center shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 block">Preparation Path</span>
                    <span className="text-3xl font-black text-[#B8860B]">{assessmentResult.estimatedTimelineMonths}</span>
                    <span className="text-xs font-bold block">MONTHS</span>
                  </div>
                </div>

                {/* Country & Salary Forecast */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-black/10 p-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Target Demands & Salary Forecast</h4>
                    <div className="space-y-3">
                      {assessmentResult.recommendedCountries.map((c, i) => (
                        <div key={i} className="flex justify-between items-center bg-[#FAF9F6] p-3 border border-black/5">
                          <div>
                            <span className="text-sm font-bold block">{c.name}</span>
                            <span className="text-[10px] uppercase text-black/40">Demand: {c.demandLevel}</span>
                          </div>
                          <span className="text-xs font-bold font-mono text-[#B8860B]">{c.averageSalary}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-black/10 p-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Budget Analysis Breakdown</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-black/50 uppercase">Trade Training Fees:</span>
                        <span className="font-semibold">{assessmentResult.budgetAnalysis.trainingFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/50 uppercase">Language Courses:</span>
                        <span className="font-semibold">{assessmentResult.budgetAnalysis.languageCourseFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/50 uppercase">Exams & Certifications:</span>
                        <span className="font-semibold">{assessmentResult.budgetAnalysis.examAndCertification}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/50 uppercase">Visa & Airfare:</span>
                        <span className="font-semibold">{assessmentResult.budgetAnalysis.estimatedVisaAirfare}</span>
                      </div>
                      <div className="flex justify-between border-t border-black/10 pt-2 font-bold text-sm">
                        <span className="uppercase text-[#B8860B]">Total Estimate:</span>
                        <span className="font-mono text-[#B8860B]">{assessmentResult.budgetAnalysis.totalEstimatedBudget}</span>
                      </div>
                      <p className="text-[10px] text-black/60 italic leading-relaxed pt-2 border-t border-black/5">
                        <span className="font-bold">Pro-Tip:</span> {assessmentResult.budgetAnalysis.tips}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Training and Language roadmap */}
                <div className="bg-[#FAF9F6] p-6 border border-black/10">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Course & Language Roadmap</h4>
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase text-[#B8860B]">Recommended Skill Course:</span>
                    <p className="text-sm text-black/80 mt-1 leading-relaxed">{assessmentResult.trainingRecommendation}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {assessmentResult.languageRoadmap.map((l, i) => (
                      <div key={i} className="bg-white p-4 border border-black/5">
                        <span className="text-xs font-bold uppercase block">{l.language} Track</span>
                        <p className="text-xs text-black/70 mt-1 leading-relaxed">
                          Target level: <span className="font-semibold">{l.levelRequired}</span> in {l.timeline}.<br/>
                          Focus: {l.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparation step by step checklist */}
                <div className="border border-black/10 p-6 bg-white">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Preparation Checklist Timeline</h4>
                  <div className="space-y-3">
                    {assessmentResult.preparationChecklist.map((ch, i) => (
                      <div key={i} className="flex items-center space-x-3 text-xs">
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          {i+1}
                        </div>
                        <div className="flex-grow flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-medium text-black/80">{ch.step}</span>
                          <span className="text-[10px] font-mono text-black/40 uppercase mt-0.5 sm:mt-0">Duration: {ch.duration} ({ch.status})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important legal check */}
                <p className="text-[10px] italic text-black/40 leading-relaxed text-center">
                  Disclaimer: {assessmentResult.disclaimer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI RESUME BUILDER */}
        {activeTab === "resume" && (
          <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-10 max-w-5xl mx-auto" id="resume-tab-view">
            <div className="border-b border-black/10 pb-6 mb-8">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Standardized CV Generator</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">AI Resume Builder</h1>
              <p className="text-sm text-black/60 font-serif italic mt-2">
                Generate a professional, structured CV and cover letter specifically tailored to meet international recruiter requirements and skilled worker databases.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Details */}
              <form onSubmit={submitResumeBuilder} className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeForm.fullName}
                    onChange={(e) => setResumeForm(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={resumeForm.email}
                      onChange={(e) => setResumeForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Phone</label>
                    <input 
                      type="text" 
                      value={resumeForm.phone}
                      onChange={(e) => setResumeForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Target Trade</label>
                    <input 
                      type="text" 
                      value={resumeForm.targetTrade}
                      onChange={(e) => setResumeForm(p => ({ ...p, targetTrade: e.target.value }))}
                      className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Target Country</label>
                    <input 
                      type="text" 
                      value={resumeForm.targetCountry}
                      onChange={(e) => setResumeForm(p => ({ ...p, targetCountry: e.target.value }))}
                      className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Education</label>
                  <input 
                    type="text" 
                    value={resumeForm.education}
                    onChange={(e) => setResumeForm(p => ({ ...p, education: e.target.value }))}
                    className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                    placeholder="School Board, Year, SSC/HSC"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Experience Details</label>
                  <textarea 
                    value={resumeForm.experience}
                    onChange={(e) => setResumeForm(p => ({ ...p, experience: e.target.value }))}
                    rows={3}
                    className="w-full bg-[#FAF9F6] border border-black/10 p-3 text-xs focus:outline-none"
                    placeholder="List volunteer work or previous trade assistant tasks"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Key Technical Skills</label>
                  <input 
                    type="text" 
                    value={resumeForm.skills}
                    onChange={(e) => setResumeForm(p => ({ ...p, skills: e.target.value }))}
                    className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                    placeholder="Elderly care, metal cutting, circuit wiring"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">Languages Levels</label>
                  <input 
                    type="text" 
                    value={resumeForm.languages}
                    onChange={(e) => setResumeForm(p => ({ ...p, languages: e.target.value }))}
                    className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                    placeholder="Bengali, English (Conversational), Japanese (N5 Prep)"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={resumeLoading}
                  className="w-full bg-black hover:bg-black/95 text-white font-bold py-3 uppercase text-xs tracking-wider transition-all disabled:opacity-50"
                >
                  {resumeLoading ? "Drafting CV & Cover Letter..." : "Generate Pro Resume"}
                </button>
              </form>

              {/* Right Column: Output Previews */}
              <div className="lg:col-span-7 bg-[#FAF9F6] border border-black/10 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-black/40 tracking-wider block mb-4">Employer-Ready Previews</span>
                  
                  {resumeError ? (
                    <div className="border-2 border-red-500 bg-white p-6 space-y-4" id="resume-error-banner">
                      <div className="flex items-start space-x-2.5 text-red-700">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-black">Drafting Engine Offline</h4>
                          <p className="text-[9px] text-red-600 uppercase font-mono mt-0.5">API Compilation Error</p>
                        </div>
                      </div>
                      <p className="text-xs text-black/75 font-serif leading-relaxed italic">
                        "{resumeError}"
                      </p>
                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={(e) => submitResumeBuilder(e)}
                          className="bg-black hover:bg-black/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all"
                        >
                          Retry Generation
                        </button>
                        <button
                          onClick={() => setResumeError(null)}
                          className="border border-black/20 hover:bg-black/5 text-black font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : resumeResult ? (
                    <div className="space-y-6">
                      <div className="bg-white border border-black/10 p-6 shadow-sm max-h-[420px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
                          <span className="text-xs font-bold uppercase text-[#B8860B]">Generated Curriculum Vitae</span>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(resumeResult.resumeMarkdown);
                                alert("CV copied to clipboard!");
                              }}
                              className="text-[10px] font-bold uppercase border border-black/20 px-2.5 py-1 hover:bg-black hover:text-white transition-all"
                            >
                              Copy Markdown
                            </button>
                            <button 
                              onClick={() => {
                                const safeName = resumeForm.fullName.trim() || "Candidate";
                                const filename = `${safeName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_cv.pdf`;
                                generatePdfFromMarkdown(
                                  "Curriculum Vitae",
                                  resumeResult.resumeMarkdown,
                                  filename,
                                  resumeForm.fullName || undefined,
                                  resumeForm.targetCountry || undefined
                                );
                              }}
                              className="text-[10px] font-bold uppercase border border-black/20 bg-black text-white px-2.5 py-1 hover:bg-black/80 transition-all flex items-center space-x-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        </div>
                        <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-black/85">
                          {resumeResult.resumeMarkdown}
                        </pre>
                      </div>

                      <div className="bg-white border border-black/10 p-6 shadow-sm max-h-[220px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
                          <span className="text-xs font-bold uppercase text-[#B8860B]">Targeted Cover Letter</span>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(resumeResult.coverLetterMarkdown);
                                alert("Cover Letter copied to clipboard!");
                              }}
                              className="text-[10px] font-bold uppercase border border-black/20 px-2.5 py-1 hover:bg-black hover:text-white transition-all"
                            >
                              Copy Letter
                            </button>
                            <button 
                              onClick={() => {
                                const safeName = resumeForm.fullName.trim() || "Candidate";
                                const filename = `${safeName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_cover_letter.pdf`;
                                generatePdfFromMarkdown(
                                  "Cover Letter",
                                  resumeResult.coverLetterMarkdown,
                                  filename,
                                  resumeForm.fullName || undefined,
                                  resumeForm.targetCountry || undefined
                                );
                              }}
                              className="text-[10px] font-bold uppercase border border-black/20 bg-black text-white px-2.5 py-1 hover:bg-black/80 transition-all flex items-center space-x-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        </div>
                        <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-black/85">
                          {resumeResult.coverLetterMarkdown}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-24 space-y-4">
                      <FileText className="w-12 h-12 text-black/10 mx-auto" />
                      <p className="text-xs text-black/50 italic max-w-sm mx-auto">
                        Enter your professional background on the left and execute the AI generator to build standard, high-converting CVs and Cover Letters tailored for global employers.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 text-center">
                  <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                    Powered by BIPLOB Skill Assessment Registry
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COURSES & LANGUAGE ACADEMY */}
        {activeTab === "courses" && (
          <div className="space-y-12" id="courses-tab-view">
            
            {/* Header section */}
            <div className="border-b border-black/10 pb-6">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Language Academy & Skill Assessment</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">Trade Courses & Language Academy</h1>
              <p className="text-sm text-black/60 font-serif italic mt-2">
                Learn professional skills online, monitor your progress, and sit for interactive simulated exams to unlock downloadable BIPLOB digital certificates.
              </p>
            </div>

            {/* Main view split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: List of courses & Lesson Player */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Active Video Lesson and Learning Dashboard */}
                <div className="bg-white border border-black/10 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-black/10 pb-4 mb-6 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#B8860B] tracking-wider block">Active Online Learning Session</span>
                      <h3 className="text-lg font-bold uppercase tracking-tight">{activeLesson ? activeLesson.title : "Lesson Player"}</h3>
                    </div>
                    <div className="bg-[#FAF9F6] border border-black/5 px-3 py-1 font-mono text-xs">
                      Lesson {currentLessonIndex + 1} of {currentLessons.length || 1}
                    </div>
                  </div>

                  {/* HTML Video simulator */}
                  <div className="aspect-video bg-black flex flex-col justify-between p-4 relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                      <span className="text-xs font-mono text-[#B8860B] uppercase tracking-widest mb-1">Simulated Live Stream Class</span>
                      <h4 className="text-white text-base font-bold uppercase">{activeLesson ? activeLesson.title : "Introduction"}</h4>
                      <p className="text-white/60 text-xs mt-1">Instructor: Dr. Farhana Yasmin (Geriatric Specialist) • 45 mins Duration</p>
                    </div>
                    <div className="self-end bg-black/60 border border-white/20 px-3 py-1.5 text-[10px] text-white font-bold uppercase tracking-widest rounded-sm">
                      ● LIVE FEED
                    </div>
                  </div>

                  {/* Slide Notes / Reading */}
                  <div className="bg-[#FAF9F6] p-6 border border-black/5 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-2">Classroom Slide & Vocabulary Notes</h4>
                    <p className="text-xs text-black/80 leading-relaxed font-serif italic">
                      {activeLesson ? activeLesson.notes : "Learn Hiragana, Katakana, and basic polite phrases (Ohayou Gozaimasu, Arigatou Gozaimasu)."}
                    </p>
                  </div>

                  {/* MCQ quiz element */}
                  {activeLesson && activeLesson.mcqs && (
                    <div className="border border-black/10 p-6 bg-white space-y-4">
                      <div className="flex items-center space-x-2 border-b border-black/5 pb-2 mb-2">
                        <Award className="w-4 h-4 text-[#B8860B]" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lesson Graded Trade Quiz</span>
                      </div>

                      {activeLesson.mcqs.map((mcq, mcqIdx) => (
                        <div key={mcqIdx} className="space-y-3">
                          <p className="text-xs font-bold text-black/90">Q{mcqIdx+1}: {mcq.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mcq.options.map((option, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerSelect(mcqIdx, optIdx)}
                                className={`text-left p-3 text-xs transition-all border ${
                                  selectedAnswers[mcqIdx] === optIdx 
                                    ? "bg-black text-white border-black" 
                                    : "bg-[#FAF9F6] text-black/75 border-black/5 hover:border-black/20"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Grade actions */}
                      <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {!isQuizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(selectedAnswers).length < activeLesson.mcqs.length}
                            className="bg-black hover:bg-black/95 text-white font-bold uppercase text-[10px] tracking-widest px-5 py-2.5 disabled:opacity-40 transition-all"
                          >
                            Submit Graded Answers
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full justify-between">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold uppercase text-green-700">
                                Quiz Graded: {quizScore} / {activeLesson.mcqs.length} Correct Responses!
                              </span>
                              <span className="text-[10px] text-black/50 font-serif italic">Auto-requesting lesson feedback...</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => {
                                  const activeCourse = dbCourses.find(c => c.id === activeCourseId) || TRADE_COURSES[0];
                                  setFeedbackCourseId(activeCourseId);
                                  setFeedbackCourseTitle(activeCourse ? activeCourse.title : "Trade Program");
                                  if (activeLesson) {
                                    setFeedbackLessonId(activeLesson.id);
                                    setFeedbackLessonTitle(activeLesson.title);
                                  } else {
                                    setFeedbackLessonId("");
                                    setFeedbackLessonTitle("");
                                  }
                                  setIsFeedbackOpen(true);
                                }}
                                className="border border-black hover:bg-black hover:text-white text-black font-bold uppercase text-[10px] tracking-widest px-4 py-2.5 transition-all"
                              >
                                Rate Content Quality
                              </button>
                              {currentLessonIndex < currentLessons.length - 1 ? (
                                <button
                                  onClick={handleNextLesson}
                                  className="bg-[#B8860B] hover:bg-[#a07409] text-white font-bold uppercase text-[10px] tracking-widest px-5 py-2.5 transition-all"
                                >
                                  Advance to Next Lesson →
                                </button>
                              ) : (
                                <div className="bg-green-50 border border-green-200 px-4 py-2 text-xs text-green-800 font-bold uppercase tracking-wider flex items-center gap-3 flex-wrap">
                                  <span>🎉 ALL COURSE LESSONS COMPLETED! Certificate Unlocked.</span>
                                  <button
                                    onClick={() => {
                                      const activeCourse = dbCourses.find(c => c.id === activeCourseId) || TRADE_COURSES[0];
                                      setFeedbackCourseId(activeCourseId);
                                      setFeedbackCourseTitle(activeCourse ? activeCourse.title : "Trade Program");
                                      setFeedbackLessonId("");
                                      setFeedbackLessonTitle("");
                                      setIsFeedbackOpen(true);
                                    }}
                                    className="bg-black hover:bg-black/90 text-white font-bold uppercase text-[9px] tracking-wider px-3 py-1.5 transition-all"
                                  >
                                    Submit Course Feedback
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Course Catalog Grid */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">Technical Trade Certifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredCourses.map(course => (
                      <div 
                        key={course.id} 
                        onClick={() => {
                          setActiveCourseId(course.id);
                          setCurrentLessonIndex(0);
                          setUnlockedCert(false);
                          setSelectedAnswers({});
                          setQuizScore(null);
                          setIsQuizSubmitted(false);
                        }}
                        className={`bg-white border transition-all p-5 cursor-pointer ${
                          activeCourseId === course.id ? "border-black shadow-xs ring-1 ring-black" : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <span className="text-[9px] font-bold text-[#B8860B] uppercase tracking-wider block mb-1">{course.trade}</span>
                        <h4 className="text-sm font-bold uppercase leading-tight mb-2">{course.title}</h4>
                        <p className="text-[11px] text-black/60 font-serif italic mb-4 leading-relaxed line-clamp-2">{course.description}</p>
                        
                        <div className="flex justify-between items-center text-[10px] font-mono text-black/50 border-t border-black/5 pt-3">
                          <span>{course.duration}</span>
                          <span className="font-bold text-black">{course.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Language Academy & Certificate Wallet */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Language Academy Box */}
                <div className="bg-black text-white p-6 border border-black/10">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B] block mb-2">Foreign Language Academy</span>
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Intensive Language Prep</h3>
                  
                  <div className="space-y-4">
                    {LANGUAGE_COURSES.map(lc => (
                      <div key={lc.id} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold uppercase text-[#B8860B] tracking-wider block">{lc.language} Track • {lc.level}</span>
                        <h4 className="text-xs font-bold uppercase text-white/95 mt-0.5">{lc.title}</h4>
                        <p className="text-[11px] text-white/60 font-serif italic leading-relaxed mt-1">{lc.description}</p>
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-2">
                          <span>{lc.duration}</span>
                          <span>{lc.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificate Wallet */}
                <div className="bg-[#FAF9F6] border border-black/10 p-6 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-black/10 pb-3">
                    <Award className="w-5 h-5 text-[#B8860B]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Digital Certificate Wallet</h3>
                  </div>

                  {unlockedCert ? (
                    <div className="bg-white border border-black/10 p-4 text-center space-y-3 shadow-xs">
                      <span className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider block bg-emerald-50 py-1">
                        Verified & Released
                      </span>
                      <h4 className="text-xs font-bold uppercase">Muhammad Rafiq</h4>
                      <p className="text-[10px] text-black/60 font-mono">
                        Has successfully satisfied all trade modules & MCQ exams for the Caregiver Trade program.
                      </p>
                      <div className="border border-black/10 p-2 font-mono text-[9px] bg-[#FAF9F6]">
                        Unique Hash: b6ca9828e10d29ab129f1234bda89b21
                      </div>
                      <button 
                        onClick={() => {
                          setVerificationInput("b6ca9828e10d29ab129f1234bda89b21");
                          setActiveTab("verify");
                        }}
                        className="w-full bg-black text-white text-[10px] font-bold uppercase py-2 hover:bg-black/90 transition-all"
                      >
                        Verify on Registry
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-black/50 italic leading-relaxed">
                        Complete all MCQ quizzes inside your active training courses to unlock and release your cryptographic BIPLOB Digital Certificate.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: JOB BOARD */}
        {activeTab === "jobs" && (
          <div className="space-y-8" id="jobs-tab-view">
            
            {/* Header section */}
            <div className="border-b border-black/10 pb-6">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Direct Employer Partnerships</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">International Job Openings</h1>
              <p className="text-sm text-black/60 font-serif italic mt-2">
                Browse official overseas job listings submitted by verified international employers and recruitment agency partners. Apply instantly using your BIPLOB digital profile.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap gap-4 bg-white border border-black/10 p-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Filter by Target Country</label>
                <select 
                  value={jobFilterCountry}
                  onChange={(e) => setJobFilterCountry(e.target.value)}
                  className="bg-[#FAF9F6] border border-black/10 text-xs px-3 py-1.5 focus:outline-none"
                >
                  <option value="All">All Countries</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Germany">Germany</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Filter by Technical Trade</label>
                <select 
                  value={jobFilterTrade}
                  onChange={(e) => setJobFilterTrade(e.target.value)}
                  className="bg-[#FAF9F6] border border-black/10 text-xs px-3 py-1.5 focus:outline-none"
                >
                  <option value="All">All Trades</option>
                  <option value="Caregiver">Elderly Caregiver</option>
                  <option value="Welder">Welder</option>
                  <option value="Industrial Electrician">Electrician</option>
                  <option value="Commercial Cook">Commercial Cook</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div key={job.id} className="bg-white border border-black/10 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-[#B8860B] uppercase bg-amber-50 px-2 py-0.5 border border-amber-200">
                          {job.trade}
                        </span>
                        <span className="text-[10px] font-mono text-black/40">Posted on: {job.postedDate}</span>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">{job.title}</h3>
                      <p className="text-xs text-black/60 font-serif italic">Employer: {job.employerName} • Contract Duration: {job.contractDuration}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs pt-1">
                        <span className="flex items-center text-black/70">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-[#B8860B]" /> {job.country}
                        </span>
                        <span className="flex items-center text-[#B8860B] font-bold">
                          Salary: {job.salary}
                        </span>
                        <span className="flex items-center text-black/70">
                          Language: {job.languageRequired}
                        </span>
                      </div>

                      {/* Benefits badges */}
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase text-black/55 pt-1">
                        {job.accommodation && <span className="bg-green-50 px-2 py-0.5 text-green-700">✓ Accommodation Provided</span>}
                        {job.food && <span className="bg-green-50 px-2 py-0.5 text-green-700">✓ Food Included</span>}
                        {job.insurance && <span className="bg-[#FAF9F6] border border-black/5 px-2 py-0.5">Insurance Cover</span>}
                        {job.medical && <span className="bg-[#FAF9F6] border border-black/5 px-2 py-0.5">Medical Plan</span>}
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-stretch sm:items-end justify-center space-y-2">
                      {appliedJobs.includes(job.id) ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold uppercase text-xs px-6 py-3 text-center flex items-center justify-center space-x-1.5">
                          <Check className="w-4 h-4" />
                          <span>APPLICATION SENT</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          className="bg-black hover:bg-black/95 text-white font-bold uppercase text-xs tracking-wider px-6 py-3 transition-all"
                        >
                          Apply with BIPLOB Profile
                        </button>
                      )}
                      <p className="text-[10px] text-black/40 text-center sm:text-right font-mono">
                        ID: JOBS-{job.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white border border-black/10">
                  <p className="text-sm text-black/50 italic">
                    No active job postings match your chosen country and trade filters. Try widening your filters.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: VERIFY CERTIFICATE */}
        {activeTab === "verify" && (
          <div className="bg-white border border-black/10 p-6 sm:p-12 max-w-3xl mx-auto" id="verify-tab-view">
            <div className="border-b border-black/10 pb-6 mb-8 text-center">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Secure Cryptographic Audit</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">Certificate Verification System</h1>
              <p className="text-sm text-black/60 font-serif italic mt-2">
                Validate student trade certifications, language test scores, and training validation hashes using the secure cryptographic BIPLOB ledger registry.
              </p>
            </div>

            <form onSubmit={verifyCertificateHash} className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-2 text-center">
                  Enter Certificate ID or Unique Cryptographic Hash
                </label>
                <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
                  <input 
                    type="text" 
                    placeholder="e.g. CERT-92813 or b6ca9828e10d29ab129f1234bda89b21" 
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    className="flex-grow bg-[#FAF9F6] border border-black/10 px-4 py-3 text-sm font-mono focus:outline-none focus:border-black"
                  />
                  <button 
                    type="submit"
                    className="bg-black hover:bg-black/95 text-white font-bold uppercase text-xs tracking-wider px-6 py-3 transition-all shrink-0"
                  >
                    Query Ledger
                  </button>
                </div>
              </div>
            </form>

            {hasSearchedCert && (
              <div className="mt-8 pt-8 border-t border-black/10">
                {verificationResult ? (
                  <div className="border border-green-200 bg-green-50/20 p-6 sm:p-8 space-y-6 relative" id="verification-card-success">
                    <div className="absolute top-6 right-6 w-16 h-16 border-2 border-emerald-600/20 rounded-full flex items-center justify-center font-bold text-emerald-800 text-xs italic">
                      VALID
                    </div>

                    <div className="flex items-center space-x-3 text-emerald-800 font-bold uppercase text-xs">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Ledger Verified Certificate Authentic</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-black/5">
                      <div>
                        <span className="text-black/50 uppercase block">Certified Student:</span>
                        <span className="text-base font-bold uppercase block mt-1">{verificationResult.studentName}</span>
                      </div>
                      <div>
                        <span className="text-black/50 uppercase block">Course Program:</span>
                        <span className="text-base font-bold uppercase block mt-1">{verificationResult.courseTitle}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-black/50 uppercase block">Issue Date:</span>
                        <span className="font-semibold block mt-1">{verificationResult.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-black/50 uppercase block">Verified Assessor:</span>
                        <span className="font-semibold block mt-1">{verificationResult.trainerName}</span>
                      </div>
                      <div>
                        <span className="text-black/50 uppercase block">Certificate Status:</span>
                        <span className="font-semibold text-green-700 block mt-1 uppercase">{verificationResult.status}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 border border-black/5 font-mono text-[10px] text-black/75">
                      <span className="font-bold">Cryptographic Validation Ledger Hash:</span><br/>
                      {verificationResult.uniqueHash}
                    </div>
                  </div>
                ) : (
                  <div className="border border-red-200 bg-red-50/20 p-6 text-center space-y-3" id="verification-card-failed">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
                    <h3 className="text-base font-bold text-red-800 uppercase">Verification Query Failed</h3>
                    <p className="text-xs text-black/60 max-w-md mx-auto">
                      The entered certificate number or ledger hash could not be matched with any issued student certification on the secure BIPLOB server registry. Double check the character sequence and spelling.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: STUDENT DASHBOARD */}
        {activeTab === "student-dash" && (
          <div className="space-y-8" id="student-dashboard-view">
            <div className="border-b border-black/10 pb-4">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Student Workspace</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">My Student Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Student Info */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-black/10 p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-[#E4E3E0] flex items-center justify-center font-bold text-xl text-black">
                      MR
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase">{profile.fullName}</h3>
                      <span className="text-xs text-black/50 font-mono">ID: {profile.id}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-black/5 pt-4">
                    <div className="flex justify-between">
                      <span className="text-black/50 uppercase">Email:</span>
                      <span className="font-semibold">{profile.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50 uppercase">Phone:</span>
                      <span className="font-semibold">{profile.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50 uppercase">Passport Status:</span>
                      <span className="font-semibold text-emerald-700">{profile.passportStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50 uppercase">Preferred country:</span>
                      <span className="font-semibold">{profile.preferredDestination}</span>
                    </div>
                  </div>

                  {/* Calculated score */}
                  <div className="bg-[#FAF9F6] p-4 border border-black/5">
                    <span className="text-[10px] font-bold text-black/40 uppercase block">My Global Preparation Score</span>
                    <div className="flex items-baseline space-x-1.5 mt-1">
                      <span className="text-3xl font-black text-[#B8860B]">{profile.eligibilityScore}</span>
                      <span className="text-xs font-semibold text-black/50">/ 100 Points</span>
                    </div>
                    <div className="w-full bg-black/10 h-1.5 mt-2">
                      <div className="bg-[#B8860B] h-1.5" style={{ width: `${profile.eligibilityScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Simulated payment invoices */}
                <div className="bg-white border border-black/10 p-6 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider block border-b border-black/5 pb-2">Invoices & Payments</span>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-[#FAF9F6] p-2.5 border border-black/5">
                      <div>
                        <span className="font-bold block">Caregiver Trade Fee</span>
                        <span className="text-[9px] text-black/40 uppercase font-mono">Invoice: BIPLOB-4921-A</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-bold">BDT 15,000 (Paid)</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#FAF9F6] p-2.5 border border-black/5">
                      <div>
                        <span className="font-bold block">Japanese N5 Course Fee</span>
                        <span className="text-[9px] text-black/40 uppercase font-mono">Invoice: BIPLOB-4921-B</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-bold">BDT 10,000 (Paid)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Checklist and enrolled stats */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Active Courses */}
                <div className="bg-white border border-black/10 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-4 border-b border-black/5 pb-2">My Enrolled Course Sessions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF9F6] p-4 border border-black/5 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-[#B8860B] tracking-wider block">Caregiver Trade Course</span>
                        <h4 className="text-sm font-bold uppercase mt-1">Caregiver & Elderly Support Trade</h4>
                        <span className="text-[10px] text-black/50 font-mono block mt-2">Lessons Finished: {completedLessons.length} / 3 Complete</span>
                      </div>
                      <button 
                        onClick={() => { setActiveTab("courses"); setActiveCourseId("course-1"); }}
                        className="mt-4 bg-black text-white text-[10px] font-bold uppercase tracking-wider py-2 hover:bg-black/90 transition-all text-center"
                      >
                        Enter Classroom
                      </button>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 border border-black/5 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-[#B8860B] tracking-wider block">Language Training Academy</span>
                        <h4 className="text-sm font-bold uppercase mt-1">Japanese NAT-TEST N5 Intensive</h4>
                        <span className="text-[10px] text-black/50 font-mono block mt-2">Batch 42 • Live Class in 4 Days</span>
                      </div>
                      <button 
                        onClick={() => { setActiveTab("courses"); }}
                        className="mt-4 bg-black text-white text-[10px] font-bold uppercase tracking-wider py-2 hover:bg-black/90 transition-all text-center"
                      >
                        Enter Classroom
                      </button>
                    </div>
                  </div>
                </div>

                {/* Job application list */}
                <div className="bg-white border border-black/10 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-4 border-b border-black/5 pb-2">My Submitted Applications</h3>
                  {appliedJobs.length > 0 ? (
                    <div className="space-y-3">
                      {appliedJobs.map(jobId => {
                        const original = JOBS.find(j => j.id === jobId);
                        return (
                          <div key={jobId} className="flex justify-between items-center bg-[#FAF9F6] p-3 border border-black/5">
                            <div>
                              <span className="text-xs font-bold uppercase block">{original ? original.title : "Trade Role"}</span>
                              <span className="text-[10px] text-black/50">Employer: {original ? original.employerName : "Verified Agency"} • Country: {original ? original.country : "Japan"}</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200">
                              Under Review
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-black/50 italic py-2">
                      You haven't submitted any job applications yet. Go to the Job Board to apply.
                    </p>
                  )}
                </div>

                {/* Visa checklist */}
                <div className="bg-white border border-black/10 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-4 border-b border-black/5 pb-2">My Smart Migration Checklist</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span className="font-medium text-black/80">Valid Bangladeshi Passport verified in portal database</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span className="font-medium text-black/80">Caregiver trade training enrollment fee invoice generated and paid</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span className="font-medium text-black/80">First 2 interactive trade lessons successfully passed with quiz scores</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#B8860B] shrink-0" />
                      <span className="font-medium text-black/60">Take final trade certificate validation exam (Awaiting lessons progress)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#B8860B] shrink-0" />
                      <span className="font-medium text-black/60">Attend Japanese N5 test or NAT-TEST verification (Scheduled in 4 months)</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 8: TRAINER DASHBOARD */}
        {activeTab === "trainer-dash" && (
          <div className="bg-white border border-black/10 p-6 sm:p-10 max-w-4xl mx-auto" id="trainer-dashboard-view">
            <div className="border-b border-black/10 pb-4 mb-6">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Assessor & Instructor Portal</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">My Trainer Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
              <div className="md:col-span-4 bg-[#FAF9F6] p-6 border border-black/5 space-y-4">
                <span className="text-xs font-bold uppercase text-black/40 block">Trainer Profile</span>
                <div>
                  <h4 className="text-base font-bold uppercase">Dr. Farhana Yasmin</h4>
                  <span className="text-xs text-[#B8860B] font-medium block mt-1">Geriatric Specialist Assessor</span>
                </div>
                <div className="text-xs space-y-2 border-t border-black/5 pt-3">
                  <div className="flex justify-between">
                    <span className="text-black/40">Total Students:</span>
                    <span className="font-bold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/40">Active Lessons:</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/40">Exams Graded:</span>
                    <span className="font-bold">128</span>
                  </div>
                </div>
              </div>

              {/* Add New Lesson Form */}
              <div className="md:col-span-8 bg-white border border-black/10 p-6">
                <span className="text-xs font-bold uppercase tracking-wider block mb-4 text-[#B8860B]">Add Live Lesson / Study Slide to Caregiver Course</span>
                
                {trainerSuccessMsg && (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold uppercase px-4 py-3 mb-4">
                    {trainerSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleTrainerAddLesson} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Lesson Title</label>
                    <input 
                      type="text" 
                      value={trainerLessonTitle}
                      onChange={(e) => setTrainerLessonTitle(e.target.value)}
                      placeholder="e.g. Lesson 4: Essential Patient Transfer and Sanitary Safety"
                      className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Slide Study Notes & Vocabulary Transcription</label>
                    <textarea 
                      value={trainerLessonNotes}
                      onChange={(e) => setTrainerLessonNotes(e.target.value)}
                      rows={4}
                      placeholder="Enter detailed caregiver procedures or Japanese/German grammar patterns."
                      className="w-full bg-[#FAF9F6] border border-black/10 p-3 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="bg-black hover:bg-black/95 text-white font-bold uppercase text-xs tracking-wider px-5 py-2.5 transition-all"
                  >
                    Release Lesson
                  </button>
                </form>
              </div>
            </div>

            {/* Students pending grading list */}
            <div className="bg-[#FAF9F6] border border-black/10 p-6">
              <span className="text-xs font-bold uppercase text-black/40 block mb-4">Pending Assignment Submissions & Grading Queue</span>
              <div className="space-y-3">
                <div className="bg-white p-4 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center text-xs">
                  <div>
                    <span className="font-bold block">Muhammad Rafiq</span>
                    <span className="text-black/50">Assignment: Demonstration of elderly care bed-transfer techniques</span>
                  </div>
                  <button 
                    onClick={() => alert("Assigned score: 10/10 successfully passed!")}
                    className="mt-2 sm:mt-0 bg-black text-white text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-black/90 transition-all text-center"
                  >
                    Grade Pass (10/10)
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 9: EMPLOYER PORTAL */}
        {activeTab === "employer-dash" && (
          <div className="bg-white border border-black/10 p-6 sm:p-10 max-w-4xl mx-auto" id="employer-dashboard-view">
            <div className="border-b border-black/10 pb-4 mb-6">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Verified Corporate Portal</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">My Employer Portal</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
              
              <div className="md:col-span-4 bg-[#FAF9F6] p-6 border border-black/5 space-y-4">
                <span className="text-xs font-bold uppercase text-black/40 block">Company Credentials</span>
                <div>
                  <h4 className="text-base font-bold uppercase">Heisei Senior Care Association</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 uppercase tracking-widest rounded-sm block mt-1.5 w-max">
                    ✓ VERIFIED EMPLOYER
                  </span>
                </div>
                <div className="text-xs space-y-2 border-t border-black/5 pt-3">
                  <div className="flex justify-between">
                    <span className="text-black/40">Office Location:</span>
                    <span className="font-semibold text-right">Chiba, Japan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/40">Posted Jobs:</span>
                    <span className="font-bold">1 Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/40">Applicants:</span>
                    <span className="font-bold text-indigo-700">1 Pending</span>
                  </div>
                </div>
              </div>

              {/* Post New Job Form */}
              <div className="md:col-span-8 bg-white border border-black/10 p-6">
                <span className="text-xs font-bold uppercase tracking-wider block mb-4 text-[#B8860B]">Post New Skilled Job Vacancy</span>
                
                {employerSuccessMsg && (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold uppercase px-4 py-3 mb-4">
                    {employerSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleEmployerPostJob} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Job Role Title</label>
                    <input 
                      type="text" 
                      value={newJobForm.title}
                      onChange={(e) => setNewJobForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Certified Elderly Support Assistant"
                      className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Country</label>
                      <select 
                        value={newJobForm.country}
                        onChange={(e) => setNewJobForm(p => ({ ...p, country: e.target.value }))}
                        className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="Japan">Japan</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Germany">Germany</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Trade Category</label>
                      <select 
                        value={newJobForm.trade}
                        onChange={(e) => setNewJobForm(p => ({ ...p, trade: e.target.value }))}
                        className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="Caregiver">Caregiver</option>
                        <option value="Welder">Welder</option>
                        <option value="Industrial Electrician">Industrial Electrician</option>
                        <option value="Commercial Cook">Commercial Cook</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Salary Range / Month</label>
                      <input 
                        type="text" 
                        value={newJobForm.salary}
                        onChange={(e) => setNewJobForm(p => ({ ...p, salary: e.target.value }))}
                        placeholder="e.g. ¥220,000 - ¥250,000"
                        className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-black/50 mb-1">Language Level Required</label>
                      <input 
                        type="text" 
                        value={newJobForm.languageRequired}
                        onChange={(e) => setNewJobForm(p => ({ ...p, languageRequired: e.target.value }))}
                        placeholder="e.g. Japanese NAT-TEST N5"
                        className="w-full bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs font-bold uppercase text-black/60 pt-2">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={newJobForm.accommodation}
                        onChange={(e) => setNewJobForm(p => ({ ...p, accommodation: e.target.checked }))}
                      />
                      <span>Accommodation Included</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={newJobForm.food}
                        onChange={(e) => setNewJobForm(p => ({ ...p, food: e.target.checked }))}
                      />
                      <span>Food Provided</span>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="bg-black hover:bg-black/95 text-white font-bold uppercase text-xs tracking-wider px-5 py-2.5 transition-all"
                  >
                    Post Job Globally
                  </button>
                </form>
              </div>

            </div>

            {/* Candidate Search / CV downloads */}
            <div className="bg-[#FAF9F6] border border-black/10 p-6">
              <span className="text-xs font-bold uppercase text-black/40 block mb-4">Skilled Candidates Search Pool</span>
              <div className="space-y-4">
                <div className="bg-white p-4 border border-black/5 flex flex-col sm:flex-row justify-between sm:items-center text-xs">
                  <div>
                    <h5 className="font-bold uppercase text-sm">Muhammad Rafiq</h5>
                    <p className="text-black/50 mt-1">Certified Caregiver • Bengali, English, Japanese (N5 ongoing)</p>
                    <span className="text-[#B8860B] font-semibold mt-1 block">BIPLOB Skill Score: 78/100 points</span>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button 
                      onClick={() => alert("CV and Cover letter downloaded successfully!")}
                      className="bg-[#FAF9F6] hover:bg-black hover:text-white border border-black/20 text-black text-[10px] font-bold uppercase px-3 py-1.5 transition-all"
                    >
                      Download CV
                    </button>
                    <button 
                      onClick={() => alert("Interview Invitation sent successfully!")}
                      className="bg-black hover:bg-[#B8860B] text-white text-[10px] font-bold uppercase px-3 py-1.5 transition-all"
                    >
                      Invite for Interview
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 10: LICENSED RECRUITMENT PARTNER PORTAL */}
        {activeTab === "partner-dash" && (
          <div className="bg-white border border-black/10 p-6 sm:p-10 max-w-4xl mx-auto" id="partner-dashboard-view">
            <div className="border-b border-black/10 pb-4 mb-6">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">Licensed Recruitment Partner Portal</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">My Partner Dashboard</h1>
              <p className="text-xs text-black/60 italic mt-1 font-serif">
                Authorized agency dashboard to verify candidates, view certificates, and manage migration workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#FAF9F6] p-4 border border-black/5 text-center">
                <span className="text-3xl font-black block text-[#B8860B]">78</span>
                <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider mt-1 block">Verified Candidates</span>
              </div>
              <div className="bg-[#FAF9F6] p-4 border border-black/5 text-center">
                <span className="text-3xl font-black block text-green-700">12</span>
                <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider mt-1 block">Visas Approved</span>
              </div>
              <div className="bg-[#FAF9F6] p-4 border border-black/5 text-center">
                <span className="text-3xl font-black block text-indigo-700">45</span>
                <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider mt-1 block">Interviews Scheduled</span>
              </div>
            </div>

            {/* Verification tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tight border-b border-black/5 pb-2">Verified Candidate Workflow</h3>
              <div className="bg-white border border-black/10 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-4">
                  <div>
                    <h5 className="font-bold uppercase">Muhammad Rafiq</h5>
                    <p className="text-black/50 mt-1">Preferred Destination: Japan • Role: Caregiver</p>
                    <span className="text-[10px] font-mono text-emerald-700 mt-1 block">✓ Trade Certificate VERIFIED on ledger</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Certificate verified officially!")}
                      className="bg-green-100 text-green-800 text-[10px] font-bold uppercase px-3 py-1.5 rounded-none"
                    >
                      Verified OK
                    </button>
                    <button 
                      onClick={() => alert("Interview scheduled for July 15, 2026.")}
                      className="bg-black text-white text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-[#B8860B] transition-all"
                    >
                      Request Interview
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 11: ADMIN DASHBOARD */}
        {activeTab === "admin-dash" && (
          <div className="bg-white border border-black/10 p-6 sm:p-10 max-w-4xl mx-auto" id="admin-dashboard-view">
            <div className="border-b border-black/10 pb-4 mb-6">
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest block">System Management Console</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1">My Admin Console</h1>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#FAF9F6] p-4 border border-black/5">
                <span className="text-xs font-bold text-black/40 uppercase block">Daily Visitors</span>
                <span className="text-2xl font-black block mt-1">2,840</span>
                <span className="text-[10px] text-green-700 font-bold block mt-1">↑ 12% This Week</span>
              </div>
              <div className="bg-[#FAF9F6] p-4 border border-black/5">
                <span className="text-xs font-bold text-black/40 uppercase block">Total Revenue</span>
                <span className="text-2xl font-black block mt-1">BDT 4.8M</span>
                <span className="text-[10px] text-green-700 font-bold block mt-1">Target 96% Met</span>
              </div>
              <div className="bg-[#FAF9F6] p-4 border border-black/5">
                <span className="text-xs font-bold text-black/40 uppercase block">Course Dropouts</span>
                <span className="text-2xl font-black block mt-1">2.4%</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">Excellent Retention</span>
              </div>
              <div className="bg-[#FAF9F6] p-4 border border-black/5">
                <span className="text-xs font-bold text-black/40 uppercase block">Active Employers</span>
                <span className="text-2xl font-black block mt-1">240</span>
                <span className="text-[10px] text-green-700 font-bold block mt-1">↑ 8 Partner Signups</span>
              </div>
            </div>

            {/* Control logs list */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tight border-b border-black/5 pb-2">Audit Ledger Log Entries</h3>
              <div className="bg-white border border-black/10 p-4 text-xs font-mono space-y-2 text-black/85 max-h-60 overflow-y-auto">
                <p>[2026-07-01 10:43] USER_REGISTRATION: Student "Muhammad Rafiq" verified passport upload</p>
                <p>[2026-07-01 09:12] PAYMENT_COMPLETED: BIPLOB-4921-A caregiver enrollment fee received via bKash</p>
                <p>[2026-07-01 08:30] CERTIFICATE_ISSUED: NAT-TEST N5 prep certification verified for Taslima Akter</p>
                <p>[2026-06-30 23:45] SYSTEM: Generated XML sitemap index and triggered Google SEO crawlers</p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Collapsible AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="biplob-ai-chatbot-root">
        {isChatOpen ? (
          <div className="w-80 sm:w-96 h-[450px] bg-white border border-black shadow-2xl flex flex-col justify-between mb-2">
            
            {/* Chatbot Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#B8860B] animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">BIPLOB AI Assistant</h4>
                  <span className="text-[9px] font-mono text-[#B8860B] uppercase">V1.0 Live Counselor</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#FAF9F6]">
              {chatHistory.map((chat, i) => (
                <div 
                  key={i} 
                  className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-3 text-xs max-w-[85%] leading-relaxed ${
                    chat.role === "user" 
                      ? "bg-black text-white" 
                      : "bg-[#E4E3E0] text-[#1A1A1A]"
                  }`}>
                    {chat.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#E4E3E0] p-3 text-xs max-w-[85%] text-black/50 italic flex items-center space-x-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-[#B8860B]" />
                    <span>AI Assistant thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={submitChatMessage} className="p-3 border-t border-black/10 flex items-center bg-white gap-2">
              <input 
                type="text" 
                placeholder="Ask about courses, visa requirements..." 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow bg-[#FAF9F6] border border-black/10 px-3 py-1.5 text-xs focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-black hover:bg-black/90 text-white p-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            id="floating-chatbot-trigger-btn"
            className="bg-black hover:bg-black/95 text-white border border-[#B8860B] w-14 h-14 rounded-none flex items-center justify-center shadow-xl transition-all hover:scale-105 group"
          >
            <Globe className="w-6 h-6 text-[#B8860B] group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Elegant Editorial Footer */}
      <footer className="bg-black text-white mt-24 border-t border-white/10" id="biplob-main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-base italic">B</div>
                <span className="text-xl font-black tracking-tighter uppercase">BIPLOB</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-serif italic">
                Empowering Bangladeshi workers with real vocational competencies, certifications, and fluent languages for successful overseas careers.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] mb-4">Skilled Trades</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>Certified Elderly Caregiver</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>Industrial Electrician</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>Structural AWS Welder</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>Commercial Culinary Cook</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] mb-4">Language Tracks</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>Japanese N5 Prep</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>German Goethe A2 Prep</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>Korean EPS-TOPIK</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab("courses")}>IELTS Vocational</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] mb-4">Portal Legal Registry</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><span className="hover:underline cursor-pointer">Terms & Conditions</span></li>
                <li><span className="hover:underline cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:underline cursor-pointer">Refund Policy</span></li>
                <li><span className="hover:underline cursor-pointer">Anti-Fraud Notice</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-white/40 uppercase font-mono">
              © 2026 BIPLOB Inc. All Rights Reserved. Bangladesh Skills Council Partner.
            </p>
            <div className="flex gap-4">
              <span className="text-[9px] font-bold uppercase text-emerald-500 bg-emerald-950/50 px-2 py-0.5 border border-emerald-500/20 rounded-xs">
                ● Registry Online & Verified
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Course and Quiz Content Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        courseId={feedbackCourseId}
        courseTitle={feedbackCourseTitle}
        lessonId={feedbackLessonId}
        lessonTitle={feedbackLessonTitle}
      />

    </div>
  );
}
