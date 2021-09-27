import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
//import pdfMake from "pdfmake/build/pdfmake";
import { getFactureDefinition } from "./getFactureDefinition";
import { MatDialog, MatSnackBar } from "@angular/material";
import { AddressComponent } from "../../address/address.component";
import { AccountService } from "src/app/services/account/account.service";
import { CustomerAccount } from "src/app/models/account.model";
import { invoices, subscriptions, paymentIntents } from "stripe";
import {
  ConfirmModel,
  ConfirmComponent,
} from "../../home/confirm/confirm.component";
import { Router } from '@angular/router';

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
  styleUrls: ["./facturation.component.scss"],
})
export class FacturationComponent implements OnInit {
  account: CustomerAccount;
  paymentMethod: paymentIntents.IPaymentIntent;
  subscription: subscriptions.ISubscription;
  offer: any;
  invoices: invoices.IInvoice[];

  inProgress = false;
  datePipe = new DatePipe("fr");
  nextInvoice: any;
  searchQuery: "";

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
    private router: Router
  ) {
    this.accountService.account.subscribe((acc) => (this.account = acc));
    this.accountService.paymentMethod.subscribe(
      (pm) => (this.paymentMethod = pm)
    );
    this.accountService.subscription.subscribe(
      (sub) => (this.subscription = sub)
    );
    this.accountService.offer.subscribe((off) => (this.offer = off));
    this.accountService.invoices.subscribe((inv) => (this.invoices = inv));
  }
  /**
   *
   */
  ngOnInit() {
    // declaration nav route
    this.dataRoute = [
      {
        routerLink: "/subscription",
        condition: true,
        classAnimParent: "hvr-icon-bounce",
        classAnimIcone: "hvr-icon",
        icon: "credit_card",
        name: "Abonnement",
      },
      {
        routerLink: "/dashboard/facturation",
        condition: true,
        classAnimParent: "hvr-icon-bounce",
        classAnimIcone: "hvr-icon",
        icon: "list_alt",
        name: "Facturation",
      },
      {
        routerLink: "/dashboard/protection-des-donnees",
        condition: true,
        classAnimParent: "hvr-icon-bounce",
        classAnimIcone: "hvr-icon",
        icon: "admin_panel_settings",
        name: "Confidentialité",
      },
    ];
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
    this.router.navigate(['/save-payment']);
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
  async enableSub() {
    this.inProgress = true;
    const dialogData = new ConfirmModel(
      "Confirmation",
      "Souhaitez vous réactiver votre abonnement ?"
    );
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "80%",
      data: dialogData,
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.enableSubscription().subscribe(
        (sub) => {
          this.inProgress = false;
        },
        (err) => {
          this.snackBar.open(
            "Oops ! nous sommes pas en mesure de réactiver votre abonnement pour le moment. Veuillez réessayer plus tard.",
            "Ok",
            { duration: 3500 }
          );
          this.inProgress = false;
        }
      );
    } else {
      this.inProgress = false;
    }
  }
  /**
   *
   */
  async cancelSub() {
    this.inProgress = true;
    const dialogData = new ConfirmModel(
      "Confirmation",
      "Souhaitez vous annuler votre abonnement ?"
    );
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "80%",
      data: dialogData,
    });
    const doAction = await dialogRef.afterClosed().toPromise();
    if (doAction) {
      this.accountService.cancelSubscription().subscribe(
        (sub) => {
          this.inProgress = false;
        },
        (err) => {
          this.snackBar.open(
            "Oops ! nous sommes pas en mesure d'annuler votre abonnement pour le moment. Veuillez réessayer plus tard.",
            "Ok",
            { duration: 3500 }
          );
          this.inProgress = false;
        }
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
