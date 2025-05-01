import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  // Signal to store favorite trial IDs
  private favoriteTrialIds = signal<string[]>([]);

  // Add a trial ID to the favorites list
  addFavorite(trialId: string) {
    const currentFavorites = this.favoriteTrialIds();
    if (!currentFavorites.includes(trialId)) {
      this.favoriteTrialIds.set([...currentFavorites, trialId]);
    }
  }

  // Remove a trial ID from the favorites list
  removeFavorite(trialId: string) {
    const updatedFavorites = this.favoriteTrialIds().filter((id) => id !== trialId);
    this.favoriteTrialIds.set(updatedFavorites);
  }

  // Get the signal for favorite trial IDs
  getFavorites() {
    return this.favoriteTrialIds;
  }

  constructor() { }
}
