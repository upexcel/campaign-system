import { Component, OnInit } from '@angular/core';
import { ManageSmtpService } from "./manage-smtp.service"
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-manage-smtp',
  templateUrl: './manage-smtp.component.html',
  styleUrls: ['./manage-smtp.component.scss']
})
export class ManageSmtpComponent implements OnInit {
  smtpList: any;
  apiInProgress: boolean;

  constructor(
    private manageSmtpService: ManageSmtpService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getSmtpList();
  }

  async getSmtpList() {
    try {
      const data = await this.manageSmtpService.getSmtpList() as Array<any>;
      this.smtpList = data.sort((a, b) => a.priority > b.priority ? 1 : -1);
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async removeUser(id:string) {
    try {
      const res = await this.commonService.openConfirmationBox("Are you sure ?");
      if (res == 'yes') {
        await this.manageSmtpService.deleteSmtp(id);
        this.getSmtpList();
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async changePriority(smtp, position, index) {
    try {
      await this.manageSmtpService.changePriorityOfSmtp({
        id: smtp._id,
        position: position
      });
      if (position === 1) {
        [this.smtpList[index], this.smtpList[index - 1]] = [this.smtpList[index - 1], this.smtpList[index]];
      }
      else {
        [this.smtpList[index], this.smtpList[index + 1]] = [this.smtpList[index + 1], this.smtpList[index]];
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

}
