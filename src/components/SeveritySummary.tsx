
import { ScanResult } from "@/types/security";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface SeveritySummaryProps {
  scanResult: ScanResult;
}

export default function SeveritySummary({ scanResult }: SeveritySummaryProps) {
  const { summary } = scanResult;
  
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[120px] bg-security-dark border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Total Issues</span>
          <span className="font-semibold text-xl">{summary.total}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span className="text-xs">Scan completed</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-[120px] bg-security-high/10 border border-security-high/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">High Risk</span>
          <span className="font-semibold text-xl text-security-high">{summary.high}</span>
        </div>
        <div className="flex items-center text-security-high">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Critical attention needed</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-[120px] bg-security-medium/10 border border-security-medium/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Medium Risk</span>
          <span className="font-semibold text-xl text-security-medium">{summary.medium}</span>
        </div>
        <div className="flex items-center text-security-medium">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span className="text-xs">Important to fix</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-[120px] bg-security-low/10 border border-security-low/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Low Risk</span>
          <span className="font-semibold text-xl text-security-low">{summary.low}</span>
        </div>
        <div className="flex items-center text-security-low">
          <Info className="h-4 w-4 mr-1" />
          <span className="text-xs">Should be addressed</span>
        </div>
      </div>
    </div>
  );
}
