import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSmtpComponent } from './add-smtp.component';
import { AddSmtpRoutingModule } from './add-smtp-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopUpMessageModule } from '../../components/popup-message/pop-up-message.module';



@NgModule({
  declarations: [AddSmtpComponent],
  imports: [
    CommonModule,
    AddSmtpRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PopUpMessageModule
  ]
})
export class AddSmtpModule { }
