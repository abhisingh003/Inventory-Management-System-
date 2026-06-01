from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    PositiveInt,
    condecimal,
    ConfigDict,
)


# ---------------- PRODUCTS ----------------

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    sku: str = Field(..., min_length=2, max_length=80)
    description: Optional[str] = None
    price: condecimal(
        max_digits=12,
        decimal_places=2,
        ge=0
    ) = Field(...)
    stock_quantity: int = Field(..., ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=150
    )
    sku: Optional[str] = Field(
        None,
        min_length=2,
        max_length=80
    )
    description: Optional[str] = None
    price: Optional[
        condecimal(
            max_digits=12,
            decimal_places=2,
            ge=0
        )
    ] = None
    stock_quantity: Optional[int] = Field(
        None,
        ge=0
    )


class ProductRead(ProductBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------- CUSTOMERS ----------------

class CustomerBase(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=150
    )
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=150
    )
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class CustomerRead(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------- ORDER ITEMS ----------------

class OrderItemBase(BaseModel):
    product_id: int
    quantity: PositiveInt


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal
    product_name: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------- ORDERS ----------------

class OrderBase(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderCreate(OrderBase):
    pass


class OrderRead(BaseModel):
    id: int
    customer_id: int
    total_amount: Decimal
    status: str
    created_at: datetime
    items: List[OrderItemRead]

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------- PAGINATION ----------------

class Pagination(BaseModel):
    page: int = 1
    limit: int = 20
    total: int = 0


class PaginatedResponse(BaseModel):
    data: list
    pagination: Pagination