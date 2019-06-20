import { Component, OnInit } from '@angular/core';
import { ApiClientService, API_URI_CAMPAIGNS } from '../../../api-client/api-client.service';
import { InviteCandidat } from '../edit-campagne/candidats/invite-candidat.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent implements OnInit {

  public campaigns: any[];
  public searchHeader: string;

  constructor(public apiClientService: ApiClientService,
              public dialog: MatDialog) {
    this.searchHeader = null;
  }

  ngOnInit() {
    this.apiClientService
      .get(API_URI_CAMPAIGNS)
      .subscribe((datas) => {
        this.campaigns = datas;
        console.log('CAMPAIGNS', this.campaigns);
      });
  }
  recupID(idCampaign: string) {
    console.log(idCampaign);
  }

  openDialog(idCampaign) {
    this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '80vh'
    });
  }

}
