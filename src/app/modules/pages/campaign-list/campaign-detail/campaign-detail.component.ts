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
  templateList: any;
  sendMailInProcess: any;

  constructor(public dialog: MatDialog,
    private campaignListService: CampaignListService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.dialogSubs = this.campaignListService.getEventValue().subscribe(item => {
      if (item === 'show') {
        this.editCampaignDialog();
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

  editCampaignDialog() {
    const dialogRef = this.dialog.open(CampaignDescriptionComponent, {
      width: '700px',
      data: {
        campaignDetail: this.campaignDetails
      }
    })
    dialogRef.afterClosed().subscribe(campaignDetails => {
      if (campaignDetails)
        this.editCampaign(campaignDetails);
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
      if (campaignDetails) {
        this.updateCampaignDetails(campaignDetails);
      }
    })
  }

  assignUsersWithCsv() {
    const dialog = this.dialog.open(UploadCsvComponent, {
      width: '500px',
    });
    dialog.afterClosed().subscribe(userData => {
      if (userData) {
        this.assignUsers({
          "users": userData,
          "campaign":this.campaignDetails._id
        })
      }
    })
  }

  async assignUsers(body) {
    try {
      const res = await this.campaignListService.assignUser(body);
      this.getUserDetails();
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async editCampaign(campaignDetail) {
    try {
      const res = await this.campaignListService.updateCampaign(campaignDetail, this.campaignDetails._id);
      this.popUpValue = [res.message, false];
      this.campaignDetails.Campaign_name = campaignDetail.campaignName;
      this.campaignDetails.Campaign_description = campaignDetail.campaignDescription || 'No Description Provided';
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async updateCampaignDetails(campaignDetail) {
    const assignedTemplate = this.campaignDetails.Template;
    const templateList = new Array();
    let templateAleadyAssigned = false;
    templateList.push(campaignDetail.template1);
    templateList.push(campaignDetail.template2);
    templateList.push(campaignDetail.template3);
    templateList.forEach((item) => {
      if (item) {
        assignedTemplate.forEach((template) => {
          if (item._id === template._id) {
            templateAleadyAssigned = true
          }
        })
        if (templateAleadyAssigned === false) {
          this.updateTemplate(item);
        }
      }
    })
  }

  async updateTemplate(template) {
    try {
      await this.campaignListService.assignTemplate({
        campaign_id: this.campaignDetails._id,
        template_id: template._id
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
              item.hit_details = 'Not Seen Yet';
              item['seen'] = false;
            }
          }
          else {
            item.send_status = 'Not Sended Yet';
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
    this.sendMailInProcess = true;
    try {
      this.userDetails.forEach((item) => {
        userIds.ids.push(item._id);
      })
      if (userIds.ids.length === 0) {
        this.sendMailInProcess = false;
        this.popUpValue = ['Please add users to send mail', true];
      }
      else {
        await this.campaignListService.sendMail(userIds);
        this.getUserDetails();
        this.sendMailInProcess = false;
        this.popUpValue = ['Emails sent successfully', false];
      }
    } catch (error) {
      this.sendMailInProcess = false;
      this.commonService.handleError(error);
    }
  }

  ngOnDestroy() {
    this.dialogSubs.unsubscribe();
  }

}
