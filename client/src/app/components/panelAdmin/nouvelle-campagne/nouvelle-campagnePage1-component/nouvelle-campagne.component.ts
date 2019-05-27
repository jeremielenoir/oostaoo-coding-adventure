import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthFormVerification } from 'src/app/components/panelAdmin/nouvelle-campagne/formCampagneValidator'

@Component({
  selector: 'app-NouvelleCampagnePage1Component',
  templateUrl: './nouvelle-campagne.component.html',
  styleUrls: ['./nouvelle-campagne.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage1Component implements OnInit {

  @Output() incrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public oAuthFormVerification: AuthFormVerification;
  public errorExperience: string;
  public errorRole: string;
  public errorTechno: string;

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



  constructor() {
    this.oAuthFormVerification = new AuthFormVerification();
  }

  ngOnInit() { }

  // validation du formulaire et passage à l'étap suivante.
  public onIncrementPage(p_oDatafromValue: any): void {

    this.formValid(p_oDatafromValue);
    if (AuthFormVerification._sMessageError === '') {
      this.incrementPage.emit();  // Déclenche l'output pour passer à la paga suivante.
    }

  }

  public formValid(p_oDatafromValue: any): void {

    AuthFormVerification.startVerificationFrom();

    if (AuthFormVerification.validateExprience(p_oDatafromValue.experience) === false) {
      this.errorExperience = AuthFormVerification._sMessageError;
    } else {
      this.errorExperience = '';
    }

    if (AuthFormVerification.validateRole(p_oDatafromValue.role) === false) {
      this.errorRole = AuthFormVerification._sMessageError;
    } else {
      this.errorRole = '';
    }

    if (AuthFormVerification.validateTechno(p_oDatafromValue.techno) === false) {
      this.errorTechno = AuthFormVerification._sMessageError;
    } else {
      this.errorTechno = '';
    }
  }

}
