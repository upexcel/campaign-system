import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';


const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent
  },
  {
    path: 'campaign-detail/:id',
    component: CampaignDetailComponent,
    data: { title: "Campaign Details" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignListRoutingModule { }
