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
  selector: 'app-campagne',
  templateUrl: './campagne.component.html',
  styleUrls: ['./campagne.component.scss'],
})



export class CampagneComponent implements OnInit {
  public campaigns = [];
  public campaignsFiltered = [];
  public searchHeader: string;
  @Output() campaignsChild = new EventEmitter<any>();
  @Output() emitIsactiveNoCountryside = new EventEmitter();
  public IsactiveNoCountryside = false;
  public searchText = '';
  public result: any;
  public test: any;




  constructor(
    public apiClientService: ApiClientService,
    public dialog: MatDialog,
    public decryptTokenService: DecryptTokenService,
    public authenticationService: AuthenticationService
  ) {
    this.searchHeader = null;
  }

  ngOnInit() {

    this.authenticationService
      .getCampaignsUser(this.decryptTokenService.userId)
      .then(resultat => {
        // console.log('resultat = ', resultat);
        this.campaigns = resultat;

        for (const campaign of this.campaigns) {
          if (campaign.archive === false) {
            this.campaignsFiltered.push(campaign);
            this.test = this.campaignsFiltered;
            console.log('camp filter', this.campaignsFiltered);
          }
          console.log('camp filter', this.campaignsFiltered);
        }


        this.IsactiveNoCountryside = true;
        // setTimeout(() => {
        //   this.IsactiveNoCountryside = true;
        // }, 2000)
        this.emitIsactiveNoCountryside.emit(this.IsactiveNoCountryside);
        // console.log('CONNECTED GET CAMPAING: ', resultat);
        this.giveCampaigns();
      });
  }

  customComparator(itemA ) {
    return itemA = true ;
}

  includeArchivedCampaigns(checked: any) {
    if (checked) {
      this.test = this.campaignsFiltered;
    }
    if (!checked) {
      this.test = this.campaigns;
    }
  }

  openDialog(idCampaign) {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '80vh'
    });
  }

  duplicatecampaign(idCampaign) {
    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;
    return this.apiClientService
      .get(apiURL)
      .toPromise()
      .then(res => { // Success
        this.result = res;

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
    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;
    if (pinCampaign === false) {
      return this.apiClientService
        .put(apiURL, {
          pin: true
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
          pin: false
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

    const apiURL = API_URI_CAMPAIGNS + '/' + idCampaign;

    if (archiveCampaign === false) {
      return this.apiClientService
        .put(apiURL, {
          archive: true
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
          archive: false
        }).subscribe(
          (res) => {
            alert('Campagne désarchiver');
            window.location.reload();

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

  giveCampaigns() {
    if (this.campaigns) {
      this.campaignsChild.emit(this.campaigns);
    }
  }
}