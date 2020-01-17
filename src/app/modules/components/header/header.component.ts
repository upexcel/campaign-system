import { Component, EventEmitter, OnInit, ElementRef, Output, OnChanges, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppConfig, ADMIN } from 'src/app/app.config';
import { EmitEventsService } from 'src/app/services/emit-events.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CampaignListService } from '../../pages/campaign-list/campaign-list.service';
import { environment } from 'src/environments/environment';

declare let jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
  $el: any;
  config: any;
  router: Router;
  username: any;
  title = 'setting';
  fetchOnSettings: boolean;
  routerSubscription: Subscription;
  apiInProgress: boolean;
  currentRoute: any;
  token: string;
  Userimage: any;
  name: any;
  id: number;
  date = new Date().toDateString();
  @Input() imageName;
  @Input() selectedProfile;
  searchKeyword: any;
  searchSubs: Subscription;
  headingTitle: any;
  campDetailPage: any

  constructor(
    el: ElementRef,
    config: AppConfig,
    router: Router,
    private emitEventsService: EmitEventsService,
    private dialog: MatDialog,
    private commonService: CommonService,
    public localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private campaignListService: CampaignListService,
  ) {
    this.token = this.localStorageService.getToken();
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.router = router;
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let root = this.router.routerState.snapshot.root;
        while (root) {
          if (root['_routerState'].url.includes('campaign-detail')) {
            this.campDetailPage = true;
          }
          else {
            this.campDetailPage = false
          }
          if (root.children && root.children.length) {
            root = root.children[0];
          } else if (root.data && root.data['title']) {
            let pageTitle = root.data['title'];
            this.headingTitle = pageTitle
            return;
          } else {
            this.headingTitle = "";
            return;
          }
        }
        if (event.urlAfterRedirects.includes('/dashboard/home')) this.fetchOnSettings = false;
        else this.fetchOnSettings = true;
      }
    });

  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  toggleChat(): void {
    this.toggleChatEvent.emit(null);
  }

  onDashboardSearch(f): void {
    this.router.navigate(['/app', 'extra', 'search'], { queryParams: { search: f.value.search } });
  }


  ngOnInit(): void {
    // this.$el.find('.input-group-addon + .form-control').on('blur focus', function (e): void {
    //   jQuery(this).parents('.input-group')
    //   [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
    // });
    // this.getUserDetails();
    // if (this.selectedProfile) {
    //   this.headingTitle = this.selectedProfile['title']
    // } else {
    let root = this.router.routerState.snapshot.root;
    while (root) {
      if (root['_routerState'].url.includes('campaign-detail')) {
        this.campDetailPage = true
      }
      else {
        this.campDetailPage = false;
      }
      if (root.children && root.children.length) {
        root = root.children[0];
      } else if (root.data && root.data['title']) {
        let pageTitle = root.data['title'];
        this.headingTitle = pageTitle
        return;
      } else {
        return;
      }
    }
    // }
    const username = localStorage.getItem("username");
    this.username = username && username.slice(1, username.indexOf('@'));
  }

  ngOnChanges() {
    this.getUserDetails();
  }

  async getUserDetails() {
    try {
      const res = await this.commonService.getUserDetails();
      this.Userimage = `${environment.apibase}/${res['imageUrl']}`;
      this.name = res['name'];
    }
    catch (error) {
      this.commonService.handleError(error);
    }
  }


  logout() {
    this.router.navigate(['/login']);
    this.localStorageService.clearLocalStorage();
  }

  ngOnDestroy() {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
    if (this.searchSubs) this.searchSubs.unsubscribe();
  }

  isUserAdmin() {
    const token = this.localStorageService.getToken();
    const helper = new JwtHelperService;
    const decodedToken = helper.decodeToken(token);
    this.id = decodedToken.token;
    if (decodedToken.role === ADMIN) {
      return true
    }
    else {
      return false
    }
  }

  showCampaign() {
    this.campaignListService.setEventValue('show');
  }

  updateCampaign() {
    this.campaignListService.setEventValue('update');
  }

  openUploadCsv() {
    this.campaignListService.setEventValue('openCsv');
  }

  sendMailToUsers() {
    this.campaignListService.setEventValue('sendMail');
  }


}
