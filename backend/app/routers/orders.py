from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app import crud, schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


def serialize_order(order):
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "total_amount": order.total_amount,
        "status": order.status.value if hasattr(order.status, "value") else order.status,
        "created_at": order.created_at,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "product_name": item.product.name if item.product else None,
            }
            for item in order.items
        ],
    }


@router.get("", response_model=dict)
async def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
):
    items, total = await crud.list_orders(session, page, limit, search)
    return {
        "data": [serialize_order(item) for item in items],
        "pagination": {"page": page, "limit": limit, "total": total},
    }


@router.get("/{order_id}", response_model=schemas.OrderRead)
async def get_order(order_id: int, session: AsyncSession = Depends(get_session)):
    order = await crud.get_order(session, order_id)
    return serialize_order(order)


@router.post("", response_model=schemas.OrderRead, status_code=201)
async def create_order(payload: schemas.OrderCreate, session: AsyncSession = Depends(get_session)):
    return await crud.create_order(session, payload)
