import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { API_URI_CAMPAIGNS, ApiClientService } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  constructor( private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.parent.params.subscribe(params => {
      this.globalId = params.id;
    });
  }
  public globalId: any;

  public campaigns;


  ngOnInit() {
    this.getCampaign();
    setTimeout(() => {
      console.log('campaign selected in /general = ', this.campaigns);
     }, 1000);
  }


  getCampaign() {
    this.apiClientService
    .get(API_URI_CAMPAIGNS + '/' + this.globalId)
    .subscribe(datas => {
      this.campaigns = datas;
    });

  }

}
