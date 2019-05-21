import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  _url1 = "https://bitotsav.in/api/admin/updatePayment";
  _url2 = "https://bitotsav.in/api/admin/getPayment";

  constructor(private _http: HttpClient) { }
  update(token: any, id: String, payment: any){
    return this._http.post<any>(this._url1, 
      {
        token: token, 
        id: id,
        payment: payment
      });
  }
  get(token: any, id: String){
    return this._http.post<any>(this._url2, 
      {
        token: token, 
        id: id
      });
  }
}
