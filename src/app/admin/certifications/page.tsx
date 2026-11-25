
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { requireAdmin } from "@/lib/supabase/admin";
import CertificationControls from "./CertificationControls";

export const metadata: Metadata = {
  title: "Manage Certifications | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

async function CertificationsContent({ searchParams }: PageProps) {
  await connection();

  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const { data: certifications, error } = await supabase
    .from("certifications")
    .select(
      "id, title, issuing_organization, issue_date, expiry_date, file_type, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("CERTIFICATION FETCH ERROR:", error);

    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold">Manage Certifications</h1>
        <p className="mt-6 text-red-600">
          Unable to load certifications. Please check the database permissions.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Certifications</h1>
          <p className="mt-2 text-slate-500">
            Add, edit, publish, and manage your professional certifications.
          </p>
        </div>

        <Link
          href="/admin/certifications/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Certification
        </Link>
      </div>

      {params.success && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {params.success === "created" && "Certification created successfully."}
          {params.success === "updated" && "Certification updated successfully."}
          {params.success === "published" && "Certification published successfully."}
          {params.success === "unpublished" && "Certification unpublished successfully."}
          {params.success === "deleted" && "Certification deleted successfully."}
        </div>
      )}

      {params.error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          An error occurred while processing your request: {params.error}
        </div>
      )}

      {!certifications || certifications.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <h2 className="text-xl font-semibold">No certifications found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Add your first certification to get started.
          </p>
          <Link
            href="/admin/certifications/new"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add Your First Certification
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {certifications.map((certification) => (
            <div
              key={certification.id}
              className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {certification.title}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      certification.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {certification.status === "published"
                      ? "Published"
                      : "Draft"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {certification.issuing_organization}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                  <span>
                    Issued:{" "}
                    {certification.issue_date
                      ? new Date(certification.issue_date).toLocaleDateString()
                      : "Not specified"}
                  </span>

                  <span>
                    Expires:{" "}
                    {certification.expiry_date
                      ? new Date(certification.expiry_date).toLocaleDateString()
                      : "No expiry"}
                  </span>

                  <span>
                    File:{" "}
                    {certification.file_type === "pdf"
                      ? "PDF"
                      : certification.file_type === "image"
                        ? "Image"
                        : "Not uploaded"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Certification ID: {certification.id}
                </p>
              </div>

              <div className="shrink-0">
                <CertificationControls
                  id={certification.id}
                  status={certification.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function CertificationsPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-slate-500">Loading certifications...</p>
        </main>
      }
    >
      <CertificationsContent searchParams={props.searchParams} />
    </Suspense>
  );
}
