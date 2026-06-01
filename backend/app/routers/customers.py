from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app import crud, schemas

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get("", response_model=dict)
async def list_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
):
    items, total = await crud.list_customers(
        session,
        page,
        limit,
        search,
    )

    return {
        "data": [
            schemas.CustomerRead
            .model_validate(item)
            .model_dump()
            for item in items
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
        },
    }


@router.get(
    "/{customer_id}",
    response_model=schemas.CustomerRead
)
async def get_customer(
    customer_id: int,
    session: AsyncSession = Depends(get_session),
):
    return await crud.get_customer(
        session,
        customer_id,
    )


@router.post(
    "",
    response_model=schemas.CustomerRead,
    status_code=201
)
async def create_customer(
    payload: schemas.CustomerCreate,
    session: AsyncSession = Depends(get_session),
):
    return await crud.create_customer(
        session,
        payload,
    )


@router.put(
    "/{customer_id}",
    response_model=schemas.CustomerRead
)
async def update_customer(
    customer_id: int,
    payload: schemas.CustomerUpdate,
    session: AsyncSession = Depends(get_session),
):
    return await crud.update_customer(
        session,
        customer_id,
        payload,
    )


@router.delete(
    "/{customer_id}",
    response_model=schemas.CustomerRead
)
async def delete_customer(
    customer_id: int,
    session: AsyncSession = Depends(get_session),
):
    return await crud.delete_customer(
        session,
        customer_id,
    )