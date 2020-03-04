import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TooltipPosition, MatSnackBar } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_QUESTIONS
} from '../../../../api-client/api-client.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms'
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  public globalId;
  public campaing;
  public yourCampaign;
  public allQuestions;
  public allQuestionsCampaign;
  public questionsByCampaign;
  public updateQuestionsCampaign = [];
  public searchText = '';
  public positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public toppings = new FormControl();
  public toppingsDifficulty = new FormControl();
  public toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  public difficulty = ['facile', 'moyen', 'expert'];
  public boelanIsSearchAdvenced: boolean = false;
  public saveallQuestionsCampaign = [];
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('allQuestionsCampaign: ', this.allQuestionsCampaign);
      console.log('this questionsByCampaign: ', this.questionsByCampaign);
    }
  }

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService, private _snackBar: MatSnackBar, ) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
    });
  }

  ngOnInit() {

    Promise.all([this.loadCampaign(), this.loadAllQuestion()]).then(values => {
      const campaigns = values[0];
      this.yourCampaign = campaigns;
      console.log('------------------allQuestionsCampaign------------------: ', this.allQuestionsCampaign);
      const questions = values[1]
      console.log('this.loadCampaign', values[0]);
      console.log('oui questions', questions);
      const nameQuestionByTechno = [];
      campaigns[0].questions.forEach(element => {
        console.log('question campagne', element);
        nameQuestionByTechno.push(element.name);
      });
      const questionByTechnoCampaing = [];
      const nameQuestionCampaignByTechno = [];
      for (let question of questions) {
        // console.log('question.technologies.id', question.technologies.id)
        campaigns[0].technologies.forEach(element => {


          if (question.technologies && question.technologies.id === element.id && !nameQuestionByTechno.includes(question.name)) {

            questionByTechnoCampaing.push(question);

          }
          if (question.technologies && question.technologies.id === element.id && nameQuestionByTechno.includes(question.name)) {

            nameQuestionCampaignByTechno.push(question);
          }


        });
        // console.log('nameQuestionCampaignByTechno: ', nameQuestionCampaignByTechno);
        // console.log(this.yourCampaign[0].questions);
        // console.log('iteName: ', question.name);
      }
      this.questionsByCampaign = nameQuestionCampaignByTechno;
      console.log('this.questionsByCampaign: ', this.questionsByCampaign);
      this.allQuestionsCampaign = questionByTechnoCampaing;
      this.saveallQuestionsCampaign = questionByTechnoCampaing;
    });
  }

  loadCampaign(): Promise<any> {
    return this.apiClientService.get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .toPromise()
      .then(response => {
        // console.log('questionsByCampaign : ', this.questionsByCampaign);
        this.yourCampaign = [response];
        return this.yourCampaign;
      })
      .catch(err => err);
  }

  loadAllQuestion(): Promise<any> {
    return this.apiClientService.get(API_URI_QUESTIONS)
      .toPromise()
      .then(response => {
        console.log('all questions: ', response);
        return response;
      })
      .catch(err => err);
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  SendQuestionSelected() {
    for (const element of this.questionsByCampaign) {
      console.log('element: ', element);
      this.updateQuestionsCampaign.push(element.id);
    }
    console.log('this array for update questions: ', this.updateQuestionsCampaign);
    this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.globalId, {
      questions: this.updateQuestionsCampaign
    }).subscribe(
      (res) => {
        this.openSnackBar('Les questions ont bien été éditées', 'Fermer');
        console.log(res);
      },
      err => console.log(err)
    );
  }
  fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    // return (m - (m %= 60)) / 60 + (9 < m ? ':' : ':0') + m;
  }

  openSearchAdvenced() {
    this.boelanIsSearchAdvenced = !this.boelanIsSearchAdvenced
  }

  filtreDifficuty(element) {
    console.log('-------------this.yourCampaign-------------', this.yourCampaign);
    let arrayFacile = [];
    let arrayMoyen = [];
    let arrayExpert = [];
    let arrayComplet = [];

    if (element.value.includes('facile')) {
      arrayFacile = this.saveallQuestionsCampaign.filter(element => element.level == 'facile');
      arrayComplet.push(...arrayFacile);
    }

    if (element.value.includes('moyen')) {
      arrayMoyen = this.saveallQuestionsCampaign.filter(element => element.level == 'moyen');
      arrayComplet.push(...arrayMoyen);
    }

    if (element.value.includes('expert')) {
      arrayExpert = this.saveallQuestionsCampaign.filter(element => element.level == 'expert');
      arrayComplet.push(...arrayExpert);
    }

    this.allQuestionsCampaign = arrayComplet;

    if (element.value.length == 0) {
      this.allQuestionsCampaign = this.saveallQuestionsCampaign
    }

  }

  filtreTechno(element) {

    console.log('all question', this.allQuestionsCampaign)

    this.allQuestionsCampaign.forEach(question => {

      element.value.forEach(val => {

        if (question.technologies.name == val) {
          console.log('good !!!')
        }

      });

    });

    // const arrayTechno = [];

    // element.value.forEach(val => {
    //   let tech = this.allQuestionsCampaign.filter(question => question.technologies.name == val);
    //   arrayTechno.push(...tech);
    // });

    // this.allQuestionsCampaign = arrayTechno;
    // console.log('arrayTechno ------------>', arrayTechno)

  }



}