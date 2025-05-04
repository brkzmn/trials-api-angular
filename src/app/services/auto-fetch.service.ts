import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class AutoFetchService {
  toggler = signal(this.loadAutoFetchValeu());

  toggleAutoFetch(value: boolean) {
    this.toggler.set(value);
    localStorage.setItem('autoFetchEnabled', String(value));
  }

  private loadAutoFetchValeu(): boolean {
    return localStorage.getItem('autoFetchEnabled') === 'true';
  }
}
