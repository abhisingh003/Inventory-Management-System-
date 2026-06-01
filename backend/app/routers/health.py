from fastapi import APIRouter
from app.database import engine

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", summary="Health check")
async def health_check():
    return {"status": "healthy"}
