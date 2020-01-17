import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { RouterButtonData } from 'src/app/app.config';

@Component({
  selector: 'app-router-button',
  templateUrl: './router-button.component.html',
  styleUrls: ['./router-button.component.scss']
})
export class RouterButtonComponent implements OnInit, OnChanges {
  routerButtonData = RouterButtonData
  currentPageData: any;
  @Input() pageTitle: any; 
  title: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
    if(this.pageTitle){
     this.title = this.pageTitle;
     this.currentPageData = this.routerButtonData.find(data => data.title == this.title);
    }
  }
  
}
