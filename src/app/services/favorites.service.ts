import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoriteTrialIds = signal<string[]>([]);

  addFavorite(trialId: string) {
    const currentFavorites = this.favoriteTrialIds();
    if (!currentFavorites.includes(trialId)) {
      this.favoriteTrialIds.set([...currentFavorites, trialId]);
    }
  }

  removeFavorite(trialId: string) {
    const updatedFavorites = this.favoriteTrialIds().filter((id) => id !== trialId);
    this.favoriteTrialIds.set(updatedFavorites);
  }

  getFavorites() {
    return this.favoriteTrialIds;
  }
}
