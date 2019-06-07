import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiClientService, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-NouvelleCampagnePage2Component',
  templateUrl: './nouvelle-campagne2.component.html',
  styleUrls: ['./nouvelle-campagne2.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage2Component implements OnInit {

  selectedLangue = "FR"

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public errorNomCampgane: boolean = false;

  constructor(public apiClientService: ApiClientService) { }

  ngOnInit() {
    this.formCampagne.patchValue({
      nomDeCampagne: this.formCampagne.value.role + " - " + this.formCampagne.value.experience
    })
  }

  postData() {
    this.formCampagne.patchValue({
      utilisationCopieColler: this.formCampagne.value.utilisationCopieColler,
      envoiRapportSimplifie: this.formCampagne.value.envoiRapportSimplifie,
      langue: this.selectedLangue
    })
    console.log(this.formCampagne.value.langues)
    this.apiClientService.post(API_URI_CAMPAIGNS, {
      "Name": this.formCampagne.value.nomDeCampagne,
      "level": this.formCampagne.value.experience,
      "langs": this.formCampagne.value.langue,
      "copy_paste": this.formCampagne.value.utilisationCopieColler,
      "sent_report": this.formCampagne.value.envoiRapportSimplifie,
      "profile": this.formCampagne.value.roleSelectedId,
      "technologies": this.formCampagne.value.technoSelectedId
    }).subscribe(
      (res) => {
        console.log(res);
      },
      err => console.log(err)
    );
    console.log(this.formCampagne.value.langue)
    console.log(this.formCampagne.value.role)
    console.log(this.formCampagne.value)
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
