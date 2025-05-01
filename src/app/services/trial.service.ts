import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TrialItem } from '../models/trial-item.model'; // Make sure this import exists

@Injectable({
  providedIn: 'root'
})
export class TrialService {

  private apiUrl = environment.apiUrl;

  constructor() { }

  async fetchTrialList(pageSize: number = 10): Promise<TrialItem[]> {
    const fields = 'NCTId|BriefTitle|OverallStatus|HasResults';
    const sort = 'LastUpdatePostDate:desc';
    const url = `${this.apiUrl}?fields=${fields}&pageSize=${pageSize}&sort=${sort}`;
    const res = await fetch(url);
    
    if(!res.ok) {
      throw new Error(`Error fetching trials: ${res.statusText}`);
    } 
    const data = await res.json();
    console.log('Fetched data:', data);
    return (data.studies || []).map((study: any) => ({
      NCTId: study.protocolSection?.identificationModule?.nctId ?? '',
      BriefTitle: study.protocolSection?.identificationModule?.briefTitle ?? '',
      OverallStatus: study.protocolSection?.statusModule?.overallStatus ?? '',
      HasResults: study.hasResults ?? false,
    }));
  }

  async fetchTrialById(id: string) {
    const res = await fetch(`${this.apiUrl}?NCTId=${id}`);

    if(!res.ok) {
      throw new Error(`Error fetching trial: ${res.statusText}`);
    } 
    
    return await res.json();
  } 
}
