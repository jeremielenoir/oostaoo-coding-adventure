import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApiClientService,
  API_URI_USER,
  API_URI_PAYMENT
} from 'src/app/api-client/api-client.service';
import {
  StripeService,
  ElementsOptions,
  TokenResult,
  ElementOptions,
  StripeCardComponent
} from 'ngx-stripe';
import { Router } from '@angular/router';
import { Offer } from 'src/app/models/offer.model';
import { DecryptTokenService } from '../register/register.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  offerChoice: any;
  userInfo: any;
  cardInfos: any;

  stripeKey = '';
  inProgress = false;
  paied = false;
  complete = false;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: ElementOptions = {
    style: {
      base: {
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };
  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };

  constructor(
    private router: Router,
    private apiClientService: ApiClientService,
    private stripeService: StripeService,
    private userToken: DecryptTokenService,
    private snackBar: MatSnackBar
  ) {}
  /**
   *
   */
  ngOnInit() {
    this.offerChoice = JSON.parse(localStorage.getItem('offerChoice'));
    this.apiClientService
      .get(API_URI_USER + '/' + this.userToken.userId)
      .subscribe(user => {
        this.userInfo = user;
      });
    this.card.on.subscribe(item => {
      if (item.type === 'change') {
        if (item.event.error) {
          this.snackBar.open(item.event.error.message, 'OK');
        }
        if (item.event.complete) {
          this.complete = true;
          this.cardInfos = item.event.value;
        }
      }
    });
  }
  /**
   *
   */
  keyUpdated() {
    this.stripeService.changeKey(this.stripeKey);
  }
  /**
   *
   */
  async payNow() {

    try {

      this.inProgress = true;

      const tokenResult: TokenResult = await this.stripeService
        .createToken(this.card.element, {
          name: this.userInfo.username,
          // address_line1: '123 A Place',
          // address_line2: 'Suite 100',
          // address_city: 'Irving',
          // address_state: 'BC',
          address_zip: this.cardInfos.postalCode,
          address_country: 'FR'
        })
        .toPromise();

      if (tokenResult.error || !tokenResult.token) {
        this.inProgress = false;
        if (tokenResult.error) {
          this.snackBar.open(tokenResult.error.message, 'OK');
        } else {
          this.snackBar.open('Un problème technique est survenu', 'OK');
        }
        return;
      }

      const payResult: any = await this.apiClientService
        .post(API_URI_PAYMENT + '/finalize', {
          offer: this.offerChoice.id,
          // email: this.userInfo.email,
          paymentToken: tokenResult.token
        })
        .toPromise();

      if (!payResult || !payResult.newToken) {
        this.snackBar.open('Votre paiement a échoué', 'OK');
        this.inProgress = false;
        return;
      }

      // localStorage.setItem('currentUser', payResult.newToken);

      this.snackBar.open('Votre paiement a été effectué', 'OK');
      this.inProgress = false;
      this.paied = true;

      setTimeout(() => {
         this.router.navigate(['/dashboard/campaigns']);
      }, 3000);

    } catch (e) {
      this.inProgress = false;
      this.snackBar.open(e.message ? e.message : 'Oops ! paiement non disponible pour le moment.', 'OK');
      console.error(e);
      return;
    }
  }
}
