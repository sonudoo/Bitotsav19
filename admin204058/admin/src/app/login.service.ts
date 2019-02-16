import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  _loginUrl = "http://localhost:3000/api/admin/login";
  
  constructor(private _http: HttpClient) { }
  login(username: String, password: String){
    return this._http.post<any>(this._loginUrl, {username: username, password: password});
  }
}
