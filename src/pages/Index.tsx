
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import UrlScanner from "@/components/UrlScanner";
import ScanningAnimation from "@/components/ScanningAnimation";
import ScanResultView from "@/components/ScanResultView";
import Footer from "@/components/Footer";
import { ScanResult } from "@/types/security";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { startScan, processScan, getScanResult } from "@/services/scanService";

enum ScanState {
  IDLE,
  SCANNING,
  COMPLETED
}

const Index = () => {
  const [scanState, setScanState] = useState<ScanState>(ScanState.IDLE);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  // Handle the scan process
  const handleStartScan = async (url: string) => {
    try {
      setCurrentUrl(url);
      setScanState(ScanState.SCANNING);
      setScanProgress(0);
      
      // Reset any previous results
      setScanResult(null);
      
      // Create a new scan in the database
      const scanId = await startScan(url);
      setCurrentScanId(scanId);
      
      // Show a toast notification
      toast("Scan initiated", {
        description: `Starting security scan for ${url}`,
        icon: <Shield className="h-4 w-4 text-security-accent" />
      });
    } catch (error) {
      console.error("Failed to start scan:", error);
      toast.error("Failed to start scan", {
        description: "There was a problem starting the scan. Please try again."
      });
      setScanState(ScanState.IDLE);
    }
  };

  // Effect to simulate the scanning process
  useEffect(() => {
    if (scanState !== ScanState.SCANNING || !currentScanId) return;
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 2;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Process the scan and get real results
          processScan(currentScanId, currentUrl)
            .then(() => getScanResult(currentScanId))
            .then(result => {
              if (result) {
                setScanResult(result);
                setScanState(ScanState.COMPLETED);
                
                // Show completion toast
                toast.success("Scan completed", {
                  description: `Found ${result.summary.total} vulnerabilities`,
                  icon: <Shield className="h-4 w-4 text-security-accent" />
                });
              } else {
                throw new Error("No scan result returned");
              }
            })
            .catch(error => {
              console.error("Error processing scan:", error);
              toast.error("Scan failed", {
                description: "There was a problem completing the scan."
              });
              setScanState(ScanState.IDLE);
            });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [scanState, currentUrl, currentScanId]);

  // Handle starting a new scan
  const handleScanAgain = () => {
    setScanState(ScanState.IDLE);
    setCurrentUrl("");
    setScanResult(null);
    setCurrentScanId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />
      
      <main className="container flex-grow py-8">
        {scanState === ScanState.IDLE && (
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              OWASP Top 10 Vulnerability Scanner
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              AI-powered security scanning for small websites
            </p>
          </div>
        )}
        
        {scanState === ScanState.IDLE && (
          <UrlScanner onStartScan={handleStartScan} isScanning={false} />
        )}
        
        {scanState === ScanState.SCANNING && (
          <ScanningAnimation url={currentUrl} progress={scanProgress} />
        )}
        
        {scanState === ScanState.COMPLETED && scanResult && (
          <ScanResultView scanResult={scanResult} onScanAgain={handleScanAgain} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
