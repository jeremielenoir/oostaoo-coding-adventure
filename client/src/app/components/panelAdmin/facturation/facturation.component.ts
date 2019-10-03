import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {  ApiClientService, API_URI_USER_ADMIN, API_URI_USER} from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

export interface PeriodicElement {
  date: string;
  montant: string;
  statut: string;
  facture: string;
  download: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {date: '19/04/2019', montant: '418.80', statut: 'Payée',
//   facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '19/03/2019', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '19/02/2019', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/01/2019', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/12/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/11/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/10/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/09/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/08/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/07/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
//   {date: '05/06/2018', montant: '418.80', statut: 'Payée',
//    facture: 'Fact-012', download: '<a href=""><i class="far fa-eye eye-icon"></i></a>'},
// ];


@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.css']
})
export class FacturationComponent implements OnInit {

  displayedColumns: string[] = ['date', 'montant', 'statut', 'facture', 'download'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  public user: any;
  public facture: any;

  // @ViewChild(MatSort) sort: MatSort;

  constructor(public apiClientService: ApiClientService, public decryptTokenService: DecryptTokenService) {
  }

  ngOnInit() {
    // this.dataSource.sort = this.sort;

    this.getUser().then(user => {
      console.log(user);
      this.facture = (user[0].factures);
      console.log(this.facture);
     // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
    });
  }

  async getUser(): Promise<any> {
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
