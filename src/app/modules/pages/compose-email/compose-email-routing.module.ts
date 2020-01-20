import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComposeEmailComponent } from './compose-email.component';


const routes: Routes = [
  {
    path: '',
    component:ComposeEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComposeEmailRoutingModule { }
