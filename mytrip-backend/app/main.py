from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import trips

app = FastAPI(
    title="MyTrip API",
    description="API para geração de roteiros de viagem com IA",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(trips.router, prefix="/api/v1", tags=["trips"])

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo ao MyTrip API",
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
