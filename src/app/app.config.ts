import { Injectable } from '@angular/core';

declare let jQuery: any;

@Injectable()
export class AppConfig {
  config = {
    debug: true,
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

    state: {
      'nav-static': false
    }

  };

  isScreen(size): boolean {
    const screenPx = window.innerWidth;
    return (screenPx >= this.config.settings.screens[size + '-min'] || size === 'xs')
      && (screenPx <= this.config.settings.screens[size + '-max'] || size === 'xl');
  }

  getConfig(): Object {
    return this.config;
  }
}

export const ADMIN = 'Admin';

export const DomainsDetails = [
  { name: 'email.com', src: '/assets/email.png' },
  {
    name: 'gmail.com', imap: 'imap.gmail.com', smtp: 'smtp.gmail.com', imapPort: 993, smtpPort: 465, imapType: 'tls', smtpType: 'tls', logo: 'gmail.png', src: '/assets/gmail.png', heading: 'Gmail Settings', link: " https://myaccount.google.com/lesssecureapps",
    text: "**NOTE : The recommended way is for your to setup <a target='_blank' href='https://support.google.com/accounts/answer/185839?co=GENIE.Platform%3DDesktop&hl=en'>2FA</a> authentication on your gmail account and <a target='_blank' href='https://support.google.com/accounts/answer/185833?hl=en'> enable app </a> specific passwords. This way you don't have to share with us your actual gmail password and your account is fully secure! <br> But if you don't want to enabled 2FA on your gmail account, make sure you allow Allow less secure apps button on your Gmail account"
  },
  { name: 'yahoo.com', imap: 'imap.mail.yahoo.com', smtp: 'smtp.mail.yahoo.com', imapPort: 993, smtpPort: 587, imapType: 'ssl', smtpType: 'ssl', logo: 'yahoo.png', src: '/assets/yahoo.png', heading: "Yahoo Settings", link: "https://help.yahoo.com/kb/SLN4075.html?guccounter=1", text: "**NOTE : IMAP settings are required to fetch email from your mailbox. You can get the correct settings here ", passwordMessage: "**Note: This should be app password!  <a target='_blank' href='https://login.yahoo.com/account/security?scrumb=gzQzu3%2FQTgY'>Genrate Password</a>" },
  { name: 'outlook.com', imap: 'outlook.office365.com', smtp: 'smtp.office365.com', imapPort: 993, smtpPort: 587, imapType: 'tls', smtpType: 'starttls', logo: 'outlook.png', src: '/assets/outlook.png', heading: "outlook Settings", link: "https://support.office.com/en-us/article/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040", text: "**NOTE : IMAP settings are required to fetch email from your mailbox. You can get the correct settings here " },
  { name: 'zoho.com', imap: 'imappro.zoho.com', smtp: 'smtp.zoho.com', imapPort: 993, smtpPort: 465, imapType: 'ssl', smtpType: 'ssl', logo: 'zoho.png', src: '/assets/zoho.png', heading: "Zoho Settings", link: "https://www.zoho.com/mail/help/iphone-ipad-imap-access.html#alink3", text: "**NOTE :IMAP settings are required to fetch email from your mailbox. You can get the correct settings here " },
  { name: 'icloud.com', imap: 'imap.mail.me.com', smtp: 'smtp.mail.me.com', imapPort: 993, smtpPort: 587, imapType: 'ssl', smtpType: 'ssl', logo: 'icloud.png', src: '/assets/icloud.png', heading: "icloud Settings", link: "https://support.apple.com/en-in/HT204397", text: "**NOTE :IMAP settings are required to fetch email from your mailbox. You can get the correct settings here " }
];

export const RouterButtonData = [
  { title: "Manage Smtp", routeLink: "/settings/add-smtp", pageTitle: "Manage Smtp", buttonName: "Add Smtp" },
]
