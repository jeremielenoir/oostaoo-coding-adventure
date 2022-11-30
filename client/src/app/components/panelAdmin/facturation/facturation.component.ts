import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
// import pdfMake from "pdfmake/build/pdfmake";
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddressComponent } from '../../address/address.component';
import { AccountService } from 'src/app/services/account/account.service';
import { CustomerAccount } from 'src/app/models/account.model';
import {
  ConfirmModel,
  ConfirmComponent,
} from '../../home/confirm/confirm.component';
import { Router } from '@angular/router';
import _ from 'lodash';

export interface PeriodicElement {
  date: string;
  montant: string;
  statut: string;
  facture: string;
  download: string;
}

@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.scss'],
})
export class FacturationComponent implements OnInit {
  account: CustomerAccount;
  paymentMethod: any;
  subscription: any;
  offer: any;
  invoices: [];

  inProgress = false;
  datePipe = new DatePipe('fr');
  nextInvoice: any;
  searchQuery = '';

  dataRoute: any;

  /**
   *
   * @param apiClientService
   * @param decryptTokenService
   */
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}
  /**
   *
   */
  ngOnInit() {
    // declaration nav route
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

    this.loadAccount();
    this.loadPayment();
    this.loadSubscriptions();
    this.loadOffers();
    this.loadInvoices();
  }

  loadAccount() {
    this.accountService.loadAccount().subscribe(
      (acc) => (this.account = acc),
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

  loadPayment() {
    this.accountService.loadPaymentMethod().subscribe(
      (pm) => (this.paymentMethod = pm),
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

  loadSubscriptions() {
    this.accountService.loadSubscription().subscribe(
      (sub) => {
        if (!_.isEmpty(sub)) {
        this.subscription = sub;
        }

      },
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
      (off) => (this.offer = off),
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

  loadInvoices() {
    this.accountService.loadInvoices().subscribe(
      (inv) => (this.invoices = inv),
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
  getAddress() {
    return this.account ? this.account.billing_address : undefined;
  }
  /**
   *
   */
  async addOrEditCard() {
    this.router.navigate(['/save-payment']);
  }
  /**
   *
   */
  async addOrEditAddress() {
    console.log(this.account);
    const dialogRef = this.dialog.open(AddressComponent, {
      data: this.account,
    });

    const newAddress = await dialogRef.afterClosed().toPromise();
    this.account.billing_address = newAddress;
  }
  /**
   *
   */
  async enableSub(sub) {
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
  async cancelSub(sub) {
    console.log(sub);
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
            'Oops ! nous sommes pas en mesure d\'annuler votre abonnement pour le moment. Veuillez réessayer plus tard.',
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
  exportPdf() {
    /*let facture = {
      ...this.facture[0],
      date: this.datePipe.transform(this.facture[0].date, "dd-MM-yy")
    };*/
    // pdfMake.createPdf(getFactureDefinition(facture)).open();
  }
  /**
   *
   */
  downloadPdf() {
    /*let date = this.datePipe.transform(this.facture[0].date, "dd-MM-yy");
    let facture = { ...this.facture[0], date };
    pdfMake.createPdf(getFactureDefinition(facture)).download();*/
  }
}
