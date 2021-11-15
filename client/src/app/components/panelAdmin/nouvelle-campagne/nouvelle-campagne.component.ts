import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { FormCampagneValidator } from "src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator";
import { RouterLink } from '@angular/router';

// const MOCK_TECHNO: Record<string, any>[] = [
//   {
//     id: 13555,
//     name: "React",
//     description: null,
//     created_at: "2020-03-16T10:39:57.000Z",
//     updated_at: "2020-03-16T10:39:57.000Z",
//     profile: null
//   },
//   {
//     id: 13554,
//     name: "JavaScript",
//     description: null,
//     created_at: "2020-03-16T10:39:41.000Z",
//     updated_at: "2020-03-16T10:39:41.000Z",
//     profile: null
//   },
//   {
//     id: 13561,
//     name: "HTML/CSS",
//     description: null,
//     created_at: "2020-03-26T16:04:07.000Z",
//     updated_at: "2020-03-26T16:04:07.000Z",
//     profile: null
//   },
//   {
//     id: 13546,
//     name: "python",
//     description: null,
//     created_at: "2020-03-12T12:50:58.000Z",
//     updated_at: "2020-03-12T12:50:58.000Z",
//     profile: null
//   },
//   {
//     id: 13558,
//     name: "Android",
//     description: null,
//     created_at: "2020-03-17T10:37:31.000Z",
//     updated_at: "2020-03-17T10:37:31.000Z",
//     profile: null
//   },
//   {
//     id: 13568,
//     name: "Symfony",
//     description: null,
//     created_at: "2020-06-09T14:41:17.000Z",
//     updated_at: "2020-06-09T14:41:17.000Z",
//     profile: null
//   }
// ];

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

  ngOnInit() {
    // this.nNumeorPage = 3
    // this.Alltechno = MOCK_TECHNO;
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
    this.Alltechno = [...event];
    console.log('this.Alltechno', this.Alltechno);
  }
}
