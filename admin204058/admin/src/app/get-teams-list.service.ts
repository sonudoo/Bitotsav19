import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetTeamsListService {
  _url = 'https://bitotsav.in/api/admin/getTeamsList';
  constructor(private _http: HttpClient) { 

  }

  getTeamsList(token: any, id: string){
    return this._http.post<any>(this._url, {token: token, eventId: id});
  } 
}
