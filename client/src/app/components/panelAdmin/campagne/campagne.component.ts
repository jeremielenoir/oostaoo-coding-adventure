import { Component, OnInit, Output, EventEmitter, Inject, Pipe, PipeTransform, ViewEncapsulation, OnDestroy } from '@angular/core';
import {
  ApiClientService,
  API_URI_CAMPAIGNS
} from '../../../api-client/api-client.service';
import { InviteCandidat } from '../edit-campagne/candidats/invite-candidat.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './../../home/register/service/auth.service';

export interface DialogData {
  campaign: any;
  confirmed: boolean;
}

@Pipe({ name: 'campaignsArchived' })
export class CampaignsArchivedPipe implements PipeTransform {
  transform(campaigns: any[], archived?: boolean) {
    return campaigns.filter(campaign => !campaign.archive || campaign.archive == archived);
  }
}

@Component({
  selector: 'app-campagne',
  templateUrl: './campagne.component.html',
  styleUrls: ['./campagne.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CampagneComponent implements OnInit, OnDestroy {
  @Output() campaignsChild = new EventEmitter<any>();
  @Output() emitIsactiveNoCountryside = new EventEmitter();
  private subscription: Subscription;
  public campaigns = [];
  public searchHeader: string;
  public confirmed: boolean;
  public IsactiveNoCountryside = false;
  public searchText: string = '';
  public result: any;
  public showArchives = false;
  public test: any;
  public nbShowCampaigns: number;
  public isLoaded = false;

  constructor(
    public apiClientService: ApiClientService,
    public dialog: MatDialog,
    public decryptTokenService: DecryptTokenService,
    public authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private campaignsArchived: CampaignsArchivedPipe
  ) {
    this.searchHeader = null;
  }

  ngOnInit() {
    const adminId: number = this.decryptTokenService.adminId || this.decryptTokenService.userId;

    this.subscription = this.authenticationService.getCampaignsUser(adminId).subscribe((campaigns: Record<string, any>[]) => {
      this.campaigns = campaigns;
      this.IsactiveNoCountryside = true;
      this.emitIsactiveNoCountryside.emit(this.IsactiveNoCountryside);
      this.giveCampaigns();
      this.isLoaded = true;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  customComparator(itemA) {
    return itemA = true;
  }

  includeArchivedCampaigns() {
    this.showArchives = !this.showArchives;
  }

  openDialog(campaignId: number) {
    this.dialog.open(InviteCandidat, {
      data: {
        globalId: campaignId,
        tests_available: this.campaigns.length,
      },
      height: '580px',
      panelClass: ['mat-snack-bar-container']
    });
  }

  openDialogDuplicate(campaign): void {
    const dialogRef = this.dialog.open(DialogOverviewDuplicate, {
      width: '250px',
      data: { campaign: campaign, confirmed: this.confirmed },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      this.confirmed = res;
      if (res) {
        this.subscription = this.duplicateCampaign(campaign.id).subscribe((duplicateCampaign) => {
          this.campaigns.push(duplicateCampaign);
          this.campaigns = [...this.campaigns];
          this.openSnackBar("La campagne a correctement été dupliquée", "Fermer");
        });
      }
    });
  }

  openDialogDelete(campaign): void {
    const dialogRef = this.dialog.open(DialogOverviewDelete, {
      width: '250px',
      data: { campaign: campaign, confirmed: this.confirmed },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      this.confirmed = res;
      if (res) {
        this.subscription = this.deleteCampaign(campaign.id).subscribe((campaignId) => {
          let found = this.campaigns.findIndex(campaign => campaign.id === campaignId);
          console.log('FOUND', found);
          this.campaigns.splice(found, 1);
          this.campaigns = [...this.campaigns];
          this.openSnackBar("La campagne a correctement été supprimée", "Fermer");
        });
      }
    });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container']
    });
  }

  duplicateCampaign(campaignId: number): Observable<Record<string, any>> {
    return this.apiClientService.get(API_URI_CAMPAIGNS + '/' + campaignId).pipe(
      switchMap(campaign => this.apiClientService.post(API_URI_CAMPAIGNS, {
        Name: campaign.Name + ' copie',
        archive: campaign.archive,
        copy_paste: campaign.copy_paste,
        langs: campaign.langs,
        level: campaign.level,
        pin: campaign.pin,
        profile: campaign.profile,
        email_title: campaign.email_title,
        email_content: campaign.email_content,
        sent_report: campaign.sent_report,
        technologies: campaign.technologies,
        questions: campaign.questions,
        user: campaign.user,
      }))
    );
  }


  pincampaign(campaign) {
    const apiURL = API_URI_CAMPAIGNS + '/' + campaign.id;
    if (campaign.pin === false) {
      return this.apiClientService
        .put(apiURL, {
          pin: true
        }).subscribe(
          (res) => {
            campaign.pin = true;
            this.campaigns = [...this.campaigns];
            this.openSnackBar("La campagne a correctement été épinglée", "Fermer");
          },
          err => console.log(err)
        );
    } else {
      return this.apiClientService
        .put(apiURL, {
          pin: false
        }).subscribe(
          (res) => {
            campaign.pin = false;
            this.campaigns = [...this.campaigns];
            this.openSnackBar("La campagne a correctement été désépinglée", "Fermer");
          },
          err => console.log(err)
        );
    }
  }

  trackByFn(index, campaign) {
    return campaign.id;
  }

  archivecampaign(campaign) {
    const apiURL = API_URI_CAMPAIGNS + '/' + campaign.id;

    if (campaign.archive === false) {
      return this.apiClientService
        .put(apiURL, {
          archive: true
        }).subscribe(
          (res) => {
            campaign.archive = true;
            this.campaigns = [...this.campaigns];
            this.openSnackBar("La campagne a correctement été archivée", "Fermer");
          },
          err => console.log(err)
        );
    } else {
      return this.apiClientService
        .put(apiURL, {
          archive: false
        }).subscribe(
          (res) => {
            campaign.archive = false;
            this.campaigns = [...this.campaigns];
            this.openSnackBar("La campagne a correctement été désarchivée", "Fermer");
          },
          err => console.log(err)
        );
    }
  }

  deleteCampaign(campaignId: number): Observable<number> {
    return this.apiClientService.delete(API_URI_CAMPAIGNS + '/' + campaignId).pipe(
      map(() => campaignId)
    );
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
