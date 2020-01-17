import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  jobProfiles: any;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * api to fetch job profiles
   */
  async getJobProfiles(): Promise<any> {
    this.jobProfiles = await this.http.get(`${environment.apibase}/email/countEmail`).toPromise();
    return this.jobProfiles;
  }

  sendJobProfiles() {
    return this.jobProfiles.data[0].data;
  }

  getSpamMails(body): Promise<any> {
    return this.http.get(`${environment.apibase}/email/spam/${body.page}/${body.limit}`).toPromise();
  }

}
