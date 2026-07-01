import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "Visa & Process",
    question: "How do I get a visa through BIPLOB?",
    answer: "BIPLOB is a professional vocational training and preparation academy, not a direct visa processing agency. We focus on preparing you with internationally certified trade qualifications and mandatory foreign language credentials. Once certified, we connect you with licensed recruitment partners and verified global employers who handle and sponsor your formal visa application process."
  },
  {
    category: "Recognition",
    question: "Are the trade training certificates internationally recognized?",
    answer: "Yes, absolutely. Our trade curricula are specifically mapped to meet target-country standards. For example, our Caregiving program aligns with the Japanese SSW (Specified Skilled Worker) framework and the Kaigo evaluation, our Welding course meets AWS (American Welding Society) standards, and our language programs prepare students for official NAT-TEST (Japanese) and Goethe-Institut (German) examinations."
  },
  {
    category: "Timeline & Cost",
    question: "What is the typical duration and cost of a skilled track?",
    answer: "Most skilled migration pathways require 4 to 6 months of combined trade training and intensive language academy instruction. The cost varies depending on your chosen trade and target country, but we provide fully transparent BDT budget estimations. We also partner with leading banks to assist with low-interest migration loans once an employment offer is secured."
  },
  {
    category: "Requirements",
    question: "Do I need a university degree to apply for skilled pathways?",
    answer: "No. Many specified skilled worker visa programs (such as Japan's SSW, South Korea's EPS/E-9/E-7, or Middle-Eastern technical sectors) prioritize hands-on vocational competency and practical language skills over formal academic degrees. A high-school certificate (SSC or HSC) is usually more than sufficient when paired with our certified credentials."
  },
  {
    category: "AI & Assessment",
    question: "How does the AI Career Assessment work?",
    answer: "Our AI-driven system scans your personal profile parameters—including age, highest education level, prior trade experience, passport status, and available budget in BDT. It then cross-references this data with live, active global job board criteria to instantly recommend your best trade direction, compute an estimated preparation timeline, and suggest specific academy classes."
  },
  {
    category: "Employment Match",
    question: "Can I interact with real employers on the platform?",
    answer: "Yes. Licensed recruitment agencies and registered global employers actively utilize our Verified Talent Registry. Once you pass our vocational practical exams and language benchmarks, your digital profile, verified certifications, and AI-compiled CV are listed on the employer dashboard, allowing international hiring managers to request direct interviews."
  }
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section 
      className="bg-white border-2 border-black p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8" 
      id="homepage-faq-section"
    >
      {/* FAQ Header */}
      <div className="border-b-2 border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4" id="faq-header-container">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[#B8860B]">
            <HelpCircle className="w-4 h-4 shrink-0" id="faq-help-icon" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em]" id="faq-sub-badge">
              Student & Candidate Help Desk
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black" id="faq-title">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="flex items-center space-x-2 bg-amber-50 border border-[#B8860B]/20 px-3 py-1.5 self-start sm:self-auto" id="faq-info-pill">
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
          <span className="text-[10px] font-mono font-bold text-[#B8860B] uppercase">Updated July 2026</span>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4" id="faq-accordion-list">
        {FAQ_DATA.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div 
              key={index} 
              className={`border-2 border-black transition-colors ${
                isOpen ? "bg-[#FAF9F6]" : "bg-white hover:bg-[#FAF9F6]/50"
              }`}
              id={`faq-item-card-${index}`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none focus:ring-1 focus:ring-[#B8860B]/50"
                id={`faq-item-btn-${index}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-pane-${index}`}
              >
                <div className="space-y-1">
                  <span 
                    className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#B8860B] bg-amber-50 border border-[#B8860B]/15 px-2 py-0.5 rounded-sm"
                    id={`faq-item-category-${index}`}
                  >
                    {item.category}
                  </span>
                  <h3 
                    className="text-sm sm:text-base font-bold text-black uppercase tracking-tight pt-1"
                    id={`faq-item-question-${index}`}
                  >
                    {item.question}
                  </h3>
                </div>
                <div 
                  className={`w-8 h-8 rounded-none border-2 border-black flex items-center justify-center shrink-0 bg-white transition-transform duration-200 ${
                    isOpen ? "bg-black text-white" : "text-black"
                  }`}
                  id={`faq-item-indicator-${index}`}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-pane-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="px-5 pb-5 pt-1 border-t border-black/10 text-xs sm:text-sm text-black/80 font-serif leading-relaxed italic"
                      id={`faq-item-answer-${index}`}
                    >
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Trust Quote / Notice */}
      <div 
        className="bg-[#E4E3E0]/30 border border-black/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" 
        id="faq-footer-notice"
      >
        <span className="text-black/50 font-serif italic text-center sm:text-left">
          Have a more specific question regarding your eligibility or financial support options?
        </span>
        <button 
          onClick={() => {
            const chatTrigger = document.getElementById("floating-chatbot-trigger-btn");
            if (chatTrigger) {
              chatTrigger.click();
            } else {
              alert("Our live BIPLOB AI Assistant is active! Click the floating globe icon in the bottom-right of your screen.");
            }
          }}
          className="bg-black hover:bg-[#B8860B] hover:text-white text-white font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-2 transition-all shrink-0 rounded-none border border-black"
          id="faq-chat-trigger-btn"
        >
          Ask BIPLOB AI Chatbot
        </button>
      </div>
    </section>
  );
}
