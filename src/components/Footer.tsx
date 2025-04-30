
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-6 mt-auto">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-security-accent" />
            <span className="text-sm text-gray-400">
              Cockerel Shield | OWASP Top 10 Scanner
            </span>
          </div>
          <div className="text-sm text-gray-500">
            For educational purposes only. © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
