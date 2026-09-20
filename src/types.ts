export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'MERN Stack' | 'Frontend' | 'JavaScript';
  stack: string[];
  description: string;
  highlights: string[];
  githubUrl: string;
  liveSimType: 'library' | 'ecommerce' | 'banking';
  color: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  score: string;
  current?: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  badgeType: string;
  skillsCovered: string[];
}

export interface SkillCategory {
  title: string;
  items: { name: string; level?: 'Advanced' | 'Proficient' | 'Familiar'; icon?: string }[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  issuedTo?: string;
  issuedDate?: string;
  dueDate?: string;
}

export interface TransactionRecord {
  id: string;
  bookTitle: string;
  userName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'Issued' | 'Returned' | 'Overdue';
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  recipient?: string;
}
