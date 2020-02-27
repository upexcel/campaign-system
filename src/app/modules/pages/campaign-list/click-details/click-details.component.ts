import { Component, OnInit } from '@angular/core';
import { CampaignListService } from '../campaign-list.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-click-details',
  templateUrl: './click-details.component.html',
  styleUrls: ['./click-details.component.scss']
})
export class ClickDetailsComponent implements OnInit {

  apiInProcess: boolean;
  clickDetails = new Array();
  popUpValue: any;

  constructor(
    private campaignListService: CampaignListService,
    private commonService: CommonService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUserDetails();
  }

  async getUserDetails() {
    this.apiInProcess = true
    try {
      const res = await this.campaignListService.campaignDetails(this.route.snapshot.paramMap.get('id'));
      this.clickDetails = res.clicking_details;
      this.clickDetails.reverse();
      if (this.clickDetails.length === 0) {
        this.popUpValue = ['Do not have any available click detail', true];
      }
      this.apiInProcess = false;
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

}
