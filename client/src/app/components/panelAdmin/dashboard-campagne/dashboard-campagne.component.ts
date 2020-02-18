import { Component, OnInit, Input } from '@angular/core';



@Component({
  selector: 'app-dashboard-campagne',
  templateUrl: './dashboard-campagne.component.html',
  styleUrls: ['./dashboard-campagne.component.scss']
})
export class DashboadCampagneComponent implements OnInit {
  public campaigns: any;
  public booleanViewContentDefault = false;
  public IsactiveNoCountryside: boolean;
  public IsBooaleanDashboardMaxSize: any;

  constructor() { }

  ngOnInit() {
  }

  display(value) {

    this.booleanViewContentDefault = value;

  }

  getCampaignsFromChild(campaigns) {
    console.log('my campaigns from dashboard-campagne', campaigns);
    this.campaigns = campaigns;
    
    //console.log(this.notifications);
  }

  IsBoaleanSmallSidibarOutputClbk(event) {

    console.log('resultat', event)
    this.IsBooaleanDashboardMaxSize = event;

  }


  public DefaultViewContent(event) {

    this.booleanViewContentDefault = event;

    console.log(this.booleanViewContentDefault);

  }
}