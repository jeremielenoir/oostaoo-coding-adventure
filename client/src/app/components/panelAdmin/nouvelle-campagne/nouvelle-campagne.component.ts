import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { FormCampagneValidator } from "src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator";

@Component({
  selector: "app-nouvelle-campagne",
  templateUrl: "./nouvelle-campagne.component.html",
  styleUrls: ["./nouvelle-campagne.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NouvelleCampagneComponent implements OnInit {
  nNumeorPage: number;
  ParentFormCampagne: FormGroup;
  public oFormCampagneValidator: FormCampagneValidator;
  technoFromChild: Array<string>;
  selectProfilFromChild: string;
  public Alltechno: any[] = []

  constructor(private _formBuilder: FormBuilder) {
    this.nNumeorPage = 1;
    this.oFormCampagneValidator = new FormCampagneValidator();
    this.ParentFormCampagne = this._formBuilder.group({
      role: this.oFormCampagneValidator.getRoleValidator(),
      roleSelectedId: { id: "" },
      techno: this.oFormCampagneValidator.getTechnoValidator(),
      technoSelectedId: [],
      experience: [
        "facile",
        this.oFormCampagneValidator.getExperienceValidator()
      ],
      utilisationCopieColler: "false",
      envoiRapportSimplifie: "false",
      nomDeCampagne: "",
      langue: [],
      CampaignID: { id: "" }
    });
  }

  ngOnInit() {}

  getTechno(techno: Array<string>) {
    return (this.technoFromChild = techno);
  }

  getProfil(profil: string) {
    return (this.selectProfilFromChild = profil);
  }

  showtechno() {
    console.log("this.technoFromChild: ", this.technoFromChild);
  }

  public nextPage(): void {
    this.nNumeorPage++;
  }

  public previousPage(): void {
    console.log(this.ParentFormCampagne.value);
    this.nNumeorPage--;
  }

  public nouvelleCampagne(p_oDataFormValue: any): void {
    console.log(p_oDataFormValue);
  }

  public recupeAllTechno(event) {
    this.Alltechno = [...event];
    console.log('this.Alltechno', this.Alltechno);
  }
}
