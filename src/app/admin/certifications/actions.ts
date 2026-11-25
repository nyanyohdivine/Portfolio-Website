
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedFileTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
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

function isValidDate(value: string) {
  if (!value) return true;

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

function getFileDetails(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const extension = allowedFileTypes[file.type];

  if (!extension || file.size > MAX_FILE_SIZE) {
    return null;
  }

  return {
    file,
    extension,
    fileType: file.type === "application/pdf" ? "pdf" : "image",
  };
}

function validateCertification(formData: FormData) {
  const title = getText(formData, "title");
  const organization = getText(formData, "issuing_organization");
  const description = getText(formData, "description");
  const issueDate = getText(formData, "issue_date");
  const expiryDate = getText(formData, "expiry_date");
  const credentialId = getText(formData, "credential_id");
  const credentialUrl = getText(formData, "credential_url");
  const status = getText(formData, "status");

  if (title.length < 3 || title.length > 150) {
    return { error: "Title must contain between 3 and 150 characters." };
  }

  if (organization.length < 2 || organization.length > 120) {
    return {
      error: "Issuing organization must contain between 2 and 120 characters.",
    };
  }

  if (description.length > 2000) {
    return { error: "Description cannot exceed 2,000 characters." };
  }

  if (!isValidDate(issueDate) || !isValidDate(expiryDate)) {
    return { error: "Please enter valid certification dates." };
  }

  if (issueDate && expiryDate && expiryDate < issueDate) {
    return { error: "Expiry date cannot be earlier than the issue date." };
  }

  if (!isValidUrl(credentialUrl)) {
    return {
      error: "Credential URL must start with http:// or https://.",
    };
  }

  if (status !== "draft" && status !== "published") {
    return { error: "Please select a valid publication status." };
  }

  return {
    data: {
      title,
      issuing_organization: organization,
      description: description || null,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null,
      credential_id: credentialId || null,
      credential_url: credentialUrl || null,
      status,
    },
  };
}

function refreshCertificationPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  revalidatePath("/");
}

export async function createCertification(formData: FormData) {
  const { supabase } = await requireAdmin();

  const validation = validateCertification(formData);

  if (validation.error || !validation.data) {
    redirect("/admin/certifications/new?error=invalid");
  }

  const fileEntry = formData.get("certificate_file");
  const fileDetails = getFileDetails(fileEntry);

  if (fileEntry instanceof File && fileEntry.size > 0 && !fileDetails) {
    redirect("/admin/certifications/new?error=file");
  }

  let filePath: string | null = null;
  let fileType: "image" | "pdf" | null = null;

  if (fileDetails) {
    filePath = `certifications/${crypto.randomUUID()}.${fileDetails.extension}`;
    fileType = fileDetails.fileType as "image" | "pdf";

    const { error: uploadError } = await supabase.storage
      .from("portfolio-public")
      .upload(filePath, fileDetails.file, {
        contentType: fileDetails.file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("CERTIFICATION UPLOAD ERROR:", uploadError);
      redirect("/admin/certifications/new?error=upload");
    }
  }

  const { error: insertError } = await supabase
    .from("certifications")
    .insert({
      ...validation.data,
      file_path: filePath,
      file_type: fileType,
      published_at:
        validation.data.status === "published"
          ? new Date().toISOString()
          : null,
    });

  if (insertError) {
    console.error("CERTIFICATION INSERT ERROR:", insertError);

    if (filePath) {
      await supabase.storage.from("portfolio-public").remove([filePath]);
    }

    redirect("/admin/certifications/new?error=save");
  }

  refreshCertificationPages();
  redirect("/admin/certifications?created=1");
}

export async function updateCertification(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirect("/admin/certifications?error=invalid");
  }

  const validation = validateCertification(formData);

  if (validation.error || !validation.data) {
    redirect(`/admin/certifications/${id}/edit?error=invalid`);
  }

  const { data: existing, error: fetchError } = await supabase
    .from("certifications")
    .select("id, file_path, file_type, status, published_at")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    redirect("/admin/certifications?error=notfound");
  }

  const fileEntry = formData.get("certificate_file");
  const fileDetails = getFileDetails(fileEntry);

  if (fileEntry instanceof File && fileEntry.size > 0 && !fileDetails) {
    redirect(`/admin/certifications/${id}/edit?error=file`);
  }

  let newFilePath: string | null = existing.file_path;
  let newFileType: "image" | "pdf" | null = existing.file_type;

  if (fileDetails) {
    newFilePath = `certifications/${crypto.randomUUID()}.${fileDetails.extension}`;
    newFileType = fileDetails.fileType as "image" | "pdf";

    const { error: uploadError } = await supabase.storage
      .from("portfolio-public")
      .upload(newFilePath, fileDetails.file, {
        contentType: fileDetails.file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("CERTIFICATION REPLACEMENT UPLOAD ERROR:", uploadError);
      redirect(`/admin/certifications/${id}/edit?error=upload`);
    }
  }

  const publishedAt =
    validation.data.status === "published"
      ? existing.status === "published" && existing.published_at
        ? existing.published_at
        : new Date().toISOString()
      : null;

  const { error: updateError } = await supabase
    .from("certifications")
    .update({
      ...validation.data,
      file_path: newFilePath,
      file_type: newFileType,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (updateError) {
    console.error("CERTIFICATION UPDATE ERROR:", updateError);

    if (fileDetails && newFilePath && newFilePath !== existing.file_path) {
      await supabase.storage.from("portfolio-public").remove([newFilePath]);
    }

    redirect(`/admin/certifications/${id}/edit?error=save`);
  }

  if (fileDetails && existing.file_path && existing.file_path !== newFilePath) {
    await supabase.storage.from("portfolio-public").remove([existing.file_path]);
  }

  refreshCertificationPages();
  redirect("/admin/certifications?updated=1");
}

export async function changeCertificationStatus(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = getText(formData, "id");
  const status = getText(formData, "status");

  if (!id || (status !== "draft" && status !== "published")) {
    redirect("/admin/certifications?error=invalid");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("certifications")
    .select("id, status, published_at")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    redirect("/admin/certifications?error=notfound");
  }

  const publishedAt =
    status === "published"
      ? existing.status === "published" && existing.published_at
        ? existing.published_at
        : new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("certifications")
    .update({ status, published_at: publishedAt })
    .eq("id", id);

  if (error) {
    console.error("CERTIFICATION STATUS ERROR:", error);
    redirect("/admin/certifications?error=status");
  }

  refreshCertificationPages();
  redirect("/admin/certifications?updated=1");
}

export async function deleteCertification(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirect("/admin/certifications?error=invalid");
  }

  const { data: certification, error: fetchError } = await supabase
    .from("certifications")
    .select("id, file_path")
    .eq("id", id)
    .single();

  if (fetchError || !certification) {
    redirect("/admin/certifications?error=notfound");
  }

  const { error: deleteError } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("CERTIFICATION DELETE ERROR:", deleteError);
    redirect("/admin/certifications?error=delete");
  }

  if (certification.file_path) {
    const { error: storageError } = await supabase.storage
      .from("portfolio-public")
      .remove([certification.file_path]);

    if (storageError) {
      console.error("CERTIFICATION FILE CLEANUP ERROR:", storageError);
    }
  }

  refreshCertificationPages();
  redirect("/admin/certifications?deleted=1");
}
