import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  _url = "http://localhost:3000/api/admin/sendAnnouncement";
  
  constructor(private _http: HttpClient) { }
  sendAnnouncement(token: any, title: String, msg: String){
    return this._http.post<any>(this._url, {token: token, title:title, msg: msg});
  }
}
