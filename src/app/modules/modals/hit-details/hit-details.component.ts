import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-hit-details',
  templateUrl: './hit-details.component.html',
  styleUrls: ['./hit-details.component.scss']
})
export class HitDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>) { }

  hitDetailForm: any
  editorConfig: AngularEditorConfig = {
    height: '300px',
    editable: false,
  }
  popUpValue:any

  ngOnInit() {
    this.getHitDetailsForm();
  }

  getHitDetailsForm() {
    if (this.data.campaignDetail.hit_details.message) {
      this.hitDetailForm = this.fb.group({
        subject: [{ value: this.data.campaignDetail.hit_details.subject, disabled: true }],
        message: [this.data.campaignDetail.hit_details.message]
      })
    }
    else {
      this.popUpValue = ['Mail not sended yet', false];
    }

  }

  close() {
    this.dialogRef.close();
  }

}
