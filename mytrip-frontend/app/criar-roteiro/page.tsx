"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { saveTripToSupabase } from '@/lib/supabaseTrip';
import Link from 'next/link';
import AuthButton from '@/app/components/AuthButton';
import { useRouter } from 'next/navigation';
import ScrollAnimation from '@/app/components/ScrollAnimation';

interface TripRequest {
  region: string;
  duration_days: number;
  budget?: string;
  budget_min?: number;
  budget_max?: number;
  interests?: string[];
}

export default function CreateTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState<TripRequest>({
    region: '',
    duration_days: 3,
    budget_min: 50,
    budget_max: 100,
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setAuthLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const europeanDestinations = {
    'Portugal': ['Lisboa', 'Porto', 'Algarve', 'Douro', 'Alentejo', 'Coimbra', 'Braga', 'Aveiro', 'Sintra', 'Madeira', 'Açores', 'Guimarães', 'Óbidos', 'Évora', 'Cascais', 'Faro', 'Setúbal', 'Nazaré', 'Viana do Castelo', 'Monsanto'],
    'Espanha': ['Barcelona', 'Madrid', 'Sevilha', 'Valencia', 'Granada', 'Bilbao', 'Santiago de Compostela', 'Málaga', 'Ibiza', 'Canárias', 'Toledo', 'Córdoba', 'San Sebastián', 'Salamanca', 'Segovia', 'Cádiz', 'Mallorca', 'Menorca', 'Girona', 'Tarragona', 'Ronda', 'Zaragoza'],
    'França': ['Paris', 'Provence', 'Côte d\'Azur', 'Bordeaux', 'Lyon', 'Normandia', 'Bretanha', 'Alsácia', 'Champagne', 'Loire Valley', 'Nice', 'Marselha', 'Estrasburgo', 'Avignon', 'Toulouse', 'Nantes', 'Annecy', 'Mont Saint-Michel', 'Carcassonne', 'Colmar', 'Aix-en-Provence', 'Montpellier'],
    'Itália': ['Roma', 'Toscana', 'Veneza', 'Milão', 'Florença', 'Nápoles', 'Sicília', 'Costa Amalfitana', 'Sardenha', 'Cinque Terre', 'Verona', 'Bologna', 'Turim', 'Génova', 'Pisa', 'Siena', 'Bolonha', 'Lago de Como', 'Positano', 'Capri', 'Pompeia', 'Pádua'],
    'Grécia': ['Atenas', 'Santorini', 'Mykonos', 'Creta', 'Rodes', 'Zakynthos', 'Corfu', 'Meteora', 'Delfos', 'Tessalónica', 'Naxos', 'Paros', 'Ios', 'Milos', 'Kefalonia', 'Peloponeso', 'Olympia', 'Epidauro', 'Nafplio', 'Hydra'],
    'Alemanha': ['Berlim', 'Munique', 'Baviera', 'Hamburgo', 'Frankfurt', 'Colónia', 'Floresta Negra', 'Dresden', 'Heidelberg', 'Rothenburg', 'Freiburg', 'Stuttgart', 'Nuremberga', 'Leipzig', 'Bremen', 'Düsseldorf', 'Potsdam', 'Bamberg', 'Trier', 'Regensburg', 'Konstanz', 'Füssen', 'Baden-Baden'],
    'Reino Unido': ['Londres', 'Escócia', 'Edimburgo', 'Liverpool', 'Manchester', 'Oxford', 'Cambridge', 'Bath', 'Cotswolds', 'Lake District', 'York', 'Brighton', 'Bristol', 'Canterbury', 'Stonehenge', 'Windsor', 'Stratford-upon-Avon', 'Cornwall', 'Devon', 'Peak District', 'Norfolk', 'Gales'],
    'Holanda': ['Amesterdão', 'Roterdão', 'Haia', 'Utrecht', 'Maastricht', 'Haarlem', 'Leiden', 'Delft', 'Groningen', 'Keukenhof', 'Eindhoven', 'Volendam', 'Marken', 'Giethoorn', 'Zaanse Schans', 'Alkmaar', 'Gouda', 'Kinderdijk'],
    'Bélgica': ['Bruxelas', 'Bruges', 'Gante', 'Antuérpia', 'Leuven', 'Dinant', 'Ardenas', 'Mechelen', 'Ostende', 'Liège', 'Namur', 'Mons', 'Tournai', 'Waterloo', 'Durbuy', 'Spa'],
    'Suíça': ['Zurique', 'Genebra', 'Interlaken', 'Lucerna', 'Berna', 'Zermatt', 'Lugano', 'St. Moritz', 'Lausanne', 'Jungfrau', 'Montreux', 'Grindelwald', 'Lauterbrunnen', 'Basel', 'Locarno', 'Engelberg', 'Davos', 'Thun'],
    'Áustria': ['Viena', 'Salzburgo', 'Innsbruck', 'Hallstatt', 'Tirol', 'Graz', 'Salzkammergut', 'Wachau', 'Kitzbühel', 'Alpes Austríacos', 'Linz', 'Melk', 'Eisenstadt', 'Grossglockner', 'Seefeld', 'Bad Gastein'],
    'República Checa': ['Praga', 'Český Krumlov', 'Brno', 'Karlovy Vary', 'Kutná Hora', 'Olomouc', 'Plzeň', 'Bohémia', 'Morávia', 'Telč', 'Mariánské Lázně', 'Liberec', 'Lednice', 'Třeboň', 'Špindlerův Mlýn'],
    'Polónia': ['Cracóvia', 'Varsóvia', 'Gdansk', 'Wrocław', 'Zakopane', 'Auschwitz', 'Tatra Mountains', 'Toruń', 'Poznań', 'Malbork', 'Lublin', 'Katowice', 'Białowieża', 'Sopot', 'Łódź', 'Szczecin'],
    'Croácia': ['Dubrovnik', 'Split', 'Zagreb', 'Hvar', 'Plitvice', 'Rovinj', 'Zadar', 'Istria', 'Korčula', 'Krka', 'Trogir', 'Šibenik', 'Brač', 'Vis', 'Pula', 'Opatija', 'Mljet'],
    'Irlanda': ['Dublin', 'Galway', 'Cork', 'Cliffs of Moher', 'Ring of Kerry', 'Connemara', 'Giant\'s Causeway', 'Killarney', 'Dingle', 'Belfast', 'Kilkenny', 'Limerick', 'Doolin', 'Aran Islands', 'Wicklow', 'Waterford', 'Skellig Michael'],
    'Escócia': ['Edimburgo', 'Glasgow', 'Highlands', 'Isle of Skye', 'Inverness', 'Loch Ness', 'St Andrews', 'Aberdeen', 'Cairngorms', 'Fort William', 'Stirling', 'Isle of Mull', 'Oban', 'Glencoe', 'Orkney', 'Shetland'],
    'Noruega': ['Oslo', 'Bergen', 'Fjords', 'Tromsø', 'Lofoten', 'Stavanger', 'Trondheim', 'Geirangerfjord', 'Preikestolen', 'Svalbard', 'Ålesund', 'Flåm', 'Sognefjord', 'Nordkapp', 'Bodø', 'Kristiansand', 'Røros'],
    'Suécia': ['Estocolmo', 'Gotemburgo', 'Malmö', 'Uppsala', 'Lapónia', 'Visby', 'Kiruna', 'Abisko', 'Örebro', 'Arquipélago de Estocolmo', 'Lund', 'Helsingborg', 'Jönköping', 'Kalmar', 'Dalarna', 'Ystad'],
    'Dinamarca': ['Copenhaga', 'Aarhus', 'Odense', 'Aalborg', 'Roskilde', 'Helsingor', 'Legoland', 'Skagen', 'Bornholm', 'Ribe', 'Frederiksberg', 'Esbjerg', 'Møn', 'Fyn', 'Kronborg'],
    'Finlândia': ['Helsínquia', 'Lapónia', 'Rovaniemi', 'Tampere', 'Turku', 'Oulu', 'Savonlinna', 'Porvoo', 'Kemi', 'Arquipélago de Åland', 'Jyväskylä', 'Kuopio', 'Inari', 'Rauma', 'Naantali'],
    'Islândia': ['Reykjavik', 'Círculo Dourado', 'Akureyri', 'Vik', 'Jökulsárlón', 'Blue Lagoon', 'Snaefellsnes', 'Myvatn', 'Landmannalaugar', 'Westfjords', 'Höfn', 'Húsavík', 'Ísafjörður', 'Þingvellir', 'Skaftafell'],
    'Hungria': ['Budapeste', 'Eger', 'Lake Balaton', 'Pécs', 'Debrecen', 'Szentendre', 'Tokaj', 'Szeged', 'Visegrád', 'Hortobágy', 'Győr', 'Sopron', 'Esztergom', 'Kecskemét', 'Hollókő'],
    'Turquia': ['Istambul', 'Capadócia', 'Pamukkale', 'Éfeso', 'Antalya', 'Bodrum', 'Fethiye', 'Izmir', 'Ankara', 'Troia', 'Marmaris', 'Alanya', 'Side', 'Göreme', 'Konya', 'Bursa', 'Pergamon', 'Kaş'],
  };

  const [selectedCountry, setSelectedCountry] = useState<string>('Portugal');
  const regions = europeanDestinations[selectedCountry as keyof typeof europeanDestinations] || [];

  const interestOptions = [
    'História',
    'Gastronomia',
    'Natureza',
    'Praias',
    'Cultura',
    'Aventura',
    'Fotografia',
    'Vinhos',
    'Arquitetura',
    'Vida Noturna',
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests || [];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Se não estiver logado, direciona para login
    if (!user) {
      setLoading(false);
      setError('É necessário estar logado para criar um roteiro.');
      return;
    }

    try {
      // ...existing code...
      // Envia apenas a região/cidade selecionada para evitar confusão
      const payload = {
        ...formData,
        country: selectedCountry,
        // Envia região formatada: "Cidade, País" para contexto completo
        region: `${formData.region}, ${selectedCountry}`
      };
      // ...existing code...
      console.log('📤 Enviando payload:', JSON.stringify(payload, null, 2));
      // ...existing code...
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setError('API URL não configurada.');
        setLoading(false);
        return;
      }
      const response = await fetch(`${apiUrl}/api/v1/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar roteiro');
      }

      const data = await response.json();
      // ...existing code...
      if (typeof window !== 'undefined') {
        const tripToSave = {
          id: data.id,
          region: data.region,
          country: selectedCountry,
          duration_days: data.duration_days,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          interests: formData.interests,
          created_at: new Date().toISOString(),
          itinerary: data.itinerary,
          general_tips: data.general_tips,
          estimated_cost: data.estimated_cost,
          best_season: data.best_season,
        };

        // Salva no Supabase vinculado ao usuário autenticado
        const userId = user.id;
        if (userId) {
          await saveTripToSupabase(tripToSave, userId);
        }
      }
      // ...existing code...
      router.push(`/roteiro/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar roteiro');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                MyTrip
              </h1>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link
                href="/criar-roteiro"
                className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Criar Roteiro</span>
                <span className="sm:hidden">Criar</span>
              </Link>
              <Link
                href="/meus-roteiros"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Meus Roteiros</span>
                <span className="sm:hidden">Roteiros</span>
              </Link>
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollAnimation direction="fade">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Criar Novo Roteiro
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Preencha os detalhes da sua viagem e deixe a IA criar o roteiro perfeito para si.
            </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País 🌍
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setFormData({ ...formData, region: '' }); // Reset region quando mudar país
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.keys(europeanDestinations).sort().map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Região / Cidade 📍
              </label>
              <select
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Selecione uma região ou cidade</option>
                {regions.sort().map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duração da Viagem ⏱️
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.duration_days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_days: parseInt(e.target.value),
                    })
                  }
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 min-w-[80px]">
                  {formData.duration_days} {formData.duration_days === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orçamento Diário 💰
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Mínimo (€/dia)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={formData.budget_min ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                        setFormData({
                          ...formData,
                          budget_min: value,
                        });
                      }}
                      onBlur={(e) => {
                        // Ao perder o foco, se estiver vazio, define valor padrão
                        if (e.target.value === '') {
                          setFormData({
                            ...formData,
                            budget_min: 50,
                          });
                        }
                      }}
                      placeholder="50"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Máximo (€/dia)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={formData.budget_max ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                        setFormData({
                          ...formData,
                          budget_max: value,
                        });
                      }}
                      onBlur={(e) => {
                        // Ao perder o foco, se estiver vazio, define valor padrão
                        if (e.target.value === '') {
                          setFormData({
                            ...formData,
                            budget_max: 100,
                          });
                        }
                      }}
                      placeholder="100"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Orçamento: <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      €{formData.budget_min} - €{formData.budget_max}
                    </span> por dia
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Total estimado: €{(formData.budget_min || 0) * formData.duration_days} - €{(formData.budget_max || 0) * formData.duration_days}
                  </p>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interesses (opcional) 🎯
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`py-2 px-4 rounded-full text-sm transition-all ${
                      formData.interests?.includes(interest)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Criando roteiro...
                  </span>
                ) : (
                  '🚀 Criar Roteiro'
                )}
              </button>
            </div>
          </form>
          </div>
        </ScrollAnimation>
      </main>
    </div>
  );
}
