import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ManageSmtpService } from '../../pages/manage-smtp/manage-smtp.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private manageSmtpService: ManageSmtpService,
    private commonService: CommonService) { }

  resetPassword: any;
  apiInProcess: boolean;

  ngOnInit() {
    this.getResetPasswordForm();
  }

  getResetPasswordForm() {
    this.resetPassword = this.fb.group({
      password: ['', Validators.required]
    })
  }

  async setNewPassword(form) {
    try {
      this.apiInProcess = true;
      const res = await this.manageSmtpService.changePassword({
        smtpId: this.data.id,
        password: form.password
      });
      this.close(res);
    } catch (error) {
      this.close(error);
    }
    this.apiInProcess = false;
  }

  close(res?) {
    res ? this.dialogRef.close(res) : this.dialogRef.close();
  }

}
