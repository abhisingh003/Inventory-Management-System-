import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/ui/Card";
import { fetchCustomers } from "../api/customers";
import { fetchProducts } from "../api/products";
import { fetchOrders } from "../api/orders";
import Spinner from "../components/ui/Spinner";

interface MetricCardProps {
  label: string;
  value: string;
  accent: string;
}

function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-3xl px-4 py-3 text-sm font-semibold text-white ${accent}`}>
          live
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [productsData, setProductsData] = useState<{ data: any[]; pagination: any } | null>(null);
  const [customersData, setCustomersData] = useState<{ data: any[]; pagination: any } | null>(null);
  const [ordersData, setOrdersData] = useState<{ data: any[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [products, customers, orders] = await Promise.all([
          fetchProducts(1, 20, ""),
          fetchCustomers(1, 20, ""),
          fetchOrders(1, 20, ""),
        ]);
        setProductsData(products);
        setCustomersData(customers);
        setOrdersData(orders);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenue = useMemo(() => {
    return ordersData?.data.reduce((sum, order) => sum + Number(order.total_amount), 0) ?? 0;
  }, [ordersData]);

  const lowStockCount = useMemo(() => {
    return productsData?.data.filter((item) => item.stock_quantity <= 10).length ?? 0;
  }, [productsData]);

  const salesSeries = useMemo(() => {
    if (!ordersData) return [];
    return ordersData.data.slice(0, 6).map((order, index) => ({ day: `#${index + 1}`, revenue: Number(order.total_amount) }));
  }, [ordersData]);

  const stockSeries = useMemo(() => {
    if (!productsData) return [];
    return productsData.data.slice(0, 5).map((product) => ({ name: product.name, stock: product.stock_quantity }));
  }, [productsData]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
            <h2 className="mt-2 text-4xl font-semibold text-white">Inventory operations made elegant.</h2>
            <p className="mt-4 max-w-2xl text-slate-400">Monitor stock, customers, orders, and revenue from one beautifully designed workspace.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-6 py-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Low stock alerts</p>
            <p className="mt-2 text-3xl font-semibold text-white">{lowStockCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard label="Products" value={`${productsData?.pagination.total ?? 0}`} accent="bg-violet-500" />
        <MetricCard label="Customers" value={`${customersData?.pagination.total ?? 0}`} accent="bg-sky-500" />
        <MetricCard label="Orders" value={`${ordersData?.pagination.total ?? 0}`} accent="bg-emerald-500" />
        <MetricCard label="Revenue" value={`$${revenue.toFixed(2)}`} accent="bg-fuchsia-500" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Orders overview" description="Recent order revenue trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 18, border: "1px solid rgba(148,163,184,.25)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Inventory snapshot" description="Stock levels for top products">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockSeries} dataKey="stock" nameKey="name" innerRadius={48} outerRadius={96} fill="#6366f1" stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 18, border: "1px solid rgba(148,163,184,.25)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
