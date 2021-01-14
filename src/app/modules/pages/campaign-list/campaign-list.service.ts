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

  setEventValue(event) {
    this.eventValue.next(event);
  }

  getEventValue(): Observable<any> {
    return this.eventValue.asObservable();
  }

  getCampaignList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/list_campaign`).toPromise();
  }

  deleteCampaing(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/delete_campaign/${body._id}`).toPromise();
  }

  editCampaignDetails(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/update_campaign/${body.id}`, body.campaignDetails).toPromise();
  }

  deleteEmail(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/update_campaign/${body.campaignId}/${body.messageId}`).toPromise();
  }

  campaignDetails(body): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/campaign_detail/${body}`).toPromise();
  }

  getTemplateList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/message/get_email_template/CAMPAIGN`).toPromise();
  }

  // assignTemplate(body): Promise<any> {
  //   return this.http.put(`${environment.mailsystembaseapiurl}/assign_template/${body.campaign_id}`, body.template).toPromise();
  // }

  sendMail(body, id): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/campaign_mails/${id}`, body).toPromise();
  }

  assignUser(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/user_list_campaign`, body).toPromise();
  }

  changeCampaignStatus(campaign, status): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/pause_campaign/${campaign._id}/${status}`, '').toPromise();
  }

  sendTestMail(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/campaign_smtp_test`, body).toPromise();
  }

  deleteUser(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/user_delete_campaign/${body.campaignId}/${body.userId}`).toPromise();
  }

  validateUser(campaign): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/validate_users/${campaign._id}`,'').toPromise();
  }

}
