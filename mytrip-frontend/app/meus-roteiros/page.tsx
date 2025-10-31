'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthButton from '@/app/components/AuthButton';
import { supabase } from '@/lib/supabaseClient';
import ScrollAnimation from '@/app/components/ScrollAnimation';

interface TripSummary {
  id: string;
  region: string;
  duration_days: number;
  created_at: string;
  budget_min?: number;
  budget_max?: number;
  interests?: string[];
  itinerary?: any;
  budget?: string;
  estimated_cost?: string;
}

export default function MeusRoteiros() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setTrips([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('roteiros')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setTrips([]);
      } else {
        setTrips(data || []);
      }
      setLoading(false);
    };
    fetchTrips();
  }, [user]);

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
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollAnimation direction="fade">
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
        </ScrollAnimation>

  {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Carregando roteiros...
            </p>
          </div>
        ) : !user ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Faça login para ver seus roteiros
            </h3>
            <AuthButton />
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
              Os seus roteiros ficam guardados na sua conta Supabase
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <ScrollAnimation key={trip.id} direction="up" delay={index * 100}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
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
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                      Editar
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
              </ScrollAnimation>
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
