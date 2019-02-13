import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAllChampionshipTeamsService {
  _url = 'https://bitotsav.in/api/admin/getAllBCTeams';
  constructor(private _http: HttpClient) { 

  }

  getAllTeams(token: any){
    return this._http.post<any>(this._url, {token: token});
  } 
}
