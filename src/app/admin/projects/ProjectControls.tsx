"use client";

import Link from "next/link";
import {
  changeProjectStatus,
  deleteProject,
} from "./actions";

type ProjectControlsProps = {
  id: string;
  status: string;
};

const buttonStyle = {
  padding: "9px 13px",
  borderRadius: "7px",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--foreground)",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
};

export default function ProjectControls({
  id,
  status,
}: ProjectControlsProps) {
  const nextStatus = status === "published" ? "draft" : "published";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "18px",
      }}
    >
      <Link href={`/admin/projects/${id}/edit`} style={buttonStyle}>
        Edit
      </Link>

      <form action={changeProjectStatus}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={nextStatus} />
        <button type="submit" style={buttonStyle}>
          {nextStatus === "published" ? "Publish" : "Unpublish"}
        </button>
      </form>

      <form
        action={deleteProject}
        onSubmit={(event) => {
          const confirmed = window.confirm(
            "Are you sure you want to permanently delete this project? This action cannot be undone."
          );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          style={{
            ...buttonStyle,
            borderColor: "#DC2626",
            color: "#DC2626",
          }}
        >
          Delete
        </button>
      </form>
    </div>
  );
}