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
      template: [null, Validators.required],
      message: [null, Validators.required],
      subject: [{ value: null, disabled: true }, Validators.required]
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
    this.sendMailToAllForm.get('message').setValue(this.sendMailToAllForm.get('template').value.message);
    this.sendMailToAllForm.get('subject').setValue(this.sendMailToAllForm.get('template').value.message_key);
  }

  async createCampaign(body) {
    this.createCampaignInProcess = true;
    try {
      const res = await this.composeEmailService.createCampaign(body);
      if (res) {
        try {
          if (body.template) {
            await this.composeEmailService.assignTemplate({
              template_id: body.template._id,
              campaign_id: res
            });
          }
          this.createCampaignInProcess = false;
          this.router.navigate(['settings/campaign-list']);
        }
        catch (error) { this.commonService.handleError(error) }
      }
    }
    catch (error) {
      this.commonService.handleError(error);
    }
  }

}
