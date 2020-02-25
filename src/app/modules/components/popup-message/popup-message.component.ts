import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss']
})
export class PopupMessageComponent implements OnInit, OnChanges {

  showMsg: boolean = false;
  showError: boolean = false;
  popUpMessage: any;
  @Input() message: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.popUpMessage = this.message;
    if (this.popUpMessage && !this.popUpMessage[2]) {
      this.popUpMessage[2] = 2000;
    }
    if (this.popUpMessage !== null && this.popUpMessage !== undefined) {
      this.setPopUpTime();
    }
  }

  setPopUpTime() {
    this.showMsg = !this.popUpMessage[1];
    this.showError = this.popUpMessage[1];
    setTimeout(() => {
      this.showMsg = false;
      this.showError = false;
    }, this.popUpMessage[2])
  }

}
