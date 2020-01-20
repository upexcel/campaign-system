import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddSmtpComponent } from './add-smtp.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: AddSmtpComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AddSmtpRoutingModule { }
