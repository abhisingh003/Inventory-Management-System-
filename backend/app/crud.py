from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app import models, schemas


# ---------------- PRODUCTS ----------------

async def list_products(session, page=1, limit=20, search=None):
    query = select(models.Product)

    if search:
        query = query.where(
            models.Product.name.ilike(
                f"%{search}%"
            )
        )

    total = await session.scalar(
        select(func.count()).select_from(
            query.subquery()
        )
    )

    result = await session.execute(
        query.offset(
            (page - 1) * limit
        ).limit(limit)
    )

    return result.scalars().all(), total


async def get_product(session, product_id):
    result = await session.execute(
        select(models.Product).where(
            models.Product.id == product_id
        )
    )

    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            404,
            "Product not found"
        )

    return product


async def create_product(session, payload):
    existing = await session.execute(
        select(models.Product).where(
            models.Product.sku == payload.sku
        )
    )

    if existing.scalar_one_or_none():
        raise HTTPException(
            400,
            "SKU already exists"
        )

    product = models.Product(
        **payload.model_dump()
    )

    session.add(product)
    await session.commit()
    await session.refresh(product)

    return product


async def update_product(session, product_id, payload):
    product = await get_product(
        session,
        product_id
    )

    for key, value in payload.model_dump(
        exclude_unset=True
    ).items():
        setattr(product, key, value)

    await session.commit()
    await session.refresh(product)

    return product


async def delete_product(session, product_id):
    product = await get_product(
        session,
        product_id
    )

    await session.delete(product)
    await session.commit()

    return product


# ---------------- CUSTOMERS ----------------

async def list_customers(
    session,
    page=1,
    limit=20,
    search=None
):
    query = select(models.Customer)

    if search:
        query = query.where(
            models.Customer.full_name.ilike(
                f"%{search}%"
            )
        )

    total = await session.scalar(
        select(func.count()).select_from(
            query.subquery()
        )
    )

    result = await session.execute(
        query.offset(
            (page - 1) * limit
        ).limit(limit)
    )

    return result.scalars().all(), total


async def get_customer(
    session,
    customer_id
):
    result = await session.execute(
        select(models.Customer).where(
            models.Customer.id == customer_id
        )
    )

    customer = result.scalar_one_or_none()

    if not customer:
        raise HTTPException(
            404,
            "Customer not found"
        )

    return customer


async def create_customer(
    session,
    payload
):
    existing = await session.execute(
        select(models.Customer).where(
            models.Customer.email == payload.email
        )
    )

    if existing.scalar_one_or_none():
        raise HTTPException(
            400,
            "Email already exists"
        )

    customer = models.Customer(
        **payload.model_dump()
    )

    session.add(customer)
    await session.commit()
    await session.refresh(customer)

    return customer


async def update_customer(
    session,
    customer_id,
    payload
):
    customer = await get_customer(
        session,
        customer_id
    )

    for key, value in payload.model_dump(
        exclude_unset=True
    ).items():
        setattr(customer, key, value)

    await session.commit()
    await session.refresh(customer)

    return customer


async def delete_customer(
    session,
    customer_id
):
    customer = await get_customer(
        session,
        customer_id
    )

    await session.delete(customer)
    await session.commit()

    return customer


# ---------------- ORDERS ----------------

async def list_orders(
    session,
    page=1,
    limit=20,
    search=None
):
    query = select(
        models.Order
    ).options(
        selectinload(
            models.Order.items
        ).selectinload(
            models.OrderItem.product
        )
    )

    total = await session.scalar(
        select(func.count()).select_from(
            query.subquery()
        )
    )

    result = await session.execute(
        query.offset(
            (page - 1) * limit
        ).limit(limit)
    )

    return result.scalars().all(), total


async def get_order(
    session,
    order_id
):
    result = await session.execute(
        select(models.Order)
        .options(
            selectinload(
                models.Order.items
            ).selectinload(
                models.OrderItem.product
            )
        )
        .where(
            models.Order.id == order_id
        )
    )

    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            404,
            "Order not found"
        )

    return order


async def create_order(
    session,
    payload
):
    customer = await get_customer(
        session,
        payload.customer_id
    )

    total = 0
    items = []

    for item in payload.items:
        product = await get_product(
            session,
            item.product_id
        )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                400,
                f"Insufficient stock for {product.name}"
            )

        product.stock_quantity -= item.quantity

        order_item = models.OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        items.append(order_item)
        total += (
            product.price *
            item.quantity
        )

    order = models.Order(
        customer_id=customer.id,
        total_amount=total,
        status="PENDING",
        items=items,
    )

    session.add(order)

    await session.commit()
    await session.refresh(order)

    return await get_order(
        session,
        order.id
    )