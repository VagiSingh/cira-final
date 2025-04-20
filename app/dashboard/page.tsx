import { ReportList } from "@/components/dashboard/ReportList";
import Link from "next/link";
import  SOS  from "@/components/dashboard/SOS";


export default function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Recent Reports</h1>
        <Link
          href="/submit-report"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
        >
          New Report
        </Link>
      </div>
      <ReportList />
      <div>
      {/* ...other dashboard components... */}
      <SOS />
    </div>
    </div>
   

  );
}