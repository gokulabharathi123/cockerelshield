
import { Shield, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface ScanningAnimationProps {
  url: string;
  progress: number;
}

export default function ScanningAnimation({ url, progress }: ScanningAnimationProps) {
  const [currentCheck, setCurrentCheck] = useState("");
  const checks = [
    "Checking for Broken Access Control",
    "Analyzing Cryptographic Implementation",
    "Scanning for Injection Vulnerabilities",
    "Evaluating Design Practices",
    "Inspecting Security Configuration",
    "Auditing Components and Dependencies",
    "Verifying Authentication Mechanisms",
    "Checking Software and Data Integrity",
    "Analyzing Logging and Monitoring",
    "Scanning for Server-Side Request Forgery"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCheck = checks[Math.floor(Math.random() * checks.length)];
      setCurrentCheck(randomCheck);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 p-6 rounded-lg bg-security-dark border border-gray-700 relative overflow-hidden">
      {/* Scanning effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 opacity-30 pointer-events-none" />
      <div className="absolute left-0 right-0 h-[1px] bg-cyan-400/30 animate-scan-line" />
      
      <div className="flex flex-col items-center justify-center space-y-4 py-8 relative z-10">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border border-cyan-500/30 mb-2">
          <Shield className="h-10 w-10 text-security-accent animate-pulse-glow" />
        </div>
        
        <h2 className="text-xl font-semibold text-center">
          Scanning {url}
        </h2>
        
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{currentCheck}</span>
        </div>
        
        <div className="w-full max-w-md space-y-1">
          <Progress value={progress} className="h-2 bg-gray-800" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Testing OWASP Top 10 vulnerabilities</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
