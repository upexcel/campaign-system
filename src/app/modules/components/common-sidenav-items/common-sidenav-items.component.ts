import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-common-sidenav-items',
  templateUrl: './common-sidenav-items.component.html',
  styleUrls: ['./common-sidenav-items.component.scss']
})
export class CommonSidenavItemsComponent implements OnInit {

  onSettingsPage: boolean;
  userName: string;
  userAvatar: string;
  @Output() openSideNav: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.onSettingsPage = this.router.url.startsWith('/settings/');
  }

  ngOnInit() {
    this.getUserAccountInfo()
  }

  async getUserAccountInfo() {
    const { userName, userAvatar } = await this.commonService.getUserNameAndImage();
    this.userName = userName;
    this.userAvatar = userAvatar;
  }

  logout() {
    this.router.navigate(['/login']);
    this.localStorageService.clearLocalStorage();
  }

  openSideNavEmitter() {
    this.openSideNav.emit();
  }

}
