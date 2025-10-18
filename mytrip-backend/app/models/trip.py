from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TripRequest(BaseModel):
    """Modelo para requisição de criação de roteiro"""
    region: str = Field(..., description="Região/cidade para o roteiro (ex: Lisboa, Paris, Roma)")
    duration_days: int = Field(..., ge=1, le=30, description="Número de dias (1-30)")
    budget: Optional[str] = Field(None, description="Orçamento: economico, medio, alto (deprecated)")
    budget_min: Optional[int] = Field(None, ge=10, le=500, description="Orçamento mínimo diário em euros")
    budget_max: Optional[int] = Field(None, ge=10, le=500, description="Orçamento máximo diário em euros")
    interests: Optional[List[str]] = Field(default=[], description="Interesses: aventura, cultura, gastronomia, praia, etc")
    country: Optional[str] = Field(None, description="País do destino (opcional, será inferido pela região)")

class Place(BaseModel):
    """Modelo para um local turístico"""
    name: str
    description: str
    duration: str  # Ex: "2 horas"
    start_time: Optional[str] = None  # Ex: "09:00"
    end_time: Optional[str] = None  # Ex: "11:00"
    tips: Optional[str] = None
    entrance_fee: Optional[str] = None  # Ex: "€8-12"

class Meal(BaseModel):
    """Modelo para refeição"""
    type: str  # "Pequeno-almoço", "Almoço", "Lanche", "Jantar"
    time: str  # Ex: "13:00"
    restaurant: str
    suggestion: str  # O que comer
    estimated_cost: str  # Ex: "€15-25 por pessoa"
    location: Optional[str] = None

class DayItinerary(BaseModel):
    """Modelo para itinerário de um dia"""
    day: int
    title: str
    date: Optional[str] = None  # Ex: "Segunda-feira, 15 de Maio"
    places: List[Place]
    meals: List[Meal]
    accommodation_suggestion: Optional[str] = None
    daily_budget: Optional[str] = None  # Ex: "€60-90"

class TripResponse(BaseModel):
    """Modelo para resposta de roteiro gerado"""
    id: Optional[str] = None
    region: str
    duration_days: int
    itinerary: List[DayItinerary]
    general_tips: Optional[List[str]] = None
    estimated_cost: Optional[str] = None
    best_season: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TripSummary(BaseModel):
    """Modelo resumido de roteiro para listagem"""
    id: str
    region: str
    duration_days: int
    created_at: datetime
