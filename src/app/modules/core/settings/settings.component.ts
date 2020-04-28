import {
  Component,
  ElementRef, Renderer2,
  NgZone,
  ViewChild, HostBinding, OnInit, HostListener, OnDestroy
} from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { LocalStorageService } from 'src/app/services/local-storage.service';

declare let jQuery: any;
declare let Hammer: any;
declare let Raphael: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @HostBinding('class.nav-static') navStatic: boolean;
  @HostBinding('class.app') appClass: boolean = true;
  config: any;
  configFn: any;
  $sidebar: any;
  el: ElementRef;
  router: Router;
  @ViewChild('spinnerElement') spinnerElement: ElementRef;
  @ViewChild('routerComponent') routerComponent: ElementRef;
  apiInProgress: boolean = true;

  constructor(config: AppConfig,
    el: ElementRef,
    router: Router,
    private renderer: Renderer2,
    private ngZone: NgZone,
    public localStorageService: LocalStorageService,
  ) {

    Raphael.prototype.safari = function (): any { return; };
    this.el = el;
    this.config = config.getConfig();
    this.configFn = config;
    this.router = router;
  }

  toggleSidebarListener(state): void {
    const toggleNavigation = state === 'static'
      ? this.toggleNavigationState
      : this.toggleNavigationCollapseState;
    toggleNavigation.apply(this);
    this.localStorageService.setNavStatic(this.navStatic);
  }

  toggleNavigationState(): void {
    this.navStatic = !this.navStatic;
    if (!this.navStatic) {
      this.collapseNavigation();
    } else {
      this.expandNavigation();
    }
  }

  expandNavigation(): void {
    jQuery('app-settings').removeClass('nav-collapsed');
    this.$sidebar.find('.active .active').closest('.collapse').collapse('show')
      .siblings('[data-toggle=collapse]').removeClass('collapsed');
  }

  collapseNavigation(): void {
    jQuery('app-settings').addClass('nav-collapsed');
    this.$sidebar.find('.collapse.in').collapse('hide')
      .siblings('[data-toggle=collapse]').addClass('collapsed');

    !this.isNavigationStatic() && this.$sidebar.find('li.open.active').find('.collapse.show').removeClass('show')
  }

  isNavigationStatic(): boolean {
    return this.navStatic === true;
  }

  toggleNavigationCollapseState(): void {
    if (jQuery('app-settings').is('.nav-collapsed')) {
      this.expandNavigation();
    } else {
      this.collapseNavigation();
    }
  }

  _sidebarMouseEnter(): void {
    if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
      this.expandNavigation();
    }
  }

  _sidebarMouseLeave(): void {
    if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
      this.collapseNavigation();
    }
  }

  enableSwipeCollapsing(): void {
    const swipe = new Hammer(document.getElementById('content-wrap'));
    const d = this;

    swipe.on('swipeleft', () => {
      setTimeout(() => {
        if (d.configFn.isScreen('md')) { return; }

        if (!jQuery('app-settings').is('.nav-collapsed')) {
          d.collapseNavigation();
        }
      });
    });

    swipe.on('swiperight', () => {
      if (d.configFn.isScreen('md')) { return; }

      if (jQuery('app-settings').is('.nav-collapsed')) {
        d.expandNavigation();
      }
    });
  }

  ngOnInit(): void {

    if (this.localStorageService.getNavStatic() === 'true') {
      this.navStatic = true;
    }

    const $el = jQuery(this.el.nativeElement);
    this.$sidebar = $el.find('app-settings-sidenav');

    $el.find('a[href="#"]').on('click', (e) => {
      e.preventDefault();
    });


    let timer;
    this.$sidebar.on('mouseenter', () => {
      timer = setTimeout(() => {
        this._sidebarMouseEnter();
      }, 100)
    });

    this.$sidebar.on('mouseleave', () => {
      timer && clearTimeout(timer);
      this._sidebarMouseLeave();
    });

    this.collapseNavigation();

    this.router.events.subscribe((event) => {
      this._navigationInterceptor(event);
      window.scrollTo(0, 0);
    });

    if ('ontouchstart' in window) {
      this.enableSwipeCollapsing();
    }

    this.$sidebar.find('.collapse').on('show.bs.collapse', function (e): void {
      // execute only if we're actually the .collapse element initiated event
      // return for bubbled events
      if (e.target !== e.currentTarget) { return; }

      const $triggerLink = jQuery(this).prev('[data-toggle=collapse]');
      jQuery($triggerLink.data('parent'))
        .find('.collapse.show').not(jQuery(this)).collapse('hide');
    })
      /* adding additional classes to navigation link li-parent
       for several purposes. see navigation styles */
      .on('show.bs.collapse', function (e): void {
        // execute only if we're actually the .collapse element initiated event
        // return for bubbled events
        if (e.target !== e.currentTarget) { return; }

        jQuery(this).closest('li').addClass('open');
      }).on('hide.bs.collapse', function (e): void {
        // execute only if we're actually the .collapse element initiated event
        // return for bubbled events
        if (e.target !== e.currentTarget) { return; }

        jQuery(this).closest('li').removeClass('open');
      });
  }

  private _navigationInterceptor(event: RouterEvent): void {

    if (event instanceof NavigationStart) {
      // We wanna run this function outside of Angular's zone to
      // bypass change detection
      this.ngZone.runOutsideAngular(() => {

        // For simplicity we are going to turn opacity on / off
        // you could add/remove a class for more advanced styling
        // and enter/leave animation of the spinner
        this.renderer.setStyle(
          this.spinnerElement.nativeElement,
          'opacity',
          '1'
        );
        this.renderer.setStyle(
          this.routerComponent.nativeElement,
          'opacity',
          '0'
        );
      });
    }
    if (event instanceof NavigationEnd) {
      this._hideSpinner();
    }

    // Set loading state to false in both of the below events to
    // hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this._hideSpinner();
    }
    if (event instanceof NavigationError) {
      this._hideSpinner();
    }
  }

  private _hideSpinner(): void {
    // We wanna run this function outside of Angular's zone to
    // bypass change detection,
    this.ngZone.runOutsideAngular(() => {

      // For simplicity we are going to turn opacity on / off
      // you could add/remove a class for more advanced styling
      // and enter/leave animation of the spinner
      this.renderer.setStyle(
        this.spinnerElement.nativeElement,
        'opacity',
        '0'
      );
      this.renderer.setStyle(
        this.routerComponent.nativeElement,
        'opacity',
        '1'
      );
    });
  }

  loading(event) {
    this.apiInProgress = event;
  }

}
