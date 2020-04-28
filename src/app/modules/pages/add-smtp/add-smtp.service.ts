import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddSmtpService {

  constructor(
    private http: HttpClient
  ) { }

  addSmtp(body) {
    return this.http.post(`${environment.mailsystembaseapiurl}/smtp/settings/CAMPAIGN`, body).toPromise();
  }

  getDomain(body) {
    return this.http.post (`${environment.mailsystembaseapiurl}/smtp/validate_smtp`, body).toPromise();
  }

}
