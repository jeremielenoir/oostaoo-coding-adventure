import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiClientService, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-NouvelleCampagnePage2Component',
  templateUrl: './nouvelle-campagne2.component.html',
  styleUrls: ['./nouvelle-campagne2.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage2Component implements OnInit {

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public errorNomCampgane: boolean = false;

  langsData: string[] = ["FR", "EN", "ES", "JP"];
  lastAction: string;
  constructor(public apiClientService: ApiClientService) {
  }

  ngOnInit() {
    this.formCampagne.patchValue({
      nomDeCampagne: this.formCampagne.value.role + " - " + this.formCampagne.value.experience
    })
  }
  arrLang: any = [];

  Change(event, item) {
    // console.log(item + " _ " + event.checked);
    if (event.checked) {
      this.arrLang.push(item)
    } else {
      let index = this.arrLang.indexOf(item);
      if (index > -1) {
        this.arrLang.splice(index, 1);
      }
    }
    // console.log(this.formCampagne.value.langs)
    // console.log(this.arrLang);
  }

  postData() {
    // console.log(this.arrLang)
    this.formCampagne.patchValue({
      utilisationCopieColler: this.formCampagne.value.utilisationCopieColler,
      envoiRapportSimplifie: this.formCampagne.value.envoiRapportSimplifie,
      langs: this.arrLang
    })
    this.apiClientService.post(API_URI_CAMPAIGNS, {
      "Name": this.formCampagne.value.nomDeCampagne,
      "level": this.formCampagne.value.experience,
      "langs": this.formCampagne.value.langs,
      "copy_paste": this.formCampagne.value.utilisationCopieColler,
      "sent_report": this.formCampagne.value.envoiRapportSimplifie,
      "profile": this.formCampagne.value.role,
      "technologies": this.formCampagne.value.techno
    }).subscribe(
      (res) => {
        console.log(res);
      },
      err => console.log(err)
    );
    console.log("technologies " + this.formCampagne.value.techno)
    // console.log("cp " + this.formCampagne.value.utilisationCopieColler)
    // console.log("sent_rapport " + this.formCampagne.value.envoiRapportSimplifie)
    // console.log("langues " + this.formCampagne.value.langs)
    // console.log(this.formCampagne.value)
  }

  public onDecrementPage(): void {
    this.decrementPage.emit();  // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit();  // Déclenche l'output
  }

}
