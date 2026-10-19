"""Heart-disease classifier trained on the local CSV.

Import from another module inside this folder:

    from heart_disease import predict_heart_disease

Or from the repository root:

    from backend.heart_disease import predict_heart_disease
"""

from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path
from typing import NamedTuple

import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

DATA_PATH = Path(__file__).with_name("heart-disease-training.csv")

GENDERS = ("female", "male")
ALCOHOL_LEVELS = ("none", "occasional", "regular")


class HeartDiseaseClassification(NamedTuple):
    heart_disease: bool
    probability: float


def predict_heart_disease(
    age: float,
    gender: str,
    systolic: float,
    sugar: float,
    alcohol: str,
) -> bool:
    """Return whether the fitted model classifies these inputs as heart disease.

    ``gender`` is ``female`` or ``male``. ``alcohol`` is ``none``,
    ``occasional``, or ``regular``. ``systolic`` is mmHg and ``sugar`` is mmol/L.
    """
    return classify_heart_disease(age, gender, systolic, sugar, alcohol).heart_disease


def classify_heart_disease(
    age: float,
    gender: str,
    systolic: float,
    sugar: float,
    alcohol: str,
) -> HeartDiseaseClassification:
    """Return the class and the model's probability of heart disease."""
    features = _feature_row(
        _number("age", age),
        _number("systolic", systolic),
        _number("sugar", sugar),
        _choice("gender", gender, GENDERS),
        _choice("alcohol", alcohol, ALCOHOL_LEVELS),
    ).reshape(1, -1)
    model = _trained_model()
    heart_disease = int(model.predict(features)[0]) == 1
    probability = float(model.predict_proba(features)[0, 1])
    return HeartDiseaseClassification(heart_disease, probability)


@lru_cache(maxsize=1)
def _trained_model() -> Pipeline:
    rows = _read_training_rows()
    features = np.vstack(
        [
            _feature_row(
                float(row["age"]),
                float(row["systolic_mmhg"]),
                float(row["sugar_mmol"]),
                row["gender"],
                row["alcohol"],
            )
            for row in rows
        ]
    )
    labels = np.array([int(row["heart_disease"]) for row in rows])
    # Numbers are scaled. Gender and alcohol are already 0/1 columns.
    model = Pipeline(
        [
            (
                "features",
                ColumnTransformer(
                    [
                        ("numbers", StandardScaler(), [0, 1, 2]),
                        ("categories", "passthrough", [3, 4, 5]),
                    ]
                ),
            ),
            ("classifier", LogisticRegression(max_iter=1000)),
        ]
    )
    model.fit(features, labels)
    return model


def _feature_row(
    age: float,
    systolic: float,
    sugar: float,
    gender: str,
    alcohol: str,
) -> np.ndarray:
    """One numeric row: age, systolic, sugar, male, occasional, regular."""
    return np.array(
        [
            age,
            systolic,
            sugar,
            1.0 if gender == "male" else 0.0,
            1.0 if alcohol == "occasional" else 0.0,
            1.0 if alcohol == "regular" else 0.0,
        ]
    )


def _read_training_rows() -> list[dict[str, str]]:
    if not DATA_PATH.is_file():
        raise FileNotFoundError(f"Training data not found: {DATA_PATH}")
    with DATA_PATH.open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        raise ValueError(f"Training data is empty: {DATA_PATH}")
    return rows


def _number(name: str, value: float) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise TypeError(f"{name} must be a number")
    number = float(value)
    if not np.isfinite(number):
        raise ValueError(f"{name} must be a finite number")
    return number


def _choice(name: str, value: str, allowed: tuple[str, ...]) -> str:
    if not isinstance(value, str):
        raise TypeError(f"{name} must be one of: {', '.join(allowed)}")
    choice = value.strip().lower()
    if choice not in allowed:
        raise ValueError(f"{name} must be one of: {', '.join(allowed)}")
    return choice
