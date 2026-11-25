type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: {
    id: string;
    title: string;
    summary: string;
    description: string;
    category: string;
    technologies: string[] | null;
    github_url: string | null;
    live_demo_url: string | null;
    status: string;
    is_featured: boolean;
  };
  errors?: string;
  submitLabel?: string;
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "14px",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "8px",
};

const errorMessages: Record<string, string> = {
  validation: "Please check the required fields and URLs.",
  image: "The image must be JPEG, PNG or WebP and no larger than 10 MB.",
  upload: "The image upload failed. Please try again.",
  duplicate: "A project with this title or slug already exists.",
  save: "The project could not be saved. Please try again.",
};

export default function ProjectForm({
  action,
  project,
  errors,
  submitLabel = "Save Project",
}: ProjectFormProps) {
  return (
    <form action={action} style={{ display: "grid", gap: "22px" }}>
      {project && <input type="hidden" name="id" value={project.id} />}

      {errors && (
        <div
          role="alert"
          style={{
            padding: "14px",
            border: "1px solid #DC2626",
            borderRadius: "8px",
            color: "#DC2626",
          }}
        >
          {errorMessages[errors] ?? "Something went wrong. Please try again."}
        </div>
      )}

      <div>
        <label htmlFor="title" style={labelStyle}>
          Project Title *
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={120}
          defaultValue={project?.title ?? ""}
          placeholder="e.g. ESP32-CAM Smart Traffic Management System"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="summary" style={labelStyle}>
          Short Summary *
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          minLength={10}
          maxLength={250}
          rows={3}
          defaultValue={project?.summary ?? ""}
          placeholder="Briefly explain what the project does."
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="description" style={labelStyle}>
          Full Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          rows={8}
          defaultValue={project?.description ?? ""}
          placeholder="Explain the problem, your solution, implementation and results."
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="category" style={labelStyle}>
          Project Category *
        </label>
        <input
          id="category"
          name="category"
          required
          maxLength={80}
          defaultValue={project?.category ?? ""}
          placeholder="e.g. Network Engineering, Embedded Systems, Software"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="technologies" style={labelStyle}>
          Technologies Used
        </label>
        <input
          id="technologies"
          name="technologies"
          defaultValue={project?.technologies?.join(", ") ?? ""}
          placeholder="ESP32, Python, YOLOv8, MQTT (separate with commas)"
          style={inputStyle}
        />
        <small style={{ opacity: 0.65 }}>
          Separate each technology with a comma.
        </small>
      </div>

      <div>
        <label htmlFor="github_url" style={labelStyle}>
          GitHub Repository URL
        </label>
        <input
          id="github_url"
          name="github_url"
          type="url"
          defaultValue={project?.github_url ?? ""}
          placeholder="https://github.com/username/project"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="live_url" style={labelStyle}>
          Live Demo URL
        </label>
        <input
          id="live_url"
          name="live_url"
          type="url"
          defaultValue={project?.live_demo_url ?? ""}
          placeholder="https://example.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="cover_image" style={labelStyle}>
          {project ? "Replace Project Cover Image (optional)" : "Project Cover Image"}
        </label>
        <input
          id="cover_image"
          name="cover_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={inputStyle}
        />
        <small style={{ opacity: 0.65 }}>
          JPEG, PNG or WebP. Maximum size: 10 MB. Leave empty to keep the
          current image.
        </small>
      </div>

      <div>
        <label htmlFor="status" style={labelStyle}>
          Publication Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={project?.status ?? "draft"}
          style={inputStyle}
        >
          <option value="draft">Save as Draft</option>
          <option value="published">Publish Project</option>
        </select>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
        }}
      >
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={project?.is_featured ?? false}
        />
        Feature this project on the homepage
      </label>

      <button
        type="submit"
        style={{
          padding: "14px 20px",
          border: "none",
          borderRadius: "8px",
          background: "#2563EB",
          color: "#FFFFFF",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {submitLabel}
      </button>
    </form>
  );
}