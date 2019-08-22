import { Component, OnInit } from '@angular/core';
import { } from '@angular/core';



@Component({
  selector: 'app-dashboard-campagne',
  templateUrl: './dashboard-campagne.component.html',
  styleUrls: ['./dashboard-campagne.component.css']
})
export class DashboadCampagneComponent implements OnInit {
  public campaigns: any;
  public booleanViewContentDefault: boolean;


  constructor() { }

  ngOnInit() {

    // console.log('callback output', this.callbackContentViewDefault);

  }
  getCampaignsFromChild(campaigns) {
    // console.log('my campaigns from dashboard-campagne', campaigns);
    this.campaigns = campaigns;
  }

  public DefaultViewContent(event) {

    this.booleanViewContentDefault = event;

    console.log(this.booleanViewContentDefault);

  }
}
