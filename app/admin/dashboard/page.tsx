"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  business: string;
  status: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  won: "bg-green-50 text-green-700",
  lost: "bg-red-50 text-red-700",
};

function StatusSelect({
  leadId,
  value,
  disabled,
  onChange,
}: {
  leadId: string;
  value: string;
  disabled: boolean;
  onChange: (id: string, status: string) => void;
}) {
  const status = value || "new";
  const colorClass = STATUS_STYLES[status] ?? STATUS_STYLES.new;

  return (
    <div className={`relative inline-flex items-center rounded-full ${colorClass}`}>
      <select
        value={status}
        onChange={(e) => onChange(leadId, e.target.value)}
        disabled={disabled}
        className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-transparent border-0 cursor-pointer focus:outline-none focus:ring-0 disabled:cursor-wait"
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <div className="pointer-events-none absolute right-2 opacity-60">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden>
          <path d="M4.5 6.5L1 2.5h7L4.5 6.5z" />
        </svg>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setLeads(data ?? []);
      setLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );
    }
    setUpdatingId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const counts = {
    new: leads.filter((l) => !l.status || l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    won: leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider leading-none mb-0.5">
              Dave&apos;s Pixel Shop
            </p>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!loading && !error && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "New", count: counts.new, style: "bg-blue-50 border-blue-100 text-blue-700" },
              { label: "Contacted", count: counts.contacted, style: "bg-amber-50 border-amber-100 text-amber-700" },
              { label: "Won", count: counts.won, style: "bg-green-50 border-green-100 text-green-700" },
              { label: "Lost", count: counts.lost, style: "bg-red-50 border-red-100 text-red-700" },
            ].map(({ label, count, style }) => (
              <div key={label} className={`border rounded-xl p-4 ${style}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium opacity-80 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Leads
            {!loading && !error && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                {leads.length} total
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-gray-400 text-sm">Loading…</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 text-sm font-medium">Error loading leads</p>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
            <p className="text-gray-400 text-sm">No leads yet</p>
            <p className="text-gray-300 text-xs mt-1">
              Submissions from your contact form will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["Name", "Business", "Email", "Message", "Status", "Date"].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {lead.business || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs">
                        <span className="line-clamp-2 block">{lead.message}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          leadId={lead.id}
                          value={lead.status ?? "new"}
                          disabled={updatingId === lead.id}
                          onChange={updateStatus}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
