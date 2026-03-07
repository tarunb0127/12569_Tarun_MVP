from pydantic import BaseModel
from typing import List, Optional


class FaceBox(BaseModel):
    x: int
    y: int
    width: int
    height: int


class MetricResult(BaseModel):
    name: str
    score: int
    severity: str
    impactWeight: float
    details: str


class ProfessionalResponse(BaseModel):
    overallScore: int
    rating: str
    confidenceLevel: str
    analysisSummary: str
    metrics: List[MetricResult]
    improvementPriority: List[str]
    faceBox: FaceBox
    suggestions: Optional[str] = None