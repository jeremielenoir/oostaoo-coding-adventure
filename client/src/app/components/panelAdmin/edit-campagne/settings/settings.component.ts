import { Component, OnInit } from '@angular/core';
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
      // console.log('data', this.globalId);
    });
  }

  public globalId: string;
  public campaigns;

  ngOnInit() {
    this.getCampaign();
    // setTimeout(() => {

    // }, 1000);
    console.log('my campaign', this.campaigns);
  }
  getCampaign() {
    const promise = new Promise((resolve, reject) => {
      const apiURL = API_URI_CAMPAIGNS + '/' + this.globalId;
      this.apiClientService
        .get(apiURL)
        .toPromise()
        .then(res => { // Success
          console.log('my data', res);
          this.campaigns = res;
          resolve(this.campaigns);
        }, msg => reject(msg))
      return promise;
    });
    // console.log('all candidats: ', this.getCampaign);
    console.log('campaign selected: ', this.campaigns);
    // if (this.campaigns[0].candidats.length > 0) {
    //   this.ViewCandidats = 'CandidatTrue';
    // } else {
    //   this.ViewCandidats = 'CandidatFalse';
    // }
  }

}
