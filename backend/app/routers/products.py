from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app import crud, schemas

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get("", response_model=dict)
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
):
    items, total = await crud.list_products(
        session,
        page,
        limit,
        search
    )

    return {
        "data": [
            schemas.ProductRead
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
    "/{product_id}",
    response_model=schemas.ProductRead
)
async def get_product(
    product_id: int,
    session: AsyncSession = Depends(get_session),
):
    return await crud.get_product(
        session,
        product_id
    )


@router.post(
    "",
    response_model=schemas.ProductRead,
    status_code=201
)
async def create_product(
    payload: schemas.ProductCreate,
    session: AsyncSession = Depends(get_session),
):
    return await crud.create_product(
        session,
        payload
    )


@router.put(
    "/{product_id}",
    response_model=schemas.ProductRead
)
async def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    session: AsyncSession = Depends(get_session),
):
    return await crud.update_product(
        session,
        product_id,
        payload
    )


@router.delete(
    "/{product_id}",
    response_model=schemas.ProductRead
)
async def delete_product(
    product_id: int,
    session: AsyncSession = Depends(get_session),
):
    return await crud.delete_product(
        session,
        product_id
    )