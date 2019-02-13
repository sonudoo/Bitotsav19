import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAllFeedsService {
  _url = 'https://bitotsav.in/api/admin/getAllFeeds';
  constructor(private _http: HttpClient) { 

  }
  getAllFeeds(token: any){
    return this._http.post<any>(this._url, {token: token});
  }
}