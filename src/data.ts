import { TradeCourse, LanguageCourse, CountryDetail, SuccessStory, JobVacancy, DigitalCertificate } from "./types";

export const TRADE_COURSES: TradeCourse[] = [
  {
    id: "course-1",
    title: "Specified Skilled Worker: Professional Caregiver Trade Program",
    trade: "Caregiver",
    description: "An intensive 3-month comprehensive certification covering physical support, healthcare assistance, patient dignity, medical safety protocols, and specialized elderly care techniques.",
    duration: "3 Months (120 Hours)",
    seatsLeft: 8,
    countdownDays: 4,
    language: "Basic English & Japanese",
    price: "BDT 15,000",
    instructor: "Dr. Farhana Yasmin (Geriatric Specialist)",
    lessonsCount: 15,
    enrolledStudentsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "course-2",
    title: "International Structural Welding & Fabrication (AWS Standard)",
    trade: "Welder",
    description: "Hands-on masterclass focusing on MMAW, GMAW, and GTAW welding techniques, structural blueprints, metallurgy basics, and international safety compliance standards.",
    duration: "3 Months (140 Hours)",
    seatsLeft: 5,
    countdownDays: 6,
    language: "English Standard",
    price: "BDT 18,000",
    instructor: "Engr. Mostafa Kamal (AWS Certified Inspector)",
    lessonsCount: 18,
    enrolledStudentsCount: 35,
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "course-3",
    title: "Industrial & Commercial Electrical Maintenance",
    trade: "Industrial Electrician",
    description: "Comprehensive program on 3-phase wiring, PLC programming, heavy machinery setup, circuitry analysis, electrical blueprints, and OSHA industrial safety codes.",
    duration: "4 Months (160 Hours)",
    seatsLeft: 12,
    countdownDays: 8,
    language: "English Standard",
    price: "BDT 20,000",
    instructor: "Engr. Arifur Rahman (Electrical Engineer)",
    lessonsCount: 22,
    enrolledStudentsCount: 50,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "course-4",
    title: "Commercial Cook & Hospitality Culinary Arts",
    trade: "Commercial Cook",
    description: "Learn high-volume culinary techniques, food safety standards (HACCP), menu design, multi-cuisine specialties, and kitchen brigade management for global hotel groups.",
    duration: "3 Months (110 Hours)",
    seatsLeft: 6,
    countdownDays: 5,
    language: "English Standard",
    price: "BDT 16,500",
    instructor: "Chef Tareq Aziz (Executive Chef, Marriott Dhaka)",
    lessonsCount: 14,
    enrolledStudentsCount: 28,
    imageUrl: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "course-5",
    title: "HVAC Installation & Refrigeration Systems Technician",
    trade: "HVAC",
    description: "Thermodynamics fundamentals, commercial air conditioning installation, troubleshooting electrical components, refrigerant recovery, and ventilation design.",
    duration: "3 Months (130 Hours)",
    seatsLeft: 10,
    countdownDays: 11,
    language: "English Standard",
    price: "BDT 15,000",
    instructor: "Sohail Ahmed (HVAC Specialist)",
    lessonsCount: 16,
    enrolledStudentsCount: 22,
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80"
  }
];

export const LANGUAGE_COURSES: LanguageCourse[] = [
  {
    id: "lang-1",
    title: "Japanese NAT-TEST / JLPT N5 Intensive Course",
    language: "Japanese",
    level: "N5 (Beginner)",
    duration: "4 Months",
    price: "BDT 10,000",
    lessonsCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    description: "Learn Hiragana, Katakana, 100 essential Kanji, and 800 everyday vocabulary words. Specifically structured for Specified Skilled Worker (SSW) visa applicants."
  },
  {
    id: "lang-2",
    title: "German Goethe-Zertifikat A2 Prep Program",
    language: "German",
    level: "A2 (Elementary)",
    duration: "5 Months",
    price: "BDT 12,500",
    lessonsCount: 50,
    imageUrl: "https://images.unsplash.com/photo-1467269204594-96e101448641?auto=format&fit=crop&w=600&q=80",
    description: "Intensive training for vocational students (Ausbildung) aiming for Germany. Covers day-to-day work scenarios, administrative language, and basic grammar fluency."
  },
  {
    id: "lang-3",
    title: "Korean TOPIK I (Level 1-2) EPS-TOPIK Special",
    language: "Korean",
    level: "TOPIK Level 1-2",
    duration: "4 Months",
    price: "BDT 9,500",
    lessonsCount: 40,
    imageUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80",
    description: "Tailored specifically for Bangladesh EPS-TOPIK aspirants targetting manufacturing and shipbuilding sectors in South Korea. Covers Hangul, safety signs, and industry terms."
  },
  {
    id: "lang-4",
    title: "IELTS Vocational & Employment Special",
    language: "English",
    level: "Band 5.0 - 6.5",
    duration: "3 Months",
    price: "BDT 8,000",
    lessonsCount: 30,
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    description: "Comprehensive practice for listening, reading, writing, and speaking. Focuses on technical workspace terminology, accent understanding, and workplace briefings."
  }
];

export const COUNTRIES: CountryDetail[] = [
  {
    id: "country-japan",
    name: "Japan",
    code: "JP",
    flagUrl: "https://flagcdn.com/w160/jp.png",
    demandLevel: "Very High",
    avgSalary: "¥200,000 - ¥280,000 (Equivalent to BDT 150,000 - 210,000) / Month",
    workingHours: "40 Hours/Week (Typical 5 days, standard overtime rates apply)",
    visaPathways: [
      "Specified Skilled Worker (SSW-1): 5 Years legal stay, language & skill assessments required.",
      "Specified Skilled Worker (SSW-2): Unlimited renewals, family companionship, pathway to permanent residence.",
      "Technical Intern Training Program (TITP): 3 Years on-the-job vocational training."
    ],
    livingCost: "Moderate (Employer-subsidized dormitory accommodation usually available for ¥20,000 - ¥30,000/month)",
    languageRequirement: "Japanese Language N5 or NAT-TEST Level 5 required + Specified Skilled Worker evaluation test.",
    accommodation: "Dormitories are typically structured and pre-arranged by employers at highly subsidized rates.",
    food: "Hygienic local food, easily adjustable, halal ingredients and community markets accessible in larger towns.",
    weather: "Four beautiful distinct seasons. Warm summers and chilly winters with occasional snowfall.",
    workerRights: "Strictly protected. Equal pay for equal work as Japanese citizens, state labor insurance, and pension systems.",
    taxes: "Income tax (~5-10%), resident tax, and national social security insurance contributions deducted at source.",
    familyOptions: "Allowed under SSW-2 visa pathway. Families cannot be brought under SSW-1 or TITP training tracks.",
    permanentResidence: "Eligible after completing SSW-2 pathway or serving 10 continuous years in standard resident status.",
    officialLinks: [
      "Ministry of Foreign Affairs of Japan: mofaj.go.jp",
      "Japan Support Organization for SSW: ssw.otit.go.jp"
    ]
  },
  {
    id: "country-germany",
    name: "Germany",
    code: "DE",
    flagUrl: "https://flagcdn.com/w160/de.png",
    demandLevel: "High",
    avgSalary: "€2,400 - €3,400 (Equivalent to BDT 300,000 - 425,000) / Month",
    workingHours: "38 - 40 Hours/Week (Highly regulated, strict weekends and 25-30 days paid leaves)",
    visaPathways: [
      "German Skilled Immigration Act (Fachkräfteeinwanderungsgesetz): Direct employment for certified degree/trade holders.",
      "Ausbildung (Vocational Training Program): 3-Year dual system (learn & earn) with monthly stipend of €1,000 - €1,300."
    ],
    livingCost: "Higher (€700 - €900/month, shared apartments or student residences, subsidized transit passes)",
    languageRequirement: "German Language A2 for vocational training, B1 or B2 for direct professional employment.",
    accommodation: "Shared housing (WG) or studio apartments. Hard to secure independently, BIPLOB partners help pre-arrange.",
    food: "Diverse European food, wide availability of halal butchers and Turkish/Middle Eastern groceries in all urban centers.",
    weather: "Temperate seasonal climate. Warm summers and freezing winter months requiring proper building insulation.",
    workerRights: "World-class protection. Unlimited contracts, maternity leave, comprehensive free healthcare, and strong trade unions.",
    taxes: "Progessive taxation (Class 1-6, standard deductions for pension, medical insurance, unemployment total ~35%).",
    familyOptions: "Family reunion visas (spouse and children) are legally protected if living conditions and income standards are met.",
    permanentResidence: "Pathway to Settlement Permit (Niederlassungserlaubnis) after 3-5 years of continuous qualified employment.",
    officialLinks: [
      "Make it in Germany (Official Portal): make-it-in-germany.com",
      "German Federal Foreign Office: auswaertiges-amt.de"
    ]
  },
  {
    id: "country-korea",
    name: "South Korea",
    code: "KR",
    flagUrl: "https://flagcdn.com/w160/kr.png",
    demandLevel: "Very High",
    avgSalary: "₩2,200,000 - ₩3,000,000 (Equivalent to BDT 180,000 - 250,000) / Month",
    workingHours: "44 Hours/Week (Standard shift structures with high overtime availability in manufacturing)",
    visaPathways: [
      "EPS E-9 (Employment Permit System): Specialized manufacturing, construction, agriculture, and shipbuilding tracks.",
      "E-7-4 (Skilled Worker Visa): Point-based upgrade pathway from E-9 allowing long-term stay and family sponsorship."
    ],
    livingCost: "Moderate (Most manufacturing and shipbuilding companies provide free or deeply subsidized food and lodging)",
    languageRequirement: "Must pass the EPS-TOPIK Korean Language & Skill Exam conducted by BOESL (Bangladesh).",
    accommodation: "Company-provided standard industrial dormitories with high-speed internet and thermal flooring.",
    food: "Rich culinary options, rice-based meals. Halal foods are pre-packaged or sourced from specialized neighborhoods.",
    weather: "Four distinct seasons. Hot humid summers and very cold winters with heavy snowfall.",
    workerRights: "Strict Minimum Wage Compliance, mandatory National Health Insurance, Industrial Accident Compensation.",
    taxes: "Standard income tax (flat 3-6% for foreign workers) plus local national pension contributions.",
    familyOptions: "Not available under E-9 visa. Family sponsorship becomes fully accessible after upgrading to E-7-4 visa.",
    permanentResidence: "Accessible via advanced point system upgrades and passing social integration programs (KIIP).",
    officialLinks: [
      "EPS South Korea: eps.go.kr",
      "Bangladesh BOESL (Official Partner): boesl.gov.bd"
    ]
  },
  {
    id: "country-saudi",
    name: "Saudi Arabia",
    code: "SA",
    flagUrl: "https://flagcdn.com/w160/sa.png",
    demandLevel: "Stable",
    avgSalary: "SAR 2,000 - SAR 4,000 (Equivalent to BDT 60,000 - 120,000) / Month",
    workingHours: "48 Hours/Week (6 Days/week, resting schedules tailored around prayer times and summer heats)",
    visaPathways: [
      "Standard Work Visa (Sponsorship / Qiwa Portal): Requires verified employer contract and medical clearance.",
      "Professional Skills Pathway: Validated certifications via Qiwa Skill Verification exams."
    ],
    livingCost: "Low (Employers provide free shared accommodation, transit, and medical cards as mandated by law)",
    languageRequirement: "Basic English or Arabic is preferred. Certifications in trades are highly prioritized.",
    accommodation: "Employer-provided air-conditioned living quarters, kitchen facilities, and company transport vectors.",
    food: "Extremely comfortable for Bangladeshis. 100% Halal environment with abundant Bangladeshi shops, rice, and fish.",
    weather: "Arid desert climate with extremely hot summers reaching 45°C+ and mild winters.",
    workerRights: "Contracts managed digitally via Qiwa portal to safeguard salary deposits and job change permissions.",
    taxes: "Tax-free basic salary! No personal income tax is deducted. Nominal municipal and expatriate residency fees exist.",
    familyOptions: "Allowed for high-skilled technical/managerial trades. Standard labor/trade positions do not qualify for family visas.",
    permanentResidence: "Available only under Premium Residency schemes for highly exceptional talent or financial investment.",
    officialLinks: [
      "Saudi Qiwa Platform: qiwa.sa",
      "Saudi Ministry of Human Resources: hrsd.gov.sa"
    ]
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    studentName: "Mohammad Shahinur Islam",
    homeDistrict: "Bogura",
    country: "Japan",
    trade: "Specified Skilled Caregiver",
    salary: "¥235,000 (BDT ~180,000) / Month",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    quote: "BIPLOB changed my life. I went from driving an auto-rickshaw in Bogura to a certified caregiver in a state-of-the-art facility in Chiba. The N5 language class was the key!",
    achievement: "Completed Caregiver Trade course and Japanese NAT-TEST N5 in 6 months."
  },
  {
    id: "story-2",
    studentName: "Taslima Akter",
    homeDistrict: "Sylhet",
    country: "Germany",
    trade: "Hospitality Trainee (Ausbildung)",
    salary: "€1,150 (BDT ~140,000) Stipend / Month",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    quote: "With BIPLOB's German A2 program, I cracked my visa interview easily. Today I study culinary arts at a major hotel chain in Frankfurt, tuition-free and earning a salary!",
    achievement: "Enrolled in 3-year German Ausbildung program with full medical insurance."
  },
  {
    id: "story-3",
    studentName: "Engr. Rakibul Hasan",
    homeDistrict: "Cumilla",
    country: "South Korea",
    trade: "Shipbuilding Welder (E-9)",
    salary: "₩2,850,000 (BDT ~235,000) / Month",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    quote: "I passed the EPS skill and language exams with top marks thanks to BIPLOB's virtual weld testing and Korean TOPIK modules. My family is secure now.",
    achievement: "Working at Hyundai Heavy Industries, Ulsan, South Korea."
  }
];

export const JOBS: JobVacancy[] = [
  {
    id: "job-1",
    title: "Specified Skilled Elderly Caregiver",
    employerName: "Heisei Senior Care Association",
    country: "Japan",
    trade: "Caregiver",
    salary: "¥220,000 - ¥260,000 / month",
    experience: "No previous experience required (BIPLOB Certificate Accepted)",
    contractDuration: "5 Years (Renewable)",
    languageRequired: "Japanese N5 or NAT-TEST L5",
    accommodation: true,
    food: false,
    insurance: true,
    medical: true,
    overtime: true,
    status: "Open",
    postedDate: "2026-06-25"
  },
  {
    id: "job-2",
    title: "Structural Shipyard Welder (GTAW / GMAW)",
    employerName: "Daewoo Shipbuilding & Marine Engineering",
    country: "South Korea",
    trade: "Welder",
    salary: "₩2,600,000 - ₩3,200,000 / month",
    experience: "1 Year or Certified Trade Training",
    contractDuration: "3 Years",
    languageRequired: "Basic EPS-TOPIK Korean",
    accommodation: true,
    food: true,
    insurance: true,
    medical: true,
    overtime: true,
    status: "Open",
    postedDate: "2026-06-28"
  },
  {
    id: "job-3",
    title: "Industrial Plant Electrician",
    employerName: "Al-Taqwa Electrical & Engineering Contracting",
    country: "Saudi Arabia",
    trade: "Industrial Electrician",
    salary: "SAR 2,500 - SAR 3,500 / month",
    experience: "2 Years standard or BIPLOB Trade certified",
    contractDuration: "2 Years (Renewable)",
    languageRequired: "Basic English or Arabic",
    accommodation: true,
    food: true,
    insurance: true,
    medical: true,
    overtime: true,
    status: "Open",
    postedDate: "2026-06-29"
  },
  {
    id: "job-4",
    title: "Culinary Commis Chef / Commercial Cook",
    employerName: "Amari Hotel & Resort Frankfurt Group",
    country: "Germany",
    trade: "Commercial Cook",
    salary: "€2,200 - €2,700 / month",
    experience: "BIPLOB Culinary Graduate or 1 year exp",
    contractDuration: "Unlimited (Permanent Track)",
    languageRequired: "German A2 / B1 standard",
    accommodation: false,
    food: true,
    insurance: true,
    medical: true,
    overtime: false,
    status: "Open",
    postedDate: "2026-06-30"
  }
];

export const MOCK_LESSONS = [
  {
    id: "lesson-1",
    courseId: "course-1",
    title: "Lesson 1: Introduction to Elder Care & Resident Dignity",
    duration: "45 mins",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: "Dignity is a fundamental human right. In Japanese senior care (介護 - Kaigo), preserving self-reliance and honor is the core of healthcare support. Respect privacy during sanitation, bathing, and transfers.",
    assignment: "Write a 200-word essay on how you would comfort an elderly resident feeling homesick.",
    mcqs: [
      {
        question: "What is the primary core philosophy of Japanese geriatric care?",
        options: ["Complete physical dependence", "Preserving resident self-reliance & dignity", "Speed of service", "Isolating residents"],
        correctIndex: 1
      },
      {
        question: "What does the Japanese term 'Kaigo' mean?",
        options: ["Welding", "Engineering", "Nursing / Caregiving", "Cooking"],
        correctIndex: 2
      }
    ]
  },
  {
    id: "lesson-2",
    courseId: "course-1",
    title: "Lesson 2: Standard Patient Transfer & Lifting Safety",
    duration: "55 mins",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    notes: "Proper body mechanics are critical to prevent nurse back injury and resident falls. Keep your feet shoulder-width apart, bend your knees, hold the patient close to your body core, and lift using your legs.",
    assignment: "Submit a video demonstrating your understanding of safe body mechanics or write out the step-by-step transfer protocol.",
    mcqs: [
      {
        question: "Which muscle group should you use primarily when lifting a resident?",
        options: ["Lower back muscles", "Shoulder muscles", "Legs and gluteal muscles", "Arm muscles"],
        correctIndex: 2
      }
    ]
  },
  {
    id: "lesson-3",
    courseId: "course-2",
    title: "Lesson 1: Introduction to Shielded Metal Arc Welding (SMAW)",
    duration: "60 mins",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    notes: "SMAW, commonly known as stick welding, utilizes an electric arc between a flux-covered electrode and the weld pool. Safety requires a Grade-10 auto-darkening mask, fireproof leather gloves, and steel-toe boots.",
    assignment: "List the essential safety PPE required before launching any welding task.",
    mcqs: [
      {
        question: "What does the SMAW acronym represent?",
        options: ["Shielded Metal Arc Welding", "Standard Machine Auto Welding", "Steel Metal Alloy Welding", "Safe Manual Arc Welding"],
        correctIndex: 0
      }
    ]
  }
];

export const MOCK_CERTIFICATES: DigitalCertificate[] = [
  {
    id: "CERT-92813",
    studentName: "Mohammad Shahinur Islam",
    courseTitle: "Specified Skilled Worker: Professional Caregiver Trade Program",
    issueDate: "2026-05-15",
    trainerName: "Dr. Farhana Yasmin",
    status: "Verified",
    uniqueHash: "b6ca9828e10d29ab129f1234bda89b21"
  },
  {
    id: "CERT-31049",
    studentName: "Taslima Akter",
    courseTitle: "German Goethe-Zertifikat A2 Prep Program",
    issueDate: "2026-06-01",
    trainerName: "Dr. Farhana Yasmin",
    status: "Verified",
    uniqueHash: "cf81a29b02ef01cc01da287ef92bb831"
  }
];
