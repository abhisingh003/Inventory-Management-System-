import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import { fetchCustomers, createCustomer, deleteCustomer, updateCustomer } from "../api/customers";
import type { Customer } from "../api/types";

const initialFormState = { full_name: "", email: "", phone: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [editId, setEditId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const result = await fetchCustomers(page, 12, search);
      setCustomers(result.data);
      setPagination(result.pagination);
    } catch {
      toast.error("Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page, search]);

  const openCreateModal = () => {
    setEditId(null);
    setFormState(initialFormState);
    setModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditId(customer.id);
    setFormState({
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setModalOpen(true);
  };

  const saveCustomer = async () => {
    try {
      if (!formState.full_name || !formState.email) {
        toast.error("Name and email are required");
        return;
      }
      if (editId) {
        await updateCustomer(editId, formState);
        toast.success("Customer updated");
      } else {
        await createCustomer(formState);
        toast.success("Customer added");
      }
      setModalOpen(false);
      loadCustomers();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to save customer");
    }
  };

  const removeCustomer = async (id: number) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Customer removed");
      loadCustomers();
    } catch {
      toast.error("Unable to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Customers</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Client directory</h2>
          <p className="mt-2 text-slate-400">Track customer rosters, contact info, and recent engagement.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add customer
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-300">
            <Search className="h-4 w-4" />
            <input
              className="bg-transparent text-sm outline-none placeholder:text-slate-500"
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-sm text-slate-400">Showing {customers.length} of {pagination.total}</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-800">
            <table className="table-base bg-slate-950/70">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {customers.map((customer) => (
                  <motion.tr key={customer.id} whileHover={{ scale: 1.01 }} className="bg-slate-950/80 transition-transform">
                    <td className="px-6 py-4 text-slate-100 font-medium">{customer.full_name}</td>
                    <td className="px-6 py-4 text-slate-300">{customer.email}</td>
                    <td className="px-6 py-4 text-slate-300">{customer.phone || "—"}</td>
                    <td className="px-6 py-4 text-slate-300">{customer.address || "No address"}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(customer.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 space-x-3 text-slate-200">
                      <button className="rounded-2xl border border-slate-700 px-3 py-2 hover:bg-white/5" onClick={() => openEditModal(customer)}>
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="rounded-2xl border border-slate-700 px-3 py-2 hover:bg-white/5" onClick={() => removeCustomer(customer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-4 text-slate-400">
        <p>Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}</p>
        <div className="flex gap-3">
          <button className="rounded-2xl border border-slate-800 px-4 py-2 text-sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
            Previous
          </button>
          <button className="rounded-2xl border border-slate-800 px-4 py-2 text-sm" disabled={page >= Math.ceil(pagination.total / pagination.limit)} onClick={() => setPage((prev) => prev + 1)}>
            Next
          </button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit customer" : "New customer"}>
        <div className="grid gap-4">
          <Input label="Name" value={formState.full_name} onChange={(e) => setFormState({ ...formState, full_name: e.target.value })} />
          <Input label="Email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
          <Input label="Phone" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} />
          <label className="block text-sm text-slate-300">
            Address
            <textarea
              className="input-field min-h-[120px] resize-none"
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
            />
          </label>
          <Button onClick={saveCustomer}>{editId ? "Save customer" : "Create customer"}</Button>
        </div>
      </Modal>
    </div>
  );
}
