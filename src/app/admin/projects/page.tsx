import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";
import ProjectControls from "./ProjectControls";

export const metadata: Metadata = {
  title: "Manage Projects | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

type ProjectsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  await connection();

  const { supabase } = await requireAdmin();
  const { created, updated, deleted } = await searchParams;

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, summary, category, status, is_featured, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PROJECT FETCH ERROR:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{ color: "#2563EB", fontWeight: 600, fontSize: "14px" }}
        >
          ← Back to Dashboard
        </Link>

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "24px",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 800 }}>
              Project Management
            </h1>
            <p style={{ opacity: 0.7, marginTop: "8px" }}>
              Create and manage the projects displayed in your portfolio.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            style={{
              padding: "13px 20px",
              background: "#2563EB",
              color: "#FFFFFF",
              borderRadius: "8px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            + Add New Project
          </Link>
        </header>

        {created === "1" && (
          <p
            role="status"
            style={{
              padding: "14px",
              marginBottom: "24px",
              border: "1px solid #16A34A",
              borderRadius: "8px",
              color: "#16A34A",
            }}
          >
            Your project was saved successfully.
          </p>
        )}

        {updated === "1" && (
          <p role="status" style={{ color: "#16A34A", marginBottom: "20px" }}>
            Project updated successfully.
          </p>
        )}

        {deleted === "1" && (
          <p role="status" style={{ color: "#16A34A", marginBottom: "20px" }}>
            Project deleted successfully.
          </p>
        )}

        {error && (
          <p role="alert" style={{ color: "#DC2626" }}>
            Unable to retrieve projects. Check your database permissions and try
            again.
          </p>
        )}

        {!error && projects?.length === 0 && (
          <section
            style={{
              padding: "48px 24px",
              textAlign: "center",
              border: "1px dashed var(--border)",
              borderRadius: "14px",
              background: "var(--card)",
            }}
          >
            <h2 style={{ fontSize: "21px", fontWeight: 700 }}>
              No projects yet
            </h2>
            <p style={{ opacity: 0.7, margin: "12px 0 22px" }}>
              Start by adding your first engineering project.
            </p>
            <Link
              href="/admin/projects/new"
              style={{ color: "#2563EB", fontWeight: 700 }}
            >
              Add your first project →
            </Link>
          </section>
        )}

        <section style={{ display: "grid", gap: "16px" }}>
          {projects?.map((project) => (
            <article
              key={project.id}
              style={{
                padding: "22px",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                background: "var(--card)",
              }}
            >
              <ProjectControls id={project.id} status={project.status} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ flex: "1 1 400px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <h2 style={{ fontSize: "19px", fontWeight: 700 }}>
                      {project.title}
                    </h2>

                    <span
                      style={{
                        padding: "4px 9px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background:
                          project.status === "published"
                            ? "rgba(22,163,74,0.12)"
                            : "rgba(100,116,139,0.15)",
                        color:
                          project.status === "published"
                            ? "#16A34A"
                            : "var(--foreground)",
                      }}
                    >
                      {project.status.toUpperCase()}
                    </span>

                    {project.is_featured && (
                      <span style={{ color: "#2563EB", fontSize: "12px" }}>
                        FEATURED
                      </span>
                    )}
                  </div>

                  <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                    {project.summary}
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                      opacity: 0.55,
                      marginTop: "12px",
                    }}
                  >
                    {project.category} · Slug: {project.slug}
                  </p>
                </div>

                <p style={{ fontSize: "12px", opacity: 0.55 }}>
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
