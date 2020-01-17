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

  viewCampaign: any

  editorConfig: AngularEditorConfig = {
    height: '230px',
    editable: false,
  }

  ngOnInit() {
    this.getViewCampaignForm();
  }

  getViewCampaignForm() {
    let template: any;
    if (this.data.campaignDetail.Template) {
      [template] = this.data.campaignDetail.Template;
    }
    this.viewCampaign = this.fb.group({
      campaignDescription: [template.message || null, Validators.required]
    })
  }

  close() {
    this.dialogRef.close();
  }

}
