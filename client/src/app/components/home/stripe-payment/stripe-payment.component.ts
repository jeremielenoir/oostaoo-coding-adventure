import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApiClientService,
  API_URI_USER,
  API_URI_ACCOUNT
} from 'src/app/api-client/api-client.service';
import {
  StripeService,
  ElementsOptions,
  ElementOptions,
  StripeCardComponent,
  Address
} from 'ngx-stripe';
import { Router } from '@angular/router';
import { DecryptTokenService } from '../register/register.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AddressComponent } from '../../address/address.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  offerChoice: any;
  userInfo: any;
  cardInfos: any;
  account: any;

  emailForm: any;
  cardHolderForm: any;
  emailForReceipt: string;
  cardHolder: string;

  messageErrorStripeElement: string;
  stripeKey = '';
  inProgress = false;
  paied = false;
  complete = false;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: ElementOptions = {
    style: {
      base: {
        lineHeight: '50px',
        fontSize: '16px',
        fontFamily: '"Poppins", sans-serif',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
          fontSize: '16px',
          fontFamily: '"Poppins", sans-serif',
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
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {

    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]]
    });

    this.cardHolderForm = this.formBuilder.group({
      cardHolder: ['', [Validators.required]]
    });
  }
  /**
   *
   */
  ngOnInit() {
    this.offerChoice = JSON.parse(localStorage.getItem('offerChoice'));
    this.apiClientService
      .get(API_URI_USER + '/' + this.userToken.userId)
      .subscribe(user => {
        this.userInfo = user;
        this.account = this.userInfo.customeraccount;
        this.emailForReceipt = this.account.entreprise && this.account.entreprise.email
          ? this.account.entreprise.email : this.userInfo.email;
        this.cardHolder = this.account.entreprise && this.account.entreprise.nom
          ? this.account.entreprise.nom : (this.userInfo.prenom + ' ' + this.userInfo.nom);
      });
    this.card.on.subscribe(item => {
      if (item.type === 'change') {
        this.messageErrorStripeElement = null;
        if (item.event.error) {
          this.messageErrorStripeElement = item.event.error.message;
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
  async addOrEditAddress() {
    const dialogRef = this.dialog.open(AddressComponent, {
      data: this.account
    });

    const newAddress = await dialogRef.afterClosed().toPromise();
    this.account.billing_address = newAddress;
  }
  /**
   *
   */
  canPayNow(): boolean {
    return this.complete && this.account && this.account.billing_address
      && this.emailForm.controls.email.valid;
  }
  /**
   *
   */
  async editAndSelectEmail() {

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

      // create card payment method
      let response1 = await this.stripeService.getInstance()
        .createPaymentMethod("card", this.card.element, {
          billing_details: {
            email: this.emailForReceipt,
            address: {
              line1: this.account.billing_address.line1,
              line2: this.account.billing_address.line2,
              city: this.account.billing_address.city,
              postal_code: this.account.billing_address.postal_code,
              state: this.account.billing_address.state,
              country: 'FR', // this.account.billing_address.country,
            } as Address
          },
          metadata: {
            'account': this.account.id,
            'user': this.userInfo.id
          }
        });

      if (response1.error) {
        this.snackBar.open(String(response1.error.message), 'Ok', {duration: 3000});
        this.inProgress = false;
        return;
      }

      // process payment server side
      let response2 = await this.apiClientService
        .post(`${API_URI_ACCOUNT}/${this.account.id}/offers`, {
          offerId: this.offerChoice.id,
          receiptEmail: this.emailForReceipt,
          paymentMethod: response1.paymentMethod.id
        })
        .toPromise();

      // parse result
      if (response2.error) {

        this.snackBar.open(String(response2.error), 'Ok', {duration: 3000});
        this.inProgress = false;
        return;

      } else if (response2.requiresAction) {

        let response3 = await this.stripeService.getInstance().handleCardAction(response2.clientSecret);

        if (response3.error) {
          this.snackBar.open(String(response3.error), 'Ok', {duration: 3000});
          this.inProgress = false;
          return;
        } else if (response3.paymentIntent.status === "requires_confirmation") {

          let response4 = await this.apiClientService
            .post(`${API_URI_ACCOUNT}/${this.account.id}/offers`, {
              paymentIntentId: response3.paymentIntent.id
            })
            .toPromise();

          if (response4.error) {
            this.snackBar.open(String(response3.error), 'Ok', {duration: 3000});
            this.inProgress = false;
            return;
          }
        }

      }

      this.snackBar.open('Votre achat s\'est terminé avec succès', 'Ok', {duration: 3000});
      this.inProgress = false;
      this.paied = true;

    } catch (e) {
      this.inProgress = false;
      this.snackBar.open(e.message ? e.message : 'Oops ! paiement non disponible pour le moment.', 'OK');
      console.error(e);
      return;
    }
  }
}
