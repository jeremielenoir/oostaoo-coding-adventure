import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AuthFormVerification } from "src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator";
import {
  ApiClientService,
  API_URI_TECHNO,
  API_URI_PROFILES
} from "../../../../api-client/api-client.service";
import { MatSelectChange } from "@angular/material";
import {SelectedLanguageService} from '../../../../services/selected-language.service';
import { LanguagePipe } from 'ngx-markdown';

@Component({
  selector: "app-profile-rechercher",
  templateUrl: "./nouvelle-campagne.component.html",
  styleUrls: [
    "./nouvelle-campagne.component.scss",
    "../nouvelle-campagne.component.scss"
  ]
})
export class NouvelleCampagnePage1Component implements OnInit {
  @Output() incrementPage = new EventEmitter<any>();
  @Output() allTechno = new EventEmitter();
  @Input() formCampagne: FormGroup;
  @Input() technoByParent;
  @Input() profilByParent;
  public oAuthFormVerification: AuthFormVerification;
  public errorExperience: string;
  public errorRole: string;
  public errorTechno: string;

  public technos: any[];
  public profiles: any[];
  public technosSelect: Array<string>;
  public roleSelect: string;
  public facile = 'facile';
  public nameLanguage:string = '';
  

  @Output() valueChange = new EventEmitter();
  @Output() valueChangeProfil = new EventEmitter();



  constructor(public apiClientService: ApiClientService,public languageStorage:SelectedLanguageService) {
    this.oAuthFormVerification = new AuthFormVerification();
  }

  ngOnInit() {
    this.technosSelect = this.technoByParent;
    this.roleSelect = this.profilByParent;
    this.getProfiles();
    this.getTechnos();
    
    console.log('this.languageStorage.recupLanguageCountry()',this.languageStorage.getLanguageCountry())

    switch(this.languageStorage.getLanguageCountry()){
      case 'es-ES':
      this.nameLanguage = 'name_es';
      break;
      case 'fr-FR':
      this.nameLanguage = 'name';
      break;
      case 'en-US':
      this.nameLanguage = 'name_en';
      break;
      case 'jp-JP':
      this.nameLanguage = 'name_jp';
      break;
    }

    console.log('content this.nameLanguage',this.nameLanguage)
  }

  // somme(a, b) {
  //   return a + b;
  // }

  getProfiles() {
    this.apiClientService.get(API_URI_PROFILES).subscribe(datas => {
      return (this.profiles = datas);
    });
  }

  getTechnos() {
    this.apiClientService.get(API_URI_TECHNO).subscribe(datas => {
      return (this.technos = datas);
    });
  }
  selected(event: MatSelectChange) {

    for (const iterator of this.profiles) {
  
      const roleData = iterator[this.nameLanguage];
      if (event.value === roleData) {
        this.formCampagne.patchValue({roleSelectedId: { id: iterator.id } });
        const technoData = [];
        const technoDataID = [];
        iterator.technologies.forEach(item => {
          // console.log('item forEach : ', item);
          technoData.push(item);
          technoDataID.push(item.id);
        });
        this.technosSelect = technoData;

        this.formCampagne.patchValue({
          techno: technoData,
          technoSelectedId: technoDataID
        });
      }
    }
   
  }

  getTechnoChecked() {

    for (const profile of this.profiles) {
      console.log('this.profileHasTechnologies -->',this.formCampagne.value.techno)
      if (this.profileHasTechnologies(profile, this.formCampagne.value.techno)) {
        this.roleSelect = profile[this.nameLanguage];
        break;
      } else {
        // this.roleSelect = "Personnalisé";
        this.roleSelect = this.profiles[2][this.nameLanguage];
      }
    }
    const technoDataID = [];

    this.formCampagne.value.techno.forEach(element => {
      technoDataID.push(element.id);
    });

    this.formCampagne.patchValue({
      technoSelectedId: technoDataID
    });
    // console.log("this.formCampagne.value: ", this.formCampagne.value);
  }

  compareObjects(o1: any, o2: any): boolean {
    // console.log('o1: ', o1, 'o2: ', o2);
    if (!o1 || !o2) {
      return false;
    }
    return o1.id === o2.id;
  }

  profileHasTechnologies(profile: any, listTechno: Array<string>): boolean {
    if (profile.technologies.length !== listTechno.length) {
      return false;
    }

    let nbCounterTechno = 0;
    for (const techno of profile.technologies) {
      // console.log('technoFromList: ', technoFromList);
      for (const technoFromList of listTechno) {
        if (techno[this.nameLanguage] === technoFromList["name"]) {
          nbCounterTechno++;
        }
      }
    }
    return profile.technologies.length === nbCounterTechno;
  }

  valueChanged() {
    
    // You can give any function name
    console.log("salut")
    this.valueChange.emit(this.technosSelect);
    this.valueChangeProfil.emit(this.roleSelect);
  }

  // validation du formulaire et passage à l'étap suivante.
  public onIncrementPage(pDatafromValue: any): void {

    this.formValid(pDatafromValue);
    if (AuthFormVerification._sMessageError === "") {
      this.incrementPage.emit(); // Déclenche l'output pour passer à la paga suivante.
      this.methodAllTechno()
    }
  }

  public formValid(pDatafromValue: any): void {
    AuthFormVerification.startVerificationFrom();

    if (
      AuthFormVerification.validateExprience(pDatafromValue.experience) ===
      false
    ) {
      this.errorExperience = AuthFormVerification._sMessageError;
    } else {
      this.errorExperience = "";
    }

    if (AuthFormVerification.validateRole(pDatafromValue.role) === false) {
      this.errorRole = AuthFormVerification._sMessageError;
    } else {
      this.errorRole = "";
    }

    if (AuthFormVerification.validateTechno(pDatafromValue.techno) === false) {
      this.errorTechno = AuthFormVerification._sMessageError;
    } else {
      this.errorTechno = "";
    }
  }

  methodAllTechno() {
    this.allTechno.emit(this.technosSelect);
  }
}
