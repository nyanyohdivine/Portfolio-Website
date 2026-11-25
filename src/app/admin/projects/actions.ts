"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const allowedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createProject(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = getText(formData, "title");
  const summary = getText(formData, "summary");
  const description = getText(formData, "description");
  const category = getText(formData, "category");
  const technologiesText = getText(formData, "technologies");
  const githubUrl = getText(formData, "github_url");
  const liveUrl = getText(formData, "live_url");
  const status = getText(formData, "status");
  const isFeatured = formData.get("is_featured") === "on";
  const image = formData.get("cover_image");

  if (
    title.length < 3 ||
    title.length > 120 ||
    summary.length < 10 ||
    summary.length > 250 ||
    description.length < 20 ||
    category.length < 2 ||
    category.length > 80
  ) {
    redirect("/admin/projects/new?error=validation");
  }

  if (
    !isValidUrl(githubUrl) ||
    !isValidUrl(liveUrl) ||
    !["draft", "published"].includes(status)
  ) {
    redirect("/admin/projects/new?error=validation");
  }

  const technologies = technologiesText
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean)
    .slice(0, 30);

  let coverImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const extension = allowedImageTypes[image.type];

    if (!extension || image.size > MAX_IMAGE_SIZE) {
      redirect("/admin/projects/new?error=image");
    }

    coverImagePath = `projects/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-public")
      .upload(coverImagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      redirect("/admin/projects/new?error=upload");
    }
  }

  const slug = createSlug(title);

  const { error: insertError } = await supabase.from("projects").insert({
    title,
    slug,
    summary,
    description,
    category,
    technologies,
    github_url: githubUrl || null,
    live_demo_url: liveUrl || null,
    cover_image_path: coverImagePath,
    status,
    is_featured: isFeatured,
    published_at: status === "published" ? new Date().toISOString() : null,
  });

  if (insertError) {
    console.error("PROJECT INSERT ERROR:", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });

    if (coverImagePath) {
      await supabase.storage.from("portfolio-public").remove([coverImagePath]);
    }

    if (insertError.code === "23505") {
      redirect("/admin/projects/new?error=duplicate");
    }

    redirect("/admin/projects/new?error=save");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");

  redirect("/admin/projects?created=1");
}

export async function updateProject(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = getText(formData, "id");
  const title = getText(formData, "title");
  const summary = getText(formData, "summary");
  const description = getText(formData, "description");
  const category = getText(formData, "category");
  const technologiesText = getText(formData, "technologies");
  const githubUrl = getText(formData, "github_url");
  const liveUrl = getText(formData, "live_url");
  const status = getText(formData, "status");
  const isFeatured = formData.get("is_featured") === "on";
  const image = formData.get("cover_image");

  const errorUrl = `/admin/projects/${id}/edit`;

  if (
    !id ||
    title.length < 3 ||
    title.length > 120 ||
    summary.length < 10 ||
    summary.length > 250 ||
    description.length < 20 ||
    category.length < 2 ||
    category.length > 80
  ) {
    redirect(`${errorUrl}?error=validation`);
  }

  if (
    !isValidUrl(githubUrl) ||
    !isValidUrl(liveUrl) ||
    !["draft", "published"].includes(status)
  ) {
    redirect(`${errorUrl}?error=validation`);
  }

  const { data: existingProject, error: fetchError } = await supabase
    .from("projects")
    .select("id, cover_image_path, status, published_at")
    .eq("id", id)
    .single();

  if (fetchError || !existingProject) {
    redirect("/admin/projects?error=notfound");
  }

  const technologies = technologiesText
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean)
    .slice(0, 30);

  let newCoverImagePath = existingProject.cover_image_path;
  let uploadedImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const extension = allowedImageTypes[image.type];

    if (!extension || image.size > MAX_IMAGE_SIZE) {
      redirect(`${errorUrl}?error=image`);
    }

    uploadedImagePath = `projects/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-public")
      .upload(uploadedImagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      redirect(`${errorUrl}?error=upload`);
    }

    newCoverImagePath = uploadedImagePath;
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      title,
      slug: createSlug(title),
      summary,
      description,
      category,
      technologies,
      github_url: githubUrl || null,
      live_demo_url: liveUrl || null,
      cover_image_path: newCoverImagePath,
      status,
      is_featured: isFeatured,
      published_at:
        status === "published"
          ? (existingProject.published_at ?? new Date().toISOString())
          : null,
    })
    .eq("id", id);

  if (updateError) {
    console.error("PROJECT UPDATE ERROR:", {
      code: updateError.code,
      message: updateError.message,
      details: updateError.details,
      hint: updateError.hint,
    });

    if (uploadedImagePath) {
      await supabase.storage
        .from("portfolio-public")
        .remove([uploadedImagePath]);
    }

    if (updateError.code === "23505") {
      redirect(`${errorUrl}?error=duplicate`);
    }

    redirect(`${errorUrl}?error=save`);
  }

  // Remove the previous cover only after the database update succeeds.
  if (
    uploadedImagePath &&
    existingProject.cover_image_path &&
    existingProject.cover_image_path !== uploadedImagePath
  ) {
    const { error: removeError } = await supabase.storage
      .from("portfolio-public")
      .remove([existingProject.cover_image_path]);

    if (removeError) {
      console.error("OLD COVER IMAGE REMOVAL ERROR:", removeError.message);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/");
  revalidatePath(`/projects/${createSlug(title)}`);

  redirect("/admin/projects?updated=1");
}

export async function changeProjectStatus(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = getText(formData, "id");
  const status = getText(formData, "status");

  if (!id || !["draft", "published"].includes(status)) {
    redirect("/admin/projects?error=validation");
  }

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, published_at")
    .eq("id", id)
    .single();

  if (fetchError || !project) {
    redirect("/admin/projects?error=notfound");
  }

  const { error } = await supabase
    .from("projects")
    .update({
      status,
      published_at:
        status === "published"
          ? (project.published_at ?? new Date().toISOString())
          : null,
    })
    .eq("id", id);

  if (error) {
    console.error("PROJECT STATUS UPDATE ERROR:", error.message);
    redirect("/admin/projects?error=save");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects?updated=1");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirect("/admin/projects?error=validation");
  }

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, cover_image_path")
    .eq("id", id)
    .single();

  if (fetchError || !project) {
    redirect("/admin/projects?error=notfound");
  }

  // Collect additional image paths before the project is deleted.
  const { data: projectImages, error: imagesError } = await supabase
    .from("project_images")
    .select("image_path")
    .eq("project_id", id);

  if (imagesError) {
    console.error("PROJECT IMAGE LOOKUP ERROR:", imagesError.message);
    redirect("/admin/projects?error=delete");
  }

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("PROJECT DELETE ERROR:", deleteError.message);
    redirect("/admin/projects?error=delete");
  }

  // The project row is deleted first. Then remove its stored images.
  const imagePaths = [
    project.cover_image_path,
    ...(projectImages ?? []).map((item) => item.image_path),
  ].filter((path): path is string => Boolean(path));

  if (imagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("portfolio-public")
      .remove(imagePaths);

    if (storageError) {
      console.error("PROJECT IMAGE CLEANUP ERROR:", storageError.message);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects?deleted=1");
}
