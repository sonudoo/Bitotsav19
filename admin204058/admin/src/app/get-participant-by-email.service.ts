import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetParticipantByEmailService {
  _url = 'http://localhost:3000/api/admin/getParticipantByEmail';
  constructor(private _http: HttpClient) { 

  }

  getParticipantByEmail(token: any, email: string){
    return this._http.post<any>(this._url, {token: token, email: email});
  } 
}
