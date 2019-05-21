import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAllSAPSService {
  _url = 'http://localhost:3000/api/admin/getAllSAPS';
  constructor(private _http: HttpClient) { 

  }

  getAllSAPS(token: any){
    return this._http.post<any>(this._url, {token: token});
  } 
}
