import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: LoginPageComponent
      }
    ])
  ], 
  exports: [
    RouterModule
  ]
})
export class LoginPageRoutingModule { }
