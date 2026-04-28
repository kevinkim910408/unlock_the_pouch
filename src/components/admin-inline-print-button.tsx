"use client";

import { useState } from "react";

type Props = {
  target: "all" | "minister" | "mp";
  status: "all" | "pending" | "printed";
  query: string;
};

export default function AdminInlinePrintButton({ target, status, query }: Props) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("target", target);
      formData.set("status", status);
      formData.set("q", query);
      await fetch("/api/admin/print/run-inline", {
        method: "POST",
        body: formData,
      });
      window.onafterprint = () => {
        window.location.reload();
      };
      window.print();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded bg-[#59b0df] px-3 py-1 text-sm font-bold text-white disabled:opacity-60"
    >
      {loading ? "Preparing..." : "Print Letters"}
    </button>
  );
}

