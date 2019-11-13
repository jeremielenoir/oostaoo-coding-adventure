import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_USER,
  API_URI_CAMPAIGN
} from '../../../api-client/api-client.service';
import { InviteCandidat } from '../edit-campagne/candidats/invite-candidat.component';
import { MatDialog } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './../../home/register/service/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.scss']
})
export class CompagneComponent implements OnInit {
  public campaigns = [];
  public searchHeader: string;
  @Output() campaignsChild = new EventEmitter<any>();
  @Output() emitIsactiveNoCountryside = new EventEmitter()
  public IsactiveNoCountryside = false;
  public searchText = '';
  public result: any;

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
        this.campaigns = resultat;
        this.IsactiveNoCountryside = true;
        console.log('cest good')
        // setTimeout(() => {
        //   this.IsactiveNoCountryside = true;
        // }, 2000)
        this.emitIsactiveNoCountryside.emit(this.IsactiveNoCountryside);
        // console.log('CONNECTED GET CAMPAING: ', resultat);
        this.giveCampaigns();
      });
  }

  openDialog(idCampaign) {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '80vh'
    });
  }

  duplicatecampaign(idCampaign) {
    console.log('duplicate');
    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;
    console.log(apiURL);
    return this.apiClientService
    .get(apiURL)
    .toPromise()
    .then(res => { // Success
      console.log(res);
      this.result = res;
      console.log('result =', this.result);

      this.apiClientService
    .post(API_URI_CAMPAIGNS, {
      Name: this.result.Name + ' copie',
      archive: this.result.archive,
      copy_paste: this.result.copy_paste,
      langs: this.result.langs,
      level: this.result.level,
      pin: this.result.pin,
      profile: this.result.profile,
      sent_report: this.result.sent_report,
      technologies: this.result.technologies,
      user: this.result.user,
    }).subscribe((resultat) => {
      alert('Campagne dupliqué');
      window.location.reload();
     });

    });
  }


  pincampaign(idCampaign, pinCampaign) {
    console.log('pin');

    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;

    if (pinCampaign === false) {
    return this.apiClientService
      .put(apiURL, {
        pin : true
      }).subscribe(
        (res) => {
          alert('Campagne épingler');
          window.location.reload();
         // console.log('res', res);
        },
        err => console.log(err)
      );
  } else {
    return this.apiClientService
      .put(apiURL, {
        pin : false
      }).subscribe(
        (res) => {
          alert('Campagne désépingler');
          window.location.reload();
         // console.log('res', res);
        },
        err => console.log(err)
      );
   }
}

  archivecampaign(idCampaign, archiveCampaign) {
    console.log('archive');

    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;

    if (archiveCampaign === false) {
    return this.apiClientService
      .put(apiURL, {
        archive : true
      }).subscribe(
        (res) => {
          alert('Campagne archiver');
          window.location.reload();
         // console.log('res', res);
        },
        err => console.log(err)
      );
  } else {
    return this.apiClientService
      .put(apiURL, {
        archive : false
      }).subscribe(
        (res) => {
          alert('Campagne désarchiver');
          window.location.reload();
         // console.log('res', res);
        },
        err => console.log(err)
      );
   }
  }

  deletecampaign(idCampaign) {

    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;

    return this.apiClientService
      .delete(apiURL)
      .toPromise()
      .then(res => { // Success
        alert('Campagne supprimé');
        window.location.reload();
      });
  }

  showIdCampaign(idCampaign) {
    console.log(idCampaign);
    }

  giveCampaigns() {
    console.log('CAMPAINGS GIVE CAMPAIGNS: ', this.campaigns);
    if (this.campaigns) {
      this.campaignsChild.emit(this.campaigns);
    }
  }
}
