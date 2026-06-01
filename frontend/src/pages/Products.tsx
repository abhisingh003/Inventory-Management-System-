import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../api/products";
import type { Product } from "../api/types";

const initialFormState = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  stock_quantity: 0,
};

export default function Products() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [formState, setFormState] =
    useState(initialFormState);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 20,
      total: 0,
    });

  const loadProducts = async () => {
    setLoading(true);

    try {
      const result =
        await fetchProducts(
          page,
          12,
          search
        );

      setProducts(result.data);
      setPagination(
        result.pagination
      );
    } catch {
      toast.error(
        "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const openCreateModal = () => {
    setEditId(null);
    setFormState(
      initialFormState
    );
    setModalOpen(true);
  };

  const openEditModal = (
    product: Product
  ) => {
    setEditId(product.id);

    setFormState({
      name: product.name,
      sku: product.sku,
      description:
        product.description || "",
      price: Number(
        product.price
      ),
      stock_quantity:
        product.stock_quantity,
    });

    setModalOpen(true);
  };

  const saveProduct =
    async () => {
      try {
        if (
          !formState.name ||
          !formState.sku
        ) {
          toast.error(
            "Name and SKU are required"
          );
          return;
        }

        if (editId) {
          await updateProduct(
            editId,
            formState
          );

          toast.success(
            "Product updated"
          );
        } else {
          await createProduct(
            formState
          );

          toast.success(
            "Product added"
          );
        }

        setModalOpen(false);
        loadProducts();
      } catch (
        error: any
      ) {
        toast.error(
          error?.response?.data
            ?.detail ||
            "Unable to save product"
        );
      }
    };

  const removeProduct =
    async (id: number) => {
      if (
        !confirm(
          "Delete this product?"
        )
      )
        return;

      try {
        await deleteProduct(id);

        toast.success(
          "Product removed"
        );

        loadProducts();
      } catch {
        toast.error(
          "Unable to delete"
        );
      }
    };

  const statusBadge = (
    stock: number
  ) => {
    if (stock <= 5)
      return "bg-rose-500/15 text-rose-200";

    if (stock <= 15)
      return "bg-amber-500/15 text-amber-200";

    return "bg-emerald-500/15 text-emerald-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Products
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-white">
            Inventory catalog
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your product list,
            pricing, and stock at a
            glance.
          </p>
        </div>

        <Button
          onClick={
            openCreateModal
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add product
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-300">
            <Search className="h-4 w-4" />

            <input
              className="bg-transparent text-sm outline-none placeholder:text-slate-500"
              placeholder="Search by name or SKU"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          <p className="text-sm text-slate-400">
            Displaying {
              products.length
            }{" "}
            of {
              pagination.total
            }{" "}
            products
          </p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-800">
            <table className="table-base bg-slate-950/70">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-6 py-4">
                    Name
                  </th>
                  <th className="px-6 py-4">
                    SKU
                  </th>
                  <th className="px-6 py-4">
                    Price
                  </th>
                  <th className="px-6 py-4">
                    Stock
                  </th>
                  <th className="px-6 py-4">
                    Created
                  </th>
                  <th className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {products.map(
                  (
                    product
                  ) => (
                    <motion.tr
                      key={
                        product.id
                      }
                      whileHover={{
                        scale: 1.01,
                      }}
                      className="bg-slate-950/80 transition-transform"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">
                          {
                            product.name
                          }
                        </div>

                        <p className="text-xs text-slate-500">
                          {product.description ||
                            "No description"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {
                          product.sku
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-100">
                        $
                        {Number(
                          product.price
                        ).toFixed(
                          2
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                            product.stock_quantity
                          )}`}
                        >
                          {
                            product.stock_quantity
                          }{" "}
                          in stock
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(
                          product.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 space-x-3 text-slate-200">
                        <button
                          className="rounded-2xl border border-slate-700 px-3 py-2 hover:bg-white/5"
                          onClick={() =>
                            openEditModal(
                              product
                            )
                          }
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          className="rounded-2xl border border-slate-700 px-3 py-2 hover:bg-white/5"
                          onClick={() =>
                            removeProduct(
                              product.id
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-4 text-slate-400">
        <p>
          Page {
            pagination.page
          }{" "}
          of{" "}
          {Math.ceil(
            pagination.total /
              pagination.limit
          ) || 1}
        </p>

        <div className="flex gap-3">
          <button
            className="rounded-2xl border border-slate-800 px-4 py-2 text-sm"
            disabled={page === 1}
            onClick={() =>
              setPage(
                (prev) =>
                  Math.max(
                    prev - 1,
                    1
                  )
              )
            }
          >
            Previous
          </button>

          <button
            className="rounded-2xl border border-slate-800 px-4 py-2 text-sm"
            disabled={
              page >=
              Math.ceil(
                pagination.total /
                  pagination.limit
              )
            }
            onClick={() =>
              setPage(
                (prev) =>
                  prev + 1
              )
            }
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        title={
          editId
            ? "Edit product"
            : "New product"
        }
      >
        <div className="grid gap-4">
          <Input
            label="Name"
            value={
              formState.name
            }
            onChange={(e) =>
              setFormState({
                ...formState,
                name:
                  e.target
                    .value,
              })
            }
          />

          <Input
            label="SKU"
            value={
              formState.sku
            }
            onChange={(e) =>
              setFormState({
                ...formState,
                sku:
                  e.target
                    .value,
              })
            }
          />

          <Input
            label="Price"
            type="number"
            value={
              formState.price
            }
            onChange={(e) =>
              setFormState({
                ...formState,
                price:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
          />

          <Input
            label="Stock quantity"
            type="number"
            value={
              formState.stock_quantity
            }
            onChange={(e) =>
              setFormState({
                ...formState,
                stock_quantity:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
          />

          <label className="block text-sm text-slate-300">
            Description

            <textarea
              className="input-field min-h-[120px] resize-none"
              value={
                formState.description
              }
              onChange={(e) =>
                setFormState({
                  ...formState,
                  description:
                    e.target
                      .value,
                })
              }
            />
          </label>

          <Button
            onClick={
              saveProduct
            }
          >
            {editId
              ? "Save changes"
              : "Create product"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}