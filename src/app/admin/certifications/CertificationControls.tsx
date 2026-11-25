
"use client";

import Link from "next/link";
import {
  changeCertificationStatus,
  deleteCertification,
} from "./actions";

type CertificationControlsProps = {
  id: string;
  status: string;
};

export default function CertificationControls({
  id,
  status,
}: CertificationControlsProps) {
  const nextStatus = status === "published" ? "draft" : "published";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={`/admin/certifications/${id}/edit`}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
      >
        Edit
      </Link>

      <form action={changeCertificationStatus}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={nextStatus} />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {nextStatus === "published" ? "Publish" : "Unpublish"}
        </button>
      </form>

      <form
        action={deleteCertification}
        onSubmit={(event) => {
          if (
            !window.confirm(
              "Are you sure you want to permanently delete this certification?"
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />

        <button
          type="submit"
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
