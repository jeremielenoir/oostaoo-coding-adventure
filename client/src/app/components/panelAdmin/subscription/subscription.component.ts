import { Component, OnInit } from '@angular/core';
import { ApiClientService, API_URI_OFFER } from 'src/app/api-client/api-client.service';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmModel, ConfirmComponent } from '../../home/confirm/confirm.component';

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

  constructor(
    private apiClientService: ApiClientService,
    private accountService: AccountService,
    private dialog: MatDialog
    ) {
      this.accountService.offer
        .subscribe(
          (off) => this.ownedOffer = off,
          (err) => {}
        );
      this.accountService.subscription
        .subscribe((sub) => this.subscription = sub);
    }

  ngOnInit() {
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
  async cancelSubscription() {
    const dialogData = new ConfirmModel("Confirmation", `Souhaitez vous annuler votre abonnement ?`);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.cancelSubscription();
    }
  }

}
