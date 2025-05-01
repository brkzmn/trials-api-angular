import { Component, inject, signal, effect } from '@angular/core';
import { TrialService } from '../../services/trial.service';
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

  // Signal for the list of trials
  trialList = signal<TrialItem[]>([]);

  // Signal for toggler state
  toggler = signal(false);

  constructor() {
    // Fetch data on page load
    this.fetchTrialList();

    // Effect to handle periodic updates when toggler is enabled
    effect(() => {
      let intervalId: any;

      if (this.toggler()) {
        // Fetch immediately when toggler is enabled
        this.fetchTrialList();

        // Start periodic fetch every 5 seconds
        intervalId = setInterval(() => {
          this.fetchTrialList();
        }, 5000);
      }

      // Cleanup logic: stop the interval when toggler is turned off
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    });
  }

  // Fetch trial list and merge with existing data
  private fetchTrialList() {
    this.trialService.fetchTrialList().then((newTrials) => {
      console.log('Fetched trials:', newTrials);
      // Merge new trials with the existing list and keep only the latest 10 records
      const updatedList = [...newTrials, ...this.trialList()].slice(0, 10);
      this.trialList.set(updatedList);
    });
  }

  // Handle toggler change
  onToggleChange(event: Event) {
    this.toggler.set((event.target as HTMLInputElement).checked);
  }
}
