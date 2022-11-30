import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApiClientService,
  API_URI_USER,
  API_URI_ACCOUNT,
} from 'src/app/api-client/api-client.service';
import {
  StripeService,
  // ElementsOptions,
  // ElementOptions,
  StripeCardComponent,
  // Address
} from 'ngx-stripe';
import { Router } from '@angular/router';
import { DecryptTokenService } from '../register/register.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AddressComponent } from '../../address/address.component';
import { FormBuilder, Validators } from '@angular/forms';
import { CreatePaymentMethodCardData } from '@stripe/stripe-js';
import { ConfirmComponent, ConfirmModel } from '../confirm/confirm.component';
@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss'],
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
  cardConfirmation: FormBuilder;
  @ViewChild(StripeCardComponent) card: any;
  cardOptions = {
    style: {
      base: {
        lineHeight: '50px',
        fontSize: '16px',
        fontFamily: '"Poppins", sans-serif',
        color: '#32325D',
        '::placeholder': {
          color: '#AAB7C4',
          fontSize: '16px',
          fontFamily: '"Poppins", sans-serif',
        },
      },
      invalid: {
        color: '#FA755A',
        iconColor: '#FA755A',
      },
    },
  };
  elementsOptions = {
    locale: 'fr',
  };
  constructor(
    private router: Router,
    private apiClientService: ApiClientService,
    private stripeService: StripeService,
    private userToken: DecryptTokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.cardHolderForm = this.formBuilder.group({
      cardHolder: ['', [Validators.required]],
    });
    this.offerChoice = JSON.parse(localStorage.getItem('offerChoice'));
  }
  /**
   *
   */
  ngOnInit() {
    this.getUser();
  }

  onChange(event) {
    if (event.error) {
      this.messageErrorStripeElement = event.error.message;
    }
    if (event.complete) {
      this.complete = true;
      this.cardInfos = event.value;
    }
  }
  /**
   *
   */
  async addOrEditAddress() {
    const dialogRef = this.dialog.open(AddressComponent, {
      data: this.account,
    });
    const newAddress = await dialogRef.afterClosed().toPromise();
    this.account.billing_address = newAddress;
  }
  /**
   *
   */
  canPayNow(): boolean {
    return (
      this.complete &&
      this.account &&
      this.account.billing_address &&
      this.emailForm.controls.email.valid
    );
  }
  /**
   *
   */
  async editAndSelectEmail() {}
  /**
   *
   */
  keyUpdated() {
    this.stripeService.changeKey(this.stripeKey);
  }

  async confirmPayment() {
    const dialogData = new ConfirmModel(
      'Confirmation',
      'Souhaitez vous proceder au paiement ?',
    );
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '80%',
      data: dialogData,
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.payNow();
    } else {
      this.inProgress = false;
    }
  }

  /**
   *
   */
  async payNow() {
    try {
      // process payment server side
      this.inProgress = true;
      let saveOfferResponse: any;
      saveOfferResponse = await this.apiClientService
        .post(`${API_URI_ACCOUNT}/${this.account.id}/offers`, {
          offerId: this.offerChoice.id,
          receiptEmail: this.emailForReceipt,
        })
        .toPromise();
      if (saveOfferResponse.requiredAction) {
        await this.stripeService
          .getInstance()
          .confirmCardPayment(saveOfferResponse.clientSecret)
          .then(async (result: any) => {
            if (result && result.error) {
              // Show error to your customer
              this.snackBar.open(String(result.error.message), 'Ok', {
                duration: 3000,
              });
              this.inProgress = false;
              return;
            } else {
              if (result && result.paymentIntent.status === 'succeeded') {
                await this.apiClientService
                  .post(`${API_URI_ACCOUNT}/${this.account.id}/offers`, {
                    paymentIntentId: result.paymentIntent.id,
                  })
                  .toPromise();
                this.snackBar.open(
                  'Votre achat s\'est terminé avec succès',
                  'Ok',
                  {
                    duration: 3000,
                  },
                );
                this.inProgress = false;
                this.paied = true;
                this.router.navigate(['/dashboard/facturation']);
              }
            }
          });
      } else {
        this.snackBar.open('Votre achat s\'est terminé avec succès', 'Ok', {
          duration: 3000,
        });
        this.inProgress = false;
        this.paied = true;
        this.router.navigate(['/dashboard/facturation']);
      }
    } catch (e) {
      if (e.code === 'stripe_paiement') {
        this.snackBar.open(
          'Merci d\'enregistrer un moyen de paiement',
          'OK',
        );
        this.router.navigate(['/save-payment']);
      } else {
        this.inProgress = false;
        this.snackBar.open(
          e.message
            ? e.message
            : 'Oops ! paiement non disponible pour le moment.',
          'OK',
        );
        console.error(e);
      }
      return;
    }
  }

  private getUser() {
    this.apiClientService
      .get(API_URI_USER + '/' + this.userToken.userId)
      .subscribe((user) => {
        this.userInfo = user;
        this.account = this.userInfo.customeraccount;
        this.emailForReceipt =
          this.account.entreprise && this.account.entreprise.email
            ? this.account.entreprise.email
            : this.userInfo.email;
        this.cardHolder =
          this.account.entreprise && this.account.entreprise.nom
            ? this.account.entreprise.nom
            : this.userInfo.prenom + ' ' + this.userInfo.nom;
      });
  }
}
