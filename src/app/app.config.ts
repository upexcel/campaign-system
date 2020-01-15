import { Injectable } from '@angular/core';

declare let jQuery: any;

@Injectable()
export class AppConfig {
  config = {
    debug: true,
    /**
     * In-app constants
     */
    settings: {
      colors: {
        'white': '#fff',
        'black': '#000',
        'gray-light': '#999',
        'gray-lighter': '#eee',
        'gray': '#666',
        'gray-dark': '#343434',
        'gray-darker': '#222',
        'gray-semi-light': '#777',
        'gray-semi-lighter': '#ddd',
        'brand-primary': '#5d8fc2',
        'brand-success': '#64bd63',
        'brand-warning': '#f0b518',
        'brand-danger': '#dd5826',
        'brand-info': '#5dc4bf'
      },
      screens: {
        'xs-max': 543,
        'sm-min': 544,
        'sm-max': 767,
        'md-min': 768,
        'md-max': 991,
        'lg-min': 992,
        'lg-max': 1199,
        'xl-min': 1200
      },
      navCollapseTimeout: 2500
    },

    /**
     * Application state. May be changed when using.
     * Synced to Local Storage
     */
    state: {
      /**
       * whether navigation is static (prevent automatic collapsing)
       */
      'nav-static': false
    }
  };

  _resizeCallbacks = [];
  _screenSizeCallbacks = {
    xs: { enter: [], exit: [] },
    sm: { enter: [], exit: [] },
    md: { enter: [], exit: [] },
    lg: { enter: [], exit: [] },
    xl: { enter: [], exit: [] }
  };

  isScreen(size): boolean {
    const screenPx = window.innerWidth;
    return (screenPx >= this.config.settings.screens[size + '-min'] || size === 'xs')
      && (screenPx <= this.config.settings.screens[size + '-max'] || size === 'xl');
  }

  getScreenSize(): string {
    const screenPx = window.innerWidth;
    if (screenPx <= this.config.settings.screens['xs-max']) { return 'xs'; }
    if ((screenPx >= this.config.settings.screens['sm-min'])
      && (screenPx <= this.config.settings.screens['sm-max'])) { return 'sm'; }
    if ((screenPx >= this.config.settings.screens['md-min'])
      && (screenPx <= this.config.settings.screens['md-max'])) { return 'md'; }
    if ((screenPx >= this.config.settings.screens['lg-min'])
      && (screenPx <= this.config.settings.screens['lg-max'])) { return 'lg'; }
    if (screenPx >= this.config.settings.screens['xl-min']) { return 'xl'; }
  }

  onScreenSize(size, fn, /* Boolean= */ onEnter): void {
    onEnter = typeof onEnter !== 'undefined' ? onEnter : true;
    if (typeof size === 'object') {
      for (let i = 0; i < size.length; i++) {
        this._screenSizeCallbacks[size[i]][onEnter ? 'enter' : 'exit'].push(fn);
      }
    } else {
      this._screenSizeCallbacks[size][onEnter ? 'enter' : 'exit'].push(fn);
    }

  }

  changeColor(color, ratio, darker): string {
    const pad = function (num, totalChars): number {
      const padVal = '0';
      num = num + '';
      while (num.length < totalChars) {
        num = padVal + num;
      }
      return num;
    };
    // Trim trailing/leading whitespace
    color = color.replace(/^\s*|\s*$/, '');

    // Expand three-digit hex
    color = color.replace(
      /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
      '#$1$1$2$2$3$3'
    );

    // Calculate ratio
    const difference = Math.round(ratio * 256) * (darker ? -1 : 1),
      // Determine if input is RGB(A)
      rgb = color.match(new RegExp('^rgba?\\(\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '\\s*,\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '\\s*,\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '(?:\\s*,\\s*' +
        '(0|1|0?\\.\\d+))?' +
        '\\s*\\)$'
        , 'i')),
      alpha = !!rgb && rgb[4] !== null ? rgb[4] : null,

      // Convert hex to decimal
      decimal = !!rgb ? [rgb[1], rgb[2], rgb[3]] : color.replace(
        /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
        function (): string {
          return parseInt(arguments[1], 16) + ',' +
            parseInt(arguments[2], 16) + ',' +
            parseInt(arguments[3], 16);
        }
      ).split(/,/);

    // Return RGB(A)
    return !!rgb ?
      'rgb' + (alpha !== null ? 'a' : '') + '(' +
      Math[darker ? 'max' : 'min'](
        parseInt(decimal[0], 10) + difference, darker ? 0 : 255
      ) + ', ' +
      Math[darker ? 'max' : 'min'](
        parseInt(decimal[1], 10) + difference, darker ? 0 : 255
      ) + ', ' +
      Math[darker ? 'max' : 'min'](
        parseInt(decimal[2], 10) + difference, darker ? 0 : 255
      ) +
      (alpha !== null ? ', ' + alpha : '') +
      ')' :
      // Return hex
      [
        '#',
        pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[0], 10) + difference, darker ? 0 : 255
        ).toString(16), 2),
        pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[1], 10) + difference, darker ? 0 : 255
        ).toString(16), 2),
        pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[2], 10) + difference, darker ? 0 : 255
        ).toString(16), 2)
      ].join('');
  }

  lightenColor(color, ratio): any {
    return this.changeColor(color, ratio, false);
  }

  darkenColor(color, ratio): any {
    return this.changeColor(color, ratio, true);
  }

  max(array): any {
    return Math.max.apply(null, array);
  }

  min(array): any {
    return Math.min.apply(null, array);
  }

  _initResizeEvent(): void {
    let resizeTimeout;

    jQuery(window).on('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        jQuery(window).trigger('sn:resize');
      }, 100);
    });
  }

  _initOnScreenSizeCallbacks(): void {
    let resizeTimeout,
      prevSize = this.getScreenSize();

    jQuery(window).resize(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const size = this.getScreenSize();
        if (size !== prevSize) { // run only if something changed
          // run exit callbacks first
          this._screenSizeCallbacks[prevSize].exit.forEach((fn) => {
            fn(size, prevSize);
          });
          // run enter callbacks then
          this._screenSizeCallbacks[size].enter.forEach((fn) => {
            fn(size, prevSize);
          });
        }
        prevSize = size;
      }, 100);
    });
  }

  constructor() {
    this._initResizeEvent();
    this._initOnScreenSizeCallbacks();
  }

  getConfig(): Object {
    return this.config;
  }
}



/************** App Old Config *****************/


export const config = {
  'mobileNoPrefix': '+91', // mobile number prefix for INDIA
  emailLimit: 20,  //emails fetched once by default
  companyProfileId: 1  //company id default
}

//data for tooltips for call status
export const callToolTips = {
  'missed': 'Didn\'t Pickup',
  'error': 'Call Not Connected',
  'success': 'Talked To Candidate on ',
  'again': 'Call Again Later',
  'scheduledSuccess': 'Talked on Scheduled Time'
}

//link for test
//bitly is created from manisharies.iitg@gmail.com google login
export const bitlySetup = {
  'apiKey': 'R_8fb82b427799aa1a5082a0baa4c1ddca',
  'login': 'o_6so222ci9c',
  'host': 'http://api.bit.ly/v3/shorten'
}

export const NOJOBPROFILE = "No Active Job Profile"; //used when there is no active job profile

export const CHARTCOLORS = ['#9964E3', '#F55D5D', '#FFC247', '#547FFF',
  '#FFC247', '#FFC247', '#3ABF94', '#F55D5D']; // used for colors in charts in statistics component

export const JOBAPPLICATIONCHARTCOLORS = [
  '#9964E3', '#F55D5D', '#FFC247', '#547FFF', '#3ABF94', '#716FB3', '#5DA3FA',
  '#BAB8FF', '#8DCC7E', '#6FAFB3', '#CCC17E', '#568DB3', '#FF605E', , '#B8FBFF',
  '#95D5FF', '#CCCB62', '#C98A83', '#B0807B', '#2F68AD', , '#FDBDE6'
]

export const ALLTAG = 'All'; //used in candidates component, used just to match the job profile tag with the string 'All'

export const DEFAULT = 'Default';

//temporary json test scores for inbox widgets
export const TESTSCORESJSON = [
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
  { date: '06/09/19', candidateName: 'Varun Gupta', candidateEmail: 'varungupta@gmail.com', score: '3/25' },
];

//temporary json interview schedule for inbox widgets
export const INTERVIEWSSCHEDULEJSON = [
  { label: 'Today', value: 12 },
  { label: 'Today', value: 30 },
  { label: 'Today', value: 20 },
];

//used in candidates component for temporary assigning job role as admin 
export const ADMIN = 'Admin';
export const HR = 'HR';
export const INTERVIEWEE = 'Interviewee'

export const REMOVEDTAGS = ['automation', 'NoShow', 'Genuine Applicant', 'No Response', 'Auto Shortlist', 'var', 'new']; //automation tags that are to be removed

export const REMOVEDASSIGNTAGS = ['CV Rejected', 'Shortlist', 'Hold', 'Reject', 'Schedule', 'Selected']; // removed actions from table view

export const AUTOMATION = false; //automation disabled 

export const ROLES = [ADMIN, HR, INTERVIEWEE];

export const DomainsDetails = [
  { name: 'email.com', src: '/assets/email.png' },
  {
    name: 'gmail.com', imap: 'imap.gmail.com', smtp: 'smtp.gmail.com', imapPort: 993, smtpPort: 465, imapType: 'tls', smtpType: 'tls', logo: 'gmail.png', src: '/assets/gmail.png', heading: 'Gmail Settings', link: " https://myaccount.google.com/lesssecureapps",
    text: "**NOTE : The recommended way is for your to setup <a target='_blank' href='https://support.google.com/accounts/answer/185839?co=GENIE.Platform%3DDesktop&hl=en'>2FA</a> authentication on your gmail account and <a target='_blank' href='https://support.google.com/accounts/answer/185833?hl=en'> enable app </a> specific passwords. This way you don't have to share with us your actual gmail password and your account is fully secure! <br> But if you don't want to enabled 2FA on your gmail account, make sure you allow Allow less secure apps button on your Gmail account"
  },
  { name: 'yahoo.com', imap: 'imap.mail.yahoo.com', smtp: 'smtp.mail.yahoo.com', imapPort: 993, smtpPort: 587, imapType: 'ssl', smtpType: 'ssl', logo: 'yahoo.png', src: '/assets/yahoo.png', heading: "Yahoo Settings", link: "https://help.yahoo.com/kb/SLN4075.html?guccounter=1", text: "**NOTE : IMAP settings are required to fetch email from your mailbox. You can get the correct settings here ", passwordMessage: "**Note: This should be app password!  <a target='_blank' href='https://login.yahoo.com/account/security?scrumb=gzQzu3%2FQTgY'>Genrate Password</a>" },
  { name: 'outlook.com', imap: 'outlook.office365.com', smtp: 'smtp.office365.com', imapPort: 993, smtpPort: 587, imapType: 'tls', smtpType: 'starttls', logo: 'outlook.png', src: '/assets/outlook.png', heading: "outlook Settings", link: "https://support.office.com/en-us/article/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040", text: "**NOTE : IMAP settings are required to fetch email from your mailbox. You can get the correct settings here " },
  { name: 'zoho.com', imap: 'imappro.zoho.com', smtp: 'smtp.zoho.com', imapPort: 993, smtpPort: 465, imapType: 'ssl', smtpType: 'ssl', logo: 'zoho.png', src: '/assets/zoho.png', heading: "Zoho Settings", link: "https://www.zoho.com/mail/help/iphone-ipad-imap-access.html#alink3", text: "**NOTE :IMAP settings are required to fetch email from your mailbox. You can get the correct settings here " },
];

export const InterviewSystemBaseUrl = "http://176.9.137.77:4500";

export const REJECTREASONS = ['CV Not Suitable', 'Candidate Not Suitable', 'Experience Mismatch', 'CTC Mismatch', 'Location Mismatch', 'Age Mismatch', 'Profile Mismatch', 'Others'];

export const HOLD = 'Hold';

export const REJECT = 'Reject';

export const CVREJECTED = 'CV Rejected';

export const INTERVIEW = 'Interview';

export const FIRSTROUND = 'First Round';

export const SECONDROUND = 'Second Round';

export const THIRDROUND = 'Third Round';

export const SCHEDULE = 'Schedule';

export const SELECTED = 'Selected';

export const SHORTLIST = 'Shortlist';

export const NEW = 'New';

export const DOCOPENERURL = 'https://docs.google.com/gview?url=';

export const IMPORTCONTENT = {
  title: 'Import Old Candidates',
  message: `Selecting this option will read through all candidate we have in All Mail/Attachments. 
            In case due to any reason if candidates got missed they will be added to this job profile again! 
            You can also select a date optionally if you want to add candidates only after a specific date. Continue?`,
  hint: `(This is optional, if no date selected our system will read through all previous candidates.)`
}

export const ARCHIVECONTENT = {
  title: 'Archive',
  message: `Archive will clean up the mails from this section.
            Since most of the email in this section are not needed, you can select a date below before which it will remove all emails from this section.
            P.S. This operation cannot be undone.`,
  hint: `(All emails before this date will be removed)`
}

export const REMOVECONTENT = {
  title: 'Remove Old Candidates',
  message: `You can remove old candidates from the current job profile. 
            This will just move the candidate data from the current job profile to the Inbox section. 
            You can restore back the candidate's again if needed from the Read Candidate's Option. Continue?`,
  hint: `(All emails before this date will be moved to inbox)`
}

export const DASHBOARD_ACTIVE_TRACKING_CHART_COLORS = ['#93d9d9', '#ffe199', '#f1f0ff', '#fea1b4', '#87c7f3'];

export const SM_MAXWIDTH = 768;

export const SPAM = 'Spam';

export const DEFAULT_IMAGE = 'defaultAvatar.png';

export const CurrentView = [
  { name: "TABLE VIEW", icon: "la la-bars la-lg table-icon", selector: "table", class: "tableView" },
  { name: "KANBAN VIEW", icon: "glyphicon glyphicon-th fontSize", selector: "kanban", class: "kanban" },
  { name: "STATISTICS", icon: "glyphicon glyphicon-signal statistics-icon", selector: "statistics", class: "stat" },
  { name: "STARRED", icon: "glyphicon glyphicon-star starred-icon", selector: "starred mails", class: "star" },
  { name: "", icon: "glyphicon glyphicon-search", selector: "search", class: "search" }
];

export const RouterButtonData = [
  { title: "My Account", routeLink: null, pageTitle: "My Account", buttonName: null },
  { title: "All Users", routeLink: "/settings/add-user", pageTitle: "All User", buttonName: "Add User" },
  { title: "Logs", routeLink: null, pageTitle: "Logs Details", buttonName: null },
  { title: "Statistics", routeLink: null, pageTitle: "Dashboard", buttonName: null },
  { title: "Jobs", routeLink: "/settings/create-job", pageTitle: "Jobs", buttonName: "Add Job Opening" },
  { title: "Manage Sources", routeLink: "/settings/add-imap", pageTitle: "Manage Sources", buttonName: "Add Source" },
  { title: "Manage Smtp", routeLink: "/settings/add-smtp", pageTitle: "Manage Smtp", buttonName: "Add Smtp" },
  { title: "Manage Referrals", routeLink: "/settings/add-referrals", pageTitle: "Manage Referrals", buttonName: "Add Referrals" },
  { title: "Manage Spams", routeLink: null, pageTitle: "Spam List", buttonName: null },
]

