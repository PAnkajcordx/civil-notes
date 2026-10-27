export interface BTECUnit {
  id: string;
  unitNumber: number | string;
  level: string; // e.g., 'Level 3', 'Level 4', 'Level 5'
  levelType: 'Mandatory Unit' | 'Core Unit' | 'HNC Mandatory' | 'HND Specialist' | 'Optional Specialist';
  tag: string; // e.g., 'Pearson Spec Aligned', 'Assignment Guidance', 'Coursework Template', 'CDM 2015 Regs', 'Calculus & Matrices', 'Lab & Field Tests'
  title: string;
  description: string;
  unitCodeTag: string; // e.g., 'Unit 1 • L3', 'Unit 2 - L3', 'Unit 29 • HND', 'Unit 30 • HNC'
  badgeType: 'blue' | 'green' | 'amber' | 'purple' | 'indigo' | 'orange';
  exemplarStatus: 'Distinction Exemplar Attached' | 'Full Unit Pack' | 'Assignment Guidance';
  category: 'Construction Principles' | 'Construction Tech' | 'Structural & Design' | 'Site & Surveying' | 'Geotechnics & Math';
  credits: number;
  guidedLearningHours: number;
  specificationCode: string;
  previewContent: {
    overview: string;
    learningOutcomes: string[];
    gradingCriteria: {
      pass: string;
      merit: string;
      distinction: string;
    };
    sampleCalculations: string[];
    standardCodes: string[];
  };
}

export interface PYQResource {
  id: string;
  title: string;
  category: string;
  questionsCount: number;
  yearRange: string;
}

export interface CourseworkToolkit {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  unitsIncluded: string;
}

export interface SubjectDirectory {
  id: string;
  name: string;
  iconName: string;
  unitsCount: number;
  topics: string[];
  keyFormulas: string[];
  notesAvailable: number;
}

export interface CommunityDiscussion {
  id: string;
  author: string;
  avatar: string;
  unitTag: string;
  title: string;
  excerpt: string;
  replies: number;
  views: number;
  timeAgo: string;
  verifiedByTutor?: boolean;
}

export interface CivilVideo {
  id: string;
  title: string;
  unitCodeTag: string;
  duration: string;
  quality: string;
  fileSize: string;
  tutorName: string;
  description: string;
  priceINR: number; // e.g. 49
  thumbnailColor: string;
  topicsCovered: string[];
  sampleVideoUrl?: string;
}

export interface PaymentTransaction {
  txnId: string;
  videoId: string;
  videoTitle: string;
  amountINR: number;
  method: 'upi' | 'card' | 'netbanking';
  upiApp?: string;
  upiId?: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}
