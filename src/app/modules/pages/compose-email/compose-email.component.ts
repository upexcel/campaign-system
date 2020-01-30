import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonService } from 'src/app/services/common.service';
import { ComposeEmailService } from './compose-email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compose-email-temp',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss'],
})
export class ComposeEmailComponent implements OnInit {

  templateList: any
  apiInProcess: boolean
  sendMailToAllForm: any
  editorConfig: AngularEditorConfig = {
    height: '200px',
    editable: true,
  }
  tagTitle: string
  emailList = new Array();
  interviewTagId: number;
  assignUserData = new Array();
  createCampaignInProcess: boolean;
  attachment: false;
  formData = new FormData();


  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private composeEmailService: ComposeEmailService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getSendMailToAllForm();
    this.getTemplateList();
  }

  getSendMailToAllForm() {
    this.sendMailToAllForm = this.fb.group({
      campaignDescription: [null],
      campaign: [null, Validators.required],
      template: [null],
      message: [null, Validators.required],
      subject: [null, Validators.required],
      attachment: [null]
    })
  }

  async getTemplateList() {
    this.apiInProcess = true
    try {
      const res = await this.composeEmailService.getTemplateList();
      this.templateList = res;
      this.apiInProcess = false;
    }
    catch (error) {
      this.commonService.handleError(error);
    }
  }

  getTemplatePreview() {
    this.attachment = false;
    this.sendMailToAllForm.get('message').setValue(this.sendMailToAllForm.get('template').value.message);
    this.sendMailToAllForm.get('subject').setValue(this.sendMailToAllForm.get('template').value.message_subject);
  }

  previewHtmlCode() {
        const templateCode = document.getElementsByClassName('angular-editor-textarea')[0] as HTMLElement;
    this.sendMailToAllForm.get('message').setValue(templateCode.innerText);
  }

  async createCampaign(body) {
    let res;
    this.createCampaignInProcess = true;
    try {
      if (body.template) {
        res = await this.composeEmailService.createCampaign({
          "campaign_name": body.campaign,
          "campaign_description": body.campaignDescription,
          "message": '',
          "message_subject": '',
          "active": true
        });
        let selectedTemplate = this.templateList.find(item => item._id === body.template._id);
        try {
          if ((selectedTemplate.message_subject !== body.subject) || (selectedTemplate.message !== body.message)) {
            await this.composeEmailService.editTemplate({
              "message": body.message,
              "message_subject": body.subject
            }, body.template._id);
          }
          await this.composeEmailService.assignTemplate({
            template: { templates: [body.template._id] },
            campaign_id: res
          });
        }
        catch (error) { this.commonService.handleError(error) }
      }
      else {
        res = await this.composeEmailService.createCampaign({
          "campaign_name": body.campaign,
          "campaign_description": body.campaignDescription,
          "message": body.message,
          "message_subject": body.subject,
          "active": true
        });
        if (body.attachment) {
          await this.composeEmailService.addAttachment({
            id: res,
            file: this.formData
          })
        }
      }
      this.createCampaignInProcess = false;
      this.router.navigate(['settings/campaign-list']);
    }
    catch (error) {
      this.commonService.handleError(error);
    }
  }

  attachFile(files: File[]) {
    this.formData.append('attachment_file', files[0]);
  }

}
