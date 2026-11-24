
import type { Metadata } from "next";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Administrator Login",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  let errorMessage = "";

  if (params.error === "invalid") {
    errorMessage = "Invalid email or password. Please try again.";
  } else if (params.error === "unauthorized") {
    errorMessage = "Your account is not authorized to access the dashboard.";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          background: "var(--card)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ color: "#2563EB", fontWeight: 700 }}>
          Administrator Access Only
        </p>

        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          Administrator Login
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "28px" }}>
          Sign in to manage your engineering portfolio.
        </p>

        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#FEE2E2",
              color: "#991B1B",
              fontSize: "14px",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form action={login}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#2563EB",
              color: "#FFFFFF",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "13px",
            opacity: 0.65,
          }}
        >
          Authorized administrators only.
        </p>
      </section>
    </main>
  );
}
