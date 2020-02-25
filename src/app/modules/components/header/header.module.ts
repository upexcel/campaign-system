import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { RouterButtonComponent } from '../router-button/router-button.component';

@NgModule({
  declarations: [
    HeaderComponent,
    RouterButtonComponent
  ],
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
