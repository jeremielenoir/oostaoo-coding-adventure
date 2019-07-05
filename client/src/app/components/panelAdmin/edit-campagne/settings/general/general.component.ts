import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { API_URI_CAMPAIGNS, ApiClientService } from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService, public datepipe: DatePipe) {
    this.route.parent.parent.params.subscribe(params => {
      this.globalId = params.id;
    });
  }
  public globalId: any;
  public campaigns;

  dateExp: string | number | Date;
  NewDateExp: Date;
  datevalue = 30;

  name = new FormControl('', Validators.required);
  lang = new FormControl('', Validators.required);
  copypaste = new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);
  rapport = new FormControl('', Validators.required);
  chrono = new FormControl('', Validators.required);

  ngOnInit() {
    this.getCampaign().then(camp => {
      this.name = new FormControl(camp[0].Name);
      this.lang = new FormControl(camp[0].langs);
      this.copypaste = new FormControl(camp[0].copy_paste);
      this.rapport = new FormControl(camp[0].sent_report);
      console.log('form =', this.name, this.lang.value, this.copypaste.value, this.rapport.value);
      console.log('campaign selected in /general = ', camp);
      console.log('campaign langue = ', camp[0].langs);
      if (camp[0].langs === 'EN') {
        this.EN = true;
      }
      if (camp[0].langs === 'FR') {
        this.FR = true;
      }
      if (camp[0].langs === 'JP') {
        this.JP = true;
      }
      if (camp[0].langs === 'ES') {
        this.ES = true;
      }

      if (camp[0].copy_paste === true) {
        this.copytrue = true;
        this.copyfalse = false;
      } else {
        this.copytrue = false;
        this.copyfalse = true;
      }

      if (camp[0].sent_report === true) {
        this.rapporttrue = true;
        this.rapportfalse = false;
      } else {
        this.rapporttrue = false;
        this.rapportfalse = true;
      }
      this.dateExp = camp[0].expiration_date.slice(0, 10);
      this.NewDateExp = new Date(this.dateExp);
      // this.NewDateExp.setDate(this.NewDateExp.getDate() + this.datevalue);
      // console.log('new date exp: ', this.NewDateExp);
      console.log('datevalue =', this.datevalue);
    });
  }

  modifierPersonne() {
     console.log('datevalue =', this.datevalue);	    
    this.NewDateExp.setDate(this.NewDateExp.getDate() + this.datevalue);
    console.log('date exp: ', this.campaigns[0].expiration_date.slice(0, 10));
    console.log('new date exp: ', this.NewDateExp);
    console.log('form =', this.name.value, this.lang, this.copypaste.value, this.rapport.value );
	   }

  getCampaign(): Promise<any> {
    return this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .toPromise()
      .then(datas => {
        // console.log('all questions: ', response);
        return this.campaigns = [datas];
      })
      .catch(err => err);
  }
}
