"use client";
import { ReportForm } from "@/components/report/ReportForm";

export default function SubmitReport() {
  return (
    <div className="relative min-h-screen bg-black selection:bg-sky-500/20 overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
      </div>

      <main className="relative px-6 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Report an Incident
              </h1>
            </div>
            <p className="mt-2 text-neutral-400">Secure and anonymous reporting</p>
          </div>
          <div className="mt-16 bg-neutral-900/50 rounded-2xl border border-white/5 p-6">
            <ReportForm />
          </div>
        </div>
      </main>
    </div>
  );
}