import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupMessageComponent } from './popup-message.component';

@NgModule({
  declarations: [PopupMessageComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PopupMessageComponent
  ]
})

export class PopUpMessageModule { }
