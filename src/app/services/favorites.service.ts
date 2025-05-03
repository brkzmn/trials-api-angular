import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoriteTrialIds = signal<string[]>(this.loadFavorites());

  addFavorite(trialId: string) {
    const currentFavorites = this.favoriteTrialIds();
    if (!currentFavorites.includes(trialId)) {
      const updated = [...currentFavorites, trialId];
      this.favoriteTrialIds.set(updated);
      this.saveFavorites(updated);
    }
  }

  removeFavorite(trialId: string) {
    const updatedFavorites = this.favoriteTrialIds().filter((id) => id !== trialId);
    this.favoriteTrialIds.set(updatedFavorites);
    this.saveFavorites(updatedFavorites);
  }

  getFavorites() {
    return this.favoriteTrialIds;
  }

  private loadFavorites(): string[] {
    const data = localStorage.getItem('favoriteTrialIds');
    return data ? JSON.parse(data) : [];
  }

  private saveFavorites(favorites: string[]) {
    localStorage.setItem('favoriteTrialIds', JSON.stringify(favorites));
  }
}
