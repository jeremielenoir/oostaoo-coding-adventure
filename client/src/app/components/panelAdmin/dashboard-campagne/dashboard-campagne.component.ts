import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-campagne',
  templateUrl: './dashboard-campagne.component.html',
  styleUrls: ['./dashboard-campagne.component.scss']
})
export class DashboadCampagneComponent{
  public campaigns: any;
  public booleanViewContentDefault = false;
  public IsactiveNoCountryside: boolean;
  public IsBooaleanDashboardMaxSize: any;

  constructor() { }

  display(value) {
    this.booleanViewContentDefault = value;
  }

  getCampaignsFromChild(campaigns) {
    this.campaigns = [...campaigns];
  }

  IsBoaleanSmallSidebarOutputClbk(event) {
    this.IsBooaleanDashboardMaxSize = event;
  }

  public DefaultViewContent(event) {
    this.booleanViewContentDefault = event;
  }
}
