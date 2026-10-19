"""SQLite storage for classified results and their public signature keys."""

from __future__ import annotations

import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data" / "heartometer.db"


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = _connect()
    try:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS results (
                signature TEXT PRIMARY KEY,
                age REAL NOT NULL,
                gender TEXT NOT NULL,
                systolic REAL NOT NULL,
                sugar REAL NOT NULL,
                alcohol TEXT NOT NULL,
                heart_disease INTEGER NOT NULL,
                probability REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.commit()
    finally:
        connection.close()


def save_result(
    *,
    age: float,
    gender: str,
    systolic: float,
    sugar: float,
    alcohol: str,
    heart_disease: bool,
    probability: float,
) -> str:
    created_at = datetime.now(timezone.utc).isoformat()
    for _ in range(5):
        signature = secrets.token_urlsafe(18)
        try:
            connection = _connect()
            try:
                connection.execute(
                    """
                    INSERT INTO results (
                        signature, age, gender, systolic, sugar, alcohol,
                        heart_disease, probability, created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        signature,
                        age,
                        gender,
                        systolic,
                        sugar,
                        alcohol,
                        1 if heart_disease else 0,
                        probability,
                        created_at,
                    ),
                )
                connection.commit()
            finally:
                connection.close()
            return signature
        except sqlite3.IntegrityError:
            continue
    raise RuntimeError("Could not generate a unique signature")


def get_result(signature: str) -> dict[str, object] | None:
    connection = _connect()
    try:
        row = connection.execute(
            "SELECT * FROM results WHERE signature = ?",
            (signature,),
        ).fetchone()
    finally:
        connection.close()
    if row is None:
        return None
    return {
        "signature": row["signature"],
        "age": row["age"],
        "gender": row["gender"],
        "systolic": row["systolic"],
        "sugar": row["sugar"],
        "alcohol": row["alcohol"],
        "heart_disease": bool(row["heart_disease"]),
        "probability": row["probability"],
        "created_at": row["created_at"],
    }


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection
