import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-campagne',
  templateUrl: './dashboard-campagne.component.html',
  styleUrls: ['./dashboard-campagne.component.css']
})
export class DashboadCampagneComponent implements OnInit {
  public campaigns: any;

  constructor() { }

  ngOnInit() {

  }
  getCampaignsFromChild(campaigns) {
    // console.log('my campaigns from dashboard-campagne', campaigns);
    this.campaigns = campaigns;
  }
}
