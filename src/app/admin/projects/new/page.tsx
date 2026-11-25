import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";
import { createProject } from "../actions";
import ProjectForm from "../ProjectForm";

export const metadata: Metadata = {
  title: "Add Project | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

type NewProjectPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  validation: "Please check your required fields and URLs.",
  image: "The image must be JPEG, PNG or WebP and no larger than 10 MB.",
  upload: "The image upload failed. Please try again.",
  duplicate: "A project with this title or slug already exists.",
  save: "The project could not be saved. Please try again.",
};

export default async function NewProjectPage({
  searchParams,
}: NewProjectPageProps) {
  await connection();
  await requireAdmin();

  const { error } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px 64px",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link
          href="/admin/projects"
          style={{ color: "#2563EB", fontWeight: 600, fontSize: "14px" }}
        >
          ← Back to Projects
        </Link>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            marginTop: "24px",
            marginBottom: "8px",
          }}
        >
          Add New Project
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "32px" }}>
          Add an engineering or software project to your portfolio.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              padding: "14px",
              marginBottom: "24px",
              border: "1px solid #DC2626",
              borderRadius: "8px",
              color: "#DC2626",
            }}
          >
            {errorMessages[error] ?? "Something went wrong."}
          </div>
        )}

        <section
          style={{
            padding: "28px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
          }}
        >
          <ProjectForm action={createProject} />
        </section>
      </div>
    </main>
  );
}