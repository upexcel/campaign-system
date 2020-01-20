import { Component, OnInit, Inject } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { CampaignListService } from '../../pages/campaign-list/campaign-list.service';


@Component({
  selector: 'app-update-campaign',
  templateUrl: './update-campaign.component.html',
  styleUrls: ['./update-campaign.component.scss']
})
export class UpdateCampaignComponent implements OnInit {


  updateCampaignForm: any;
  templateList: any;
  apiInProcess: boolean;
  templateId: any;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService,
    private campaignListService: CampaignListService) {
  }

  editorConfig: AngularEditorConfig = {
    height: '230px',
    editable: true,
  }

  ngOnInit() {
    this.getTemplateList();
  }

  getUpdateCampaignForm() {
    let template: any
    if (this.data.campaignDetail.Template) {
      [template] = this.data.campaignDetail.Template
    }
    this.templateId = template._id  
    this.updateCampaignForm = this.fb.group({
      campaignName: [this.data.campaignDetail.Campaign_name || null, Validators.required],
      campaignDescription: [this.data.campaignDetail.Campaign_description || null],
      template: [null,Validators.required],
      message: [template.message || null, Validators.required]
    })
  }

  async getTemplateList() {
    this.apiInProcess = true
    try {
      const res = await this.campaignListService.getTemplateList();
      this.templateList = res;
      this.apiInProcess = false;
      this.getUpdateCampaignForm();
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

  getTemplatePreview() {
    this.updateCampaignForm.get('message').setValue(this.updateCampaignForm.get('template').value.message);
  }

  close() {
    this.dialogRef.close();
  }

}
