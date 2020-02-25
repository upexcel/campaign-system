import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from './login-page-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/angular-material.module';
import { ForgetPasswordComponent } from '../../modals/forget-password/forget-password.component';
import { PopUpMessageModule } from '../../components/popup-message/pop-up-message.module';

@NgModule({
  declarations: [
    LoginPageComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    PopUpMessageModule
  ],
  entryComponents:[
    ForgetPasswordComponent
  ]
})
export class LoginPageModule { }
