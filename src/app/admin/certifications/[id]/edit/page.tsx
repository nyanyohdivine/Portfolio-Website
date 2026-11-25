
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { requireAdmin } from "@/lib/supabase/admin";
import { updateCertification } from "../../actions";
import CertificationForm from "../../CertificationForm";

export const metadata: Metadata = {
  title: "Edit Certification | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditCertificationPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

async function EditCertificationContent({
  params,
  searchParams,
}: EditCertificationPageProps) {
  await connection();

  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { error: formError } = await searchParams;

  const { data: certification, error: fetchError } = await supabase
    .from("certifications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("EDIT CERTIFICATION FETCH ERROR:", {
      code: fetchError.code,
      message: fetchError.message,
      details: fetchError.details,
      hint: fetchError.hint,
    });

    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load certification
          </h1>
          <p className="mt-3 text-slate-600">
            A database error occurred. Check your VS Code terminal for the
            EDIT CERTIFICATION FETCH ERROR details.
          </p>
          <Link
            href="/admin/certifications"
            className="mt-5 inline-block text-blue-600 hover:underline"
          >
            Back to Certifications
          </Link>
        </div>
      </main>
    );
  }

  if (!certification) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-white p-6">
          <h1 className="text-xl font-bold">
            Certification not found
          </h1>
          <p className="mt-3 text-slate-600">
            No certification was found for ID: {id}
          </p>
          <Link
            href="/admin/certifications"
            className="mt-5 inline-block text-blue-600 hover:underline"
          >
            Back to Certifications
          </Link>
        </div>
      </main>
    );
  }

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
            Edit Certification
          </h1>
          <p className="mt-2 text-slate-600">
            Update your certification information and uploaded document.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <CertificationForm
            action={updateCertification}
            certification={certification}
            errors={formError}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </main>
  );
}

export default function EditCertificationPage(
  props: EditCertificationPageProps
) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-5 py-10">
          <p className="text-slate-600">Loading certification...</p>
        </main>
      }
    >
      <EditCertificationContent {...props} />
    </Suspense>
  );
}
