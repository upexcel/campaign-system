import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSmtpComponent } from './manage-smtp.component';
import { ManageSmtpRoutingModule } from './manage-smtp-routing.module';

@NgModule({
  declarations: [ManageSmtpComponent],
  imports: [
    CommonModule,
    ManageSmtpRoutingModule
  ]
})
export class ManageSmtpModule { }
