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
  letterBody: string;
  mpLetterBody?: string;
  premierLetterBody?: string;
  printStatusMinister?: "pending" | "printed";
  printStatusMp?: "not_applicable" | "pending" | "printed";
};

type Props = {
  rows: PrintRow[];
  target: "all" | "minister" | "mp";
  status: "all" | "pending" | "printed";
  query: string;
};

function formatDate(value: Date | string | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function statusCell(status: string, hasTarget: boolean) {
  if (!hasTarget) return <span className="text-[#999]">-</span>;
  const printed = status === "printed";
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold ${
        printed ? "text-[#1d7f2a]" : "text-[#a06a00]"
      }`}
    >
      <span>{printed ? "✓" : "○"}</span>
      <span>{printed ? "Printed" : "Pending"}</span>
    </span>
  );
}

export default function AdminPrintSelectionTable({ rows, target, status, query }: Props) {
  const ids = useMemo(() => rows.map((row) => String(row._id)), [rows]);
  const [selected, setSelected] = useState<string[]>(ids);
  const [loading, setLoading] = useState(false);

  const allSelected = ids.length > 0 && selected.length === ids.length;

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function toggleAll() {
    setSelected(allSelected ? [] : ids);
  }

  async function printSelected() {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("target", target);
      formData.set("status", status);
      formData.set("q", query);
      formData.set("ids", JSON.stringify(selected));
      await fetch("/api/admin/print/run-inline", {
        method: "POST",
        body: formData,
      });
      const url = new URL("/admin/print-preview", window.location.origin);
      url.searchParams.set("target", target);
      url.searchParams.set("status", status);
      if (query) url.searchParams.set("q", query);
      url.searchParams.set("ids", selected.join(","));
      window.location.assign(url.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-[#444]">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
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
              {(target === "all" || target === "minister") && (
                <section className="admin-print-letter">
                  <pre className="whitespace-pre-wrap text-[12px] leading-[1.55] text-black">
                    {row.letterBody}
                  </pre>
                </section>
              )}
              {(target === "all" || target === "mp") && row.mpEmail ? (
                <section className="admin-print-letter">
                  <pre className="whitespace-pre-wrap text-[12px] leading-[1.55] text-black">
                    {row.mpLetterBody ?? row.letterBody}
                  </pre>
                </section>
              ) : null}
              {target === "all" && row.premierLetterBody ? (
                <section className="admin-print-letter">
                  <pre className="whitespace-pre-wrap text-[12px] leading-[1.55] text-black">
                    {row.premierLetterBody}
                  </pre>
                </section>
              ) : null}
            </div>
          ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Letter #</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Created</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Name</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Email</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Province</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Minister Printed</th>
              <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">MP Printed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = String(row._id);
              const ministerStatus = row.printStatusMinister ?? "pending";
              const mpStatus = row.printStatusMp ?? "pending";
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
                    {statusCell(ministerStatus, true)}
                  </td>
                  <td className="border-b border-[#eeeeee] px-2 py-2">
                    {statusCell(mpStatus, true)}
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
