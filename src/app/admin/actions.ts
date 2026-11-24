
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    redirect("/admin/login?error=invalid");
  }

  const supabase = await createClient();

  const { error: loginError } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

  if (loginError) {
    redirect("/admin/login?error=invalid");
  }

  // Authentication alone does not grant administrator access.
  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/admin/login");
}
