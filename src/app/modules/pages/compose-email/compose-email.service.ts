import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComposeEmailService {

  constructor(
    private http: HttpClient
  ) { }

  getTemplateList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/message/get_email_template/CAMPAIGN`).toPromise();
  }

  createCampaign(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/create_campaign`, {
      "campaign_name": body.campaign,
      "campaign_description": body.campaignDescription,
      "active": true
    }).toPromise();
  }

  assignTemplate(body): Promise<any> {
    return this.http.put(`${environment.mailsystembaseapiurl}/assign_template/${body.campaign_id}/${body.template_id}`, '').toPromise();
  }

  assignUser(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/user_list_campaign`, body).toPromise();
  }

}
