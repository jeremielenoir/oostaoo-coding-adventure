import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthFormVerification } from 'src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nouvelle-campagne',
  templateUrl: './nouvelle-campagne.component.html',
  styleUrls: ['./nouvelle-campagne.component.css']
})
export class NouvelleCampagneComponent implements OnInit {

  nNumeorPage: number;
  ParentFormCampagne: FormGroup;
  public oAuthFormVerification: AuthFormVerification;

  constructor(private _formBuilder: FormBuilder,
    private _http: HttpClient) {
    this.nNumeorPage = 1;
    this.oAuthFormVerification = new AuthFormVerification();
    this.ParentFormCampagne = this._formBuilder.group({
      role: this.oAuthFormVerification.getRoleValidator(),
      techno: this.oAuthFormVerification.getTechnoValidator(),
      experience: ['Senior', this.oAuthFormVerification.getExperienceValidator()],
      langueSouhaite: [''],
      utilisationCopieColler: 'false',
      envoiRapportSimplifie: 'false',
      nomDeCampagne: '',

    });
  }

  ngOnInit() {
    console.log(this.ParentFormCampagne.value);
    /*
    this._http.get(`${environment.urlBackEnd}Test22s`)
      .subscribe(
        (data) => console.log(data)
      );
      */
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



}
