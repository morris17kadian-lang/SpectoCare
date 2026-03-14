export type UserRole = 'parent' | 'teacher' | 'caregiver';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  dateOfBirth: string;  // ISO date string
  gender: 'male' | 'female' | 'other';
  condition?: string;
  notes?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Routine {
  id: string;
  childId: string;
  parentId: string;
  title: string;
  time: string;  // HH:mm
  notes?: string;
  daysOfWeek: number[];  // 0=Sun … 6=Sat
  createdAt: Date;
}

export interface BehaviorLog {
  id: string;
  childId: string;
  parentId: string;
  date: string;         // ISO date
  behaviorType: string;
  notes?: string;
  severity: 1 | 2 | 3 | 4 | 5;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  childId: string;
  parentId: string;
  date: string;         // ISO date
  note: string;
  mood?: 'great' | 'good' | 'neutral' | 'hard' | 'very_hard';
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  likesCount: number;
  commentCount: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  city: string;
  phone: string;
  email?: string;
  website?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
}

export type FacilityType =
  | 'Psychologist'
  | 'Speech Therapist'
  | 'Pediatrician'
  | 'Occupational Therapist'
  | 'Special Education School'
  | 'Autism Center';

export interface Symptom {
  id: string;
  label: string;
  description: string;
  category: SymptomCategory;
  relatedConditions: string[];
  suggestedFacilityTypes: FacilityType[];
}

export type SymptomCategory =
  | 'Communication'
  | 'Behavior'
  | 'Social'
  | 'Sensory'
  | 'Cognitive'
  | 'Motor';

export interface SymptomCheckResult {
  possibleConditions: PossibleCondition[];
  suggestedFacilityTypes: FacilityType[];
}

export interface PossibleCondition {
  name: string;
  description: string;
  matchCount: number;
  severity: 'low' | 'moderate' | 'high';
}
