"use client";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import Link from "next/link";

interface Report {
  id: string;
  reportId: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  type: string;
  createdAt: string;
}

export function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        console.log(data);

        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.error("Invalid response:", data);
          setError(true);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "PENDING":
        return <FiClock className="text-amber-500" />;
      case "IN_PROGRESS":
        return <FiAlertCircle className="text-blue-500" />;
      case "RESOLVED":
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiAlertCircle className="text-neutral-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load reports. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No reports found. Create your first report.
        </div>
      ) : (
        reports.map((report) => (
          <Link
            key={report.id}
            href={`/track-report?reportId=${report.reportId}`}
            className="block bg-neutral-900/50 hover:bg-neutral-900/70 p-4 rounded-lg border border-neutral-800 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{report.title}</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(report.status)}
                <span className="text-sm capitalize">
                  {report.status.toLowerCase().replace("_", " ")}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
