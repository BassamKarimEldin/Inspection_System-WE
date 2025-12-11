
export enum UserRole {
  ADMIN = 'admin',
  INSPECTOR = 'inspector'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  password?: string; // Added for mock auth persistence
}

export interface Center {
  id: string;
  name: string;
  code: string;
  governorate: string;
  status: 'active' | 'inactive';
  lat: number;
  lng: number;
  supportedTypes: ('TDM' | 'FTTH')[]; // Added to track center capabilities
}

// Matches the detailed Excel structure for TDM inventory
export interface TDMInventoryItem {
  id: string;
  sector: string;
  region: string;
  mainExchange: string;
  subExchange: string;
  exchangeCode: string;
  msanCode: string;
  cabinetNumber: string;
  boxNumber: string;
  visitStatus?: string; // Added to track inspection status (Done/Pending) for Dashboard
}

// Matches the detailed Excel structure for FTTH inventory
export interface FTTHInventoryItem {
  id: string;
  sector: string;
  region: string;
  mainExchange: string;
  subExchange: string;
  exchangeCode: string;
  msanCode: string;
  passiveCabinet: string;
  boxCapacity: string;
  boxNumber: string;
  visitStatus: string;
}

export interface Inspection {
  id: string;
  type: 'TDM' | 'FTTH_CABINET' | 'FTTH_BOX';
  centerId: string;
  inspectorId: string;
  date: string;
  status: 'submitted' | 'pending';
  data: Record<string, any>; // Dynamic fields based on Excel
}

export interface LoginEvent {
  id: string;
  userId: string;
  userName: string; // Denormalized for display
  userRole: UserRole; // Denormalized for display
  timestamp: string;
  lat: number | null;
  lng: number | null;
  address?: string; // Added for exact location display
  status: 'provided' | 'denied';
}

export interface DashboardStats {
  totalInspections: number;
  activeCenters: number;
  activeInspectors: number;
  pendingReviews: number;
}
