import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_USER
} from '../../../api-client/api-client.service';
import { InviteCandidat } from '../edit-campagne/candidats/invite-candidat.component';
import { MatDialog } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './../../home/register/service/auth.service';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.scss']
})
export class CompagneComponent implements OnInit {
  public campaigns = [];
  public searchHeader: string;
  @Output() campaignsChild = new EventEmitter<any>();
  public searchText = '';

  constructor(
    public apiClientService: ApiClientService,
    public dialog: MatDialog,
    public decryptTokenService: DecryptTokenService,
    public authenticationService: AuthenticationService
  ) {
    this.searchHeader = null;
  }

  ngOnInit() {
    console.log(this.decryptTokenService.userId);
    this.authenticationService
      .getCampaignsUser(this.decryptTokenService.userId)
      .then(resultat => {
        console.log('CONNECTED GET CAMPAING: ', resultat);
        this.campaigns = resultat;
        this.giveCampaigns();
      });
  }

  openDialog(idCampaign) {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '80vh'
    });
  }

  giveCampaigns() {
    console.log('CAMPAINGS GIVE CAMPAIGNS: ', this.campaigns);
    if (this.campaigns) {
      this.campaignsChild.emit(this.campaigns);
    }
  }
}
