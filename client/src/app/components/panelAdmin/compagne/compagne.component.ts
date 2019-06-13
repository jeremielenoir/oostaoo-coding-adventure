import { Component, OnInit } from '@angular/core';
import { ApiClientService, API_URI_CAMPAIGNS } from '../../../api-client/api-client.service';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent implements OnInit {

  public campaigns: any[];
  public search_header: string;

  constructor(public apiClientService: ApiClientService) {
    this.search_header = null;

  }

  ngOnInit() {
    this.apiClientService
      .get(API_URI_CAMPAIGNS)
      .subscribe((datas) => {
        this.campaigns = datas;
        console.log('CAMPAIGNS', this.campaigns);
      });
  }
  recupID(idCampaign) {
    console.log(idCampaign)
  }

}
