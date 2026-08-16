from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
import os
import logging
from pathlib import Path


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

COUNTER_ID = "page_views"
CODA_COUNTER_ID = "coda_reaches"


async def read_counts():
    views = await db.counters.find_one({"_id": COUNTER_ID})
    coda = await db.counters.find_one({"_id": CODA_COUNTER_ID})
    return {
        "count": views["count"] if views else 0,
        "coda": coda["count"] if coda else 0,
    }


@api_router.get("/")
async def root():
    return {"message": "youmademehateyou — notice server"}


@api_router.get("/views")
async def get_views():
    return await read_counts()


@api_router.post("/views")
async def increment_views():
    await db.counters.update_one({"_id": COUNTER_ID}, {"$inc": {"count": 1}}, upsert=True)
    return await read_counts()


@api_router.post("/views/coda")
async def increment_coda_reaches():
    await db.counters.update_one({"_id": CODA_COUNTER_ID}, {"$inc": {"count": 1}}, upsert=True)
    return await read_counts()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
