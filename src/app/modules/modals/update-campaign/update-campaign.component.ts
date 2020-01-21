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
    this.updateCampaignForm = this.fb.group({
      template1: [null, Validators.required],
      template2: [null],
      template3: [null],
      message1: [null],
      message2: [null],
      message3: [null]
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
    this.updateCampaignForm.get('template1').value ? this.updateCampaignForm.get('message1').setValue(this.updateCampaignForm.get('template1').value.message) : '';
    this.updateCampaignForm.get('template2').value ? this.updateCampaignForm.get('message2').setValue(this.updateCampaignForm.get('template2').value.message) : '';
    this.updateCampaignForm.get('template3').value ? this.updateCampaignForm.get('message3').setValue(this.updateCampaignForm.get('template3').value.message) : '';
  }

  close() {
    this.dialogRef.close();
  }

}
