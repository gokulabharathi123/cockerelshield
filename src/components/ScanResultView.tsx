
import { useState } from "react";
import { ScanResult, Vulnerability } from "@/types/security";
import SeveritySummary from "@/components/SeveritySummary";
import VulnerabilityCard from "@/components/VulnerabilityCard";
import VulnerabilityDetail from "@/components/VulnerabilityDetail";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface ScanResultViewProps {
  scanResult: ScanResult;
  onScanAgain: () => void;
}

export default function ScanResultView({ scanResult, onScanAgain }: ScanResultViewProps) {
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  
  const handleVulnerabilityClick = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
  };
  
  const handleExportResults = () => {
    // Create a JSON blob
    const dataStr = JSON.stringify(scanResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `security-scan-${scanResult.url.replace(/https?:\/\//i, "").replace(/\//g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-security-dark border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Scan Results</h2>
            <p className="text-gray-400">
              {new Date(scanResult.scanDate).toLocaleString()} • Completed in {scanResult.scanDuration}s
            </p>
            <p className="text-xl mt-2">
              <span className="text-gray-300">URL:</span> <span className="text-security-accent">{scanResult.url}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
              onClick={handleExportResults}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-security-accent hover:bg-cyan-600"
              onClick={onScanAgain}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </div>
        </div>
        
        <SeveritySummary scanResult={scanResult} />
      </div>
      
      <h3 className="text-xl font-semibold mb-4">OWASP Top 10 Vulnerabilities: {scanResult.vulnerabilities.length} Found</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {scanResult.vulnerabilities.map((vulnerability) => (
          <VulnerabilityCard 
            key={vulnerability.id}
            vulnerability={vulnerability}
            onClick={handleVulnerabilityClick}
          />
        ))}
      </div>
      
      {selectedVulnerability && (
        <VulnerabilityDetail
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
        />
      )}
    </div>
  );
}
