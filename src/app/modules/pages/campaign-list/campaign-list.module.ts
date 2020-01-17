import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignListRoutingModule } from './campaign-list-routing.module';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { MatButtonModule } from '@angular/material';
import { PopUpMessageModule } from '../../components/popup-message/pop-up-message.module';

@NgModule({
  declarations: [CampaignListComponent, CampaignDetailComponent],
  imports: [
    CommonModule,
    CampaignListRoutingModule,
    MatButtonModule,
    PopUpMessageModule 
  ]
})
export class CampaignListModule { }
