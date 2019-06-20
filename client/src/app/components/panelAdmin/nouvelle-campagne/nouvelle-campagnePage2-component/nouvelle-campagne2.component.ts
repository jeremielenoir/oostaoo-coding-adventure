import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiClientService, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-NouvelleCampagnePage2Component',
  templateUrl: './nouvelle-campagne2.component.html',
  styleUrls: ['./nouvelle-campagne2.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage2Component implements OnInit {

  selectedLangue = 'FR'

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public errorNomCampgane: boolean = false;

  constructor(public apiClientService: ApiClientService) { }

  ngOnInit() {
    this.formCampagne.patchValue({
      nomDeCampagne: this.formCampagne.value.role + ' - ' + this.formCampagne.value.experience
    })
  }

  postData() {
    this.formCampagne.patchValue({
      utilisationCopieColler: this.formCampagne.value.utilisationCopieColler,
      envoiRapportSimplifie: this.formCampagne.value.envoiRapportSimplifie,
      langue: this.selectedLangue
    })
    // Confirm true for post
    if (this.formCampagne.value.utilisationCopieColler === 'true') {
      var truecp = true;
    } else {
      var truecp = false;
    }
    if (this.formCampagne.value.envoiRapportSimplifie === 'true') {
      var envoiRapportSimplifie = true;
    } else {
      var envoiRapportSimplifie = false;
    }

    this.apiClientService.post(API_URI_CAMPAIGNS, {
      Name: this.formCampagne.value.nomDeCampagne,
      level: this.formCampagne.value.experience,
      langs: this.formCampagne.value.langue,
      copy_paste: truecp,
      sent_report: envoiRapportSimplifie,
      profile: this.formCampagne.value.roleSelectedId,
      technologies: this.formCampagne.value.technoSelectedId
    }).subscribe(
      (res) => {
        console.log('resultat from post', res);
        this.formCampagne.patchValue({
          CampaignID: { 'id': res.id }
        });
      },
      err => console.log(err)
    );
  }

  public onDecrementPage(): void {
    this.decrementPage.emit();  // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit();  // Déclenche l'output
  }

}
