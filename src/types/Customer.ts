export interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  accountBalance: string;
  suspiciousActivityScore: string;
  hasPreviousFraud: boolean;
  locationMismatch: boolean;
  isAccountVerified: boolean;
  riskScore: number;
  riskCategory: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AnalysisResult {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  topCountries: Array<{ country: string; count: number }>;
  customers: Customer[];
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface RiskData {
  riskScore: number;
  riskCategory: string;
}