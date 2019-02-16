import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAllParticipantsService {
  _url = 'http://localhost:3000/api/admin/getAllParticipants';
  constructor(private _http: HttpClient) { 

  }

  getAllParticipants(token: any){
    return this._http.post<any>(this._url, {token: token});
  } 
}
