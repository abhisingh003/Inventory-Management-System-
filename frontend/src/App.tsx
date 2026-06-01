import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/layout/Sidebar";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-slate-900 via-slate-950 to-transparent opacity-80" />
        <div className="relative mx-auto flex min-h-screen max-w-[1600px] px-4 py-6 lg:px-8">
          <Sidebar />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
