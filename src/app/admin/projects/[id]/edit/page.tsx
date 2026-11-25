import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";
import { updateProject } from "../../actions";
import ProjectForm from "../../ProjectForm";

export const metadata: Metadata = {
  title: "Edit Project | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
  await connection();

  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select(
      "id, title, summary, description, category, technologies, github_url, live_demo_url, status, is_featured"
    )
    .eq("id", id)
    .single();

  if (fetchError || !project) {
    notFound();
  }

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
          Edit Project
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "32px" }}>
          Update the information and publication status of {project.title}.
        </p>

        <section
          style={{
            padding: "28px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
          }}
        >
          <ProjectForm
            action={updateProject}
            project={project}
            errors={error}
            submitLabel="Save Changes"
          />
        </section>
      </div>
    </main>
  );
}