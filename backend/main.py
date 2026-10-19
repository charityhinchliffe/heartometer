"""Heartometer classification API.

Run from this folder:

    uvicorn main:app --reload
"""

from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import get_result, init_db, save_result
from heart_disease import classify_heart_disease


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Heartometer", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=(
        r"https?://(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?"
        r"|https://aware-dish-jolt\.ngrok-free\.dev"
    ),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class ClassificationRequest(BaseModel):
    age: float = Field(ge=18, le=90)
    gender: Literal["female", "male"]
    systolic: float = Field(ge=90, le=200)
    sugar: float = Field(ge=3, le=15)
    alcohol: Literal["none", "occasional", "regular"]


class ClassificationResponse(BaseModel):
    heart_disease: bool
    probability: float
    signature: str


class StoredResult(BaseModel):
    signature: str
    age: float
    gender: Literal["female", "male"]
    systolic: float
    sugar: float
    alcohol: Literal["none", "occasional", "regular"]
    heart_disease: bool
    probability: float
    created_at: str


@app.post("/predict", response_model=ClassificationResponse)
def predict(body: ClassificationRequest) -> ClassificationResponse:
    result = classify_heart_disease(
        age=body.age,
        gender=body.gender,
        systolic=body.systolic,
        sugar=body.sugar,
        alcohol=body.alcohol,
    )
    signature = save_result(
        age=body.age,
        gender=body.gender,
        systolic=body.systolic,
        sugar=body.sugar,
        alcohol=body.alcohol,
        heart_disease=result.heart_disease,
        probability=result.probability,
    )
    return ClassificationResponse(
        heart_disease=result.heart_disease,
        probability=result.probability,
        signature=signature,
    )


@app.get("/results/{signature}", response_model=StoredResult)
def read_result(signature: str) -> StoredResult:
    if not signature or any(character not in _SIGNATURE_ALPHABET for character in signature):
        raise HTTPException(status_code=404, detail="Result not found")
    row = get_result(signature)
    if row is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return StoredResult.model_validate(row)


_SIGNATURE_ALPHABET = set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")
