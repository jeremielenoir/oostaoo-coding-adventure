import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import pdfMake from "pdfmake/build/pdfmake";
import { getFactureDefinition } from "./getFactureDefinition";
import { MatDialog } from '@angular/material';
import { AddressComponent } from '../../address/address.component';
import { AccountService } from 'src/app/services/account/account.service';
import { CustomerAccount } from 'src/app/models/account.model';
import { PaymentMethod } from 'ngx-stripe/lib/interfaces/payment-intent';
import { invoices, subscriptions } from 'stripe';

export interface PeriodicElement {
  date: string;
  montant: string;
  statut: string;
  facture: string;
  download: string;
}

@Component({
  selector: "app-facturation",
  templateUrl: "./facturation.component.html",
  styleUrls: ["./facturation.component.scss"]
})
export class FacturationComponent implements OnInit {

  account: CustomerAccount;
  paymentMethod: PaymentMethod;
  subscription: subscriptions.ISubscription;
  offer: any;
  invoices: invoices.IInvoice[];

  inProgress = false;
  datePipe = new DatePipe("fr");
  nextInvoice: any;

  /**
   *
   * @param apiClientService
   * @param decryptTokenService
   */
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog
  ) {
    this.accountService.account
      .subscribe((acc) => this.account = acc);
    this.accountService.paymentMethod
      .subscribe((pm) => this.paymentMethod = pm);
    this.accountService.subscription
      .subscribe((sub) => this.subscription = sub);
    this.accountService.offer
      .subscribe((off) => this.offer = off);
    this.accountService.invoices
      .subscribe((inv) => this.invoices = inv);
  }
  /**
   *
   */
  ngOnInit() {
    this.accountService.loadPaymentMethod();
    this.accountService.loadSubscription();
    this.accountService.loadOffer();
    this.accountService.loadInvoices();
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
