import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiClientService, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-NouvelleCampagnePage2Component',
  templateUrl: './nouvelle-campagne2.component.html',
  styleUrls: ['./nouvelle-campagne2.component.css', '../nouvelle-campagne.component.css']
})
export class NouvelleCampagnePage2Component implements OnInit {

  @Output() incrementPage = new EventEmitter<any>();
  @Output() decrementPage = new EventEmitter<any>();
  @Input() formCampagne: FormGroup;
  public errorNomCampgane: boolean = false;


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
  }

  ngOnInit() {
    this.formCampagne.patchValue({
      nomDeCampagne: this.formCampagne.value.role + " - " + this.formCampagne.value.experience,
      // langueSouhaite: 
    })
    // console.log(this.formCampagne.value.en + "en", this.formCampagne.value.fr + "fr")
  }


  postData() {
    const formData = new FormData();
    formData.append("Name", "test");
    formData.append("level", 'password');
    formData.append("langs", 'password');
    formData.append("copy_paste", 'password');
    formData.append("sent_report", 'password');
    formData.append("profile", 'password');
    formData.append("technologies", 'password');

    this.apiClientService.post(API_URI_CAMPAIGNS, formData).subscribe(
      (res) => {
        console.log(res);
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
