from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app import models
from app.routers import products, customers, orders, health

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# CREATE TABLES AUTOMATICALLY
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.include_router(health)
app.include_router(products)
app.include_router(customers)
app.include_router(orders)


@app.get("/")
async def root():
    return {
        "message": "Inventory API running"
    }