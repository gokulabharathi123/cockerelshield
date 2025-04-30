
import { OwaspCategory, Vulnerability } from "@/types/security";

// Mapping of OWASP categories to their numbers
const owaspCategories: Record<OwaspCategory, number> = {
  'Broken Access Control': 1,
  'Cryptographic Failures': 2,
  'Injection': 3,
  'Insecure Design': 4,
  'Security Misconfiguration': 5,
  'Vulnerable Components': 6,
  'Auth Failures': 7,
  'Software/Data Integrity Failures': 8,
  'Logging Failures': 9,
  'SSRF': 10
};

export const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-001',
    name: 'Missing HTTP Strict Transport Security',
    category: 'Cryptographic Failures',
    description: 'The application does not use HTTP Strict Transport Security (HSTS) to enforce HTTPS connections.',
    riskLevel: 'medium',
    remediation: 'Implement HTTP Strict Transport Security (HSTS) by setting the "Strict-Transport-Security" header.',
    details: 'HSTS instructs browsers to only use HTTPS for future connections to your domain, protecting against protocol downgrade attacks.',
    cwe: 'CWE-319'
  },
  {
    id: 'vuln-002',
    name: 'Cross-Site Scripting (XSS) Vulnerability',
    category: 'Injection',
    description: 'The application is vulnerable to Cross-Site Scripting attacks in the search functionality.',
    riskLevel: 'high',
    affectedUrls: ['/search', '/products'],
    remediation: 'Implement proper output encoding and input validation. Use modern frameworks with built-in XSS protection.',
    details: 'XSS attacks allow attackers to inject malicious scripts that execute in users\' browsers, potentially stealing session tokens or sensitive data.',
    cwe: 'CWE-79'
  },
  {
    id: 'vuln-003',
    name: 'Outdated jQuery Library',
    category: 'Vulnerable Components',
    description: 'The application uses an outdated jQuery library (version 1.8.3) with known security vulnerabilities.',
    riskLevel: 'medium',
    remediation: 'Update jQuery to the latest version (3.6.0 or newer).',
    details: 'Older versions of jQuery contain vulnerabilities that could allow attackers to execute arbitrary code or perform XSS attacks.',
    cwe: 'CWE-1035'
  },
  {
    id: 'vuln-004',
    name: 'Missing Content Security Policy',
    category: 'Security Misconfiguration',
    description: 'The application does not implement a Content Security Policy (CSP).',
    riskLevel: 'medium',
    remediation: 'Implement a Content Security Policy by setting the "Content-Security-Policy" header.',
    details: 'A CSP helps prevent XSS attacks by specifying which dynamic resources are allowed to load.',
    cwe: 'CWE-1021'
  },
  {
    id: 'vuln-005',
    name: 'Insecure Cross-Origin Resource Sharing (CORS)',
    category: 'Broken Access Control',
    description: 'The application\'s CORS policy allows requests from any origin.',
    riskLevel: 'high',
    remediation: 'Configure CORS headers to allow only trusted domains.',
    details: 'Overly permissive CORS policies can allow unauthorized websites to access sensitive data.',
    cwe: 'CWE-942'
  },
  {
    id: 'vuln-006',
    name: 'Insecure Cookie Configuration',
    category: 'Auth Failures',
    description: 'Session cookies are missing the Secure and HttpOnly flags.',
    riskLevel: 'medium',
    remediation: 'Set the Secure and HttpOnly flags on all cookies containing sensitive data.',
    details: 'Without these flags, cookies can be accessed by client-side scripts or transmitted over unencrypted connections.',
    cwe: 'CWE-614'
  },
  {
    id: 'vuln-007',
    name: 'Exposed .git Directory',
    category: 'Security Misconfiguration',
    description: 'The application\'s .git directory is publicly accessible.',
    riskLevel: 'high',
    affectedUrls: ['/.git/'],
    remediation: 'Configure your web server to deny access to .git and other version control directories.',
    details: 'Exposed version control directories can leak source code and sensitive configuration information.',
    cwe: 'CWE-552'
  },
  {
    id: 'vuln-008',
    name: 'Missing Rate Limiting',
    category: 'Insecure Design',
    description: 'The login endpoint does not implement rate limiting, making it vulnerable to brute force attacks.',
    riskLevel: 'medium',
    affectedUrls: ['/login', '/api/auth'],
    remediation: 'Implement rate limiting on authentication endpoints to prevent brute force attacks.',
    details: 'Without rate limiting, attackers can make unlimited login attempts to guess user credentials.',
    cwe: 'CWE-307'
  },
  {
    id: 'vuln-009',
    name: 'Server Information Leakage',
    category: 'Security Misconfiguration',
    description: 'HTTP response headers reveal detailed server information.',
    riskLevel: 'low',
    remediation: 'Configure your web server to suppress or modify the Server and X-Powered-By headers.',
    details: 'Detailed version information helps attackers identify specific vulnerabilities in your server software.',
    cwe: 'CWE-200'
  },
  {
    id: 'vuln-010',
    name: 'Insecure Deserialization',
    category: 'Software/Data Integrity Failures',
    description: 'The application deserializes untrusted data without validation.',
    riskLevel: 'high',
    affectedUrls: ['/api/data'],
    remediation: 'Implement integrity checks and never deserialize data from untrusted sources without validation.',
    details: 'Insecure deserialization can lead to remote code execution, one of the most severe vulnerabilities.',
    cwe: 'CWE-502'
  }
];

// Helper function to generate mock scan results
export const generateMockScanResult = (url: string) => {
  // Randomly select between 3-7 vulnerabilities
  const count = Math.floor(Math.random() * 5) + 3;
  const selectedVulns = [...mockVulnerabilities]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  // Count vulnerabilities by risk level
  const highCount = selectedVulns.filter(v => v.riskLevel === 'high').length;
  const mediumCount = selectedVulns.filter(v => v.riskLevel === 'medium').length;
  const lowCount = selectedVulns.filter(v => v.riskLevel === 'low').length;
  
  return {
    url,
    scanDate: new Date(),
    vulnerabilities: selectedVulns,
    summary: {
      total: selectedVulns.length,
      high: highCount,
      medium: mediumCount,
      low: lowCount
    },
    status: 'complete',
    scanDuration: Math.floor(Math.random() * 5) + 3 // 3-8 seconds
  };
};
