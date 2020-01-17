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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
