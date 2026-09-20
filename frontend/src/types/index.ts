export type UserRole = 'CITIZEN' | 'DEPARTMENT_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  profileImageUrl?: string;
  role: UserRole;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface Department {
  id: string;
  name: string;
  email: string;
  description: string;
  totalCount: number;
  solvedCount: number;
  pendingCount: number;
}

export type ComplaintStatus = 'REGISTERED' | 'VISITED' | 'ACTION_IN_PROGRESS' | 'RESOLVED';

export interface Feedback {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  address: string;
  pincode: string;
  description: string;
  images: string[];
  status: ComplaintStatus;
  upvotes: number;
  reposts: number;
  reports?: number;
  postedDate: string;
  resolvedDate?: string;
  redirectedAt?: string;
  redirectedFromDeptName?: string;
  userUpvoted?: boolean;
  userReposted?: boolean;
  userReported?: boolean;
  feedback?: Feedback;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  grantLevel: 'Super Admin' | 'Department Admin' | 'Moderator';
  createdAt: string;
}

export interface GeminiMatchResult {
  hasDuplicate: boolean;
  matchedComplaint?: Complaint;
  similarityScore: number;
  reasoning: string;
}

export interface FilterState {
  pincode: string;
  departmentId: string;
  status: string;
  dateRange: string;
  searchQuery: string;
}
