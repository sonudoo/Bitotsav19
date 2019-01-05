import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetEventByIdService {

  _url = '../api/admin/getEventById';
  constructor(private _http: HttpClient) { 

  }

  getEventById(data){
    return this._http.post<any>(this._url, data);
  } 
}
