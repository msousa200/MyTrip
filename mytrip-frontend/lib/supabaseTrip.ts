import { supabase } from '@/lib/supabaseClient';

export async function saveTripToSupabase(trip: any, userId: string) {
  const { data, error } = await supabase.from('roteiros').insert([
    {
      user_id: userId,
      region: trip.region,
      country: trip.country,
      duration_days: trip.duration_days,
      budget_min: trip.budget_min,
      budget_max: trip.budget_max,
      interests: trip.interests,
      created_at: trip.created_at,
      itinerary: trip.itinerary,
      general_tips: trip.general_tips,
      estimated_cost: trip.estimated_cost,
      best_season: trip.best_season,
    }
  ]).select();
  return { data, error };
}
