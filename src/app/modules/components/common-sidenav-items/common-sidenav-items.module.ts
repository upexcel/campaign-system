import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonSidenavItemsComponent } from './common-sidenav-items.component';



@NgModule({
  declarations: [
    CommonSidenavItemsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonSidenavItemsComponent
  ]
})
export class CommonSidenavItemsModule { }
