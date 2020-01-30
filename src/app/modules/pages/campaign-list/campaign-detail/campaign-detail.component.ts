import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignDescriptionComponent } from 'src/app/modules/modals/campaign-description/campaign-description.component';
import { CampaignListService } from '../campaign-list.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { UpdateCampaignComponent } from 'src/app/modules/modals/update-campaign/update-campaign.component';
import { Subscription } from 'rxjs';
import { UploadCsvComponent } from 'src/app/modules/modals/upload-csv/upload-csv.component';
import { HitDetailsComponent } from 'src/app/modules/modals/hit-details/hit-details.component';
import { AddUserComponent } from 'src/app/modules/modals/add-user/add-user.component';
import { TestMailComponent } from 'src/app/modules/modals/test-mail/test-mail.component';
import { SendMailConfigurationComponent } from 'src/app/modules/modals/send-mail-configuration/send-mail-configuration.component';

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
  sendMailError: any;
  errorMsg: any;

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
        this.openSendMailConfiguration();
      }
      else if (item === 'addUser') {
        this.addUser();
      }
      else if (item === 'sendTestMail') {
        this.openSendTestMail();
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
      minHeight: '300px',
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
      width: '700px',
      minHeight: '300px',
      data: {
        campaignId: this.campaignDetails._id
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
          "campaign": this.campaignDetails._id
        })
      }
    })
  }

  async assignUsers(body) {
    this.sendMailInProcess = true;
    try {
      const res = await this.campaignListService.assignUser(body);
      this.getUserDetails();
      this.sendMailInProcess = false;
    } catch (error) {
      this.sendMailInProcess = false;
      this.commonService.handleError(error);
    }
  }

  async editCampaign(campaignDetail) {
    try {
      const res = await this.campaignListService.updateCampaign(campaignDetail, this.campaignDetails);
      this.popUpValue = [res.message, false];
      this.campaignDetails.Campaign_name = campaignDetail.campaignName;
      this.campaignDetails.Campaign_description = campaignDetail.campaignDescription || 'No Description Provided';
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async updateCampaignDetails(campaignDetail) {
    let templateList = [];
    let templateIds = [];
    templateList.push(campaignDetail.template1);
    templateList.push(campaignDetail.template2);
    templateList.push(campaignDetail.template3);
    templateList.forEach((item) => {
      if (item)
        templateIds.push(item._id);
    })
    this.updateTemplate(templateIds);
  }

  async updateTemplate(templateIds) {
    try {
      const res = await this.campaignListService.assignTemplate({
        campaign_id: this.campaignDetails._id,
        template: { templates: templateIds }
      });
      this.popUpValue = [res.message, false];
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
      if (!this.campaignDetails.Campaign_description)
        this.campaignDetails.Campaign_description = 'No Description Provided';
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
            if (seenDetail.seen) {
              item.hit_details = seenDetail;
              item['seen'] = true;
            }
            else {
              item['seen'] = false;
              item.hit_details = seenDetail;
              item.hit_details.seen_date = 'Pending'
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


  openSendMailConfiguration() {
    const dialog = this.dialog.open(SendMailConfigurationComponent, {
      width: '400px',
      minHeight: '300px',
      panelClass: 'custom-dialog-container',
      data: { sendMailError: this.sendMailError }
    });
    this.errorMsg = false;
    dialog.afterClosed().subscribe((formValue) => {
      if (formValue)
        this.sendMailToUsers(formValue);
    })
  }

  async sendMailToUsers(smtps) {
    smtps.selectedSmtp = smtps.selectedSmtp.filter(item => item !== false);
    if (smtps.selectedSmtp.length > 0) {
      const smtpIds = [];
      smtps.selectedSmtp.forEach(item => smtpIds.push(item._id))
      const sendMailConfig = { ids: [], delay: smtps.interval, smtps: smtpIds };
      this.sendMailInProcess = true;
      try {
        this.userDetails.forEach((item) => {
          sendMailConfig.ids.push(item._id);
        })
        if (sendMailConfig.ids.length === 0) {
          const res = await this.campaignListService.sendMail(sendMailConfig, this.campaignDetails._id);
          this.sendMailInProcess = false;
          this.popUpValue = ['Please add users to send mail', true];
        }
        else {
          const res = await this.campaignListService.sendMail(sendMailConfig, this.campaignDetails._id);
          this.getUserDetails();
          this.sendMailInProcess = false;
          this.popUpValue = [res['message'], false];
        }
      } catch (error) {
        this.sendMailInProcess = false;
        console.log(error);
        this.sendMailError = error.error;
        this.errorMsg = `${error.error.message} of ${error.error.mail}`;
      }
    }
    else {
      this.popUpValue = ['Please select minimum one smtp to send mail', true];
    }
  }

  openHitDetails(userDetails) {
    const dialog = this.dialog.open(HitDetailsComponent, {
      width: '680px',
      data: {
        campaignDetail: userDetails
      }
    });

  }

  addUser() {
    const dialog = this.dialog.open(AddUserComponent, {
      width: '400px',
    })
    dialog.afterClosed().subscribe((userDetails) => {
      if (userDetails) {
        this.assignUsers({
          "users": [userDetails],
          "campaign": this.campaignDetails._id
        })
      }
    })
  }

  openSendTestMail() {
    const dialog = this.dialog.open(TestMailComponent, {
      width: '400px'
    })
    dialog.afterClosed().subscribe((email) => {
      if (email)
        this.sendTestMail(email);
    })
  }

  async sendTestMail(email) {
    try {
      const res = await this.campaignListService.sendTestMail(email);
      this.popUpValue = [res['message'], false];
    } catch (error) {
      this.popUpValue = [`${error.error.message} of ${error.error.mail}`, true]
    }
  }

  ngOnDestroy() {
    this.dialogSubs.unsubscribe();
  }

}
