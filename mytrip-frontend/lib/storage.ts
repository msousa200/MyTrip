/**
 * Sistema de armazenamento local para roteiros
 * Guarda os roteiros no localStorage do navegador
 */

export interface SavedTrip {
  id: string;
  region: string;
  duration_days: number;
  budget?: string;
  interests?: string[];
  created_at: string;
  itinerary: any[];
  general_tips?: string[];
  estimated_cost?: string;
  best_season?: string;
}

const STORAGE_KEY = 'mytrip_saved_trips';

/**
 * Guarda um roteiro no localStorage
 */
export function saveTrip(trip: SavedTrip): void {
  try {
    const trips = getSavedTrips();
    
    // Verifica se já existe e atualiza, senão adiciona
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.push(trip);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error('Erro ao guardar roteiro:', error);
  }
}

/**
 * Obtém todos os roteiros guardados
 */
export function getSavedTrips(): SavedTrip[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar roteiros:', error);
    return [];
  }
}

/**
 * Obtém um roteiro específico por ID
 */
export function getTripById(id: string): SavedTrip | null {
  const trips = getSavedTrips();
  return trips.find(t => t.id === id) || null;
}

/**
 * Remove um roteiro
 */
export function deleteTrip(id: string): void {
  try {
    const trips = getSavedTrips();
    const filtered = trips.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao remover roteiro:', error);
  }
}

/**
 * Limpa todos os roteiros
 */
export function clearAllTrips(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar roteiros:', error);
  }
}

/**
 * Conta quantos roteiros estão guardados
 */
export function getTripCount(): number {
  return getSavedTrips().length;
}

/**
 * Exporta todos os roteiros para um ficheiro JSON
 */
export function exportTripsToFile(): void {
  try {
    const trips = getSavedTrips();
    
    if (trips.length === 0) {
      alert('Não há roteiros para exportar!');
      return;
    }

    const dataStr = JSON.stringify(trips, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mytrip-roteiros-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ ${trips.length} roteiro(s) exportado(s) com sucesso!`);
  } catch (error) {
    console.error('Erro ao exportar roteiros:', error);
    alert('Erro ao exportar roteiros. Tente novamente.');
  }
}

/**
 * Importa roteiros de um ficheiro JSON
 */
export function importTripsFromFile(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTrips = JSON.parse(content) as SavedTrip[];
        
        if (!Array.isArray(importedTrips)) {
          throw new Error('Formato de ficheiro inválido');
        }

        // Valida que os dados têm a estrutura correta
        const validTrips = importedTrips.filter(trip => 
          trip.id && trip.region && trip.duration_days && trip.itinerary
        );

        if (validTrips.length === 0) {
          throw new Error('Nenhum roteiro válido encontrado no ficheiro');
        }

        // Obtém roteiros existentes
        const existingTrips = getSavedTrips();
        const existingIds = new Set(existingTrips.map(t => t.id));
        
        // Adiciona apenas roteiros novos (evita duplicados)
        let newCount = 0;
        let updatedCount = 0;
        
        validTrips.forEach(trip => {
          if (existingIds.has(trip.id)) {
            updatedCount++;
          } else {
            newCount++;
          }
          saveTrip(trip);
        });

        const totalImported = newCount + updatedCount;
        console.log(`✅ Importados: ${newCount} novos, ${updatedCount} atualizados`);
        resolve(totalImported);
        
      } catch (error) {
        console.error('Erro ao importar roteiros:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o ficheiro'));
    };
    
    reader.readAsText(file);
  });
}
