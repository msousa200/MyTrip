#!/usr/bin/env python3
"""Script de teste para a API MyTrip"""
import httpx
import json
import asyncio

BASE_URL = "http://localhost:8001"

async def test_api():
    async with httpx.AsyncClient() as client:
        # Teste 1: Health check
        print("🔍 Testando health check...")
        response = await client.get(f"{BASE_URL}/health")
        print(f"✅ Status: {response.status_code}")
        print(f"   Resposta: {response.json()}\n")
        
        # Teste 2: Root endpoint
        print("🔍 Testando endpoint raiz...")
        response = await client.get(f"{BASE_URL}/")
        print(f"✅ Status: {response.status_code}")
        print(f"   Resposta: {response.json()}\n")
        
        # Teste 3: Criar roteiro
        print("🔍 Criando roteiro para Lisboa (1 dia)...")
        trip_data = {
            "region": "Lisboa",
            "duration_days": 1,
            "budget": "medio",
            "interests": ["cultura", "gastronomia"]
        }
        response = await client.post(
            f"{BASE_URL}/api/v1/trips",
            json=trip_data,
            timeout=30.0
        )
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 201:
            trip = response.json()
            print(f"   ID do roteiro: {trip['id']}")
            print(f"   Região: {trip['region']}")
            print(f"   Dias: {trip['duration_days']}")
            print(f"   Número de dias no itinerário: {len(trip['itinerary'])}")
            if trip['itinerary']:
                print(f"   Primeiro dia: {trip['itinerary'][0]['title']}")
                print(f"   Locais no dia 1: {len(trip['itinerary'][0]['places'])}")
            print()
            
            # Teste 4: Listar roteiros
            print("🔍 Listando todos os roteiros...")
            response = await client.get(f"{BASE_URL}/api/v1/trips")
            trips = response.json()
            print(f"✅ Status: {response.status_code}")
            print(f"   Total de roteiros: {len(trips)}\n")
            
            # Teste 5: Obter roteiro específico
            trip_id = trip['id']
            print(f"🔍 Obtendo roteiro {trip_id}...")
            response = await client.get(f"{BASE_URL}/api/v1/trips/{trip_id}")
            print(f"✅ Status: {response.status_code}")
            print(f"   Roteiro recuperado com sucesso!\n")
            
        print("✨ Todos os testes passaram com sucesso!")

if __name__ == "__main__":
    asyncio.run(test_api())
