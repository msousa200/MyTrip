from fastapi import APIRouter, HTTPException
from app.models.trip import TripRequest, TripResponse
from app.services.openai_service import openai_service
from datetime import datetime
from typing import List

router = APIRouter()

# Armazenamento temporário em memória (depois vamos usar MongoDB)
trips_db: List[TripResponse] = []

@router.post("/trips", response_model=TripResponse, status_code=201)
async def create_trip(trip_request: TripRequest):
    """
    Gera um novo roteiro de viagem usando IA
    """
    try:
        # Gerar roteiro com OpenAI
        itinerary_data = await openai_service.generate_itinerary(
            region=trip_request.region,
            duration_days=trip_request.duration_days,
            budget=trip_request.budget or "medio",
            interests=trip_request.interests or [],
            budget_min=trip_request.budget_min,
            budget_max=trip_request.budget_max
        )
        
        # Criar resposta
        trip_response = TripResponse(
            id=f"trip_{len(trips_db) + 1}",
            region=trip_request.region,
            duration_days=trip_request.duration_days,
            itinerary=itinerary_data.get("itinerary", []),
            general_tips=itinerary_data.get("general_tips", []),
            estimated_cost=itinerary_data.get("estimated_cost"),
            best_season=itinerary_data.get("best_season"),
            created_at=datetime.utcnow()
        )
        
        # Salvar em memória
        trips_db.append(trip_response)
        
        return trip_response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar roteiro: {str(e)}"
        )

@router.get("/trips")
async def list_trips():
    """
    Lista todos os roteiros criados
    """
    return {"trips": trips_db}

@router.get("/trips/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: str):
    """
    Obtém detalhes de um roteiro específico
    """
    for trip in trips_db:
        if trip.id == trip_id:
            return trip
    
    raise HTTPException(status_code=404, detail="Roteiro não encontrado")

@router.delete("/trips/{trip_id}")
async def delete_trip(trip_id: str):
    """
    Remove um roteiro
    """
    global trips_db
    
    for i, trip in enumerate(trips_db):
        if trip.id == trip_id:
            trips_db.pop(i)
            return {"message": "Roteiro removido com sucesso"}
    
    raise HTTPException(status_code=404, detail="Roteiro não encontrado")
