import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchOrders,
  createOrder,
} from "../api/orders";
import { fetchCustomers } from "../api/customers";
import { fetchProducts } from "../api/products";
import type {
  Customer,
  Product,
  Order,
  OrderInputItem,
} from "../api/types";

const emptyOrderRow: OrderInputItem = {
  product_id: 0,
  quantity: 1,
  id: Date.now(),
};

export default function Orders() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [customerId, setCustomerId] =
    useState(0);

  const [orderRows, setOrderRows] =
    useState<OrderInputItem[]>([
      { ...emptyOrderRow },
    ]);

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        orderResult,
        customerResult,
        productResult,
      ] = await Promise.all([
        fetchOrders(),
        fetchCustomers(),
        fetchProducts(),
      ]);

      setOrders(orderResult.data);
      setCustomers(
        customerResult.data
      );
      setProducts(
        productResult.data
      );
    } catch {
      toast.error(
        "Unable to load order data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateRow = (
    id: number,
    field:
      | "product_id"
      | "quantity",
    value: number
  ) => {
    setOrderRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]:
                value,
            }
          : row
      )
    );
  };

  const addRow = () => {
    setOrderRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        product_id: 0,
        quantity: 1,
      },
    ]);
  };

  const lineTotal = (
    row: OrderInputItem
  ) => {
    const product =
      products.find(
        (p) =>
          p.id ===
          row.product_id
      );

    return product
      ? Number(
          product.price
        ) * row.quantity
      : 0;
  };

  const totalPrice =
    useMemo(
      () =>
        orderRows.reduce(
          (sum, row) =>
            sum +
            lineTotal(
              row
            ),
          0
        ),
      [orderRows, products]
    );

  const submitOrder =
    async () => {
      if (!customerId) {
        toast.error(
          "Select customer"
        );
        return;
      }

      try {
        await createOrder({
          customer_id:
            customerId,
          items:
            orderRows.map(
              (
                row
              ) => ({
                product_id:
                  row.product_id,
                quantity:
                  row.quantity,
              })
            ),
        });

        toast.success(
          "Order created"
        );

        setOrderRows([
          {
            ...emptyOrderRow,
          },
        ]);

        setCustomerId(0);

        loadData();
      } catch (
        error: any
      ) {
        toast.error(
          error?.response?.data
            ?.detail ||
            "Order failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-3xl font-semibold">
          Orders
        </h2>

        <p className="text-slate-400 mt-2">
          Create and manage
          customer orders
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
        <select
          className="input-field"
          value={customerId}
          onChange={(e) =>
            setCustomerId(
              Number(
                e.target
                  .value
              )
            )
          }
        >
          <option value={0}>
            Select customer
          </option>

          {customers.map(
            (
              customer
            ) => (
              <option
                key={
                  customer.id
                }
                value={
                  customer.id
                }
              >
                {
                  customer.full_name
                }
              </option>
            )
          )}
        </select>

        {orderRows.map(
          (row) => (
            <div
              key={row.id}
              className="grid grid-cols-3 gap-3"
            >
              <select
                className="input-field"
                value={
                  row.product_id
                }
                onChange={(
                  e
                ) =>
                  updateRow(
                    row.id,
                    "product_id",
                    Number(
                      e
                        .target
                        .value
                    )
                  )
                }
              >
                <option value={0}>
                  Product
                </option>

                {products.map(
                  (
                    product
                  ) => (
                    <option
                      key={
                        product.id
                      }
                      value={
                        product.id
                      }
                    >
                      {
                        product.name
                      }
                    </option>
                  )
                )}
              </select>

              <input
                type="number"
                min={1}
                className="input-field"
                value={
                  row.quantity
                }
                onChange={(
                  e
                ) =>
                  updateRow(
                    row.id,
                    "quantity",
                    Number(
                      e
                        .target
                        .value
                    )
                  )
                }
              />

              <div className="flex items-center text-slate-300">
                ₹
                {lineTotal(
                  row
                ).toFixed(
                  2
                )}
              </div>
            </div>
          )
        )}

        <button
          className="rounded-2xl border border-slate-700 px-4 py-2"
          onClick={
            addRow
          }
        >
          Add Item
        </button>

        <div className="text-lg font-semibold">
          Total: ₹
          {totalPrice.toFixed(
            2
          )}
        </div>

        <button
          className="rounded-2xl bg-indigo-500 px-5 py-3 font-medium"
          onClick={
            submitOrder
          }
        >
          Create Order
        </button>
      </div>

      <div className="space-y-4">
        {orders.map(
          (order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"
            >
              <div className="flex justify-between">
                <div>
                  Order #
                  {order.id}
                </div>

                <div>
                  ₹
                  {Number(
                    order.total_amount
                  ).toFixed(
                    2
                  )}
                </div>
              </div>

              <div className="mt-2 text-slate-400">
                {
                  order.status
                }
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}