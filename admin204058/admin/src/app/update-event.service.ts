import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateEventData } from './update-event/update-event-data';

@Injectable({
  providedIn: 'root'
})
export class UpdateEventService {
  _url = 'http://localhost:3000/api/admin/updateEvent';
  constructor(private _http: HttpClient) { 

  }

  updateEvent(token: any, eventId: Number, updateEventData: UpdateEventData, msg: String){
    return this._http.post<any>(this._url, {token: token, eventId: eventId, updateEventData: updateEventData, msg: msg});
  }
}
