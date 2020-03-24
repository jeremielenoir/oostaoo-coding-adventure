import { Component, OnInit } from '@angular/core';
import {
  ApiClientService,
  API_URI_OFFER,
  API_URI_USER,
  API_URI_PAYMENT
} from 'src/app/api-client/api-client.service';
import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions,
  TokenResult
} from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Offer } from 'src/app/models/offer.model';
import { SessionService } from 'src/app/services/session/session.service';
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

  cardOwnerName = '';

  stripeSuccess = false;
  stripeLoader = false;

  payload: any;
  paymentCreationBody: any;

  // stripe var
  elements: Elements;
  card: StripeElement;
  elementsOptions: ElementsOptions = {
    locale: 'fr'
  };

  stripeFormGroup: FormGroup;

  constructor(
    private router: Router,
    private apiClientService: ApiClientService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private session: SessionService,
    private userToken: DecryptTokenService,
    private snackBar: MatSnackBar
  ) {}
  /**
   *
   */
  ngOnInit() {
    this.offerChoice = JSON.parse(localStorage.getItem('offerChoice'));
    // info utilisateur a recuperer de la bdd
    this.apiClientService
      .get(API_URI_USER + '/' + this.userToken.userId)
      .subscribe(user => {
        this.userInfo = user;
        this.cardOwnerName = this.userInfo.username;
      });
    this.stripeForm();
  }
  /**
   *
   */
  isBuyBtnDisabled(): boolean {
    return this.stripeFormGroup.invalid || this.stripeLoader;
  }
  /**
   *
   */
  stripeForm() {
    this.stripeFormGroup = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.stripeService.elements(this.elementsOptions).subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          style: {
            base: {
              color: '#32325d',
              // fontFamily: ''Helvetica Neue', Helvetica, sans-serif',
              // fontSmoothing: 'antialiased',
              // fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }
        });
        this.card.mount('#card-element');
      }
    });
  }

  /**
   *
   */
  async buy() {
    try {
      // const name = this.stripeTest.get('name').value;
      this.stripeSuccess = false;
      this.stripeLoader = true;
      // username utilisateur
      const name = this.userInfo.username;

      const tokenResult: TokenResult = await this.stripeService
        .createToken(this.card, { name })
        .toPromise();

      if (tokenResult.error || !tokenResult.token) {
        this.stripeLoader = false;
        this.snackBar.open(tokenResult.error.message, 'OK');
        return;
      }

      this.payload = {
        offer: this.offerChoice,
        email: this.userInfo.email,
        token: tokenResult.token
      };

      const payResult: any = await this.apiClientService
        .post(API_URI_PAYMENT + '/pay', this.payload)
        .toPromise();

      if (
        !payResult.status ||
        !(payResult.status === 'succeeded' || 'active')
      ) {
        this.snackBar.open('Votre paiement a échoué', 'OK');
        if (this.card) {
          this.card.unmount();
          this.card.mount('#card-element');
        }
        // setTimeout(() => {this.stripeError = ''; }, 2000);
        this.stripeLoader = false;
        return;
      }

      this.paymentCreationBody = {
        amount: this.offerChoice.price,
        offer_id: this.offerChoice.id,
        test_already_available: this.userInfo.tests_available,
        tests_available: this.offerChoice.tests_stock,
        user_id: this.userInfo.id,
        date_payment: Date.now(),
        paymentId: payResult.id
      };

      const resultPaymentConfirm: any = this.apiClientService
        .post(API_URI_PAYMENT, this.paymentCreationBody)
        .toPromise();

      const newToken = resultPaymentConfirm.jwt;

      if (resultPaymentConfirm.refund) {
        if (this.card) {
          this.card.unmount();
        }
        setTimeout(() => {
          // this.stripeError = '';
          this.card.mount('#card-element');
        }, 2000);

        this.snackBar.open('Un problème technique est survenu', 'OK');
        this.stripeLoader = false;
        return;
      } else {
        localStorage.setItem('currentUser', newToken);
        this.stripeSuccess = true;
        this.snackBar.open('Votre paiement a été effectué', 'OK');
        this.stripeLoader = false;
        // setTimeout(() => {
        //   this.router.navigate(['/dashboard/campaigns']);
        // }, 5000);
      }
    } catch (e) {
      this.stripeLoader = false;
      return;
    }
  }
}
