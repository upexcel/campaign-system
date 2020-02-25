import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from 'src/app/app.config';
import { EmitEventsService } from 'src/app/services/emit-events.service';
import { Subscription } from 'rxjs';
declare let jQuery: any;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, AfterViewInit, OnDestroy {
  $el: any;
  config: any;
  configFn: any;
  router: Router;
  location: Location;
  triggerRefreshSub: Subscription;
  currentRoute: any;
  jobChangesSubs: Subscription;

  @Output() errorEvent = new EventEmitter<string>();
  @Output() loading: any = new EventEmitter<any>();
  @Output() openSideNav: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedProfile: any = new EventEmitter<any>();
  @Output() toggleSidebarEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    config: AppConfig,
    el: ElementRef,
    router: Router,
    location: Location,
    private emitEventsService: EmitEventsService,
  ) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.configFn = config;
    this.router = router;
    this.location = location;
  }

  ngOnInit(): void {
    jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
    this.initSidebarScroll();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeActiveNavigationItem(this.location);
      }
    });
    this.emitEventsService.currentRouteId.subscribe(currentTag => this.currentRoute = currentTag);
  }

  ngAfterViewInit(): void {
    this.changeActiveNavigationItem(this.location);
  }

  initSidebarScroll(): void {
    const $sidebarContent = this.$el.find('.js-sidebar-content');
    if (this.$el.find('.slimScrollDiv').length !== 0) {
      $sidebarContent.slimscroll({
        destroy: true
      });
    }
    $sidebarContent.slimscroll({
      height: window.innerHeight,
      size: '4px',
      color: '#e5e7f1',
    });
  }

  changeActiveNavigationItem(location): void {
    const $newActiveLink = this.$el.find('a[href="#' + location.path().split('?')[0] + '"]');

    // collapse .collapse only if new and old active links belong to different .collapse
    if (!$newActiveLink.is('.active > .collapse > li > a')) {
      this.$el.find('.active .active').closest('.collapse').collapse('hide');
    }
    this.$el.find('.sidebar-nav .active').removeClass('active');

    $newActiveLink.closest('li').addClass('active')
      .parents('li').addClass('active');

    // uncollapse parent
    $newActiveLink.closest('.collapse').addClass('in').css('height', '')
      .siblings('a[data-toggle=collapse]').removeClass('collapsed');
  }

  toggleSidebarOverflow($event) {
    jQuery('#sidebar').css('z-index', $event ? '2' : '0');
    jQuery('.js-sidebar-content, .slimScrollDiv').css('overflow', $event ? 'visible' : 'hidden');
  }

  openSideNavEmitter() {
    this.openSideNav.emit();
  }

  ngOnDestroy() {
    if (this.triggerRefreshSub) this.triggerRefreshSub.unsubscribe();
    if (this.jobChangesSubs) this.jobChangesSubs.unsubscribe()
  }

}
