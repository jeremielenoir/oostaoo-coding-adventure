import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TooltipPosition, MatSnackBar } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_QUESTIONS,
} from '../../../../api-client/api-client.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-questions',
  templateUrl: './edit-questions.component.html',
  styleUrls: ['./edit-questions.component.scss'],
})
export class EditQuestionsComponent implements OnInit {
  public globalId;
  public campaing;
  public yourCampaign;
  public allQuestions;
  public allQuestionsCampaign;
  public questionsEditQuestion;
  public searchText = '';
  public positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  public toppings = new FormControl();
  public toppingsDifficulty = new FormControl();
  public toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];
  public difficulty = ['facile', 'moyen', 'expert'];
  public boelanIsSearchAdvenced = false;
  public saveallQuestionsCampaign = [];
  public techno = [];
  public allTechno = [];
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  constructor(
    private route: ActivatedRoute,
    public apiClientService: ApiClientService,
    private _snackBar: MatSnackBar,
  ) {
    this.route.parent.params.subscribe((params) => {
      this.globalId = params.id;
    });
  }

  ngOnInit() {
    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .subscribe((response) => {
        this.yourCampaign = response;
        this.yourCampaign.technologies.forEach((element) => {
          this.techno.push(element);
        });
        this.allTechno = this.techno;
        this.allQuestionsCampaign = this.yourCampaign.questions;

        console.log('allQuestionsCampaign', this.allQuestionsCampaign);

        this.loadAllQuestion(this.allQuestionsCampaign);
      });
  }

  populateQuestions(yourCampaign) {
    const technos = this.techno;

    yourCampaign.forEach((element) => {
      const technoIndex = technos.findIndex(
        (t) =>
          t && t.id && t.id.toString() === element.technologies.id.toString(),
      );
      if (technoIndex < 0) {
        technos.push(element.technologies);
      }
    });

    const newQuestion = [];

    for (const techno of technos) {
      for (const question of yourCampaign) {
        if (techno.id.toString() === question.technologies.id.toString()) {
          newQuestion.push({ ...question, technologies: techno });
        }
      }
    }

    this.questionsEditQuestion = newQuestion;

    this.yourCampaign = yourCampaign;
    this.allTechno = technos;
  }
  chargeYourCampagn(event) {
    /*  console.log("on vien de recupere event", event);
    // this.yourCampaign = event; */
    this.populateQuestions(event);
  }

  loadAllQuestion(yourCampaignQuestions): any {
    ('');
    let url = '';
    this.techno.forEach((tech, index) => {
      if (index === 0) {
        url += `?technologies_in=${tech.id}`;
      } else {
        url += `&technologies_in=${tech.id}`;
      }
    });

    this.apiClientService
      .get(`${API_URI_QUESTIONS}${url}`)
      .subscribe((response) => {
        this.allQuestionsCampaign = response.filter(
          (q1) =>
            yourCampaignQuestions.findIndex(
              (q2) => q2.id.toString() === q1.id.toString(),
            ) < 0,
        );

        this.allQuestions = response.filter(
          (q1) =>
            this.allQuestionsCampaign.findIndex(
              (q2) => q2.id.toString() === q1.id.toString(),
            ) < 0,
        );

        this.questionsEditQuestion = response.filter(
          (q1) =>
            yourCampaignQuestions.findIndex(
              (q2) => q2.id.toString() === q1.id.toString(),
            ) >= 0,
        );
      });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container'],
    });
  }

  fmtMSS(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    return (
      ('0' + h).slice(-2) +
      ':' +
      ('0' + m).slice(-2) +
      ':' +
      ('0' + s).slice(-2)
    );
    // return (m - (m %= 60)) / 60 + (9 < m ? ':' : ':0') + m;
  }

  openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced;
  }

  filtreTechno(element) {
    //   const valueChecked = [];
    //   element.value.forEach((valueCheck) => {
    //     if (valueChecked.includes(valueCheck)) {
    //       for (let value of valueChecked) {
    //         let newFilter = this.allQuestionsCampaign.filter(
    //           (element) => element.technologies.name == value
    //         );
    //         this.allQuestionsCampaign = newFilter;
    //       }
    //     } else {
    //       valueChecked.push(valueCheck);
    //     }
    //   });
    //   console.log("allquestion---------->", this.allQuestionsCampaign);
  }
}
