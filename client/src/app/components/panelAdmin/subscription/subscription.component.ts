import { Component, OnInit } from '@angular/core';
import {
  ApiClientService,
  API_URI_OFFER,
} from 'src/app/api-client/api-client.service';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  ConfirmModel,
  ConfirmComponent,
} from '../../home/confirm/confirm.component';
import { Offer } from 'src/app/models/offer.model';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  offers: any[];
  subscription: any;
  selectedOffer: any;
  ownedOffer: any;
  inProgress = false;

  dataRoute: any;

  constructor(
    private apiClientService: ApiClientService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  goToPayment(offer: Offer) {
    localStorage.setItem('offerChoice', JSON.stringify(offer));
    this.router.navigate(['/payment']);
  }
  ngOnInit() {
    this.dataRoute = [
      {
        routerLink: '/subscription',
        condition: true,
        classAnimParent: 'hvr-icon-bounce',
        classAnimIcone: 'hvr-icon',
        icon: 'credit_card',
        name: 'Abonnement',
      },
      {
        routerLink: '/dashboard/facturation',
        condition: true,
        classAnimParent: 'hvr-icon-bounce',
        classAnimIcone: 'hvr-icon',
        icon: 'list_alt',
        name: 'Facturation',
      },
      {
        routerLink: '/dashboard/protection-des-donnees',
        condition: true,
        classAnimParent: 'hvr-icon-bounce',
        classAnimIcone: 'hvr-icon',
        icon: 'admin_panel_settings',
        name: 'Confidentialité',
      },
    ];
    this.apiClientService.get(API_URI_OFFER).subscribe(
      (off) => {
        this.offers = off.sort((a, b) => b.id - a.id).filter((o) => o.enabled);
        this.offers[0].selected = true;
        this.selectedOffer = this.offers[0];
        this.accountService.loadOffer();
        this.accountService.loadSubscription();
      },
      (err) => {
        console.log('error fetching offers', err);
      },
    );

    this.loadSubscriptions();
    this.loadOffers();
  }

  loadSubscriptions() {
    this.accountService.loadSubscription().subscribe(
      (sub) => (this.subscription = sub),
      (err) => {
        console.error(err);
        this.snackBar.open(
          'Oops ! nous rencontrons un problème technique. Veuillez réessayer plus tard.',
          'Ok',
          { duration: 3500 },
        );
      },
    );
  }

  loadOffers() {
    this.accountService.loadOffer().subscribe(
      (off) => (this.ownedOffer = off),
      (err) => {
        console.error(err);
        this.snackBar.open(
          'Oops ! nous rencontrons un problème technique. Veuillez réessayer plus tard.',
          'Ok',
          { duration: 3500 },
        );
      },
    );
  }
  /**
   *
   */
  selectOffer(offer: any) {
    this.offers.forEach((o) => (o.selected = o.id === offer.id));
    this.selectedOffer = offer;
  }
  /**
   *
   */
  async enableSub(sub) {
    console.log('click');
    this.inProgress = true;
    const dialogData = new ConfirmModel(
      'Confirmation',
      'Souhaitez vous réactiver votre abonnement ?',
    );
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '80%',
      data: dialogData,
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.enableSubscription(sub).subscribe(
        (sub) => {
          this.inProgress = false;
          this.loadSubscriptions();
        },
        (err) => {
          this.snackBar.open(
            'Oops ! nous sommes pas en mesure de réactiver votre abonnement pour le moment. Veuillez réessayer plus tard.',
            'Ok',
            { duration: 3500 },
          );
          this.inProgress = false;
        },
      );
    } else {
      this.inProgress = false;
    }
  }
  /**
   *
   */
  async cancelSubscription(sub) {
    this.inProgress = true;
    const dialogData = new ConfirmModel(
      'Confirmation',
      'Souhaitez vous annuler votre abonnement ?',
    );
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '80%',
      data: dialogData,
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.cancelSubscription(sub).subscribe(
        (sub) => {
          this.inProgress = false;
          this.loadSubscriptions();
        },
        (err) => {
          this.snackBar.open(
            "Oops ! nous sommes pas en mesure d'annuler votre abonnement pour le moment. Veuillez réessayer plus tard.",
            'Ok',
            { duration: 3500 },
          );
          this.inProgress = false;
        },
      );
    } else {
      this.inProgress = false;
    }
  }
}
