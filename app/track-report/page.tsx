import { ReportTracker } from "@/components/report/ReportTracker";

export default function TrackReportPage({
  searchParams,
}: {
  searchParams: { reportId?: string };
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <ReportTracker initialReportId={searchParams.reportId} />
      </div>
    </div>
  );
}
