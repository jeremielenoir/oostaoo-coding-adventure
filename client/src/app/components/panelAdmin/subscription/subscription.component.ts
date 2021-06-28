import { Component, OnInit, Inject } from '@angular/core';
import { ApiClientService, API_URI_OFFER } from 'src/app/api-client/api-client.service';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ConfirmModel, ConfirmComponent } from '../../home/confirm/confirm.component';


export interface DialogData {
  offer: any;
  confirmed: boolean;
}
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  offers: any[];
  subscription: any;
  selectedOffer: any;
  ownedOffer: any;
  inProgress = false;
  confirmed: boolean;


  dataRoute: any;

  constructor(
    private apiClientService: ApiClientService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    ) {
      this.accountService.offer
        .subscribe(
          (off) => this.ownedOffer = off,
          (err) => {}
        );
      this.accountService.subscription
        .subscribe((sub) => this.subscription = sub);
    }

    goToPayment(){
      this.router.navigate(['/dashboard/facturation']);
    }
  ngOnInit() {
    this.dataRoute = [
      { routerLink : "/subscription", condition: true, classAnimParent: "hvr-icon-bounce", classAnimIcone: "hvr-icon", icon: "credit_card", name: "Abonnement" },
      { routerLink : "/dashboard/facturation", condition: true, classAnimParent: "hvr-icon-bounce", classAnimIcone: "hvr-icon", icon: "list_alt", name: "Facturation" },
      { routerLink : "/dashboard/protection-des-donnees", condition: true, classAnimParent: "hvr-icon-bounce", classAnimIcone: "hvr-icon", icon: "admin_panel_settings", name: "Confidentialité" }
    ];
    this.apiClientService.get(API_URI_OFFER)
      .subscribe(
        (off) => {
          this.offers = off.sort((a, b) => b.id - a.id).filter(o => o.enabled);
          this.offers[0].selected = true;
          this.selectedOffer = this.offers[0];
          this.accountService.loadOffer();
          this.accountService.loadSubscription();
        },
        (err) => {
console.log("error fetching offers",err)
        }
      );
  }
  /**
   *
   */
  selectOffer(offer: any) {
    this.offers.forEach(o => o.selected = o.id === offer.id);
    this.selectedOffer = offer;
  }
  /**
   *
   */
  async enableSub() {
    this.inProgress = true;
    const dialogData = new ConfirmModel('Confirmation', 'Souhaitez vous réactiver votre abonnement ?');
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "80%",
      data: dialogData
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.enableSubscription()
        .subscribe(
          (sub) => {
            this.inProgress = false;
          },
          (err) => {
            this.snackBar.open('Oops ! nous sommes pas en mesure de réactiver votre abonnement pour le moment. Veuillez réessayer plus tard.', 'Ok', {duration: 3500});
            this.inProgress = false;
          }
        );
    } else {
      this.inProgress = false;
    }
  }
  /**
   *
   */
  async cancelSubscription() {
    this.inProgress = true;
    const dialogData = new ConfirmModel('Confirmation', 'Souhaitez vous annuler votre abonnement ?');
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "80%",
      data: dialogData
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.cancelSubscription()
        .subscribe(
          (sub) => {
            this.inProgress = false;
          },
          (err) => {
            this.snackBar.open('Oops ! nous sommes pas en mesure d\'annuler votre abonnement pour le moment. Veuillez réessayer plus tard.', 'Ok', {duration: 3500});
            this.inProgress = false;
          }
        );
    } else {
      this.inProgress = false;
    }
  }
  openPayments(selectedOffer): void {
    console.log();
    const dialogRef = this.dialog.open(DialogOverviewPayments, {
      width: '30%',
      data: { offer: selectedOffer, confirmed: this.confirmed },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.confirmed = result;
      if (result === false) {
        return;
      } else {
        this.goToPayment();
      }
    });
  }
}


@Component({
  selector: 'dialog-overview-payments',
  templateUrl: './dialog-overview-payments.html',
})
export class DialogOverviewPayments {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewPayments>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close(this.data.confirmed = false);
  }
  onClick(): void {
    console.log(this.data);
    this.dialogRef.close(this.data.confirmed = true);
  }
}
