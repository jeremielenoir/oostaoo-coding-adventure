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
