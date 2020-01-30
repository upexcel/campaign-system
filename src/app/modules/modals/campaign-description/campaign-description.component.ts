import { Component, OnInit, Inject } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComposeEmailService } from '../../pages/compose-email/compose-email.service';
import { CommonService } from 'src/app/services/common.service';
import { CampaignListService } from '../../pages/campaign-list/campaign-list.service';


@Component({
  selector: 'app-campaign-description',
  templateUrl: './campaign-description.component.html',
  styleUrls: ['./campaign-description.component.scss']
})
export class CampaignDescriptionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>,
    private composeEmailService: ComposeEmailService,
    private commonService: CommonService,
    private campaignListService: CampaignListService,
  ) {
  }

  editCampaignForm: any
  templateList: [];
  apiInProcess: any;
  campaignDetails: any;
  formData = new FormData();

  editorConfig: AngularEditorConfig = {
    height: '230px',
    editable: true,
  }

  ngOnInit() {
    this.getCampaignDetails();
  }

  async getCampaignDetails() {
    this.apiInProcess = true
    try {
      const res = await this.campaignListService.getCampaignList();
      this.campaignDetails = res.find(item => {
        return item._id == this.data.campaignDetail._id;
      })
      if (!this.campaignDetails.Campaign_description) {
        this.campaignDetails.Campaign_description = this.data.campaignDetail.Campaign_description
      }
      this.templateList = this.campaignDetails.Template;
      this.getEditCampaignForm();
      this.apiInProcess = false
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false
    }
  }

  getEditCampaignForm() {
    this.editCampaignForm = this.fb.group({
      campaignName: [this.campaignDetails.Campaign_name, Validators.required],
      campaignDescription: [this.campaignDetails.Campaign_description || null],
      templates: [null],
      subject: [null],
      message: [null],
      attachment: [null]
    })
  }


  getTemplatePreview() {
    if (this.getFromValue('templates')) {
      const templateValue = this.getFromValue('templates').value;
      this.getFromValue('message').setValue(templateValue.message);
      this.getFromValue('subject').setValue(templateValue.message_subject);
    }
  }

  getFromValue(formField) {
    return this.editCampaignForm.get(formField);
  }

  sendDataToParent(formValue) {
    if (formValue['templates']) {
      if ((formValue['message'] !== formValue.templates.message) ||
        (formValue['subject'] !== formValue.templates.message_subject)) {
        this.updateTemplate({
          "message": formValue['message'],
          "message_subject": formValue['subject']
        }, formValue.templates._id);
      }
    }
    if (formValue.attachment) {
      this.addAttachment();
    }
    setTimeout(() => {
      this.dialogRef.close(formValue);
    });
  }

  async updateTemplate(body, id) {
    try {
      await this.composeEmailService.editTemplate(body, id);
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async removeAttachment(id) {
    try {
      await this.composeEmailService.delAttachment(id);
      this.campaignDetails.attachment_file_name = null;
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async addAttachment() {
    try {
      await this.composeEmailService.addAttachment({
        id: this.campaignDetails._id,
        file: this.formData
      })
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  attachFile(files: File[]) {
    this.formData.append('attachment_file', files[0]);
  }

  close() {
    this.dialogRef.close();
  }

}
