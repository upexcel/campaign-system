import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignListRoutingModule } from './campaign-list-routing.module';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { MatButtonModule } from '@angular/material';
import { PopUpMessageModule } from '../../components/popup-message/pop-up-message.module';
import { ClickDetailsComponent } from './click-details/click-details.component';

@NgModule({
  declarations: [CampaignListComponent, CampaignDetailComponent, ClickDetailsComponent],
  imports: [
    CommonModule,
    CampaignListRoutingModule,
    MatButtonModule,
    PopUpMessageModule 
  ]
})
export class CampaignListModule { }
