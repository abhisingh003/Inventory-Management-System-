from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, Enum, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        UniqueConstraint("sku", name="uq_product_sku"),
        CheckConstraint("price >= 0", name="chk_product_price_non_negative"),
        CheckConstraint("stock_quantity >= 0", name="chk_product_stock_non_negative"),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    sku = Column(String(80), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(12, 2), nullable=False, default=0)
    stock_quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")


class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("email", name="uq_customer_email"),
    )

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False, default=0)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.pending)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="chk_order_item_quantity_positive"),
        CheckConstraint("price >= 0", name="chk_order_item_price_non_negative"),
    )

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
