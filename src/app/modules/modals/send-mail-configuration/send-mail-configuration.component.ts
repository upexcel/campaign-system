import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ManageSmtpService } from '../../pages/manage-smtp/manage-smtp.service';
import { CommonService } from 'src/app/services/common.service';
import * as _ from "lodash";

@Component({
  selector: 'app-send-mail-configuration',
  templateUrl: './send-mail-configuration.component.html',
  styleUrls: ['./send-mail-configuration.component.scss']
})
export class SendMailConfigurationComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private manageSmtpService: ManageSmtpService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data, ) { }

  sendMailConfiguration: any;
  smtpList: any;
  apiInProcess: boolean;
  selectedSmtp: any;

  ngOnInit() {
    this.getSmtpList()
  }

  getAddUserForm() {
    this.sendMailConfiguration = this.fb.group({
      interval: [3, Validators.required],
      smtps: this.createSmtp(this.smtpList),
      reminder: [false]
    })
  }

  async getSmtpList() {
    this.apiInProcess = true;
    try {
      const data = await this.manageSmtpService.getSmtpList() as Array<any>;
      this.smtpList = data.sort((a, b) => a.priority > b.priority ? 1 : -1);
      this.getAddUserForm();
      this.apiInProcess = false;
    } catch (error) {
      this.apiInProcess = false;
      this.commonService.handleError(error);
    }
  }

  createSmtp(smtpList) {
    const arr = smtpList.map(smtp => {
      return new FormControl(smtp.selected || false);
    });
    return new FormArray(arr);
  }

  getSelectedsmtp() {
    this.selectedSmtp = _.map(this.sendMailConfiguration.controls.smtps['controls'], (smtp, i) => {
      return smtp.value && this.smtpList[i];
    });
  }

  passDataToParent() {
    this.getSelectedsmtp();
    this.dialogRef.close({
      interval: this.sendMailConfiguration.get('interval').value,
      selectedSmtp: this.selectedSmtp,
    })
  }

  close() {
    this.dialogRef.close();
  }

}
