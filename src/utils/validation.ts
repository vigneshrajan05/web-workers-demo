/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Customer, ValidationResult, AnalysisResult, RiskData } from '../types/Customer';

export const validateCustomer = (customer: any): ValidationResult => {
  const errors: string[] = [];

  if (!customer.id || typeof customer.id !== 'string') {
    errors.push('Missing or invalid id');
  }

  if (!customer.name || typeof customer.name !== 'string') {
    errors.push('Missing or invalid name');
  }

  if (!customer.email || typeof customer.email !== 'string') {
    errors.push('Missing or invalid email');
  } else if (!isValidEmail(customer.email)) {
    errors.push('Invalid email format');
  }

  if (!customer.country || typeof customer.country !== 'string') {
    errors.push('Missing or invalid country');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function analyzeRiskScore(record: Customer): RiskData {
  let score = 1;

  // Account balance: higher balance, higher risk
  const balance = parseInt(record.accountBalance, 10);
  if (balance < 500000) score += 5;
  else if (balance < 300000) score += 2;
  else if (balance < 100000) score += 1;

  score += Math.round(parseFloat(record.suspiciousActivityScore) * 100);
  if (record.hasPreviousFraud) score += 30;
  if (record.locationMismatch) score += 10;
  if (!record.isAccountVerified) score += 10;

  score = Math.max(1, Math.min(100, score));

  let riskCategory = 'Low';
  if (score >= 67) riskCategory = 'High';
  else if (score >= 34) riskCategory = 'Medium';

  return { riskScore: score, riskCategory };
}

export const analyzeCustomerData = (data: any[]): AnalysisResult => {
  const validCustomers: Customer[] = [];

  // Validate each record
  data.forEach((record) => {
    const riskAnalysis = analyzeRiskScore(record)
    record = {
      ...record,
      name: `${record.firstName} ${record.lastName}`,
      riskScore: riskAnalysis.riskScore,
      riskCategory: riskAnalysis.riskCategory
    };
    const validation = validateCustomer(record);
    if (validation.isValid) {
      validCustomers.push(record as Customer);
    }
  });

  const invalidRecords = data.length - validCustomers.length;

  // Count countries
  const countryCounts: { [key: string]: number } = {};
  validCustomers.forEach(customer => {
    countryCounts[customer.country] = (countryCounts[customer.country] || 0) + 1;
  });

  // Get top 5 countries
  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalRecords: data.length,
    validRecords: validCustomers.length,
    invalidRecords,
    topCountries,
    customers: validCustomers
  };
}; 