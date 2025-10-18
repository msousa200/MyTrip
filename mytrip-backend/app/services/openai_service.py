import os
from openai import OpenAI
from groq import Groq
from dotenv import load_dotenv
import json
from typing import Dict, Any

load_dotenv()

class OpenAIService:
    def __init__(self):
        # Verificar qual provider usar
        self.provider = os.getenv("AI_PROVIDER", "openai").lower()
        
        if self.provider == "groq":
            # Usar Groq (grátis!)
            groq_key = os.getenv("GROQ_API_KEY")
            if groq_key:
                self.client = Groq(api_key=groq_key)
                # Usar modelo mais recente e disponível
                self.model = "llama-3.3-70b-versatile"  # Modelo grátis e excelente
                print("✅ Usando Groq (GRÁTIS!)")
            else:
                self.client = None
        else:
            # Usar OpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key or api_key == "sk-test-key-placeholder":
                self.client = None  # Modo de teste sem API key
            else:
                self.client = OpenAI(api_key=api_key)
                self.model = "gpt-4o"
                print("✅ Usando OpenAI")
        
    async def generate_itinerary(
        self,
        region: str,
        duration_days: int,
        budget: str = "medio",
        interests: list = None,
        budget_min: int = None,
        budget_max: int = None
    ) -> Dict[str, Any]:
        """Gera um roteiro de viagem usando GPT-4"""
        
        interests_text = ", ".join(interests) if interests else "turismo geral"
        
        # Se budget_min e budget_max foram fornecidos, usar valores personalizados
        if budget_min is not None and budget_max is not None:
            daily_budget = f"€{budget_min}-{budget_max}"
            # Calcular distribuição aproximada para refeições (60% do orçamento)
            budget_avg = int((budget_min + budget_max) / 2)
            meal_total = int(budget_avg * 0.6)
            breakfast_cost = int(meal_total * 0.2)
            lunch_cost = int(meal_total * 0.35)
            dinner_cost = int(meal_total * 0.45)
            attractions_budget = int(budget_avg * 0.3)
            meal_budget = f"pequeno-almoço €{breakfast_cost-2}-{breakfast_cost+2}, almoço €{lunch_cost-5}-{lunch_cost+5}, jantar €{dinner_cost-5}-{dinner_cost+5}"
            budget_category = "personalizado"
        else:
            # Define limites de orçamento por categoria (deprecated, manter para compatibilidade)
            budget_ranges = {
                "economico": ("€30-50", "pequeno-almoço €3-5, almoço €8-12, jantar €12-20"),
                "medio": ("€60-90", "pequeno-almoço €5-8, almoço €15-25, jantar €25-40"),
                "alto": ("€120-200", "pequeno-almoço €10-15, almoço €30-50, jantar €50-80")
            }
            daily_budget, meal_budget = budget_ranges.get(budget.lower(), budget_ranges["medio"])
            budget_category = budget
            # Valores padrão para compatibilidade
            budget_min = 60 if budget == "medio" else (30 if budget == "economico" else 120)
            budget_max = 90 if budget == "medio" else (50 if budget == "economico" else 200)
            budget_avg = int((budget_min + budget_max) / 2)
            breakfast_cost = 5
            lunch_cost = 15
            dinner_cost = 25
            attractions_budget = int(budget_avg * 0.3)
        
        # Detecta se é um destino europeu fora de Portugal
        is_portugal = any(term in region.lower() for term in ['portugal', 'lisboa', 'porto', 'algarve', 'douro', 'braga', 'coimbra', 'aveiro'])
        location_context = "em Portugal" if is_portugal else "na Europa"
        
        prompt = f"""Crie um roteiro de viagem MUITO DETALHADO {location_context} com horários específicos das 8:00 às 19:00.

**Destino**: {region}
**Duração**: {duration_days} dia(s)
**Orçamento Diário**: {daily_budget}
**Categoria**: {budget_category}
**Interesses**: {interests_text}

IMPORTANTE: Crie um cronograma COMPLETO e DETALHADO com:
1. **4-6 ATRAÇÕES por dia** - ocupar o dia inteiro das 9:00 às 19:00
2. Horários específicos para cada atividade (formato 24h: "09:00")
3. Duração realista de cada visita (1-3 horas por atração)
4. 3 refeições por dia com restaurantes REAIS e preços AJUSTADOS ao orçamento {daily_budget}
5. Tempo de deslocamento entre locais (15-30 min)
6. Pausas estratégicas para café/descanso

ESTRUTURA DO DIA:
- 08:00 → Pequeno-almoço
- 09:00-11:30 → Atração 1 (2.5h)
- 11:30-12:00 → Deslocamento
- 12:00-14:00 → Atração 2 (2h)
- 13:00-14:00 → Almoço (pode ser durante visita ou depois)
- 14:30-16:30 → Atração 3 (2h)
- 16:30-17:00 → Pausa café/descanso
- 17:00-18:30 → Atração 4 (1.5h)
- 18:30-19:00 → Deslocamento
- 19:00-20:30 → Jantar

REGRAS DE ORÇAMENTO (diário: {daily_budget}):
- Orçamento diário TOTAL: {daily_budget}
- Refeições: {meal_budget}
- Escolha atrações e restaurantes que se encaixem no orçamento especificado
- Seja realista com os preços e sugestões

Formato JSON OBRIGATÓRIO:
{{
  "itinerary": [
    {{
      "day": 1,
      "title": "Explorando {region}",
      "daily_budget": "{daily_budget}",
      "places": [
        {{
          "name": "Atração Principal 1",
          "description": "Descrição detalhada com contexto histórico/cultural",
          "start_time": "09:00",
          "end_time": "11:30",
          "duration": "2.5 horas",
          "entrance_fee": "€8-12 ou Gratuito",
          "tips": "Dica prática útil"
        }},
        {{
          "name": "Atração 2",
          "description": "Descrição do local",
          "start_time": "12:00",
          "end_time": "13:30",
          "duration": "1.5 horas",
          "entrance_fee": "Gratuito",
          "tips": "Dica útil"
        }},
        {{
          "name": "Atração 3",
          "description": "Descrição do local",
          "start_time": "14:30",
          "end_time": "16:30",
          "duration": "2 horas",
          "entrance_fee": "€5 ou Gratuito",
          "tips": "Dica útil"
        }},
        {{
          "name": "Atração 4",
          "description": "Descrição do local",
          "start_time": "17:00",
          "end_time": "18:30",
          "duration": "1.5 horas",
          "entrance_fee": "Gratuito",
          "tips": "Bom para pôr do sol"
        }}
      ],
      "meals": [
        {{
          "type": "Pequeno-almoço",
          "time": "08:00",
          "restaurant": "Nome real do café/restaurante (ajustado ao orçamento {daily_budget})",
          "suggestion": "Opção típica portuguesa",
          "estimated_cost": "Preço real ajustado ao orçamento {daily_budget}",
          "location": "Perto do hotel/primeiro local"
        }},
        {{
          "type": "Almoço",
          "time": "13:00",
          "restaurant": "Nome real do restaurante (ajustado ao orçamento {daily_budget})",
          "suggestion": "Prato típico da região",
          "estimated_cost": "Preço real ajustado ao orçamento {daily_budget}",
          "location": "Zona onde estará na hora"
        }},
        {{
          "type": "Jantar",
          "time": "19:30",
          "restaurant": "Nome real do restaurante (categoria {budget})",
          "suggestion": "Especialidade da casa",
          "estimated_cost": "Preço real ajustado ao orçamento {budget}",
          "location": "Perto do hotel"
        }}
      ],
      "accommodation_suggestion": "Hotel específico ou zona recomendada"
    }}
  ],
  "general_tips": [
    "Dica prática 1",
    "Dica de transporte específico para {region}",
    "Dica de economia para orçamento {daily_budget}"
  ],
  "estimated_cost": "Custo TOTAL estimado para {duration_days} dias considerando orçamento diário {daily_budget} (inclui refeições, entradas, transporte local)",
  "best_season": "Melhor época para visitar {region}"
}}

REGRAS CRÍTICAS DE ORÇAMENTO - MUITO IMPORTANTE:
O orçamento diário é {daily_budget}. NUNCA EXCEDA ESTE VALOR!

Distribuição obrigatória do orçamento:
- 60% para refeições (3 por dia): {meal_budget}
- 30% para atrações/entradas
- 10% para transporte local

LIMITES RIGOROSOS:
- Pequeno-almoço: MAX {int((budget_min + budget_max) / 2 * 0.2)}€
- Almoço: MAX {int((budget_min + budget_max) / 2 * 0.35)}€
- Jantar: MAX {int((budget_min + budget_max) / 2 * 0.45)}€
- TODAS as entradas somadas: MAX {int((budget_min + budget_max) / 2 * 0.3)}€

NÚMERO DE ATRAÇÕES POR DIA - OBRIGATÓRIO:
- MÍNIMO 4 atrações por dia
- MÁXIMO 6 atrações por dia
- Distribua ao longo do dia (9:00 às 19:00)
- Inclua variedade: monumentos, parques, mercados, museus, miradouros, bairros históricos

ORÇAMENTO BAIXO (€10-50/dia):
- 4-6 atrações GRATUITAS por dia: parques, igrejas gratuitas, mercados, passeios a pé, miradouros, praias, bairros históricos
- Inclua caminhadas por bairros típicos (1-2h cada)
- Visite mercados locais (grátis para passear)
- Explore jardins e parques públicos
- Restaurantes: padarias, cafés locais, fast food local, supermercados
- Transporte: público (metro/autocarro) ou a pé
- SEM shows, tours pagos ou restaurantes caros

ORÇAMENTO MÉDIO (€50-120/dia):
- 4-6 atrações por dia (1-2 pagas + 3-4 gratuitas)
- Mix inteligente: museu pago de manhã + parques/mercados gratuitos à tarde
- Priorize as atrações pagas mais importantes
- Restaurantes tradicionais de preço médio
- Transporte público

ORÇAMENTO ALTO (>€120/dia):
- 5-6 atrações por dia (3-4 pagas + 2 gratuitas)
- Pode incluir múltiplas atrações pagas premium
- Tours guiados e experiências especiais
- Restaurantes de qualidade
- Táxis/transporte privado quando necessário

VALIDAÇÃO OBRIGATÓRIA:
Antes de sugerir qualquer atividade ou restaurante, verifique:
1. A soma de TODAS as refeições do dia cabe no orçamento?
2. A soma de TODAS as entradas do dia cabe no orçamento?
3. O TOTAL do dia (refeições + entradas + transporte €5) está dentro de {daily_budget}?

Se NÃO, escolha opções mais baratas ou gratuitas!

Outras regras:
- Dia começa às 8:00 (pequeno-almoço) e termina às 19:00 (jantar)
- 4-6 atrações por dia OBRIGATÓRIO (ocupe o dia inteiro!)
- Tempo realista em cada local: principais (2-3h), secundárias (1-1.5h), rápidas (30min-1h)
- Varie o tipo de atrações: museus, parques, mercados, bairros, monumentos, miradouros
- Inclua pausas estratégicas (café 15-30min entre atrações)
- Restaurantes REAIS e conhecidos em {region}
- Preços REALISTAS e atualizados
- Horários práticos com tempo de deslocamento (15-30min entre locais)
- Use idioma e contexto cultural apropriado para {region}
- Distribua as atrações geograficamente de forma inteligente (evite ir de um lado para outro da cidade)

Seja MUITO específico com nomes reais, endereços e preços REALISTAS de {region}. 
Inclua dicas práticas sobre transporte local, melhores horários para visitar, e avisos importantes."""

        try:
            response = await self._call_openai(prompt, region, duration_days)
            return json.loads(response)
        except json.JSONDecodeError:
            # Se a resposta não for JSON válido, tenta extrair
            return self._parse_text_response(response)
    
    async def _call_openai(self, prompt: str, region: str = None, duration_days: int = None) -> str:
        """Chama a API de IA (Groq ou OpenAI) com fallback para mock se não houver créditos"""
        # Modo de teste sem API key
        if not self.client:
            print("⚠️  Sem API key configurada. Usando modo mock...")
            return self._generate_mock_response(region, duration_days)
        
        try:
            # Calcula max_tokens baseado no número de dias (mais dias = mais tokens necessários)
            # Base: 2000 tokens, + 800 por dia adicional
            base_tokens = 2000
            tokens_per_day = 800
            days = duration_days if duration_days else 3
            max_tokens = base_tokens + (tokens_per_day * days)
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um especialista em turismo europeu, com conhecimento profundo sobre todos os países e regiões da Europa. Forneça roteiros detalhados, práticos e personalizados em formato JSON, sempre com informações reais sobre atrações, restaurantes, horários e preços atualizados de cada destino."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=min(max_tokens, 8000)  # Limite máximo de 8000 tokens
            )
            
            return completion.choices[0].message.content
            
        except Exception as e:
            # Se houver erro (sem créditos, rate limit, etc), usa mock
            error_msg = str(e).lower()
            if any(err in error_msg for err in ["insufficient_quota", "rate_limit", "429", "quota"]):
                print(f"⚠️  IA sem créditos/limite atingido. Usando modo mock...")
                return self._generate_mock_response(region, duration_days)
            else:
                # Outros erros, relança
                print(f"❌ Erro na IA: {e}")
                raise
    
    def _generate_mock_response(self, region: str, duration_days: int) -> str:
        """Gera resposta mock dinâmica para testes sem API key"""
        
        # Base de dados de atrações por região
        attractions_db = {
            "Porto": {
                "places": [
                    ("Torre dos Clérigos", "Torre icónica com 240 degraus e vista panorâmica de 360 graus sobre o Porto", "1-2 horas", "Compre bilhete combinado com a Igreja dos Clérigos"),
                    ("Livraria Lello", "Uma das livrarias mais bonitas do mundo, inspiração para Harry Potter", "45 min - 1 hora", "Reserve online para evitar filas"),
                    ("Ribeira", "Zona histórica à beira-rio com casas coloridas e restaurantes", "2-3 horas", "Passeie pelo cais e cruze a Ponte D. Luís I"),
                    ("Caves de Vinho do Porto", "Visita às caves em Vila Nova de Gaia com provas", "2 horas", "Reserve visita guiada com degustação"),
                    ("Palácio da Bolsa", "Palácio neoclássico com o impressionante Salão Árabe", "1-2 horas", "Visite com guia para conhecer a história"),
                    ("Sé do Porto", "Catedral românica no topo da colina", "1 hora", "Visite o claustro e suba à torre"),
                    ("Casa da Música", "Sala de concertos moderna com arquitetura única", "1-2 horas", "Faça visita guiada ou assista a um concerto"),
                ],
                "meals": [
                    "Francesinha no Café Santiago",
                    "Tripas à moda do Porto no Abadia do Porto",
                    "Bacalhau no Cantinho do Avillez",
                    "Petiscos no Mercado do Bolhão",
                    "Bifana no Conga",
                ],
                "tips": [
                    "Compre o Porto Card para transporte e entradas gratuitas",
                    "Use o elétrico histórico linha 1 para ir até Foz",
                    "Experimente uma francesinha, o prato típico do Porto",
                    "Passeie pela Avenida dos Aliados e Rua Santa Catarina",
                    "Vista-se em camadas - o tempo pode mudar rapidamente"
                ],
                "cost": "€60-100 por dia"
            },
            "Lisboa": {
                "places": [
                    ("Castelo de São Jorge", "Castelo medieval com vistas panorâmicas da cidade", "2-3 horas", "Visite de manhã cedo para evitar multidões"),
                    ("Alfama", "Bairro mais antigo de Lisboa com ruas labirínticas", "3-4 horas", "Perca-se pelas ruelas e ouça fado"),
                    ("Belém", "Zona histórica com mosteiro e torre emblemáticos", "4-5 horas", "Experimente pastéis de nata na Fábrica"),
                    ("Oceanário", "Um dos maiores aquários da Europa", "2-3 horas", "Ideal para famílias"),
                    ("Elevador de Santa Justa", "Elevador neo-gótico com vista sobre a cidade", "30 min - 1 hora", "Evite horas de ponta"),
                    ("LX Factory", "Espaço cultural em antiga fábrica", "2-3 horas", "Perfeito para compras e café"),
                    ("Miradouro da Graça", "Vista espetacular sobre Lisboa", "30 min - 1 hora", "Visite ao pôr-do-sol"),
                ],
                "meals": [
                    "Pastéis de Belém na Fábrica de Pastéis",
                    "Bacalhau à Brás no Zé da Mouraria",
                    "Petiscos no Time Out Market",
                    "Sardinhas assadas em Alfama",
                    "Bifanas no O Trevo",
                ],
                "tips": [
                    "Compre o Lisboa Card para transporte e museus gratuitos",
                    "Use sapatos confortáveis - Lisboa tem muitas colinas",
                    "Use os elétricos históricos (especialmente o 28)",
                    "Reserve restaurantes de fado com antecedência",
                    "Cuidado com carteiristas em zonas turísticas"
                ],
                "cost": "€50-90 por dia"
            },
            "Algarve": {
                "places": [
                    ("Praia da Marinha", "Uma das praias mais bonitas do mundo", "3-4 horas", "Vá cedo para estacionar"),
                    ("Benagil Cave", "Gruta marinha icónica", "2-3 horas", "Reserve tour de barco ou caiaque"),
                    ("Lagos", "Cidade histórica com praias deslumbrantes", "4-5 horas", "Visite Ponta da Piedade"),
                    ("Albufeira", "Centro turístico com vida noturna", "3-4 horas", "Explore a cidade velha"),
                    ("Sagres", "Ponto mais a sudoeste da Europa", "2-3 horas", "Visite a fortaleza e o cabo"),
                    ("Tavira", "Cidade histórica tranquila", "3-4 horas", "Visite a ponte romana e igrejas"),
                    ("Ria Formosa", "Parque natural com ilhas e praias desertas", "4-5 horas", "Faça tour de barco"),
                ],
                "meals": [
                    "Cataplana de marisco em Lagos",
                    "Peixe grelhado em Albufeira",
                    "Percebes em Sagres",
                    "Arroz de polvo em Tavira",
                    "Sardinhas assadas na praia",
                ],
                "tips": [
                    "Alugue carro para explorar a costa livremente",
                    "Reserve hotéis com antecedência no verão",
                    "Use protetor solar - o sol é muito forte",
                    "Experimente a gastronomia do mar fresca",
                    "Visite grutas de barco ou caiaque"
                ],
                "cost": "€70-120 por dia"
            },
            "Douro": {
                "places": [
                    ("Cruzeiro no Rio Douro", "Passeio de barco pelos vinhedos", "2-4 horas", "Reserve com antecedência"),
                    ("Quinta do Seixo", "Quinta vinícola com provas", "2-3 horas", "Faça visita guiada"),
                    ("Pinhão", "Vila no coração do Douro", "3-4 horas", "Veja os azulejos na estação"),
                    ("Peso da Régua", "Capital do Vinho do Porto", "2-3 horas", "Visite o Museu do Douro"),
                    ("Miradouro de São Leonardo de Galafura", "Vista espetacular sobre o vale", "1 hora", "Melhor ao nascer ou pôr-do-sol"),
                    ("Lamego", "Cidade histórica com santuário", "3-4 horas", "Visite Nossa Senhora dos Remédios"),
                ],
                "meals": [
                    "Cozido à portuguesa em quinta",
                    "Polvo assado em Pinhão",
                    "Vitela assada no Régua",
                    "Enchidos regionais",
                    "Queijos da região",
                ],
                "tips": [
                    "Reserve provas de vinho com antecedência",
                    "Melhor época: setembro/outubro (vindimas)",
                    "Leve roupa confortável para caminhar nas quintas",
                    "Combine cruzeiro com visita a quintas",
                    "Designe motorista se for provar vinhos"
                ],
                "cost": "€80-150 por dia"
            },
            "Coimbra": {
                "places": [
                    ("Universidade de Coimbra", "Uma das universidades mais antigas da Europa", "2-3 horas", "Visite a Biblioteca Joanina obrigatoriamente"),
                    ("Quinta das Lágrimas", "Jardim histórico e romântico", "1-2 horas", "Local da lenda de Pedro e Inês"),
                    ("Mosteiro de Santa Clara-a-Velha", "Mosteiro gótico parcialmente submerso", "1-2 horas", "Veja o centro interpretativo"),
                    ("Portugal dos Pequenitos", "Parque temático com monumentos em miniatura", "2-3 horas", "Ideal para famílias"),
                    ("Sé Velha", "Catedral românica do século XII", "1 hora", "Uma das mais bem preservadas de Portugal"),
                    ("Jardim Botânico", "Jardim histórico da universidade", "1-2 horas", "Perfeito para relaxar"),
                ],
                "meals": [
                    "Chanfana no Zé Manel dos Ossos",
                    "Leitão à Bairrada na Mealhada",
                    "Arroz de lampreia (época)",
                    "Pastéis de Santa Clara",
                    "Tapas no Loggia",
                ],
                "tips": [
                    "Caminhe pela Baixa até à Universidade",
                    "Ouça fado de Coimbra (diferente do de Lisboa)",
                    "Vista roupa confortável para subir à Alta",
                    "Visite durante a semana académica (maio)",
                    "Experimente os pastéis de Santa Clara"
                ],
                "cost": "€45-75 por dia"
            },
            "Braga": {
                "places": [
                    ("Bom Jesus do Monte", "Santuário com escadaria monumental", "2-3 horas", "Suba de funicular ou pelas escadas"),
                    ("Centro Histórico de Braga", "Cidade dos arcebispos", "3-4 horas", "Visite a Sé Catedral"),
                    ("Santuário do Sameiro", "Vista panorâmica sobre Braga", "1-2 horas", "Ideal ao pôr-do-sol"),
                    ("Guimarães", "Berço da Nação Portuguesa", "4-5 horas", "Visite o castelo e paço dos duques"),
                    ("Citânia de Briteiros", "Castro pré-romano", "2 horas", "Um dos mais bem preservados"),
                    ("Termas Romanas", "Ruínas romanas no centro", "1 hora", "Entrada gratuita"),
                ],
                "meals": [
                    "Bacalhau à Narcisa",
                    "Papas de sarrabulho",
                    "Rojões à minhota",
                    "Pudim Abade de Priscos",
                    "Vinho Verde da região",
                ],
                "tips": [
                    "Braga é conhecida como Roma Portuguesa",
                    "Combine visita a Braga e Guimarães",
                    "Experimente a gastronomia minhota",
                    "Visite durante a Semana Santa (procissões)",
                    "Use transporte público entre cidades"
                ],
                "cost": "€50-80 por dia"
            },
            "Aveiro": {
                "places": [
                    ("Passeio de Moliceiro", "Tour pelos canais de Aveiro", "45 min - 1 hora", "Melhor forma de conhecer a cidade"),
                    ("Costa Nova", "Praias com casas às riscas", "2-3 horas", "Ótimo para fotos"),
                    ("Barra e Farol", "Maior farol de Portugal", "1-2 horas", "Vista espetacular"),
                    ("Centro Histórico", "Museu Arte Nova e praças", "2-3 horas", "Arquitetura única"),
                    ("Ílhavo e Museu do Bacalhau", "História marítima", "2 horas", "Imperdível"),
                    ("Praia da Barra", "Praia urbana com ondas", "2-3 horas", "Ideal para surf"),
                ],
                "meals": [
                    "Ovos moles (doce típico)",
                    "Enguias fritas",
                    "Caldeirada de peixe",
                    "Tripas de Aveiro (doce)",
                    "Leitão da Bairrada",
                ],
                "tips": [
                    "A Veneza de Portugal tem clima marítimo",
                    "Compre ovos moles para levar",
                    "Combine praia e cidade num dia",
                    "Alugue bicicleta para explorar",
                    "Visite o mercado do peixe"
                ],
                "cost": "€50-85 por dia"
            },
            "Sintra": {
                "places": [
                    ("Palácio da Pena", "Palácio colorido no topo da serra", "2-3 horas", "Reserve online para evitar filas"),
                    ("Quinta da Regaleira", "Palácio com poço iniciático", "2-3 horas", "Explore os jardins e túneis"),
                    ("Castelo dos Mouros", "Ruínas mouriscas com vista", "1-2 horas", "Caminhe pelas muralhas"),
                    ("Palácio Nacional de Sintra", "Palácio com chaminés cónicas", "1-2 horas", "No centro da vila"),
                    ("Cabo da Roca", "Ponto mais ocidental da Europa", "1 hora", "Leve certificado"),
                    ("Praia da Adraga", "Praia selvagem e dramática", "2 horas", "Cuidado com correntes"),
                ],
                "meals": [
                    "Travesseiros de Sintra",
                    "Queijadas de Sintra",
                    "Marisco em Azenhas do Mar",
                    "Petiscos na Vila",
                    "Café no Palácio de Seteais",
                ],
                "tips": [
                    "Chegue cedo para evitar multidões",
                    "Use o autocarro 434 entre palácios",
                    "Reserve pelo menos um dia inteiro",
                    "Leve casaco - pode estar frio no topo",
                    "Compre bilhete combinado para palácios"
                ],
                "cost": "€60-100 por dia"
            },
            "Cascais": {
                "places": [
                    ("Boca do Inferno", "Formação rochosa dramática", "30 min - 1 hora", "Melhor com mar agitado"),
                    ("Centro Histórico", "Marina e praias urbanas", "2-3 horas", "Perfeito para passear"),
                    ("Praia do Guincho", "Praia ventosa ideal para surf", "2-3 horas", "Cuidado com ondas fortes"),
                    ("Museu Condes Castro Guimarães", "Palácio à beira-mar", "1-2 horas", "Arquitetura única"),
                    ("Cidadela de Cascais", "Fortaleza com galerias arte", "1-2 horas", "Entrada gratuita"),
                    ("Estoril e Casino", "Zona elegante e casino", "2-3 horas", "Passeie pelo calçadão"),
                ],
                "meals": [
                    "Peixe fresco no mercado",
                    "Marisco no Porto de Santa Maria",
                    "Santola no Baía do Peixe",
                    "Gelados na Santini",
                    "Brunch no The Lisbonaire",
                ],
                "tips": [
                    "Combine com visita a Sintra",
                    "Alugue bicicleta para ciclovia costeira",
                    "Visite o mercado da vila",
                    "Cascais é mais calma que Lisboa",
                    "Experimente desportos aquáticos"
                ],
                "cost": "€70-120 por dia"
            },
            "Alentejo": {
                "places": [
                    ("Évora - Centro Histórico", "Cidade Património Mundial UNESCO", "4-5 horas", "Visite o Templo Romano e Capela dos Ossos"),
                    ("Monsaraz", "Vila medieval amuralhada", "2-3 horas", "Vista sobre o Alqueva"),
                    ("Cromeleque dos Almendres", "Círculo de pedras megalítico", "1 hora", "Stonehenge português"),
                    ("Barragem do Alqueva", "Maior lago artificial da Europa", "2-3 horas", "Faça passeio de barco"),
                    ("Elvas", "Fortificações impressionantes", "3-4 horas", "Património Mundial"),
                    ("Marvão", "Vila no topo da serra", "2-3 horas", "Vista de 360 graus"),
                ],
                "meals": [
                    "Açorda alentejana",
                    "Porco preto ibérico",
                    "Migas com carne de porco",
                    "Queijo de Serpa",
                    "Vinhos do Alentejo",
                ],
                "tips": [
                    "Verões muito quentes - visite cedo",
                    "Alugue carro - distâncias grandes",
                    "Prove os vinhos da região",
                    "Visite planícies douradas no verão",
                    "Observe estrelas no Dark Sky Reserve"
                ],
                "cost": "€55-90 por dia"
            },
        }
        
        # Usar dados da região ou fallback para dados genéricos
        region_data = attractions_db.get(region, attractions_db["Lisboa"])
        places_pool = region_data["places"]
        meals_pool = region_data["meals"]
        tips = region_data["tips"]
        cost = region_data["cost"]
        
        # Gerar itinerário para cada dia
        itinerary = []
        places_per_day = max(2, min(4, len(places_pool) // max(1, duration_days)))
        
        # Definir horários e custos de refeições por região
        breakfast_places = {
            "Porto": [("Café Majestic", "€8-12"), ("Confeitaria do Bolhão", "€5-8")],
            "Lisboa": [("Pastelaria de Belém", "€6-10"), ("Café A Brasileira", "€8-12")],
            "Algarve": [("Café del Mar", "€10-15"), ("Pastelaria Vilamoura", "€7-12")],
        }
        
        lunch_places = {
            "Porto": [("Cantinho do Avillez", "€20-30"), ("Tapabento", "€18-28"), ("Mercado do Bolhão", "€12-20")],
            "Lisboa": [("Time Out Market", "€15-25"), ("Cervejaria Ramiro", "€30-45"), ("Taberna da Rua das Flores", "€20-30")],
            "Algarve": [("Restaurante O Marinheiro", "€25-40"), ("Vila Joya", "€50-80"), ("Casa do Polvo", "€20-35")],
        }
        
        dinner_places = {
            "Porto": [("The Yeatman", "€40-65"), ("Pedro Lemos", "€45-70"), ("Antiqvvm", "€35-55")],
            "Lisboa": [("Belcanto", "€80-120"), ("Bairro do Avillez", "€30-50"), ("Solar dos Presuntos", "€35-55")],
            "Algarve": [("Ocean Restaurant", "€60-90"), ("NoSoloÁgua", "€30-50"), ("A Vela", "€25-40")],
        }
        
        # Fallback genérico
        breakfast_default = [("Café Local", "€6-10"), ("Pastelaria Tradicional", "€7-12")]
        lunch_default = [("Restaurante Típico", "€18-28"), ("Tasca Local", "€15-25")]
        dinner_default = [("Restaurante Tradicional", "€25-40"), ("Casa de Fados", "€30-50")]
        
        breakfast_opts = breakfast_places.get(region, breakfast_default)
        lunch_opts = lunch_places.get(region, lunch_default)
        dinner_opts = dinner_places.get(region, dinner_default)
        
        for day in range(1, duration_days + 1):
            day_places = []
            current_time = 9  # Começa às 9:00 (após pequeno-almoço às 8:00)
            
            start_idx = (day - 1) * places_per_day
            end_idx = min(start_idx + places_per_day, len(places_pool))
            
            for i in range(start_idx, end_idx):
                if i < len(places_pool):
                    place = places_pool[i]
                    
                    # Determinar duração em horas
                    duration_text = place[2]
                    if "3-4" in duration_text or "4-5" in duration_text:
                        duration_hours = 3.5
                    elif "2-3" in duration_text:
                        duration_hours = 2.5
                    elif "1-2" in duration_text:
                        duration_hours = 1.5
                    else:
                        duration_hours = 1
                    
                    start_hour = int(current_time)
                    start_min = int((current_time - start_hour) * 60)
                    end_time_val = current_time + duration_hours
                    end_hour = int(end_time_val)
                    end_min = int((end_time_val - end_hour) * 60)
                    
                    day_places.append({
                        "name": place[0],
                        "description": place[1],
                        "start_time": f"{start_hour:02d}:{start_min:02d}",
                        "end_time": f"{end_hour:02d}:{end_min:02d}",
                        "duration": place[2],
                        "entrance_fee": "€5-15" if "museu" in place[0].lower() or "palácio" in place[0].lower() else "Grátis",
                        "tips": place[3]
                    })
                    
                    current_time = end_time_val + 0.5  # 30 min para deslocamento
                    
                    # Pausa para almoço se passar das 12:30
                    if current_time >= 12.5 and current_time < 14:
                        current_time = 14  # Almoço das 12:30 às 14:00
            
            # Título do dia
            if day == 1:
                title = f"Descobrindo {region}"
            elif day == duration_days:
                title = f"Último Dia em {region}"
            else:
                title = f"Explorando {region} - Dia {day}"
            
            # Refeições do dia com horários e preços
            breakfast_idx = (day - 1) % len(breakfast_opts)
            lunch_idx = (day - 1) % len(lunch_opts)
            dinner_idx = (day - 1) % len(dinner_opts)
            
            day_meals = [
                {
                    "type": "Pequeno-almoço",
                    "time": "08:00",
                    "restaurant": breakfast_opts[breakfast_idx][0],
                    "suggestion": "Pastel de nata, torrada e café",
                    "estimated_cost": breakfast_opts[breakfast_idx][1],
                    "location": "Perto do hotel"
                },
                {
                    "type": "Almoço",
                    "time": "13:00",
                    "restaurant": lunch_opts[lunch_idx][0],
                    "suggestion": meals_pool[lunch_idx % len(meals_pool)],
                    "estimated_cost": lunch_opts[lunch_idx][1],
                    "location": "Centro histórico"
                },
                {
                    "type": "Jantar",
                    "time": "19:30",
                    "restaurant": dinner_opts[dinner_idx][0],
                    "suggestion": meals_pool[(lunch_idx + 1) % len(meals_pool)],
                    "estimated_cost": dinner_opts[dinner_idx][1],
                    "location": "Zona ribeirinha"
                }
            ]
            
            itinerary.append({
                "day": day,
                "title": title,
                "daily_budget": cost,
                "places": day_places,
                "meals": day_meals,
                "accommodation_suggestion": f"Hotel no centro de {region} para fácil acesso"
            })
        
        response_data = {
            "itinerary": itinerary,
            "general_tips": tips,
            "estimated_cost": cost,
            "best_season": "Primavera (Abril-Junho) ou Outono (Setembro-Outubro) - clima agradável"
        }
        
        return json.dumps(response_data, ensure_ascii=False)
    
    def _parse_text_response(self, text: str) -> Dict[str, Any]:
        """Fallback para parsing de resposta de texto"""
        # Tenta extrair JSON da resposta
        try:
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                json_str = text[start:end]
                return json.loads(json_str)
        except:
            pass
        
        # Se falhar, retorna estrutura básica válida
        return {
            "itinerary": [{
                "day": 1,
                "title": "Erro ao processar resposta",
                "places": [{
                    "name": "Serviço temporariamente indisponível",
                    "description": "Houve um erro ao processar sua solicitação. Por favor, tente novamente em alguns instantes.",
                    "duration": "N/A",
                    "start_time": None,
                    "end_time": None,
                    "entrance_fee": None,
                    "tips": "Se o erro persistir, tente com menos dias ou menos interesses."
                }],
                "meals": [],
                "daily_budget": None,
                "accommodation_suggestion": None
            }],
            "general_tips": ["Tente novamente em alguns instantes", "O serviço pode estar com limite de requisições"],
            "estimated_cost": "N/A",
            "best_season": "Todo o ano"
        }

# Instância global
openai_service = OpenAIService()
