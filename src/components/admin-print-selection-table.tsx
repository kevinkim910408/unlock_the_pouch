"use client";

import { useMemo, useState } from "react";

type PrintRow = {
  _id?: string;
  submissionNumber?: number;
  createdAt?: string | Date;
  firstName: string;
  lastName: string;
  email: string;
  province: string;
  mpEmail?: string;
  mpName?: string;
  letterBody: string;
  mpLetterBody?: string;
  premierLetterBody?: string;
  printStatusMinister?: "pending" | "printed";
  printStatusMp?: "not_applicable" | "pending" | "printed";
};

type Props = {
  rows: PrintRow[];
  target: "minister" | "mp";
  status: "all" | "pending" | "printed";
  query: string;
  recipient: string;
};

function formatDate(value: Date | string | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function AdminPrintSelectionTable({ rows, target, status, query, recipient }: Props) {
  const ids = useMemo(() => rows.map((row) => String(row._id)), [rows]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allSelected = ids.length > 0 && ids.every((id) => selected.includes(id));

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function toggleAll() {
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : Array.from(new Set([...prev, ...ids])),
    );
  }

  async function printSelected() {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("target", target);
      formData.set("status", status);
      formData.set("q", query);
      formData.set("recipient", recipient);
      formData.set("ids", JSON.stringify(selected));
      await fetch("/api/admin/print/run-inline", {
        method: "POST",
        body: formData,
      });
      window.print();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-[#444]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />
          Select all
        </label>
        <button
          type="button"
          onClick={printSelected}
          disabled={loading || selected.length === 0}
          className="rounded bg-[#59b0df] px-3 py-1 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Preparing..." : `Print selected (${selected.length})`}
        </button>
      </div>

      <div className="admin-print-only mt-6">
        {rows
          .filter((row) => selected.includes(String(row._id)))
          .map((row) => (
            <div key={`print-${String(row._id)}`}>
              {target === "minister" && (
                <section className="admin-print-letter">
                  <pre className="whitespace-pre-wrap text-[12px] leading-[1.55] text-black">
                    {row.letterBody}
                  </pre>
                </section>
              )}
              {target === "mp" && row.mpEmail ? (
                <section className="admin-print-letter">
                  <pre className="whitespace-pre-wrap text-[12px] leading-[1.55] text-black">
                    {row.mpLetterBody ?? row.letterBody}
                  </pre>
                </section>
              ) : null}
            </div>
          ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Letter #</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Created</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Name</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Email</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Province</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Letter Type</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Recipient Name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = String(row._id);
              const number = row.submissionNumber ?? "-";
              return (
                <tr key={id}>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">
                    <input
                      type="checkbox"
                      checked={selected.includes(id)}
                      onChange={() => toggleOne(id)}
                    />
                  </td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top font-semibold">
                    {number}
                  </td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">{row.email}</td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">{row.province}</td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">
                    {target === "minister" ? "Minister" : "MP"}
                  </td>
                  <td className="border-b border-[#eeeeee] px-2 py-2 align-top">
                    {target === "minister" ? "Marjorie Michel" : row.mpName ?? "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
