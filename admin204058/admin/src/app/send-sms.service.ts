import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SendSMSService {
  _loginUrl = "https://bitotsav.in/api/admin/sendSMS";
  
  constructor(private _http: HttpClient) { }
  sendSMS(token: any, phno: Number, msg: String){
    return this._http.post<any>(this._loginUrl, {token: token, phno: phno, msg: msg});
  }
}
