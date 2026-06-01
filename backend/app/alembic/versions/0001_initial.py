"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-06-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg

revision = "0001_initial"
down_revision = None
branch_labels = None
de_pends_on = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("sku", sa.String(length=80), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("stock_quantity", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("sku", name="uq_product_sku"),
        sa.CheckConstraint("price >= 0", name="chk_product_price_non_negative"),
        sa.CheckConstraint("stock_quantity >= 0", name="chk_product_stock_non_negative"),
    )
    op.create_index(op.f("ix_products_id"), "products", ["id"], unique=False)
    op.create_index(op.f("ix_products_sku"), "products", ["sku"], unique=False)

    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("email", name="uq_customer_email"),
    )
    op.create_index(op.f("ix_customers_id"), "customers", ["id"], unique=False)
    op.create_index(op.f("ix_customers_email"), "customers", ["email"], unique=False)

    order_status = pg.ENUM("pending", "completed", "cancelled", name="orderstatus")
    order_status.create(op.get_bind())

    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("status", sa.Enum("pending", "completed", "cancelled", name="orderstatus"), nullable=False, server_default="completed"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_orders_id"), "orders", ["id"], unique=False)

    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.CheckConstraint("quantity > 0", name="chk_order_item_quantity_positive"),
        sa.CheckConstraint("price >= 0", name="chk_order_item_price_non_negative"),
    )
    op.create_index(op.f("ix_order_items_id"), "order_items", ["id"], unique=False)


def downgrade() -> None:
    op.drop_table("order_items")
    op.drop_table("orders")
    op.execute("DROP TYPE orderstatus")
    op.drop_table("customers")
    op.drop_table("products")
