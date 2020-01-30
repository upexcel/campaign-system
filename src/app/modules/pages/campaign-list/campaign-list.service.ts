import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignListService {

  constructor(private http: HttpClient) { }

  private eventValue = new Subject<any>();

  getCampaignList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/list_campaign`).toPromise();
  }

  deleteCampaing(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/delete_campaign/${body._id}`).toPromise();
  }

  updateCampaign(body, campaignDetail): Promise<any> {
    return this.http.put(`${environment.mailsystembaseapiurl}/update_campaign/${campaignDetail._id}`, {
      campaign_name: body.campaignName,
      campaign_description: body.campaignDescription,
      status: campaignDetail.status,
      message: campaignDetail.message,
      message_subject: campaignDetail.message_subject
    }).toPromise();
  }

  campaignDetails(body): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/campaign_detail/${body}`).toPromise();
  }

  setEventValue(event) {
    this.eventValue.next(event);
  }

  getEventValue(): Observable<any> {
    return this.eventValue.asObservable();
  }

  getTemplateList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/message/get_email_template/CAMPAIGN`).toPromise();
  }

  deleteTemplate(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/assign_template/${body.campaign_id}/${body.template_id}`).toPromise();
  }

  assignTemplate(body): Promise<any> {
    return this.http.put(`${environment.mailsystembaseapiurl}/assign_template/${body.campaign_id}`, body.template).toPromise();
  }

  sendMail(body, id) {
    return this.http.post(`${environment.mailsystembaseapiurl}/campaign_mails/${id}`, body).toPromise();
  }

  assignUser(body) {
    return this.http.post(`${environment.mailsystembaseapiurl}/user_list_campaign`, body).toPromise();
  }

  changeCampaignStatus(campaign, status) {
    return this.http.post(`${environment.mailsystembaseapiurl}/pause_campaign/${campaign._id}/${status}`, '').toPromise();
  }

  sendTestMail(body) {
    return this.http.post(`${environment.mailsystembaseapiurl}/campaign_smtp_test`, body).toPromise();
  }

}
