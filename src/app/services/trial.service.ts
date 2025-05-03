import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Trial } from '../models/trial.model';
import { Study } from '../models/study.model';

@Injectable({
  providedIn: 'root'
})
export class TrialService {
  private apiUrl = environment.apiUrl;

  private mapStudyToTrialItem(study: Study): Trial {
    return {
      NCTId: study.protocolSection?.identificationModule?.nctId ?? '',
      BriefTitle: study.protocolSection?.identificationModule?.briefTitle ?? '',
      OverallStatus: study.protocolSection?.statusModule?.overallStatus ?? '',
      HasResults: study.hasResults ?? false,
    };
  }

  // Fetches a list of trials from the API. It gets the trials by latest update date.
  async fetchTrialList(pageSize = 10): Promise<Trial[]> {
    const fields = 'NCTId|BriefTitle|OverallStatus|HasResults';
    const sort = 'LastUpdatePostDate:desc';
    const url = `${this.apiUrl}?fields=${fields}&pageSize=${pageSize}&sort=${sort}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error fetching trials: ${res.statusText}`);
    }
    const data = await res.json();
    return (data.studies || []).map(this.mapStudyToTrialItem);
  }

  async fetchTrialById(id: string): Promise<Trial | null> {
    const fields = 'NCTId|BriefTitle|OverallStatus|HasResults';
    const res = await fetch(`${this.apiUrl}/${id}?fields=${fields}`);

    if (!res.ok) {
      throw new Error(`Error fetching trial: ${res.statusText}`);
    }
    const data = await res.json();
    return data ? this.mapStudyToTrialItem(data) : null;
  }  
}
