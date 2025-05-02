import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TrialItem } from '../models/trial-item.model';

@Injectable({
  providedIn: 'root'
})
export class TrialService {
  private apiUrl = environment.apiUrl;

  private mapStudyToTrialItem(study: any): TrialItem {
    return {
      NCTId: study.protocolSection?.identificationModule?.nctId ?? '',
      BriefTitle: study.protocolSection?.identificationModule?.briefTitle ?? '',
      OverallStatus: study.protocolSection?.statusModule?.overallStatus ?? '',
      HasResults: study.hasResults ?? false,
    };
  }

  // Fetches a list of trials from the API. It gets the trials by latest update date.
  async fetchTrialList(pageSize: number = 10): Promise<TrialItem[]> {
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

  async fetchTrialById(id: string): Promise<TrialItem | null> {
    const fields = 'NCTId|BriefTitle|OverallStatus|HasResults';
    const res = await fetch(`${this.apiUrl}/${id}?fields=${fields}`);

    if (!res.ok) {
      throw new Error(`Error fetching trial: ${res.statusText}`);
    }
    const data = await res.json();
    console.log(  'Fetched trial data:', data);
    const study = (data.studies && data.studies[0]) ? data.studies[0] : null;
    console.log('Mapped study to TrialItem:', study);
    return data ? this.mapStudyToTrialItem(data) : null;
  }  
}
