
import { supabase } from "@/integrations/supabase/client";
import { ScanResult, Vulnerability } from "@/types/security";
import { generateMockScanResult } from "@/data/mockVulnerabilities";

// Start a new scan
export async function startScan(url: string): Promise<string> {
  try {
    // Insert a new scan record with "in-progress" status
    const { data, error } = await supabase
      .from("scan_results")
      .insert({
        url: url,
        status: "in-progress",
        summary: { total: 0, high: 0, medium: 0, low: 0 }
      })
      .select()
      .single();

    if (error) {
      console.error("Error starting scan:", error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error("Failed to start scan:", error);
    throw error;
  }
}

// Simulate the scan process and update the database with results
export async function processScan(scanId: string, url: string): Promise<void> {
  try {
    // For now, we'll use our mock data generator
    // In a real application, this would be replaced with actual scanning logic
    const mockResult = generateMockScanResult(url);
    
    // Calculate the scan duration (simulated)
    const scanDuration = Math.floor(Math.random() * 10) + 5; // 5-15 seconds
    
    // Update the scan result with the completed status and summary
    const { error: updateError } = await supabase
      .from("scan_results")
      .update({
        status: "complete" as const,
        scan_duration: scanDuration,
        summary: mockResult.summary
      })
      .eq("id", scanId);
    
    if (updateError) {
      console.error("Error updating scan result:", updateError);
      throw updateError;
    }
    
    // Insert all vulnerabilities
    if (mockResult.vulnerabilities.length > 0) {
      const vulnerabilityRows = mockResult.vulnerabilities.map(vuln => ({
        scan_id: scanId,
        name: vuln.name,
        category: vuln.category,
        description: vuln.description,
        risk_level: vuln.riskLevel,
        affected_urls: vuln.affectedUrls || [],
        remediation: vuln.remediation,
        details: vuln.details || null,
        cwe: vuln.cwe || null,
      }));
      
      const { error: vulnError } = await supabase
        .from("vulnerabilities")
        .insert(vulnerabilityRows);
      
      if (vulnError) {
        console.error("Error inserting vulnerabilities:", vulnError);
        throw vulnError;
      }
    }
  } catch (error) {
    console.error("Failed to process scan:", error);
    
    // Update scan status to error if something went wrong
    await supabase
      .from("scan_results")
      .update({ status: "error" as const })
      .eq("id", scanId);
      
    throw error;
  }
}

// Get a scan result by ID
export async function getScanResult(scanId: string): Promise<ScanResult | null> {
  try {
    // Get the scan result
    const { data: scanData, error: scanError } = await supabase
      .from("scan_results")
      .select("*")
      .eq("id", scanId)
      .single();
    
    if (scanError) {
      console.error("Error fetching scan result:", scanError);
      return null;
    }
    
    // Get vulnerabilities for this scan
    const { data: vulnData, error: vulnError } = await supabase
      .from("vulnerabilities")
      .select("*")
      .eq("scan_id", scanId);
    
    if (vulnError) {
      console.error("Error fetching vulnerabilities:", vulnError);
      return null;
    }
    
    // Map database vulnerabilities to our application model
    const vulnerabilities: Vulnerability[] = vulnData.map(vuln => ({
      id: vuln.id,
      name: vuln.name,
      category: vuln.category as any,
      description: vuln.description,
      riskLevel: vuln.risk_level as "low" | "medium" | "high",
      affectedUrls: vuln.affected_urls as string[] | undefined,
      remediation: vuln.remediation,
      details: vuln.details || undefined,
      cwe: vuln.cwe || undefined
    }));
    
    // Parse the summary properly to ensure it matches our expected type
    let summary = { total: 0, high: 0, medium: 0, low: 0 };
    if (scanData.summary && typeof scanData.summary === 'object') {
      summary = {
        total: Number(scanData.summary.total) || 0,
        high: Number(scanData.summary.high) || 0,
        medium: Number(scanData.summary.medium) || 0,
        low: Number(scanData.summary.low) || 0
      };
    }
    
    // Return the combined result
    return {
      url: scanData.url,
      scanDate: new Date(scanData.scan_date),
      vulnerabilities,
      summary,
      status: scanData.status as "complete" | "in-progress" | "error",
      scanDuration: scanData.scan_duration
    };
  } catch (error) {
    console.error("Failed to get scan result:", error);
    return null;
  }
}
