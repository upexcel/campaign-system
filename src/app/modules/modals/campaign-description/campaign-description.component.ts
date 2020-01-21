import { Component, OnInit, Inject } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-campaign-description',
  templateUrl: './campaign-description.component.html',
  styleUrls: ['./campaign-description.component.scss']
})
export class CampaignDescriptionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>) {
  }

  editCampaignForm: any

  editorConfig: AngularEditorConfig = {
    height: '230px',
    editable: false,
  }

  ngOnInit() {
    this.getEditCampaignForm();
  }

  getEditCampaignForm() {
    this.editCampaignForm = this.fb.group({
      campaignName: [this.data.campaignDetail.Campaign_name, Validators.required],
      campaignDescription: [this.data.campaignDetail.Campaign_description || null],
    })
  }

  close() {
    this.dialogRef.close();
  }

}
