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
    // this.getUserDetails();
  }

  async getUserDetails() {
    this.apiInProcess = true
    try {
      const res = await this.campaignListService.campaignDetails(this.route.snapshot.paramMap.get('id'));
      res.clicking_details.forEach(item => {
        let temp = {};
        temp['date'] = item[0]._id.date;
        item.forEach(intervals => {
          temp[intervals._id.interval] = intervals.myCount;
        })
        this.clickDetails.push(temp);
      })
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
