import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Box, Users, ShoppingBag, Sparkles } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Products", path: "/products", icon: Box },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Orders", path: "/orders", icon: ShoppingBag },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="mr-8 hidden w-72 flex-none flex-col rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/20">
          <Sparkles size={24} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Inventory HQ</p>
          <h1 className="text-xl font-semibold text-white">Control center</h1>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="group block">
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm transition ${
                  active
                    ? "border-violet-400/50 bg-white/10 text-white shadow-md shadow-violet-500/10"
                    : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-white/5"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
