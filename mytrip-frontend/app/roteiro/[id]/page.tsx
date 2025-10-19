'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ScrollAnimation from '@/app/components/ScrollAnimation';

interface Place {
  name: string;
  description: string;
  duration: string;
  start_time?: string;
  end_time?: string;
  entrance_fee?: string;
  tips?: string;
}

interface Meal {
  type: string;
  time: string;
  restaurant: string;
  suggestion: string;
  estimated_cost: string;
  location?: string;
}

interface DayItinerary {
  day: number;
  title: string;
  places: Place[];
  meals?: Meal[] | {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  daily_budget?: string;
}

interface Trip {
  id: string;
  region: string;
  duration_days: number;
  budget?: string;
  interests?: string[];
  itinerary: DayItinerary[];
  tips?: string[];
  created_at: string;
}

export default function TripDetails() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Primeiro tenta carregar do localStorage
        const { getTripById } = await import('@/lib/storage');
        const localTrip = getTripById(tripId);
        
        if (localTrip) {
          setTrip(localTrip as any);
          setLoading(false);
          return;
        }

        // Se não encontrar no localStorage, tenta no backend
        const response = await fetch(`http://localhost:8001/api/v1/trips/${tripId}`);
        
        if (!response.ok) {
          throw new Error('Roteiro não encontrado');
        }

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar roteiro');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Carregando roteiro...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">
            {error || 'Roteiro não encontrado'}
          </p>
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

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
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm sm:text-base"
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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trip Header */}
        <ScrollAnimation direction="fade">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Roteiro para {trip.region}
                </h2>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <span>⏱️ {trip.duration_days} {trip.duration_days === 1 ? 'dia' : 'dias'}</span>
                  {trip.budget && (
                    <span>
                      💰{' '}
                      {trip.budget === 'low'
                        ? 'Económico'
                        : trip.budget === 'medium'
                        ? 'Moderado'
                        : 'Premium'}
                    </span>
                  )}
                </div>
              </div>
            
            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  const { exportTripToPDF } = await import('@/lib/export');
                  exportTripToPDF(trip as any);
                }}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
                title="Exportar para PDF"
              >
                <span className="hidden sm:inline">📕 PDF</span>
                <span className="sm:hidden">📕</span>
              </button>
              
              <button
                onClick={async () => {
                  const { copyTripToClipboard } = await import('@/lib/export');
                  await copyTripToClipboard(trip as any);
                }}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
                title="Copiar para partilhar"
              >
                <span className="hidden sm:inline">📋 Copiar</span>
                <span className="sm:hidden">📋</span>
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
                title="Imprimir"
              >
                <span className="hidden sm:inline">🖨️ Imprimir</span>
                <span className="sm:hidden">🖨️</span>
              </button>
            </div>
          </div>

          {trip.interests && trip.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {trip.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
          </div>
        </ScrollAnimation>

        {/* Itinerary Days */}
        <div className="space-y-6">
          {trip.itinerary.map((day, index) => (
            <ScrollAnimation key={day.day} direction="up" delay={index * 100}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {day.day}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {day.title}
                </h3>
              </div>

              {/* Daily Budget */}
              {day.daily_budget && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    💰 Orçamento do dia: {day.daily_budget}
                  </span>
                </div>
              )}

              {/* Places */}
              <div className="space-y-4 mb-6">
                {day.places.map((place, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-indigo-500"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          📍 {place.name}
                        </h4>
                        {place.start_time && place.end_time && (
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              🕐 {place.start_time} - {place.end_time}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              ({place.duration})
                            </span>
                            {place.entrance_fee && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
                                🎫 {place.entrance_fee}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Botão Ver Direções */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ', ' + trip.region)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex-shrink-0"
                        title="Abrir no Google Maps"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span className="font-medium hidden sm:inline">Direções</span>
                        <span className="font-medium sm:hidden text-xs">Ver</span>
                      </a>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {place.description}
                    </p>
                    {place.tips && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 italic">
                        💡 {place.tips}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Meals */}
              {day.meals && Array.isArray(day.meals) && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    🍽️ Refeições do Dia
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {day.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {meal.type}
                          </span>
                          <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            🕐 {meal.time}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          {meal.restaurant}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {meal.suggestion}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {meal.estimated_cost}
                          </span>
                          {meal.location && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              📍 {meal.location}
                            </span>
                          )}
                        </div>
                        
                        {/* Botão Ver no Mapa */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meal.restaurant + ', ' + (meal.location || trip.region))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                          title="Ver no Google Maps"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          Ver no Mapa
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Tips */}
        {trip.tips && trip.tips.length > 0 && (
          <ScrollAnimation direction="up" delay={100}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                💡 Dicas Importantes
              </h3>
              <ul className="space-y-2">
                {trip.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 mt-1">
                      •
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        )}

        {/* Action Buttons */}
        <ScrollAnimation direction="fade" delay={200}>
          <div className="flex gap-4 mt-8">
          <Link
            href="/criar-roteiro"
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-center"
          >
            ✨ Criar Outro Roteiro
          </Link>
          <Link
            href="/meus-roteiros"
            className="flex-1 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors font-semibold text-center"
          >
            📋 Ver Meus Roteiros
          </Link>
          </div>
        </ScrollAnimation>
      </main>
    </div>
  );
}
