import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignDescriptionComponent } from 'src/app/modules/modals/campaign-description/campaign-description.component';
import { CampaignListService } from '../campaign-list.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { UpdateCampaignComponent } from 'src/app/modules/modals/update-campaign/update-campaign.component';
import { Subscription } from 'rxjs';
import { UploadCsvComponent } from 'src/app/modules/modals/upload-csv/upload-csv.component';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit, OnDestroy {

  campaignDetails: any
  userDetails: any;
  popUpValue: any;
  dialogSubs: Subscription;
  apiInProcess: boolean;
  templateList: any

  constructor(public dialog: MatDialog,
    private campaignListService: CampaignListService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.dialogSubs = this.campaignListService.getEventValue().subscribe(item => {
      if (item === 'show') {
        this.viewCampaign();
      } else if (item === 'update') {
        this.updateCampaign();
      }
      else if (item === 'sendMail') {
        this.sendMailToUsers();
      }
      else {
        this.assignUsersWithCsv()
      }
    })
  }

  ngOnInit() {
    this.getCampaignDetails();
  }

  viewCampaign() {
    const dialogRef = this.dialog.open(CampaignDescriptionComponent, {
      width: '750px',
      data: {
        campaignDetail: this.campaignDetails
      }
    })
  }

  updateCampaign() {
    const dialog = this.dialog.open(UpdateCampaignComponent, {
      width: '750px',
      height: '90%',
      data: {
        campaignDetail: this.campaignDetails
      }
    });
    dialog.afterClosed().subscribe(campaignDetails => {
      if (campaignDetails)
        this.updateCampaignDetails(campaignDetails);
    })
  }

  assignUsersWithCsv() {
    const dialog = this.dialog.open(UploadCsvComponent, {
      width: '400px',
    });
    dialog.afterClosed().subscribe(userData => {
      if (userData) {
        console.log(userData);
      }
    })
  }

  async updateCampaignDetails(campaignDetail) {
    const [template] = this.campaignDetails.Template;
    try {
      const res = await this.campaignListService.updateCampaign(campaignDetail, this.campaignDetails._id);
      this.popUpValue = [res.message, false];
      await this.campaignListService.deleteTemplate({
        campaign_id: this.campaignDetails._id,
        template_id: template._id
      });
      await this.campaignListService.assignTemplate({
        campaign_id: this.campaignDetails._id,
        template_id: campaignDetail.template._id
      });
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async getCampaignDetails() {
    this.apiInProcess = true
    try {
      const res = await this.campaignListService.getCampaignList();
      this.campaignDetails = res.find(item => {
        return item._id == this.route.snapshot.paramMap.get('id')
      })
      this.getUserDetails();
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false
    }
  }

  async getUserDetails() {
    try {
      const res = await this.campaignListService.campaignDetails(this.campaignDetails._id);
      this.userDetails = res.users;
      if (this.userDetails.length === 0) {
        this.popUpValue = ['Do not have any assign users.', true]
      }
      else {
        this.userDetails.forEach((item) => {
          if (item.send_status === true) {
            const [seenDetail] = item.hit_details;
            if (seenDetail) {
              item.hit_details = seenDetail;
              item['seen'] = true;
            }
            else {
              item.hit_details = null;
              item['seen'] = false;
            }
          }
        })
      }
      this.apiInProcess = false;
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

  async sendMailToUsers() {
    const userIds = { ids: [] };
    this.apiInProcess = true;
    try {
      this.userDetails.forEach((item) => {
        userIds.ids.push(item._id);
      })
      await this.campaignListService.sendMail(userIds);
      this.apiInProcess = false;
      this.popUpValue = ['Emails sent successfully', false];
    } catch (error) {
      this.apiInProcess = false;
      this.commonService.handleError(error);
    }
  }

  ngOnDestroy() {
    this.dialogSubs.unsubscribe();
  }

}
