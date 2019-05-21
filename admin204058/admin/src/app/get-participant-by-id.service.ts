import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetParticipantByIdService {
  _url = 'http://localhost:3000/api/admin/getParticipantById';
  constructor(private _http: HttpClient) { 

  }

  getParticipantById(token: any, id: string){
    return this._http.post<any>(this._url, {token: token, id: id});
  } 
}
