export type UserRole = "student" | "trainer" | "employer" | "partner" | "admin";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  skills?: string[];
  education?: string;
  experience?: string;
  passportStatus?: "Not Applied" | "Applied" | "Valid Passport";
  preferredDestination?: string;
  budgetBDT?: number;
  languages?: {
    english?: string;
    japanese?: string;
    korean?: string;
    german?: string;
    arabic?: string;
  };
  eligibilityScore?: number; // Calculated out of 100
}

export interface TradeCourse {
  id: string;
  title: string;
  trade: string;
  description: string;
  duration: string;
  seatsLeft: number;
  countdownDays: number;
  language: string;
  price: string;
  instructor: string;
  lessonsCount: number;
  enrolledStudentsCount: number;
  imageUrl: string;
}

export interface LanguageCourse {
  id: string;
  title: string;
  language: string;
  level: string;
  duration: string;
  price: string;
  lessonsCount: number;
  imageUrl: string;
  description: string;
}

export interface CountryDetail {
  id: string;
  name: string;
  code: string; // ISO code or short code
  flagUrl: string;
  demandLevel: "Very High" | "High" | "Medium" | "Stable";
  avgSalary: string;
  workingHours: string;
  visaPathways: string[];
  livingCost: string;
  languageRequirement: string;
  accommodation: string;
  food: string;
  weather: string;
  workerRights: string;
  taxes: string;
  familyOptions: string;
  permanentResidence: string;
  officialLinks: string[];
}

export interface SuccessStory {
  id: string;
  studentName: string;
  homeDistrict: string;
  country: string;
  trade: string;
  salary: string;
  photoUrl: string;
  videoUrl?: string;
  quote: string;
  achievement: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  employerName: string;
  country: string;
  trade: string;
  salary: string;
  experience: string;
  contractDuration: string;
  languageRequired: string;
  accommodation: boolean;
  food: boolean;
  insurance: boolean;
  medical: boolean;
  overtime: boolean;
  status: "Open" | "Interviewing" | "Filled";
  postedDate: string;
}

export interface DigitalCertificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  trainerName: string;
  status: "Verified" | "Pending" | "Expired";
  uniqueHash: string; // Used for QR code verification
}

export interface AssessmentProfile {
  age: number;
  gender: string;
  education: string;
  experience: string;
  passportStatus: string;
  trade: string;
  englishLevel: string;
  japaneseLevel: string;
  koreanLevel: string;
  germanLevel: string;
  preferredDestination: string;
  budgetBDT: string;
}

export interface AssessmentResult {
  suitableOccupations: string[];
  recommendedCountries: Array<{
    name: string;
    demandLevel: string;
    averageSalary: string;
  }>;
  trainingRecommendation: string;
  languageRoadmap: Array<{
    language: string;
    levelRequired: string;
    timeline: string;
    focus: string;
  }>;
  budgetAnalysis: {
    trainingFees: string;
    languageCourseFees: string;
    examAndCertification: string;
    estimatedVisaAirfare: string;
    totalEstimatedBudget: string;
    tips: string;
  };
  estimatedTimelineMonths: number;
  preparationChecklist: Array<{
    step: string;
    duration: string;
    status: string;
  }>;
  disclaimer: string;
}
