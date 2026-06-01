import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="glass-card p-16 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">404 error</p>
      <h1 className="mt-4 text-5xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 text-slate-400">The dashboard route you are looking for has been moved or does not exist.</p>
      <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-slate-800 px-6 py-3 text-sm text-white transition hover:bg-slate-700">
        <ArrowLeft className="mr-2 h-4 w-4" /> Return home
      </Link>
    </div>
  );
}
