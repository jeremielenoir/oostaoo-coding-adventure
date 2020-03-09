import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AuthFormVerification } from "src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator";
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-nouvelle-campagne",
  templateUrl: "./nouvelle-campagne.component.html",
  styleUrls: ["./nouvelle-campagne.component.scss"]
})
export class NouvelleCampagneComponent implements OnInit {
  nNumeorPage: number;
  ParentFormCampagne: FormGroup;
  public oAuthFormVerification: AuthFormVerification;
  technoFromChild: Array<string>;
  selectProfilFromChild: string;
  public Alltechno: any[] = []

  constructor(private _formBuilder: FormBuilder) {
    this.nNumeorPage = 1;
    this.oAuthFormVerification = new AuthFormVerification();
    this.ParentFormCampagne = this._formBuilder.group({
      role: this.oAuthFormVerification.getRoleValidator(),
      roleSelectedId: { id: "" },
      techno: this.oAuthFormVerification.getTechnoValidator(),
      technoSelectedId: [],
      experience: [
        "junior",
        this.oAuthFormVerification.getExperienceValidator()
      ],
      utilisationCopieColler: "false",
      envoiRapportSimplifie: "false",
      nomDeCampagne: "",
      langue: [],
      CampaignID: { id: "" }
    });
  }

  ngOnInit() {
    // console.log(this.ParentFormCampagne.value);
    /*
    this._http.get(`${environment.urlBackEnd}Test22s`)
      .subscribe(
        (data) => console.log(data)
      );
      */
  }

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
    this.Alltechno.push(...event)
    console.log('this.Alltechno', this.Alltechno)
  }
}
