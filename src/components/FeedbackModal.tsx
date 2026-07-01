import React, { useState } from "react";
import { Star, Send, X, CheckCircle2, MessageSquare, Loader2, Award } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  lessonId,
  lessonTitle
}: FeedbackModalProps) {
  const [contentClarity, setContentClarity] = useState<number>(5);
  const [quizDifficulty, setQuizDifficulty] = useState<number>(5);
  const [instructorQuality, setInstructorQuality] = useState<number>(5);
  const [recommend, setRecommend] = useState<string>("Yes");
  const [comments, setComments] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [sentiment, setSentiment] = useState<string>("Positive");

  if (!isOpen) return null;

  const handleRatingStar = (category: string, rating: number) => {
    if (category === "content") setContentClarity(rating);
    if (category === "quiz") setQuizDifficulty(rating);
    if (category === "instructor") setInstructorQuality(rating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          courseTitle,
          lessonId,
          lessonTitle,
          ratings: {
            contentClarity,
            quizDifficulty,
            instructorQuality
          },
          recommend,
          comments
        })
      });

      const data = await res.json();
      setResponseMsg(data.personalizedThankYou || "Thank you for helping us maintain top quality training!");
      setSentiment(data.sentiment || "Positive");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setResponseMsg("Thank you! Your feedback has been received and will help improve our training materials.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    // Reset state
    setContentClarity(5);
    setQuizDifficulty(5);
    setInstructorQuality(5);
    setRecommend("Yes");
    setComments("");
    setSubmitted(false);
    setResponseMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        id="feedback-modal-content"
        className="w-full max-w-lg bg-white border border-black/10 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-black/5 bg-[#FAF9F6]">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#B8860B]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-black">Training Quality Feedback</h3>
              <p className="text-[10px] font-mono text-black/50 uppercase mt-0.5">
                {lessonTitle ? `Lesson: ${lessonTitle}` : `Course: ${courseTitle}`}
              </p>
            </div>
          </div>
          <button 
            onClick={handleModalClose}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-black/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-black/70 leading-relaxed font-serif italic mb-2">
                Your direct evaluation of our curriculum, online instruction, and quizzes ensures we prepare expatriate candidates to the highest standards.
              </p>

              {/* Rating Section: Content Relevance */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60">
                  1. Content Clarity & Practical Relevance
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingStar("content", star)}
                      className="p-1 transition-transform active:scale-95"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= contentClarity 
                            ? "fill-[#B8860B] text-[#B8860B]" 
                            : "text-black/15 hover:text-[#B8860B]/50"
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-[11px] font-mono text-black/50 ml-2">
                    ({contentClarity}/5)
                  </span>
                </div>
              </div>

              {/* Rating Section: Quiz and Assessment Quality */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60">
                  2. Assessment / Quiz Quality & Alignment
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingStar("quiz", star)}
                      className="p-1 transition-transform active:scale-95"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= quizDifficulty 
                            ? "fill-[#B8860B] text-[#B8860B]" 
                            : "text-black/15 hover:text-[#B8860B]/50"
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-[11px] font-mono text-black/50 ml-2">
                    ({quizDifficulty}/5)
                  </span>
                </div>
              </div>

              {/* Rating Section: Instructor & Stream Quality */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60">
                  3. Instructor Clarity & Technical Standards
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingStar("instructor", star)}
                      className="p-1 transition-transform active:scale-95"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= instructorQuality 
                            ? "fill-[#B8860B] text-[#B8860B]" 
                            : "text-black/15 hover:text-[#B8860B]/50"
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-[11px] font-mono text-black/50 ml-2">
                    ({instructorQuality}/5)
                  </span>
                </div>
              </div>

              {/* Recommendation Choice */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60">
                  Would you recommend this course to other overseas aspirants?
                </label>
                <div className="flex gap-3">
                  {["Yes", "Maybe", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRecommend(option)}
                      className={`flex-1 py-2 text-xs font-bold uppercase border transition-all ${
                        recommend === option
                          ? "bg-black text-white border-black"
                          : "bg-white text-black/70 border-black/10 hover:border-black/30"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Text Area */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60">
                  Suggestions or Remarks (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full bg-[#FAF9F6] border border-black/10 p-3 text-xs focus:outline-none placeholder:text-black/30 font-serif leading-relaxed"
                  placeholder="Share what parts were most helpful or what we can update in the next syllabus revision..."
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-black/5 flex gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-black transition-all"
                >
                  Skip Feedback
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black hover:bg-black/95 text-white font-bold py-3 uppercase text-xs tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-black uppercase tracking-tight text-black">
                  Feedback Logged Successfully!
                </h4>
                <div className="inline-flex items-center space-x-1.5 bg-black/5 px-2.5 py-0.5 rounded-full font-mono text-[9px] text-black/60 uppercase">
                  <span>Sentiment Analyzed:</span>
                  <span className="font-bold text-emerald-700">{sentiment}</span>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-black/5 p-5 text-left space-y-3 font-serif">
                <span className="text-[10px] font-bold uppercase font-sans text-[#B8860B] tracking-wider block">
                  BIPLOB Academy Director Response
                </span>
                <p className="text-xs text-black/85 leading-relaxed italic">
                  "{responseMsg}"
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleModalClose}
                  className="w-full bg-black hover:bg-black/95 text-white font-bold py-3 uppercase text-xs tracking-wider transition-all"
                >
                  Return to Learning Player
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
