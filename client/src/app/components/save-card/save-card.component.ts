import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CreatePaymentMethodCardData } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import {
  ApiClientService,
  API_URI_ACCOUNT,
  API_URI_USER,
} from 'src/app/api-client/api-client.service';
import { AddressComponent } from '../address/address.component';
import { DecryptTokenService } from '../home/register/register.service';

@Component({
  selector: 'app-save-card',
  templateUrl: './save-card.component.html',
  styleUrls: ['./save-card.component.scss'],
})
export class SaveCardComponent implements OnInit {
  cardHolderForm: FormGroup;
  emailForm: FormGroup;
  userInfo: any;
  account: any;
  emailForReceipt: any;
  cardHolder: any;
  inProgress: boolean;
  messageErrorStripeElement: any;
  complete: boolean;
  cardInfos: any;
  paied: boolean;

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
    private apiClientService: ApiClientService,
    private stripeService: StripeService,
    private userToken: DecryptTokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.cardHolderForm = this.formBuilder.group({
      cardHolder: ['', [Validators.required]],
    });

    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.getUser();
  }

  async saveCard() {
    this.inProgress = true;
    const paymentData: CreatePaymentMethodCardData = {
      type: 'card',
      card: this.card.element,
      metadata: {
        account: this.account.id,
        user: this.userInfo.id,
      },
      billing_details: {
        email: this.emailForReceipt,
        address: {
          line1: this.account.billing_address.line1,
          line2: this.account.billing_address.line2,
          city: this.account.billing_address.city,
          postal_code: this.account.billing_address.postal_code,
          state: this.account.billing_address.state,
          country: 'FR',
        },
      },
    };

    try {
      const createPaymentMethodResponse = await this.stripeService
        .getInstance()
        .createPaymentMethod(paymentData);
      if (createPaymentMethodResponse.error) {
        this.snackBar.open(
          String(createPaymentMethodResponse.error.message),
          'Ok',
          {
            duration: 3000,
          },
        );
        this.inProgress = false;
        return;
      }

      let saveCardResponse: { error: any };
      saveCardResponse = await this.apiClientService
        .post(`${API_URI_ACCOUNT}/${this.account.id}/savecard`, {
          receiptEmail: this.emailForReceipt,
          paymentMethod: createPaymentMethodResponse.paymentMethod.id,
          cardOwner: this.cardHolder,
        })
        .toPromise();

      if (saveCardResponse.error) {
        this.snackBar.open(String(saveCardResponse.error), 'Ok', {
          duration: 3000,
        });
        this.inProgress = false;
        return;
      }

      this.snackBar.open('La sauvegarde s\'est terminée avec succès', 'Ok', {
        duration: 3000,
      });
      this.inProgress = false;
      this.router.navigate(['/dashboard/facturation']);

    } catch (e) {
      this.inProgress = false;
      this.snackBar.open(
        e.message
          ? e.message
          : 'Oops ! paiement non disponible pour le moment, merci de verifier votre moyen de paiement.',
        'OK',
      );
      console.error(e);
      return;
    }
  }

  onChange(event: { error: { message: any; }; complete: any; value: any; }) {
    if (event.error) {
      this.messageErrorStripeElement = event.error.message;
    } else {
      this.messageErrorStripeElement = '';
    }
    if (event.complete) {
      this.complete = true;
      this.cardInfos = event.value;
    }
  }

  submitIsValid(): boolean {
    return (
      this.complete &&
      this.account &&
      this.account.billing_address &&
      this.emailForm.controls.email.valid &&
      this.cardHolderForm.controls.cardHolder.valid
    );
  }

  async addOrEditAddress() {
    const dialogRef = this.dialog.open(AddressComponent, {
      data: this.account,
    });
    const newAddress = await dialogRef.afterClosed().toPromise();
    this.account.billing_address = newAddress;
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
            : (this.userInfo.prenom || '') + ' ' + (this.userInfo.nom || '');
      });
  }
}
