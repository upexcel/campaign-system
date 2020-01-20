import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ManageSmtpComponent } from "./manage-smtp.component"

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageSmtpComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ManageSmtpRoutingModule { }
