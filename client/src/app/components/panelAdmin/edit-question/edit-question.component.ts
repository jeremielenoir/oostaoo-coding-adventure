import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})


export class EditQuestionComponent implements OnInit {
  constructor(public dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(nouvelleQuestion);
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'nouvelle-question',
  templateUrl: 'nouvelle-question.html',
  styleUrls: ['./nouvelle-question.css']
})

export class nouvelleQuestion {
  constructor() { }

  TechnoList: string[] = ['AWS', 'Android', 'Angular 2+', 'AngularJS (1.x)', 'Apache Spark', 'C', 'C#', 'C++',
    'Data Science', 'Docker', 'Git', 'Hadoop Ecosystem', 'Java', 'Javascript, HTML, CSS',
    'Mobile iOS/Swift', 'Node.js', 'PHP', 'Python 3', 'React', 'SQL', 'Scala', 'Spring Framework',
    'Symfony', 'Windows Administration'];

  Questions: string[] = ['Question à choix multiples', 'Réponse libre', 'Projet'];

  Langues: string[] = ['Anglais', 'Français']
}