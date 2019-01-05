import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddEventData } from './add-event/add-event-data';

@Injectable({
  providedIn: 'root'
})

export class AddEventService {
  _url = '../api/admin/addEvent';
  constructor(private _http: HttpClient) { 

  }

  addEvent(addEventData: AddEventData, token: any){
    return this._http.post<any>(this._url, {addEventData: addEventData, token: token});
  }
}
