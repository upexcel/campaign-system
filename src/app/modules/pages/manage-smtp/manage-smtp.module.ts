import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSmtpComponent } from './manage-smtp.component';
import { ManageSmtpRoutingModule } from './manage-smtp-routing.module';
import { PopUpMessageModule } from '../../components/popup-message/pop-up-message.module';

@NgModule({
  declarations: [ManageSmtpComponent],
  imports: [
    CommonModule,
    ManageSmtpRoutingModule,
    PopUpMessageModule
  ]
})
export class ManageSmtpModule { }
