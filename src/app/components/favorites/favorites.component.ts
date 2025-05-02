import { Component, inject, signal, effect } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { TrialService } from '../../services/trial.service';
import { TrialItem } from '../../models/trial-item.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})

export class FavoritesComponent {
  public favoritesService = inject(FavoritesService);
  private trialService = inject(TrialService);

  // This signal holds the list of favorite trials
  favoriteTrials = signal<TrialItem[]>([]);
  // This signal holds the selected trial IDs. It is cleared after addition or removal
  selectedFavorites = signal<string[]>([]);

  constructor() {
    effect(() => {
      const ids = this.favoritesService.getFavorites()();
      this.fetchFavoriteTrials(ids);
    });
  }

  private async fetchFavoriteTrials(ids: string[]) {
    const trials: TrialItem[] = [];
    for (const id of ids) {
      try {
        const trial = await this.trialService.fetchTrialById(id);
        if (trial) {
          trials.push(trial);
        }
      } catch (e) {
        // TODO:handle error
      }
    }
    this.favoriteTrials.set(trials);
  }

  onFavoriteSelectionToggle(trialId: string, checked: boolean) {
    const selected = this.selectedFavorites();
    if (checked) {
      this.selectedFavorites.set([...selected, trialId]);
    } else {
      this.selectedFavorites.set(selected.filter(id => id !== trialId));
    }
  }

  onRemoveSelectedFavorites() {
    this.selectedFavorites().forEach(id => this.favoritesService.removeFavorite(id));
    this.selectedFavorites.set([]);
  }
}
