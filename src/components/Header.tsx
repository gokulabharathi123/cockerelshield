
import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-800 py-4">
      <div className="container flex items-center gap-2">
        <Shield className="h-8 w-8 text-security-accent" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Web Guardian Shield
          </h1>
          <p className="text-sm text-gray-400">
            OWASP Top 10 Vulnerability Scanner
          </p>
        </div>
      </div>
    </header>
  );
}
