import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-dashboard-campagne',
  templateUrl: './dashboard-campagne.component.html',
  styleUrls: ['./dashboard-campagne.component.scss']
})
export class DashboadCampagneComponent implements OnInit {
  public campaigns: any;
  public booleanViewContentDefault: boolean;


  constructor() { }

  ngOnInit() {


  }
  getCampaignsFromChild(campaigns) {
    console.log('my campaigns from dashboard-campagne', campaigns);
    this.campaigns = campaigns;
  }

  public DefaultViewContent(event) {

    this.booleanViewContentDefault = event;

    console.log(this.booleanViewContentDefault);

  }
}