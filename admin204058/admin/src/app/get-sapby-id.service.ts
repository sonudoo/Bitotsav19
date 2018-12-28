import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetSAPByIdService {

  _url = 'https://bitotsav.in/api/admin/getSAPById';
  constructor(private _http: HttpClient) { 

  }

  getSAPById(data){
    return this._http.post<any>(this._url, data);
  } 
}
