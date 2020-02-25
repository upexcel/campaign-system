import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( 
    private http : HttpClient
  ) { }

  login(body) {
    return this.http.post(`${environment.apibase}/user/login`,body).toPromise();
  }

  forget(body){
    return this.http.put(`${environment.apibase}/account/forgot_password/${body.email}`, body).toPromise();
  }
}
