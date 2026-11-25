
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Certifications | Nyanyoh Divine",
  description:
    "Professional certifications and credentials earned by Nyanyoh Divine.",
};

function formatDate(date: string | null) {
  if (!date) return "Not specified";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function CertificationsContent() {
  await connection();

  const supabase = await createClient();

  const { data: certifications, error } = await supabase
    .from("certifications")
    .select(
      "id, title, issuing_organization, description, issue_date, expiry_date, credential_id, credential_url, file_path, file_type"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("PUBLIC CERTIFICATIONS PAGE ERROR:", error);

    return (
      <main className="section-container py-20">
        <h1 className="text-3xl font-bold">Certifications</h1>
        <p className="mt-4 text-red-600">
          We are currently unable to load certifications. Please try again
          later.
        </p>
      </main>
    );
  }

  return (
    <main className="section-container py-16">
      <div className="mb-12">
        <span className="eyebrow">PROFESSIONAL DEVELOPMENT</span>
        <h1 className="mt-4 text-4xl font-bold">
          Certifications & Credentials
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          A record of my professional certifications, technical training
          and continued learning in engineering and technology.
        </p>
      </div>

      {!certifications || certifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <h2 className="text-xl font-semibold">
            No certifications published yet
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Published certifications will appear here as they become available.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Return to homepage
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {certifications.map((certification) => {
            const fileUrl = certification.file_path
              ? supabase.storage
                  .from("portfolio-public")
                  .getPublicUrl(certification.file_path).data.publicUrl
              : null;

            return (
              <article
                key={certification.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {certification.title}
                  </h2>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Published
                  </span>
                </div>

                <p className="mt-2 font-medium text-blue-700">
                  {certification.issuing_organization}
                </p>

                {certification.description && (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {certification.description}
                  </p>
                )}

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Issue date:
                    </span>{" "}
                    <span className="text-slate-600">
                      {formatDate(certification.issue_date)}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">
                      Expiry date:
                    </span>{" "}
                    <span className="text-slate-600">
                      {certification.expiry_date
                        ? formatDate(certification.expiry_date)
                        : "No expiry"}
                    </span>
                  </p>

                  {certification.credential_id && (
                    <p className="break-all">
                      <span className="font-semibold text-slate-800">
                        Credential ID:
                      </span>{" "}
                      <span className="text-slate-600">
                        {certification.credential_id}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View Certificate ↗
                    </a>
                  )}

                  {certification.credential_url && (
                    <a
                      href={certification.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Verify Credential ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function CertificationsPage() {
  return (
    <Suspense
      fallback={
        <main className="section-container py-20">
          <p className="text-slate-500">Loading certifications...</p>
        </main>
      }
    >
      <CertificationsContent />
    </Suspense>
  );
}
