
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

const cardStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "24px",
};

export default async function AdminDashboard() {
  await connection();

  const { supabase } = await requireAdmin();

  // Retrieve portfolio statistics from Supabase.
  const [
    projectsResult,
    publishedProjectsResult,
    certificationsResult,
    publishedCertificationsResult,
    skillsResult,
    messagesResult,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("certifications")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("certifications")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "unread"),
  ]);

  const statistics = [
    {
      title: "Total Projects",
      value: projectsResult.error ? "—" : projectsResult.count ?? 0,
      description: `${publishedProjectsResult.count ?? 0} published`,
      symbol: "01",
    },
    {
      title: "Certifications",
      value: certificationsResult.error ? "—" : certificationsResult.count ?? 0,
      description: `${publishedCertificationsResult.count ?? 0} published`,
      symbol: "02",
    },
    {
      title: "Technical Skills",
      value: skillsResult.error ? "—" : skillsResult.count ?? 0,
      description: "Skills in your database",
      symbol: "03",
    },
    {
      title: "Unread Messages",
      value: messagesResult.error ? "—" : messagesResult.count ?? 0,
      description: "Messages awaiting your attention",
      symbol: "04",
    },
  ];

  const modules = [
    {
      title: "Project Management",
      description:
        "Create projects, upload screenshots, edit descriptions and manage publication status.",
      category: "PORTFOLIO CONTENT",
    },
    {
      title: "Certification Management",
      description:
        "Upload certificate images or PDFs and control which certifications appear publicly.",
      category: "PROFESSIONAL RECORDS",
    },
    {
      title: "Skills Management",
      description:
        "Organize your technical skills into categories and control their visibility.",
      category: "PORTFOLIO CONTENT",
    },
    {
      title: "Messages Inbox",
      description:
        "Review contact messages submitted by visitors and manage their status.",
      category: "COMMUNICATION",
    },
    {
      title: "Profile & CV",
      description:
        "Manage your biography, professional details, social links, profile image and CV.",
      category: "PERSONAL INFORMATION",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px 64px",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "42px",
          }}
        >
          <div>
            <p
              style={{
                color: "#2563EB",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              PORTFOLIO MANAGEMENT
            </p>

            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 38px)",
                fontWeight: 800,
                letterSpacing: "-1px",
                marginBottom: "8px",
              }}
            >
              Admin Dashboard
            </h1>

            <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
              Welcome back, Nyanyoh Divine. Manage your professional portfolio
              from one place.
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: "12px 20px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--foreground)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </form>
        </header>

        <section style={{ marginBottom: "44px" }}>
          <div style={{ marginBottom: "18px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              Portfolio Overview
            </h2>
            <p style={{ opacity: 0.65, fontSize: "14px", marginTop: "5px" }}>
              A summary of the content stored in your portfolio database.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
            }}
          >
            {statistics.map((item) => (
              <article key={item.title} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "22px",
                  }}
                >
                  <p style={{ fontSize: "14px", opacity: 0.7 }}>
                    {item.title}
                  </p>
                  <span
                    style={{
                      color: "#2563EB",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    {item.symbol}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "34px",
                    fontWeight: 800,
                    letterSpacing: "-1px",
                    marginBottom: "7px",
                  }}
                >
                  {item.value}
                </p>

                <p style={{ fontSize: "13px", opacity: 0.65 }}>
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="management-modules">
          <div style={{ marginBottom: "18px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              Management Modules
            </h2>
            <p style={{ opacity: 0.65, fontSize: "14px", marginTop: "5px" }}>
              Your portfolio management workspace.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {modules.map((module) => (
              <article
                key={module.title}
                style={{
                  ...cardStyle,
                  minHeight: "180px",
                }}
              >
                <p
                  style={{
                    color: "#2563EB",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "1.2px",
                    marginBottom: "14px",
                  }}
                >
                  {module.category}
                </p>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  {module.title}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    opacity: 0.7,
                  }}
                >
                  {module.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer
          style={{
            marginTop: "48px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border)",
            fontSize: "13px",
            opacity: 0.6,
          }}
        >
          Engineering Portfolio CMS · Administrator Workspace
        </footer>
      </div>
    </main>
  );
}
