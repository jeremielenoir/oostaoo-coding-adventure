import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  ApiClientService,
  API_URI_CAMPAIGNS
} from "../../../../api-client/api-client.service";

@Component({
  selector: "app-NouvelleCampagnePage2Component",
  templateUrl: "./nouvelle-campagne2.component.html",
  styleUrls: [
    "./nouvelle-campagne2.component.scss",
    "../nouvelle-campagne.component.scss"
  ]
})
export class NouvelleCampagnePage2Component implements OnInit {
  selectedLangue = "FR";

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public errorNomCampgane = false;

  constructor(public apiClientService: ApiClientService) {}

  ngOnInit() {
    this.formCampagne.patchValue({
      nomDeCampagne:
        this.formCampagne.value.role +
        " - " +
        this.formCampagne.value.experience
    });
  }

  postData() {
    this.formCampagne.patchValue({
      utilisationCopieColler: this.formCampagne.value.utilisationCopieColler,
      envoiRapportSimplifie: this.formCampagne.value.envoiRapportSimplifie,
      langue: this.selectedLangue
    });
  }

  public onDecrementPage(): void {
    this.decrementPage.emit(); // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit(); // Déclenche l'output
  }
}
