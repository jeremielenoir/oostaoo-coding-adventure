import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  ApiClientService,
  API_URI_USER,
  API_URI_ACCOUNT
} from "src/app/api-client/api-client.service";
import { DecryptTokenService } from "src/app/components/home/register/register.service";
import pdfMake from "pdfmake/build/pdfmake";
import { getFactureDefinition } from "./getFactureDefinition";
import { MatDialog } from '@angular/material';
import { AddressComponent } from '../../address/address.component';

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

  datePipe = new DatePipe("fr");
  account: any;
  user: any;
  card: any;
  sub: any;
  offer: any;
  subscription: any;
  invoices: any[];
  nextInvoice: any;

  /**
   *
   * @param apiClientService
   * @param decryptTokenService
   */
  constructor(
    private apiClientService: ApiClientService,
    private decryptTokenService: DecryptTokenService,
    private dialog: MatDialog
  ) {}
  /**
   *
   */
  ngOnInit() {

    this.apiClientService
      .get(API_URI_USER + "/" + this.decryptTokenService.userId)
      .subscribe(
        (data) => {
          this.user = data;
          this.account = this.user.customeraccount;

          this.apiClientService
            .get(API_URI_ACCOUNT + '/' + this.account.id + '/offers')
            .subscribe(
              (data) => {
                const { card, sub, offer } = data;
                this.card = card;
                this.sub = sub;
                this.offer = offer;
              },
              (err) => {
                // TODO handle error
              }
            );

        },
        (err) => {
          // TODO handle error
        }
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
