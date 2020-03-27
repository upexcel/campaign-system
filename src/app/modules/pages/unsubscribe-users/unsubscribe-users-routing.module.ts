import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnsubscribeUsersComponent } from './unsubscribe-users.component';


const routes: Routes = [{
  path: '',
  component:UnsubscribeUsersComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnsubscribeUsersRoutingModule { }
