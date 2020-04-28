import 'jquery-slimscroll';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonSidenavItemsModule } from '../common-sidenav-items/common-sidenav-items.module';

@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    CommonSidenavItemsModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class SidenavModule { }
