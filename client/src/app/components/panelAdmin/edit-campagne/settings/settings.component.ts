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
      console.log('data /settings = ', this.globalId);
    });
  }

  public globalId: string;

  ngOnInit() {
  }

}
