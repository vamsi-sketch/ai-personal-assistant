"""
MongoDB Client and Database Connector using Motor (Async) and PyMongo.
Collections:
- students
- documents
- topics
- quiz_questions
- quiz_attempts
- student_interactions
- topic_mastery
- recommendations
- study_plans
"""

import os
from typing import Optional

try:
    from motor.motor_asyncio import AsyncIOMotorClient
except ImportError:
    AsyncIOMotorClient = None

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "adaptive_learning_db")

client: Optional[AsyncIOMotorClient] = None
db = None

async def connect_to_mongo():
    global client, db
    if AsyncIOMotorClient:
        try:
            client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
            db = client[MONGODB_DB_NAME]
            print(f"MongoDB connected to {MONGODB_DB_NAME}")
        except Exception as e:
            print(f"MongoDB connection notice: {e}. In-memory fallback will be active.")
    else:
        print("Motor not installed. Operating with high-speed in-memory datastore.")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

def get_database():
    return db
