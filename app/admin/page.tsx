'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Report {
  id: string;
  reportId: string;
  title: string;
  description: string;
  type: string;
  status: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  user: {
    name: string;
    email: string;
  };
}

const REPORT_TYPES: (string | "ALL")[] = [
  "ALL",
  "SAFETY",
  "FACILITY",
  "HARASSMENT",
  "OTHER",
];

export default function AdminPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedType, setSelectedType] = useState<string | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch('/api/reports');
    const data = await res.json();
    if (data.error) {
      alert('Error fetching reports');
    } else {
      setReports(data);
      setFilteredReports(data);
    }
    setLoading(false);
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updatedReport = await res.json();
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) =>
            r.reportId === updatedReport.reportId ? { ...r, ...updatedReport } : r
          )
        );
        setFilteredReports((prev) =>
          prev.map((r) =>
            r.reportId === updatedReport.reportId ? { ...r, ...updatedReport } : r
          )
        );
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleFilter = (type: string | "ALL") => {
    setSelectedType(type);
    if (type === "ALL") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((r) => r.type === type));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 sm:px-10">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        

        {/* CIRA Heading */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              CIRA Admin Panel
            </h1>
            <p className="text-sm text-neutral-400">
              View and manage all campus incident reports
            </p>
          </div>
        </div>
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleFilter(type)}
              className={`px-4 py-2 text-sm rounded-full border ${
                selectedType === type
                  ? 'bg-blue-600 border-blue-700 text-white'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* SOS Map Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => router.push('/admin/map')}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition"
        >
          SOS Map
        </button>
      </div>

      {/* Report List */}
      {loading ? (
        <p className="text-center text-neutral-400">Loading reports...</p>
      ) : filteredReports.length === 0 ? (
        <p className="text-center text-neutral-400">No reports found.</p>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow flex flex-col sm:flex-row gap-4"
            >
              {report.imageUrl && (
                <img
                  src={report.imageUrl}
                  alt="Report Image"
                  className="w-full sm:w-40 h-40 object-cover rounded-lg border border-neutral-700"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-blue-400">
                    {report.title}
                  </h2>
                  <span className="text-sm text-neutral-400">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  {report.description}
                </p>
                <p className="text-sm text-neutral-400">
                  <strong>Type:</strong> {report.type}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  <strong>Location:</strong> {report.location || 'N/A'}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  <strong>Reported by:</strong> {report.user?.name} (
                  {report.user?.email})
                </p>

                <StatusUpdater
                  reportId={report.reportId}
                  currentStatus={report.status}
                  updateStatus={updateStatus}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusUpdater({
  reportId,
  currentStatus,
  updateStatus,
}: {
  reportId: string;
  currentStatus: string;
  updateStatus: Function;
}) {
  const [status, setStatus] = useState(currentStatus);

  return (
    <div className="mt-4 flex items-center gap-3">
      <label className="text-sm text-neutral-400">
        <strong>Status:</strong>
      </label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-neutral-800 text-white text-sm px-2 py-1 rounded-md"
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="DISMISSED">Dismissed</option>
      </select>
      <button
        onClick={() => updateStatus(reportId, status)}
        className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
      >
        Update
      </button>
    </div>
  );
}
