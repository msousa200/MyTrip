#!/bin/bash
# Script de inicialização para Render

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
uvicorn app.main:app --host 0.0.0.0 --port $PORT
