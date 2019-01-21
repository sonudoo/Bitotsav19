import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ResultAnnouncementService {
  _url = "https://bitotsav.in/api/admin/resultAnnouncement";
  
  constructor(private _http: HttpClient) { }
  announce(token: any, eventId: Number, eventPosition1: String, eventPosition2: String, eventPosition3: String){
    return this._http.post<any>(this._url, 
      {
        token: token, 
        eventId: eventId,  
        eventPosition1: eventPosition1,
        eventPosition2: eventPosition2,
        eventPosition3: eventPosition3
      });
  }
}
