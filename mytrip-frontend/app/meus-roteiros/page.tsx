'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSavedTrips, deleteTrip, SavedTrip } from '@/lib/storage';

interface TripSummary {
  id: string;
  region: string;
  duration_days: number;
  created_at: string;
  budget?: string;
  estimated_cost?: string;
}

export default function MyTrips() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = () => {
    try {
      const savedTrips = getSavedTrips();
      // Ordena por data (mais recente primeiro)
      const sorted = savedTrips.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTrips(sorted);
    } catch (err) {
      console.error('Erro ao carregar roteiros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = (tripId: string) => {
    if (!confirm('Tem certeza que deseja apagar este roteiro?')) {
      return;
    }

    try {
      deleteTrip(tripId);
      // Atualiza a lista
      setTrips(trips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      alert('Erro ao apagar roteiro');
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
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Criar Roteiro</span>
                <span className="sm:hidden">Criar</span>
              </Link>
              <Link
                href="/meus-roteiros"
                className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Meus Roteiros</span>
                <span className="sm:hidden">Roteiros</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Meus Roteiros
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {trips.length > 0 ? `${trips.length} roteiro(s) guardado(s)` : 'Gerencie todos os seus roteiros de viagem'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Carregando roteiros...
            </p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ainda não tem roteiros guardados
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Comece a planear a sua próxima aventura pela Europa! Os roteiros são guardados no seu navegador.
            </p>
            <Link
              href="/criar-roteiro"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
            >
              🚀 Criar Primeiro Roteiro
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              💾 Os seus roteiros ficam guardados localmente no navegador
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {trip.region}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          ⏱️ {trip.duration_days}{' '}
                          {trip.duration_days === 1 ? 'dia' : 'dias'}
                        </p>
                        {trip.budget && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            💰 Orçamento: {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}
                          </p>
                        )}
                        {trip.estimated_cost && (
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {trip.estimated_cost}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Apagar roteiro"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Criado em {new Date(trip.created_at).toLocaleDateString('pt-PT')}
                  </div>

                  <Link
                    href={`/roteiro/${trip.id}`}
                    className="block w-full py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Ver Roteiro →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create New Button */}
        {trips.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/criar-roteiro"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
            >
              ✨ Criar Novo Roteiro
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
