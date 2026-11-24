
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

export default function DatabaseTestPage() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Supabase Database Connection Test</h1>

      <p>Checking your portfolio database...</p>

      <Suspense fallback={<p>Loading database information...</p>}>
        <DatabaseResult />
      </Suspense>
    </main>
  );
}

async function DatabaseResult() {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    return (
      <section>
        <h2>Database Query Failed</h2>
        <pre>{error.message}</pre>
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <h2>Database Connected</h2>
        <p>No profile record was found.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Database Connection Successful!</h2>
      <p>Your application successfully retrieved your profile.</p>

      <h3>Actual database record:</h3>
      <pre
        style={{
          padding: "20px",
          background: "#eeeeee",
          color: "#111111",
          overflowX: "auto",
          borderRadius: "8px",
        }}
      >
        {JSON.stringify(profile, null, 2)}
      </pre>
    </section>
  );
}
