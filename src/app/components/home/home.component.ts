import { Component, inject, signal, effect } from '@angular/core';
import { TrialService } from '../../services/trial.service';
import { FavoritesService } from '../../services/favorites.service';
import { AutoFetchService } from '../../services/auto-fetch.service';
import { TrialItem } from '../../models/trial-item.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private trialService = inject(TrialService);
  public favoritesService = inject(FavoritesService);
  public autoFetchService = inject(AutoFetchService);

  trialList = signal<TrialItem[]>([]);
  toggler = signal(false);
  // This signal holds the selected trial IDs. It is cleared after addition or removal
  selectedTrials = signal<string[]>([]);
  loading = signal(false);

  constructor() {
    this.fetchTrialList();
    
    effect((onCleanup) => {
      let intervalId: any;
      const togglerValue = this.autoFetchService.toggler(); // Use service signal
      
      if (togglerValue) {
        this.fetchTrialList();
        intervalId = setInterval(() => {
          this.fetchTrialList();
        }, 5000);
      }
  
      onCleanup(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      });
    });
  }

  private async fetchTrialList() {
    this.loading.set(true);
    try {
      const newTrials = await this.trialService.fetchTrialList();
      const updatedList = [...newTrials, ...this.trialList()].slice(0, 10);
      this.trialList.set(updatedList);
    } finally {
      this.loading.set(false);
    }
  }

  onToggleChange(isEnabled: boolean) {
    this.autoFetchService.toggleAutoFetch(isEnabled);
  }

  toggleSelection(trialId: string, checked: boolean) {
    const selected = this.selectedTrials();

    if (checked) {
      this.selectedTrials.set([...selected, trialId]);
    } else {
      this.selectedTrials.set(selected.filter(id => id !== trialId));
    }
  }

  // This method is called when the "Add to Favorites" button is clicked
  onAddSelectedToFavorites() {
    this.selectedTrials().forEach(id => this.favoritesService.addFavorite(id));
    this.selectedTrials.set([]);
  }
  
  // This method is called when the "Remove from Favorites" button is clicked
  onRemoveSelectedFromFavorites() {
    this.selectedTrials().forEach(id => this.favoritesService.removeFavorite(id));
    this.selectedTrials.set([]);
  }
}
