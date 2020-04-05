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

      const tokenResult: TokenResult = await this.stripeService
        .createToken(this.card.element, {
          name: this.userInfo.username,
          address_line1: this.account.billing_address.line1,
          address_line2: this.account.billing_address.line2,
          address_city: this.account.billing_address.city,
          address_state: this.account.billing_address.state,
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
