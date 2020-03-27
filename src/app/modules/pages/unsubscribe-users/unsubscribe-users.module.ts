import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnsubscribeUsersRoutingModule } from './unsubscribe-users-routing.module';
import { UnsubscribeUsersComponent } from './unsubscribe-users.component';


@NgModule({
  declarations: [UnsubscribeUsersComponent],
  imports: [
    CommonModule,
    UnsubscribeUsersRoutingModule
  ]
})
export class UnsubscribeUsersModule { }
