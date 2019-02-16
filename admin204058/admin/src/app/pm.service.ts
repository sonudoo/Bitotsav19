import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PMService {
  _url = "http://localhost:3000/api/admin/sendPM";
  
  constructor(private _http: HttpClient) { }
  sendPM(token: any, id: String, title: String, msg: String){
    return this._http.post<any>(this._url, 
      {
        token: token, 
        id: id,  
        title: title,
        msg: msg
      });
  }
}
