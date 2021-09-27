import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiClientService,
  API_URI_OFFER,
  API_URI_USER,
  API_URI_ACCOUNT,
} from 'src/app/api-client/api-client.service';
import { Offer } from 'src/app/models/offer.model';
import { SessionService } from 'src/app/services/session/session.service';
import { DecryptTokenService } from '../register/register.service';
import { MatDialog } from '@angular/material';
import { ConfirmModel, ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {
  handler: any = null;
  offerChoiceAmount: string;
  isSubPage = false;
  listOffers: Offer[] = [];
  currentUser: any;
  currentOffer: any;

  constructor(
    private router: Router,
    private apiClientService: ApiClientService,
    private session: SessionService,
    private userToken: DecryptTokenService,
    public dialog: MatDialog,
  ) {}
  /**
   *
   */
  ngOnInit() {
    // this.offerChoiceAmount = this.session.offerChoiceAmount ? this.session.offerChoiceAmount : null;
    this.offerChoiceAmount = localStorage.getItem('offerChoiceAmount');
    this.isSubPage = this.router.url.startsWith('/subscription');
    this.getCurrentUser();
    this.getOffers();
  }

  /**
   *
   * @param offer
   */
  async changeOffer(offer: any) {
    const message = `Souhaitez vous changer votre offre ?`;
    const dialogData = new ConfirmModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    const doAction = await dialogRef.afterClosed().toPromise();

    if (doAction) {
      const changeOffer: any = await this.apiClientService
        .post(
          API_URI_ACCOUNT +
            '/' +
            this.currentUser.customeraccount.id +
            '/changeoffer',
          { offerId: offer.id },
        )
        .toPromise();
    }
  }
  /**
   *
   */
  async unSubscribe() {
    const unsubscribeResult: any = await this.apiClientService
      .get(API_URI_OFFER + '/' + this.currentOffer.id + '/unsubscribe')
      .toPromise();

    this.currentOffer = undefined;
    this.currentUser.customeraccount.tests_stock = 0;
    this.currentUser.customeraccount.offer = undefined;
  }
  /**
   *
   */
  purchase(offer: Offer) {
    localStorage.setItem('offerChoiceAmount', '' + offer.price);
    this.offerChoiceAmount = '' + offer.price;
    if (this.router.url.startsWith('/subscription')) {
      localStorage.setItem('offerChoice', JSON.stringify(offer));
      this.router.navigate(['/payment']);
    } else {
      this.router.navigate(['/home/register']);
    }
  }

  private getCurrentUser() {
    if (this.userToken && this.userToken.userId) {
      this.apiClientService
        .get(API_URI_USER + '/' + this.userToken.userId)
        .subscribe((user) => {
          this.currentUser = user;
          this.currentOffer = this.currentUser.customeraccount.offer;
        });
    }
  }

  private getOffers() {
    this.apiClientService
      .get(API_URI_OFFER)
      .subscribe(
        (offers) => (this.listOffers = offers.filter((o: Offer) => o.enabled)),
      );
  }
}
