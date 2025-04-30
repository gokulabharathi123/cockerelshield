
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Vulnerability {
  id: string;
  name: string;
  category: OwaspCategory;
  description: string;
  riskLevel: RiskLevel;
  affectedUrls?: string[];
  remediation: string;
  details?: string;
  cwe?: string;
}

export type OwaspCategory = 
  | 'Broken Access Control'
  | 'Cryptographic Failures'
  | 'Injection'
  | 'Insecure Design'
  | 'Security Misconfiguration'
  | 'Vulnerable Components'
  | 'Auth Failures'
  | 'Software/Data Integrity Failures'
  | 'Logging Failures'
  | 'SSRF';

export interface ScanResult {
  url: string;
  scanDate: Date;
  vulnerabilities: Vulnerability[];
  summary: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  status: 'complete' | 'in-progress' | 'error';
  scanDuration?: number;
}
