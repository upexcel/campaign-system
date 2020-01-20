import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CampaignListService } from './campaign-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {

  constructor(private campaignListService: CampaignListService,
    private commonService: CommonService,
    private router: Router) { }

  campaignList: any
  apiInProcess: boolean
  popUpValue: any

  ngOnInit() {
    this.getCampaignList();
  }

  async getCampaignList() {
    this.apiInProcess = true;
    try {
      const res = await this.campaignListService.getCampaignList();
      this.campaignList = res;
      this.campaignList.forEach((item) => {
        if (!item.Campaign_description) {
          item.Campaign_description = 'No description was provided';
        }
      })
      if (this.campaignList.length === 0) {
        this.popUpValue = ["Do not have any campaign available", true];
      }
      this.apiInProcess = false;
    }
    catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

  openCampaign(campaign) {
    this.router.navigate(['settings/campaign-list/campaign-detail', campaign._id]);
  }

  async removeCampaign(campaign) {
    try {
      const res = await this.commonService.openConfirmationBox("Are you sure ?");
      if (res == 'yes') {
        await this.campaignListService.deleteCampaing(campaign);
        this.campaignList = this.campaignList.filter((item) => {
          return item._id !== campaign._id;
        })
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async changeStatus(campaignDetail) {
    try {
      const res = await this.campaignListService.changeStatus(campaignDetail, campaignDetail._id);
      this.popUpValue = ['Status changed successfully', false];
      this.getCampaignList();
    } catch (error) {

      this.commonService.handleError(error);
    }
  }

}
