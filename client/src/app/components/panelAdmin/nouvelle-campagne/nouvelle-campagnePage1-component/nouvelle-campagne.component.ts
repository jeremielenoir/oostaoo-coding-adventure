import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthFormVerification } from 'src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator';
import { ApiClientService, API_URI_TECHNO, API_URI_PROFILES } from '../../../../api-client/api-client.service';
import { MatSelectChange } from '@angular/material';


@Component({
  selector: 'app-profile-rechercher',
  templateUrl: './nouvelle-campagne.component.html',
  styleUrls: ['./nouvelle-campagne.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage1Component implements OnInit {

  @Output() incrementPage = new EventEmitter<any>();
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

  @Output() valueChange = new EventEmitter();
  @Output() valueChangeProfil = new EventEmitter();

  TechnoList: string[] = ['AWS', 'Android', 'Angular 2+', 'AngularJS (1.x)', 'Apache Spark', 'C', 'C#', 'C++',
    'Data Science', 'Docker', 'Git', 'Hadoop Ecosystem', 'Java', 'Javascript, HTML, CSS',
    'Mobile iOS/Swift', 'Node.js', 'PHP', 'Python 3', 'React', 'SQL', 'Scala', 'Spring Framework',
    'Symfony', 'Windows Administration'];

  RoleList: string[] = ['Développeur Angular Front-End', 'Administrateur base de données (SQL)',
    'Data Engineer (Hadoop, Spark)', 'Data Scientist (Python)', 'Développeur .NET C#',
    'Développeur .NET C# Back-End', 'Développeur AngularJS Front-End', 'Développeur C',
    'Développeur C# Full Stack', 'Développeur C++', 'Développeur Hadoop', 'Développeur Java',
    'Développeur Java Back-End', 'Développeur Java Full Stack', 'Développeur Java Spring Back-End',
    'Développeur Mobile Android', 'Développeur Mobile iOS (Swift)', 'Développeur Node.js',
    'Développeur PHP', 'Développeur PHP Fullstack', 'Développeur PHP Symfony', 'Développeur Python',
    'Développeur React Front-End', 'Développeur Scala', 'Développeur Spark',
    'Développeur Web (JavaScript, HTML, CSS)', 'Expert Git', 'Ingénieur DevOps AWS/Docker',
    'SysAdmin Windows', 'Personnalisé'];

  constructor(public apiClientService: ApiClientService) {
    this.oAuthFormVerification = new AuthFormVerification();
  }

  ngOnInit() {
    console.log('technoParent: ', this.technoByParent);
    this.technosSelect = this.technoByParent;
    this.roleSelect = this.profilByParent;
    this.apiClientService.get(API_URI_TECHNO).subscribe((datas) => {
      this.technos = datas;
    });
    this.apiClientService.get(API_URI_PROFILES).subscribe((datas) => {
      this.profiles = datas;
    });
  }
  selected(event: MatSelectChange) {
    for (const iterator of this.profiles) {
      // console.log('iterator profiles: ', iterator);
      const roleData = iterator.name;
      console.log(roleData);
      if (event.value === roleData) {
        this.formCampagne.patchValue({
          roleSelectedId: { id: iterator.id }
        });
        const technoData = [];
        const technoDataID = [];
        iterator.technologies.forEach((item) => {
          // console.log('item forEach : ', item);
          technoData.push(item.name);
          technoDataID.push(item.id);
        });
        this.technosSelect = technoData;
        this.formCampagne.patchValue({
          technoSelectedId: technoDataID
        });
      }
    }
    console.log('this.formCampagne.value: ', this.formCampagne.value);
  }
  getTechnoChecked() {
    this.roleSelect = 'Personnalisé';
    console.log(this.formCampagne.value.techno);
    let nbSimilarTechno = 0;
    let myprofile;
    for (const profile of this.profiles) {
      console.log('profile : ', profile);
      myprofile = {
        profileName: profile,
        nb: profile.technologies.length,
        techno: profile.technologies
      };
      // console.log(myprofile);
      // this.profileHasTechnologies(profile, this.formCampagne.value.techno);
    }
    const technoDataID = [];
    for (const techno of this.technos) {
      this.formCampagne.value.techno.forEach(element => {
        if (element === techno.name) {
          technoDataID.push(techno.id);
        }
      });
    }
    this.formCampagne.patchValue({
      technoSelectedId: technoDataID
    });
  }

  // profileHasTechnologies(profile: any, listTechno: Array<string>): boolean {
  //   const nbCounterTechno = 0;
  //   const Technoprofil = [];
  //   for (const techno of profile.technologies) {
  //     // console.log('techno: ', techno);
  //     for (const technoFromList of listTechno) {
  //       // console.log('technoFromList: ', technoFromList);
  //       if (techno.name === technoFromList && profile.technologies.length === listTechno.length && listTechno.indexOf(techno.name) !== -1) {
  //         // console.log(profile);
  //       }
  //     }
  //   }
  //   return true;
  // }

  valueChanged() { // You can give any function name
    console.log('this.technosSelect: ', this.technosSelect);
    this.valueChange.emit(this.technosSelect);
    this.valueChangeProfil.emit(this.roleSelect);
  }

  // validation du formulaire et passage à l'étap suivante.
  public onIncrementPage(pDatafromValue: any): void {
    this.formValid(pDatafromValue);
    if (AuthFormVerification._sMessageError === '') {
      this.incrementPage.emit();  // Déclenche l'output pour passer à la paga suivante.
    }
  }

  public formValid(pDatafromValue: any): void {

    AuthFormVerification.startVerificationFrom();

    if (AuthFormVerification.validateExprience(pDatafromValue.experience) === false) {
      this.errorExperience = AuthFormVerification._sMessageError;
    } else {
      this.errorExperience = '';
    }

    if (AuthFormVerification.validateRole(pDatafromValue.role) === false) {
      this.errorRole = AuthFormVerification._sMessageError;
    } else {
      this.errorRole = '';
    }

    if (AuthFormVerification.validateTechno(pDatafromValue.techno) === false) {
      this.errorTechno = AuthFormVerification._sMessageError;
    } else {
      this.errorTechno = '';
    }
  }
}
