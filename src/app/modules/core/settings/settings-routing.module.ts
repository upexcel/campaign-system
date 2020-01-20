import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: "",
        redirectTo: "campaign-list",
        pathMatch: "full"
      },
      {
        path: "campaign-list",
        loadChildren: () => import('../../pages/campaign-list/campaign-list.module').then(m => m.CampaignListModule),
        data: { title: "Campaign List" }
      },
      {
        path: "manage-smtp",
        loadChildren: () => import('../../pages/manage-smtp/manage-smtp.module').then(m => m.ManageSmtpModule),
        data: { title: "Manage Smtp" }
      },
      {
        path: "add-smtp",
        loadChildren: () => import('../../pages/add-smtp/add-smtp.module').then(m => m.AddSmtpModule),
        data: { title: "Add Smtp" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
