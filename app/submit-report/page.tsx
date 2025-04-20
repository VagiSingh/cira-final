
"use client";
import { ReportForm } from "@/components/report/ReportForm";

export default function SubmitReport() {
  return (
    <div className="min-h-screen px-6 pt-32 bg-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl text-center font-bold text-blue-600 mb-6">CIRA REPORT FORM</h1>
        <div className="bg-neutral-900/50 rounded-2xl border border-white/5 p-6">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
