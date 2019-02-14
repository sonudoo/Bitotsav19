import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetFCMListService {

  _url = 'https://bitotsav.in/api/admin/getFCMList';
  constructor(private _http: HttpClient) { 

  }

  getList(token: any){
    return this._http.post<any>(this._url, {token: token});
  } 
}
