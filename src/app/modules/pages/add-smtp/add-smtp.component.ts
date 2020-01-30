import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomainsDetails } from '../../.././app.config'
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { AddSmtpService } from './add-smtp.service';

@Component({
  selector: 'app-add-smtp',
  templateUrl: './add-smtp.component.html',
  styleUrls: ['./add-smtp.component.scss']
})
export class AddSmtpComponent implements OnInit {
  fetchForm: FormGroup;
  apiInProgress: boolean;
  existEmail: boolean;
  alertMessage: boolean;
  message: any;
  src = DomainsDetails.find(domain => domain.name = "email.com").src;
  popUpValue: any;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private addSmtpService: AddSmtpService
  ) { }


  ngOnInit() {
    this.mailForm();
  }

  mailForm() {
    this.fetchForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      smtp_server: ['', Validators.required],
      type: ['', Validators.required,],
      server_port: ['', Validators.required]
    })
  }

  getFormControl(key) {
    return this.fetchForm.get(key);
  }

  async onSubmit(data) {
    try {
      this.alertMessage = false;
      const smtp = {
        'mail_username': data.email,
        'mail_password': data.password,
        'mail_server': data.smtp_server,
        'mail_port': JSON.parse(data.server_port),
        'type': data.type
      }
      this.apiInProgress = true;
      await this.addSmtpService.addSmtp(smtp);
      this.apiInProgress = false;
      this.router.navigate(['settings/manage-smtp'])
    } catch (error) {
      this.apiInProgress = false;
      this.alertMessage = true;
      this.message = error.error.message;
    }
  }

  async changeIcon() {
    try {
      let email = this.getFormControl('email').value;
      if (email) {
        this.alertMessage = false;
        this.existEmail = true;
        let domain = email && DomainsDetails.find(domain => email.includes(domain.name));
        if (domain) {
          this.src = domain.src;
          this.fetchForm.get("smtp_server").setValue(domain.smtp);
          this.fetchForm.get("type").setValue(domain.smtpType);
          this.fetchForm.get("server_port").setValue(domain.smtpPort);
        } else {
          const res = await this.addSmtpService.getDomain(email);
          domain = res['message'] && DomainsDetails.find(domain => domain.name == res['message']);
          this.src = domain.src
          this.fetchForm.get("smtp_server").setValue(domain.smtp);
          this.fetchForm.get("type").setValue(domain.smtpType);
          this.fetchForm.get("server_port").setValue(domain.smtpPort);
        }
      }
    } catch (error) {
      this.src = DomainsDetails.find(domain => domain.name = "email.com").src;
      this.popUpValue = ['Invalid email', true];
    }
  }

}
