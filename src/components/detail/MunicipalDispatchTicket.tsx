import React, { useRef } from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ShieldAlert, 
  FileJson,
  Building2 
} from "lucide-react";
import { CivicIssue } from "../../types";

interface MunicipalDispatchTicketProps {
  issue: CivicIssue;
}

export default function MunicipalDispatchTicket({ issue }: MunicipalDispatchTicketProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (!printContent) return;

    // Open a simple clean print window to bypass navigation and layout headers
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Municipal Work Dispatch Ticket - ID: ${issue.id}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111827; }
              .ticket-container { border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; max-width: 800px; margin: 0 auto; }
              .header { border-b: 2px solid #111827; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
              .title { font-size: 22px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase; }
              .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
              .meta-box { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 15px; }
              .meta-label { font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
              .meta-val { font-size: 14px; font-weight: 600; color: #111827; }
              .description-box { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px; }
              .barcode { font-family: "Courier New", monospace; text-align: center; margin-top: 35px; letter-spacing: 5px; color: #4b5563; border-top: 1px dashed #e5e7eb; padding-top: 20px; }
              @media print {
                body { padding: 0; }
                .ticket-container { border: none; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="ticket-container">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadJSON = () => {
    const payload = {
      ticketId: `DISP-${issue.id.toUpperCase()}`,
      issueId: issue.id,
      title: issue.title,
      category: issue.category,
      address: issue.address,
      latitude: issue.lat,
      longitude: issue.lng,
      reportedTime: issue.createdAt,
      status: issue.status,
      severity: issue.analysis?.vision?.severity || "High",
      assignedBureau: issue.analysis?.resolution?.responsibleAuthority || "Operations",
      routingSLA: issue.analysis?.resolution?.estimatedResolutionTime || "3 Days",
      upvotes: issue.upvotes,
      verifications: issue.verifiedByCount,
      remediationDirectives: issue.analysis?.resolution?.recommendedAction || "None"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dispatch-ticket-${issue.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id={`municipal-dispatch-${issue.id}`} className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/40 text-left space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-900 pb-4">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-display font-bold text-base text-white">Official Municipal Dispatch Ticket</h3>
            <p className="text-xs text-gray-400">Automated agency routing order</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-200 text-xs font-medium hover:bg-gray-850 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ticket</span>
          </button>
          
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-lg border border-purple-900/40 bg-purple-950/30 text-purple-300 text-xs font-medium hover:bg-purple-900/30 hover:text-purple-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON Payload</span>
          </button>
        </div>
      </div>

      {/* Ticket Wrapper for browser print extraction */}
      <div ref={printRef} className="space-y-6 text-gray-300">
        
        {/* Ticket Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4">
          <div>
            <div className="font-mono text-[10px] font-bold text-purple-400 tracking-widest uppercase">
              METROPOLITAN DEPT OF PUBLIC WORKS
            </div>
            <h4 className="font-display font-black text-xl text-white tracking-tight mt-1">
              DISPATCH ORDER #DISP-{issue.id.split("-").pop()?.toUpperCase()}
            </h4>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/40 text-purple-400 border border-purple-800/40">
              <Clock className="w-3 h-3" />
              SLA: {issue.analysis?.resolution?.estimatedResolutionTime || "48 Hours"}
            </span>
          </div>
        </div>

        {/* 2x2 Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wide">
              Target Incident Category
            </span>
            <span className="font-bold text-sm text-white block">
              {issue.category}
            </span>
            <span className="block text-xs text-gray-400">
              Verified by {issue.verifiedByCount} citizens
            </span>
          </div>

          <div className="p-4 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wide">
              Responsible Bureau
            </span>
            <span className="font-bold text-sm text-purple-300 block">
              {issue.analysis?.resolution?.responsibleAuthority || "Bureau of Road Maintenance"}
            </span>
            <span className="block text-xs text-gray-400">
              Assigned S-Class Crew Priority
            </span>
          </div>

          <div className="p-4 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wide">
              Incident Location
            </span>
            <span className="font-semibold text-xs text-white block truncate">
              {issue.address}
            </span>
            <span className="block text-[10px] font-mono text-gray-500">
              LAT/LNG: {issue.lat.toFixed(6)}, {issue.lng.toFixed(6)}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wide">
              Priority Ranking
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                issue.analysis?.vision?.severity === "Critical" 
                  ? "bg-red-500" 
                  : issue.analysis?.vision?.severity === "High"
                  ? "bg-orange-500"
                  : "bg-amber-500"
              }`} />
              <span className="font-extrabold text-sm text-white">
                {issue.analysis?.resolution?.priority || "High"} ({issue.analysis?.vision?.severity || "High"})
              </span>
            </div>
            <span className="block text-xs text-gray-400">
              Urgency rating: {issue.analysis?.prediction?.urgencyScore || 85}/100
            </span>
          </div>

        </div>

        {/* Action Directives */}
        <div className="p-4 rounded-xl border border-gray-900 bg-black/20 space-y-2">
          <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wide">
            Automated AI Work Directive
          </span>
          <p className="text-xs text-gray-200 leading-relaxed font-mono">
            {issue.analysis?.resolution?.recommendedAction || "Inspect localized hazard area and secure surrounding public easement perimeter immediately."}
          </p>
        </div>

        {/* Dynamic Verification Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-gray-900">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-400">
              Consolidated community verification index is active
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 block">
              REPORTED ON: {new Date(issue.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Barcode Mockup */}
        <div className="pt-6 border-t border-dashed border-gray-900 flex flex-col items-center justify-center text-center space-y-1">
          <div className="font-mono text-lg tracking-[8px] text-gray-600 select-none">
            ||||| | | || ||| | ||| || ||||
          </div>
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
            *DISP-{issue.id.split("-").pop()?.toUpperCase()}*
          </span>
        </div>

      </div>

    </div>
  );
}
