import 'jquery-slimscroll';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SettingsSidenavComponent } from './settings-sidenav.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonSidenavItemsModule } from '../common-sidenav-items/common-sidenav-items.module';


@NgModule({
  declarations: [
    SettingsSidenavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    CommonSidenavItemsModule
  ],
  exports: [
    SettingsSidenavComponent
  ]
})
export class SettingsSidenavModule { }
