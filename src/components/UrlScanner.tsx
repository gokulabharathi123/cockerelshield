
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Shield } from "lucide-react";

interface UrlScannerProps {
  onStartScan: (url: string) => void;
  isScanning: boolean;
}

export default function UrlScanner({ onStartScan, isScanning }: UrlScannerProps) {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (input: string): boolean => {
    // Very basic URL validation
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a URL to scan");
      return;
    }
    
    // Add http:// if missing
    let urlToScan = url;
    if (!/^https?:\/\//i.test(url)) {
      urlToScan = "http://" + url;
    }
    
    if (!validateUrl(urlToScan)) {
      setIsValidUrl(false);
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsValidUrl(true);
    onStartScan(urlToScan);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 p-6 rounded-lg bg-security-dark border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-security-accent" />
        Start Website Security Scan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm text-gray-300">
            Enter website URL to scan
          </label>
          <Input
            id="url"
            type="text"
            placeholder="example.com or https://example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (!isValidUrl) setIsValidUrl(true);
            }}
            className={`bg-gray-900 border-gray-700 text-white ${!isValidUrl ? "border-security-high" : ""}`}
          />
          {!isValidUrl && (
            <p className="text-security-high text-sm">
              Please enter a valid URL
            </p>
          )}
        </div>
        <Button 
          type="submit" 
          className="bg-security-accent hover:bg-cyan-600 text-white"
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <Shield className="mr-2 h-4 w-4 animate-pulse" />
              Scanning...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Security Scan
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
