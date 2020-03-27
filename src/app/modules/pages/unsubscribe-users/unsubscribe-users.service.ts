import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnsubscribeUsersService {

  constructor(private http: HttpClient) { }

  unsubscribedUserList(body): Promise<any> {
    const params = new HttpParams()
      .set('limit', body.limit.toString())
      .set('skip', body.skip.toString());
    return this.http.get(`${environment.mailsystembaseapiurl}/unsub_status`, { params }).toPromise();
  }

}
