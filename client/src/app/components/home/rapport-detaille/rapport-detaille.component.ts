import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getResultsDefinition } from '../../panelAdmin/edit-campagne/candidats/getResultsDefinition.js';
import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from '../../../../assets/pdfmake-font-builds/vfs_fonts';

//pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  FontAwesome: {
    normal: 'fontawesome-webfont.ttf',
    bold: 'fontawesome-webfont.ttf',
    italics: 'fontawesome-webfont.ttf',
    bolditalics: 'fontawesome-webfont.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

@Component({
  selector: 'app-rapport-detaille-home',
  templateUrl: './rapport-detaille.component.html',
  styleUrls: ['./rapport-detaille.component.scss']
})
export class RapportDetailleHomeComponent implements OnInit {


  constructor( private router: Router) { }

  ngOnInit() {

  }

  viewExemplePdf() {
    pdfMake.createPdf(getResultsDefinition(
      {name : 'Exemple',
       email : 'exemple@exemple.com',
      date: '10/01/2020',
      languages : 'FR',
      duration : 40,
      score : 20,
      resultsByLanguage : {Javascript: {note: 33, max: 100, percentage_techno: '33%'}},
      totalPointsMax : 60,
      totalPointsCandidat : 20,
      questionsRapport :   [{
        question_id: 28,
        name: 'window.i = 0; var i = 2; alert(window.i); : que va afficher ce code ?',
        content: ['0', '2', 'Game over', 'undefined'],
        candidate_answer: '2',
        correct_answer: '2',
        question_max_score: 20,
        question_candidate_score: 20,
        question_time: '40',
        question_timeRep: '20',
      },
      {
        question_id: 30,
        name: 'Quelle chaîne de caractères ne correspond pas à l\'expression régulière /\ba/ ?',
        content: ['abcd', '_a', '-a', 'd c b a'],
        candidate_answer: '-a',
        correct_answer: '_a',
        question_max_score: 20,
        question_candidate_score: 0,
        question_time: '30',
        question_timeRep: '15',
      },
      {
        question_id: 26,
        name: 'Quelle est la méthode spécifiée dans le DOM-2 pour l\'ajout des gestionnaires d\'événements ?',
        content: ['addEventListener', 'attachEvent', 'attachEventListener', 'listen'],
        candidate_answer: 'attachEventListener',
        correct_answer: 'addEventListener',
        question_max_score: 20,
        question_candidate_score: 0,
        question_time: '20',
        question_timeRep: '5',
      },
    ],
       totalTestTime : 90,
       totalCandidateTime : 40 }
      )).open();
  }



  rapportExemple() {
    window.open('/home/rapport_exemple', '_blank');

  }
}

@Component({
  selector: 'app-rapport-detaille-exemple',
  templateUrl: './rd-exemple.html',
  styleUrls: ['./rd-exemple.scss']
})

export class RapportDetailleExempleComponent {

constructor() {}

}

