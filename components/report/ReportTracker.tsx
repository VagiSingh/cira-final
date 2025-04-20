"use client";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

interface Report {
  id: string;
  reportId: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  type: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export function ReportTracker({ initialReportId = "" }: { initialReportId?: string }) {
  const [reportId, setReportId] = useState(initialReportId);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialReportId) {
      handleSearch();
    }
  }, [initialReportId]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!reportId.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Fetch the report by reportId
      const res = await fetch(`/api/reports/${reportId}`);
      if (!res.ok) throw new Error("Report not found");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Track Report</h1>
        <p className="text-neutral-400">Enter your report ID to check status</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          className="flex-1 px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Enter report ID"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FiSearch />
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {report && (
        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
              <p className="text-neutral-300">{report.description}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className="capitalize font-medium text-white">
                  {report.status.toLowerCase().replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Type:</span>
                <span className="text-white">{report.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Submitted:</span>
                <span className="text-white">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              {report.location && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Location:</span>
                  <span className="text-white">{report.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
