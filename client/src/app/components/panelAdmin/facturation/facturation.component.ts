import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {MatSort, MatTableDataSource} from '@angular/material';
import {  ApiClientService, API_URI_USER_ADMIN, API_URI_USER} from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { getFactureDefinition } from './getFactureDefinition';

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
  styleUrls: ['./facturation.component.scss']
})


export class FacturationComponent implements OnInit {

  displayedColumns: string[] = ['date', 'montant', 'statut', 'facture', 'download'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  public user: any;
  public facture: any;
  datePipe = new DatePipe('fr');
  // @ViewChild(MatSort) sort: MatSort;

  constructor(public apiClientService: ApiClientService, public decryptTokenService: DecryptTokenService) {
  }

  ngOnInit() {
    // this.dataSource.sort = this.sort;

    this.getUser().then(user => {
      this.facture = (user[0].factures);
     // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
    });
  }

 exportPdf(){
   let facture = {...this.facture[0], date: this.datePipe.transform(this.facture[0].date, 'dd-MM-yy')};
   pdfMake.createPdf(getFactureDefinition(facture)).open();
  }

  downloadPdf(){
    let date = this.datePipe.transform(this.facture[0].date, 'dd-MM-yy');
    let facture = {...this.facture[0], date};
    pdfMake.createPdf(getFactureDefinition(facture)).download();
  }

  async getUser() {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER + '/' + this.decryptTokenService.userId)
        .toPromise();
      return this.user = [datas];
    } catch (err) {
      return err;
    }
  }
}
