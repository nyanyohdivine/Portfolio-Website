
"use client";

import Link from "next/link";

type Certification = {
  id: string;
  title: string;
  issuing_organization: string;
  description: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  status: string;
  file_type: string | null;
};

type CertificationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  certification?: Certification;
  errors?: string;
  submitLabel?: string;
};

const errorMessages: Record<string, string> = {
  invalid: "Please check the certification details and try again.",
  file: "Choose a valid JPG, PNG, WEBP or PDF file smaller than 10 MB.",
  upload: "The certificate file could not be uploaded. Please try again.",
  save: "The certification could not be saved. Please try again.",
};

export default function CertificationForm({
  action,
  certification,
  errors,
  submitLabel = "Save Certification",
}: CertificationFormProps) {
  return (
    <form action={action} className="space-y-6">
      {certification && (
        <input type="hidden" name="id" value={certification.id} />
      )}

      {errors && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessages[errors] ?? "An error occurred. Please try again."}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          Certification Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={150}
          defaultValue={certification?.title ?? ""}
          placeholder="e.g. HCIA-Datacom"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="issuing_organization"
          className="mb-2 block text-sm font-medium"
        >
          Issuing Organization *
        </label>
        <input
          id="issuing_organization"
          name="issuing_organization"
          type="text"
          required
          minLength={2}
          maxLength={120}
          defaultValue={certification?.issuing_organization ?? ""}
          placeholder="e.g. Huawei"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={certification?.description ?? ""}
          placeholder="Briefly describe what this certification covers..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="issue_date" className="mb-2 block text-sm font-medium">
            Issue Date
          </label>
          <input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={certification?.issue_date ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="expiry_date" className="mb-2 block text-sm font-medium">
            Expiry Date
          </label>
          <input
            id="expiry_date"
            name="expiry_date"
            type="date"
            defaultValue={certification?.expiry_date ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <div>
        <label htmlFor="credential_id" className="mb-2 block text-sm font-medium">
          Credential ID
        </label>
        <input
          id="credential_id"
          name="credential_id"
          type="text"
          maxLength={150}
          defaultValue={certification?.credential_id ?? ""}
          placeholder="Optional certificate identification number"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label htmlFor="credential_url" className="mb-2 block text-sm font-medium">
          Credential Verification URL
        </label>
        <input
          id="credential_url"
          name="credential_url"
          type="url"
          defaultValue={certification?.credential_url ?? ""}
          placeholder="https://example.com/verify"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
        />
      </div>

      {certification?.file_type && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Current certificate file:{" "}
          <strong>{certification.file_type.toUpperCase()}</strong>
          <p className="mt-1">
            Leave the file field empty to keep the existing upload.
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="certificate_file"
          className="mb-2 block text-sm font-medium"
        >
          {certification ? "Replace Certificate File" : "Certificate File"}
        </label>

        <input
          id="certificate_file"
          name="certificate_file"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white"
        />

        <p className="mt-2 text-xs text-slate-500">
          Accepted formats: JPG, PNG, WEBP and PDF. Maximum file size: 10 MB.
        </p>
      </div>

      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Publication Status
        </label>

        <select
          id="status"
          name="status"
          defaultValue={certification?.status ?? "draft"}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
        >
          <option value="draft">Save as Draft</option>
          <option value="published">Publish</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          {submitLabel}
        </button>

        <Link
          href="/admin/certifications"
          className="rounded-lg border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
