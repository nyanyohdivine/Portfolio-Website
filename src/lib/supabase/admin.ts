
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();

  // Verify that the user has a valid authenticated session.
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/admin/login");
  }

  // Verify that the authenticated user is an authorized administrator.
  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    supabase,
    claims: claimsData.claims,
  };
}
