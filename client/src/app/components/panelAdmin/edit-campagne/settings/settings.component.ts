import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ApiClientService, API_URI_CAMPAIGNS} from '../../../../api-client/api-client.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  
  constructor( private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
       //console.log('data', this.globalId);
    });
  }

  public globalId: string;
  public campaigns;

  ngOnInit() {
    this.getCampaign();
    setTimeout(() => {
      //console.log('campaign selected: ', this.campaigns);
     }, 1000);
  }
  getCampaign() {
    this.apiClientService
    .get(API_URI_CAMPAIGNS + '/' + this.globalId)
    .subscribe(datas => {
      this.campaigns = [datas];
    });
  }

}
