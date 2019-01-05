import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class VerifyTokenService {
  _verifyUrl = "../api/admin/verifyToken";
  constructor(private _http: HttpClient) { }
  verify(token: any){
    return this._http.post<any>(this._verifyUrl, {token: token});
  }
  
}
