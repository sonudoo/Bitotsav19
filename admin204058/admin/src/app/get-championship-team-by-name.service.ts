import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetChampionshipTeamByNameService {
  _url = 'https://bitotsav.in/api/admin/getBCTeamByName';
  constructor(private _http: HttpClient) { 

  }

  getBCTeamByName(token: any, teamName: String){
    return this._http.post<any>(this._url, {token: token, teamName: teamName});
  } 
}
