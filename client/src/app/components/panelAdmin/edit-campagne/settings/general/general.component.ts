import { Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DatePipe } from '@angular/common';
import { API_URI_CAMPAIGNS, ApiClientService } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService, public datepipe: DatePipe) {
    this.route.parent.parent.params.subscribe(params => {
      this.globalId = params.id;
    });
  }
  public globalId: any;
  public campaigns: any;

  dateExp: string | number | Date;
  NewDateExp: Date;

  name = new FormControl('', Validators.required);
  lang = new FormControl('', Validators.required);
  copypasteControl = new FormControl('', Validators.required);
  date = new FormControl(30, Validators.required);
  rapportControl = new FormControl('', Validators.required);
  chrono = new FormControl('', Validators.required);

  copypaste: boolean;
  envoiRapportSimplifie: boolean;



  ngOnInit() {
    this.getCampaign().then(camp => {
      this.name = new FormControl(camp[0].Name);
      this.lang = new FormControl(camp[0].langs);
      this.copypasteControl = new FormControl(camp[0].copy_paste);
      this.rapportControl = new FormControl(camp[0].sent_report);
      // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
      // console.log('campaign langue = ', camp[0]);
      this.dateExp = camp[0].expiration_date.slice(0, 10);
      this.NewDateExp = new Date(this.dateExp);
      // console.log(' date =', this. date.value);
    });
  }

  formatDate(date: string | number | Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [year, month, day].join('-');
}



  updateCampaign() {
    this.NewDateExp.setDate(this.NewDateExp.getDate() + this. date.value);
    // console.log('date exp: ', this.campaigns[0].expiration_date.slice(0, 10));
    // console.log('new date', this.formatDate(this.NewDateExp));

    if (this.copypasteControl.value === 'true') {
      this.copypaste = true;
    } else {
      this.copypaste = false;
    }
    if (this.rapportControl.value === 'true') {
      this.envoiRapportSimplifie = true;
    } else {
      this.envoiRapportSimplifie = false;
    }
    // console.log('form =', this.name.value, this.lang.value, this.copypaste, this.envoiRapportSimplifie );

    this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
      Name: this.name.value,
      langs: this.lang.value,
      copy_paste: this.copypaste,
      sent_report: this.envoiRapportSimplifie,
      expiration_date: this.formatDate(this.NewDateExp),
    }).subscribe(
      (res) => {
        alert('Campagne mise à jour');
       // console.log('res', res);
      },
      err => console.log(err)
    );
  }


  async getCampaign(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_CAMPAIGNS + '/' + this.globalId)
        .toPromise();
      return this.campaigns = [datas];
    } catch (err) {
      return err;
    }
  }
}
