"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
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

type PortfolioEntry = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
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

  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({ title: "", description: "", link: "" });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioSubmitting, setPortfolioSubmitting] = useState(false);
  const [portfolioFormError, setPortfolioFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const [leadsResult, portfolioResult] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("portfolio").select("id, title, description, image_url, link").order("id", { ascending: true }),
      ]);

      if (leadsResult.error) setError(leadsResult.error.message);
      else setLeads(leadsResult.data ?? []);

      if (portfolioResult.error) setPortfolioError(portfolioResult.error.message);
      else setPortfolio(portfolioResult.data ?? []);

      setLoading(false);
      setPortfolioLoading(false);
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePortfolioSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPortfolioFormError(null);
    if (!portfolioForm.title.trim() || !portfolioForm.description.trim()) {
      setPortfolioFormError("Title and description are required.");
      return;
    }
    setPortfolioSubmitting(true);

    let imageUrl: string | null = null;
    if (portfolioFile) {
      const ext = portfolioFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(path, portfolioFile, { upsert: false });
      if (uploadError) {
        setPortfolioFormError(`Image upload failed: ${uploadError.message}`);
        setPortfolioSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("portfolio")
      .insert({
        title: portfolioForm.title.trim(),
        description: portfolioForm.description.trim(),
        link: portfolioForm.link.trim() || null,
        image_url: imageUrl,
      })
      .select("id, title, description, image_url, link")
      .single();

    if (insertError) {
      setPortfolioFormError(`Failed to save: ${insertError.message}`);
    } else {
      setPortfolio((prev) => [...prev, data]);
      setPortfolioForm({ title: "", description: "", link: "" });
      setPortfolioFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setPortfolioSubmitting(false);
  }

  async function handlePortfolioDelete(entry: PortfolioEntry) {
    setDeletingId(entry.id);

    if (entry.image_url) {
      const url = new URL(entry.image_url);
      const parts = url.pathname.split("/portfolio-images/");
      if (parts.length === 2) {
        await supabase.storage.from("portfolio-images").remove([parts[1]]);
      }
    }

    const { error: deleteError } = await supabase.from("portfolio").delete().eq("id", entry.id);
    if (!deleteError) {
      setPortfolio((prev) => prev.filter((p) => p.id !== entry.id));
    }
    setDeletingId(null);
  }

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

        {/* Portfolio Management */}
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Portfolio
              {!portfolioLoading && !portfolioError && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {portfolio.length} {portfolio.length === 1 ? "project" : "projects"}
                </span>
              )}
            </h2>
          </div>

          {/* Add project form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Add New Project</h3>
            <form onSubmit={handlePortfolioSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={portfolioForm.title}
                    onChange={(e) => setPortfolioForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Project title"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Link <span className="text-gray-300 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={portfolioForm.link}
                    onChange={(e) => setPortfolioForm((f) => ({ ...f, link: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short project description"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Image <span className="text-gray-300 font-normal">(optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPortfolioFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>
              {portfolioFormError && (
                <p className="text-xs text-red-600">{portfolioFormError}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={portfolioSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-wait text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  {portfolioSubmitting ? "Saving…" : "Add Project"}
                </button>
              </div>
            </form>
          </div>

          {/* Existing entries */}
          {portfolioLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400 text-sm">Loading…</div>
            </div>
          ) : portfolioError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 text-sm font-medium">Error loading portfolio</p>
              <p className="text-red-500 text-xs mt-1">{portfolioError}</p>
            </div>
          ) : portfolio.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-400 text-sm">No portfolio projects yet</p>
              <p className="text-gray-300 text-xs mt-1">Add your first project above</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <ul className="divide-y divide-gray-100">
                {portfolio.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    {entry.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.image_url}
                        alt={entry.title}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-300">
                          <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                          <path d="M2 13l4-4 3 3 3-3 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{entry.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{entry.description}</p>
                      {entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline mt-0.5 inline-block truncate max-w-xs"
                        >
                          {entry.link}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handlePortfolioDelete(entry)}
                      disabled={deletingId === entry.id}
                      className="flex-shrink-0 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-40 disabled:cursor-wait rounded-lg px-3 py-1.5 transition-colors"
                    >
                      {deletingId === entry.id ? "Deleting…" : "Delete"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
