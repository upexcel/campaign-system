import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { TitleResolverService } from 'src/app/resolver/title-resolver.service';
import { ClickDetailsComponent } from './click-details/click-details.component';


const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent
  },
  {
    path: 'campaign-detail/:id/:name',
    component: CampaignDetailComponent,
    resolve: {
      title: TitleResolverService
    },
  },
  {
    path: 'click-details/:id/:name',
    component: ClickDetailsComponent,
    resolve: {
      title: TitleResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignListRoutingModule { }
