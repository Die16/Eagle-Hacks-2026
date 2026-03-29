import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

type Transaction = {
  date?: string;
  description?: string;
  category?: string;
  amount?: number;
  type?: string;
  risk_flag?: string;
  reason?: string;
};

type ApiResponse = {
  customer_name?: string;
  month?: string;
  monthly_income?: number;
  monthly_expenses?: number;
  transactions?: Transaction[];
  flagged_transactions?: Transaction[];
  riskLevel?: string;
  ai_summary?: string;
  ai_recommendations?: string[];
};

function riskRow(flag?: string) {
  if ((flag || "").toLowerCase() === "high") {
    return "bg-red-500/10 hover:bg-red-500/15";
  }
  if ((flag || "").toLowerCase() === "medium") {
    return "bg-amber-500/10 hover:bg-amber-500/15";
  }
  return "hover:bg-white/5";
}

function riskBadge(level?: string) {
  const value = (level || "").toLowerCase();

  if (value === "high") {
    return "bg-red-500/20 text-red-200 border border-red-400/30";
  }
  if (value === "medium") {
    return "bg-amber-500/20 text-amber-200 border border-amber-400/30";
  }
  return "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30";
}

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);
}

export default function App() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setData(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await axios.post<ApiResponse>(
        "http://127.0.0.1:8000/analyze-customer",
        json
      );

      console.log("BACKEND RESPONSE:", res.data);
      setData(res.data);
    } catch (e) {
      setError("Invalid JSON or backend error.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    maxFiles: 1,
  });

  const net = useMemo(() => {
    if (!data) return 0;
    return (data.monthly_income ?? 0) - (data.monthly_expenses ?? 0);
  }, [data]);

  const transactions = data?.transactions ?? [];
  const flaggedTransactions = data?.flagged_transactions ?? [];
  const aiRecommendations = data?.ai_recommendations ?? [];

  const resetUpload = () => {
    setFileName("");
    setError("");
    setData(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_22%),linear-gradient(180deg,#07111f_0%,#0b1020_35%,#111827_100%)] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">

          <h1 className="text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              SmartBalance
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            Upload a monthly transaction file to detect suspicious activity,
            highlight risky behavior, and generate evidence-based AI insights from
            real customer transactions.
          </p>
        </div>

        {!data && !loading && (
          <div
            {...getRootProps()}
            className={`mb-8 rounded-[28px] border border-white/10 bg-white/[0.06] p-10 shadow-glow backdrop-blur-xl transition duration-300 ${
              isDragActive
                ? "scale-[1.01] border-sky-300/40 bg-sky-400/10"
                : "hover:border-white/15 hover:bg-white/[0.08]"
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-400/10 text-4xl shadow-glow">
                ⤴
              </div>
              <h2 className="mb-2 text-2xl font-semibold">
                {isDragActive
                  ? "Drop your JSON file here"
                  : "Drag & drop your transaction file"}
              </h2>
              <p className="text-slate-300">or click to browse</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-2xl border border-sky-400/20 bg-sky-400/10 px-5 py-4 text-sky-100 shadow-glow">
            Analyzing customer data and generating AI insights...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-red-100 shadow-glow">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200">
                Loaded: {fileName}
              </div>

              <button
                onClick={resetUpload}
                className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-400/20"
              >
                Analyze Another File
              </button>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Card label="Customer" value={data.customer_name ?? "Unknown"} />
              <Card label="Month" value={data.month ?? "Unknown"} />
              <Card label="Income" value={formatCurrency(data.monthly_income)} />
              <Card label="Expenses" value={formatCurrency(data.monthly_expenses)} />
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/10 to-slate-900 p-5 shadow-glow backdrop-blur-md">
                <div className="mb-2 text-sm uppercase tracking-[0.18em] text-slate-400">
                  Risk Level
                </div>
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${riskBadge(
                    data.riskLevel
                  )}`}
                >
                  {data.riskLevel ?? "Unknown"}
                </span>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <section className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-slate-900 p-6 shadow-glow backdrop-blur-md">
                <h2 className="mb-2 text-sm uppercase tracking-[0.20em] text-sky-300">
                  AI Financial Analysis
                </h2>

                <div className="mb-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(165,180,252,0.95)]" />
                  <h3 className="text-2xl font-semibold">AI Insight</h3>
                </div>

                <p className="mb-5 text-lg leading-relaxed text-slate-200">
                  {data.ai_summary ?? "No AI summary available."}
                </p>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-100">
                    Recommended Actions
                  </h3>

                  {aiRecommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {aiRecommendations.map((r, i) => (
                        <li
                          key={i}
                          className="rounded-2xl border border-indigo-300/10 bg-indigo-400/5 px-4 py-3 text-slate-200 shadow-sm"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                      No recommendations available.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-md">
                <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
                <MetricRow label="Net Cash Flow" value={formatCurrency(net)} />
                <MetricRow
                  label="Flagged Transactions"
                  value={String(flaggedTransactions.length)}
                />
                <MetricRow label="Top Risk" value={data.riskLevel ?? "Unknown"} />
              </section>
            </div>

            <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Flagged Transactions</h2>
                <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-200">
                  Review Immediately
                </span>
              </div>

              <p className="mb-4 text-sm text-slate-300">
                {flaggedTransactions.length} flagged transactions detected across
                suspicious merchants, duplicate charges, and unusual transfer behavior.
              </p>

              <Table rows={flaggedTransactions} compact />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-semibold">All Transactions</h2>
              <Table rows={transactions} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-md">
      <div className="mb-2 text-sm uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 last:mb-0">
      <div className="mb-1 text-xs uppercase tracking-[0.18em] text-sky-300">
        {label}
      </div>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  );
}

function Table({
  rows,
  compact = false,
}: {
  rows: Transaction[];
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur">
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-sky-300">
            <th className="px-4 py-4">Date</th>
            <th className="px-4 py-4">Description</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Amount</th>
            <th className="px-4 py-4">Risk</th>
            {!compact && <th className="px-4 py-4">Type</th>}
            <th className="px-4 py-4">Reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t, i) => (
            <tr
              key={`${t.date ?? "unknown"}-${t.description ?? "unknown"}-${i}`}
              className={`border-t border-white/5 transition ${riskRow(t.risk_flag)}`}
            >
              <td className="px-4 py-4 text-sm text-slate-200">{t.date ?? "-"}</td>
              <td className="px-4 py-4 text-sm font-medium text-white">
                {t.description ?? "-"}
              </td>
              <td className="px-4 py-4 text-sm text-slate-300">{t.category ?? "-"}</td>
              <td
                className={`px-4 py-4 text-sm font-medium ${
                  Number(t.amount ?? 0) < 0 ? "text-red-200" : "text-emerald-200"
                }`}
              >
                {formatCurrency(t.amount)}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${riskBadge(
                    t.risk_flag
                  )}`}
                >
                  {t.risk_flag ?? "low"}
                </span>
              </td>
              {!compact && (
                <td className="px-4 py-4 text-sm text-slate-300">{t.type ?? "-"}</td>
              )}
              <td className="px-4 py-4 text-sm text-slate-300">{t.reason ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
