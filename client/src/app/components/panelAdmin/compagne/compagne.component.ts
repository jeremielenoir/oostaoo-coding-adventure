import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() campaignsChild = new EventEmitter<any>();
  public searchText = '';

  constructor(public apiClientService: ApiClientService, public dialog: MatDialog) {
    this.searchHeader = null;
  }

  ngOnInit() {
    this.getCampaigns();
  }

  getCampaigns(): Promise<any> {
    return this.apiClientService
      .get(API_URI_CAMPAIGNS)
      .toPromise()
      .then((datas) => {
        this.campaigns = datas;
        console.log('CAMPAIGNS', this.campaigns);
        this.giveCampaigns();
      });
  }

  openDialog(idCampaign) {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '80vh'
    });
    inviteCandidatDialog.afterClosed().subscribe((data) => {
      this.getCampaigns().then(datas => {
        console.log('AFTER CLOSE ALL DATAS', datas);
      });
    });
  }

  giveCampaigns() {
    this.campaignsChild.emit(this.campaigns);
  }

}