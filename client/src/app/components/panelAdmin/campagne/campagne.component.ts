import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_USER,
  API_URI_CAMPAIGN
} from '../../../api-client/api-client.service';
import { InviteCandidat } from '../edit-campagne/candidats/invite-candidat.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './../../home/register/service/auth.service';
import { RouterLink } from '@angular/router';

export interface DialogData {
  confirmed: boolean;

}

@Component({
  selector: 'app-campagne',
  templateUrl: './campagne.component.html',
  styleUrls: ['./campagne.component.scss'],
})


export class CampagneComponent implements OnInit {
  public campaigns = [];
  public campaignsFiltered = [];
  public campaignsArchived = [];
  public searchHeader: string;
  public confirmed: boolean;
  @Output() campaignsChild = new EventEmitter<any>();
  @Output() emitIsactiveNoCountryside = new EventEmitter();
  public IsactiveNoCountryside = false;
  public searchText = '';
  public result: any;
  public myVar = false;
  public test: any;



  constructor(
    public apiClientService: ApiClientService,
    public dialog: MatDialog,
    public decryptTokenService: DecryptTokenService,
    public authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
  ) {
    this.searchHeader = null;
  }

  ngOnInit() {

    const adminId = this.decryptTokenService.adminId || this.decryptTokenService.userId;
    this.authenticationService
      .getCampaignsUser(adminId)
      .then(resultat => {
        // console.log('resultat = ', resultat);
        this.campaigns = resultat;
        for (const campaign of this.campaigns) {
          if (campaign.archive === false) {
            this.campaignsFiltered.push(campaign);
            // console.log('camp filter', this.campaignsFilter);
          } else if (campaign.archive === true) {
            this.campaignsArchived.push(campaign);
            // console.log('campaign archive', this.campaignsArchive);
          }
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

  customComparator(itemA) {
    return itemA = true;
  }


  includeArchivedCampaigns(element) {

    console.log('element', element.checked)

    if (element.checked) {
      this.myVar = !this.myVar;
    } else {
      this.myVar = !this.myVar;
    }



  }

  openDialog(idCampaign) {
    this.dialog.open(InviteCandidat, {
      data: idCampaign,
      height: '580px'
    });
  }

  openDialogDuplicate(idCampaign): void {
    const dialogRef = this.dialog.open(DialogOverviewDuplicate, {
      width: '250px',

      data: { idCampaign, confirmed: this.confirmed },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('res', result);
      console.log('idcamp', idCampaign);
      this.confirmed = result;
      console.log('result=', result);
      if (result === false) {
        return;
      } else {
        this.duplicatecampaign(idCampaign);
      }
    });
  }

  openDialogDelete(idCampaign): void {
    const dialogRef = this.dialog.open(DialogOverviewDelete, {
      width: '250px',

      data: { idCampaign, confirmed: this.confirmed },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('res', result);
      console.log('idcamp', idCampaign);
      this.confirmed = result;
      console.log('result=', result);
      if (result === false) {
        return;
      } else {
        this.deletecampaign(idCampaign);
      }
    });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000,
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
            this.campaignsFiltered = [];
            this.campaignsArchived = [];
            this.ngOnInit();
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
            this.openSnackBar('La campagne a bien été épinglée', 'Fermer');
            this.campaignsFiltered = [];
            this.campaignsArchived = [];
            this.ngOnInit();
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
            this.openSnackBar('La campagne a bien été désépinglée', 'Fermer');
            this.campaignsFiltered = [];
            this.campaignsArchived = [];
            this.ngOnInit();
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
            this.openSnackBar('La campagne a bien été archivée', 'Fermer');
            this.campaignsFiltered = [];
            this.campaignsArchived = [];
            this.ngOnInit();
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
            this.openSnackBar('La campagne a bien été désarchivée', 'Fermer');
            this.campaignsFiltered = [];
            this.campaignsArchived = [];
            this.ngOnInit();

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
        this.campaignsFiltered = [];
        this.campaignsArchived = [];
        this.ngOnInit();
      });
  }

  giveCampaigns() {
    if (this.campaigns) {
      this.campaignsChild.emit(this.campaigns);
    }
  }

}

@Component({
  selector: 'dialog-overview-duplicate',
  templateUrl: 'dialog-overview-duplicate.html',
})
export class DialogOverviewDuplicate {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDuplicate>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close(this.data.confirmed = false);
  }
  onClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data.confirmed = true);
  }

}

@Component({
  selector: 'dialog-overview-delete',
  templateUrl: 'dialog-overview-delete.html',
})
export class DialogOverviewDelete {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDelete>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close(this.data.confirmed = false);
  }
  onClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data.confirmed = true);
  }
}
