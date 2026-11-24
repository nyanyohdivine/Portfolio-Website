
import type { Metadata } from "next";
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

export default async function AdminDashboard() {
  await requireAdmin();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div>
            <p style={{ color: "#2563EB", fontWeight: 700 }}>
              PORTFOLIO MANAGEMENT
            </p>

            <h1 style={{ fontSize: "32px" }}>
              Admin Dashboard
            </h1>

            <p style={{ opacity: 0.7 }}>
              Welcome back, Nyanyoh Divine.
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
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </form>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              title: "Projects",
              description: "Add, edit and publish engineering projects.",
            },
            {
              title: "Certifications",
              description: "Manage your professional certifications.",
            },
            {
              title: "Skills",
              description: "Organize your technical skills.",
            },
            {
              title: "Messages",
              description: "Read messages from portfolio visitors.",
            },
            {
              title: "Profile",
              description: "Update your personal and professional information.",
            },
          ].map((item) => (
            <article
              key={item.title}
              style={{
                padding: "24px",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                background: "var(--card)",
              }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                {item.title}
              </h2>

              <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <p style={{ marginTop: "40px", opacity: 0.6 }}>
          Your portfolio management workspace is ready for development.
        </p>
      </div>
    </main>
  );
}
