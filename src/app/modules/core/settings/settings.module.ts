import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { HeaderModule } from '../../components/header/header.module';
import { RouterModule } from '@angular/router';
import { SettingsSidenavModule } from '../../components/settings-sidenav/settings-sidenav.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router'


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    HeaderModule,
    RouterModule,
    SettingsSidenavModule,
    LoadingBarRouterModule
  ]
})
export class SettingsModule { }
