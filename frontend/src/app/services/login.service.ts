import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  api = "http://localhost:8080/"


  saveUser(user:any){
    return this.http.post(this.api +"register", user)
  }
  loginUser(user: any){
    return this.http.post(this.api + "login" , user )
  }

}
