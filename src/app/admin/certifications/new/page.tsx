
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/supabase/admin";
import { createCertification } from "../actions";
import CertificationForm from "../CertificationForm";

export const metadata: Metadata = {
  title: "Add Certification | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type NewCertificationPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

async function NewCertificationContent({
  searchParams,
}: NewCertificationPageProps) {
  await connection();
  await requireAdmin();

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/certifications"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Certifications
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Add New Certification
          </h1>

          <p className="mt-2 text-slate-600">
            Add your professional certifications and credentials to your portfolio.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <CertificationForm
            action={createCertification}
            errors={error}
          />
        </div>
      </div>
    </main>
  );
}

export default function NewCertificationPage(
  props: NewCertificationPageProps
) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-5 py-10">
          <p className="text-slate-600">Loading certification form...</p>
        </main>
      }
    >
      <NewCertificationContent {...props} />
    </Suspense>
  );
}
