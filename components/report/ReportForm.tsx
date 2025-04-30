'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadIcon, UserXIcon } from "lucide-react";

export function ReportForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "OTHER",
    location: "",
    image: null as File | null,
    anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("location", form.location);
    formData.append("anonymous", String(form.anonymous));
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white max-w-xl mx-auto">
      {/* Header with CIRA Branding */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
         
          <h1 className="text-2xl font-bold text-white tracking-tight">SUBMIT A REPORT</h1>
        </div>
        <p className="text-sm text-neutral-400">
          Submit a concern, issue, or incident. All reports are confidential.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-semibold mb-2">Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="SAFETY">Safety Concern</option>
          <option value="FACILITY">Facility Issue</option>
          <option value="HARASSMENT">Harassment</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold mb-2">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Building/Room number"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2">Upload Image (Optional)</label>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-700 rounded-xl bg-neutral-800 cursor-pointer hover:border-blue-500 transition">
          <UploadIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-neutral-300">
            {form.image?.name || "Click to upload an image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Anonymous Option */}
      <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3">
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={() => setForm({ ...form, anonymous: !form.anonymous })}
          id="anonymous"
          className="accent-blue-600 w-5 h-5"
        />
        <label htmlFor="anonymous" className="text-sm text-neutral-300 flex items-center gap-2">
          <UserXIcon className="w-4 h-4 text-neutral-400" />
          Submit anonymously (your name will not be attached)
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
