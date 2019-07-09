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
  @Input('technoByParent') technoParent;
  public oAuthFormVerification: AuthFormVerification;
  public errorExperience: string;
  public errorRole: string;
  public errorTechno: string;

  @Output() valueChange = new EventEmitter();

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


  public technos: any[];
  public profiles: any[];
  public technosSelect: Array<string>;


  constructor(public apiClientService: ApiClientService) {
    this.oAuthFormVerification = new AuthFormVerification();
  }

  ngOnInit() {
    console.log('technoParent: ', this.technoParent);
    this.technosSelect = this.technoParent;
    this.apiClientService.get(API_URI_TECHNO).subscribe((datas) => {
      this.technos = datas;
    });
    this.apiClientService.get(API_URI_PROFILES).subscribe((datas) => {
      this.profiles = datas;
    });
  }
  selected(event: MatSelectChange) {
    // console.log(event.value);
    for (const iterator of this.profiles) {
      // console.log(this.profiles[i])
      const roleData = iterator.name;
      // console.log(roleData)
      if (event.value === roleData) {
        // console.log(this.profiles[i].id)
        this.formCampagne.patchValue({
          roleSelectedId: { id: iterator.id }
        });
        const technoData = [];
        const technoDataID = [];
        iterator.technologies.forEach((item) => {
          technoData.push(item.name);
          technoDataID.push(item.id);
        });
        this.technosSelect = technoData;
        this.formCampagne.patchValue({
          technoSelectedId: technoDataID
        });
        // console.log(technoDataID)
        // console.log(this.formCampagne.value)
      }
    }
  }

  valueChanged() { // You can give any function name
    console.log('this.technosSelect: ', this.technosSelect);
    this.valueChange.emit(this.technosSelect);
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
