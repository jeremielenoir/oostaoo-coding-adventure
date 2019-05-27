import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-NouvelleCampagnePage2Component',
  templateUrl: './nouvelle-campagne2.component.html',
  styleUrls: ['./nouvelle-campagne2.component.css','../nouvelle-campagne.component.css']
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
                        'SysAdmin Windows',  'Personnalisé'];

  

  constructor() { }

  ngOnInit() {
  }

  public onDecrementPage(): void {
    this.decrementPage.emit();  // Déclenche l'output
  }

  public onIncrementPage(): void {
    this.incrementPage.emit();  // Déclenche l'output
  }

}
