import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/modules/core/login-page/login.service'
import { MatDialogRef } from '@angular/material';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  apiInProgress: boolean;

  constructor(
    private loginService: LoginService,
    private dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  resetPassword = this.fb.group({
    email: ['', Validators.compose([Validators.required,Validators.email])]
  })

  get email() {
    return this.resetPassword.get("email")
  }

  async forgetPassword(value) {
    // try {
    //   this.apiInProgress = true;
    //   const res = await this.loginService.forget(value);
    //   this.apiInProgress = false;
    //   if (res && res['message']) this.close(res['message'])
    // } catch (error) {
    //   this.commonService.handleError(error);
    // }
  }

  close(data?) {
    this.dialogRef.close(data);
  }

}
