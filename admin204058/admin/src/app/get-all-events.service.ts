import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAllEventsService {
  _url = 'https://bitotsav.in/api/admin/getAllEvents';
  constructor(private _http: HttpClient) { 

  }

  getAllEvents(token: any){
    return this._http.post<any>(this._url, {token: token});
  } 
}
