import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DatePipe } from '@angular/common';
import { API_URI_CAMPAIGNS, ApiClientService } from 'src/app/api-client/api-client.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService, public datepipe: DatePipe, private _snackBar: MatSnackBar) {
    this.route.parent.parent.params.subscribe(params => {
      this.globalId = params.id;
    });
  }

  public globalId: any;
  public campaigns: any;

  // dateExp: string | number | Date;
  // NewDateExp: Date;

  name = new FormControl('', Validators.required);
  lang = new FormControl('', Validators.required);
  copypasteControl = new FormControl('', Validators.required);
  expdate = new FormControl('', Validators.required);
  rapportControl = new FormControl('', Validators.required);
  chrono = new FormControl('', Validators.required);

  copypaste: boolean;
  envoiRapportSimplifie: boolean;
  isLoaded: boolean = false;


  ngOnInit() {

    this.getCampaign().then(camp => {
      this.name = new FormControl(camp[0].Name);
      this.lang = new FormControl(camp[0].langs);
      this.copypasteControl = new FormControl(camp[0].copy_paste);
      this.rapportControl = new FormControl(camp[0].sent_report);
      this.expdate = new FormControl(camp[0].expiration_days);

    });


  }

  //   formatDate(date: string | number | Date) {
  //     const d = new Date(date);
  //     let month = '' + (d.getMonth() + 1);
  //     let day = '' + d.getDate();
  //     const year = d.getFullYear();
  //     if (month.length < 2) { month = '0' + month; }
  //     if (day.length < 2) { day = '0' + day; }
  //     return [year, month, day].join('-');
  // }

  updateCampaign() {
    // this.NewDateExp.setDate(this.NewDateExp.getDate() + this. date.value);
    if (this.copypasteControl.value) {
      this.copypaste = true;
    } else {
      this.copypaste = false;
    }
    if (this.rapportControl.value) {
      this.envoiRapportSimplifie = true;
    } else {
      this.envoiRapportSimplifie = false;
    }

    
    if (this.expdate.value === null || this.name.value === '') {
      this.openSnackBar("Une erreur est survenue, veuillez remplir correctement tous les champs requis", "Fermer");
    } else {
      this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
        Name: this.name.value,
        langs: this.lang.value,
        copy_paste: this.copypaste,
        sent_report: this.envoiRapportSimplifie,
        expiration_days: this.expdate.value,
      }).subscribe(
        (res) => {
          this.openSnackBar("La campagne a correctement été mise à jour", "Fermer")

        }
      );
    }
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container']
    });
  }


  async getCampaign(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_CAMPAIGNS + '/' + this.globalId)
        .toPromise();
      this.isLoaded = true;
      return this.campaigns = [datas];
    } catch (err) {
      return err;
    }
  }
}
