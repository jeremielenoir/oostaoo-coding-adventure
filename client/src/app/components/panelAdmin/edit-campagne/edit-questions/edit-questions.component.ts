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
  selector: 'app-edit-questions',
  templateUrl: './edit-questions.component.html',
  styleUrls: ['./edit-questions.component.scss']
})
export class EditQuestionsComponent implements OnInit {
  public globalId;
  public campaing;
  public yourCampaign;
  public allQuestions;
  public allQuestionsCampaign;
  public questionsByCampaign;
  public searchText = '';
  public positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public toppings = new FormControl();
  public toppingsDifficulty = new FormControl();
  public toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  public difficulty = ['facile', 'moyen', 'expert'];
  public boelanIsSearchAdvenced: boolean = false;
  public saveallQuestionsCampaign = [];
  public techno = []
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService, private _snackBar: MatSnackBar, ) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
     
    });
  }


  ngOnInit() {

    Promise.all([this.loadCampaign(), this.loadAllQuestion()]).then(values => {
      const campaigns = values[0];
      this.yourCampaign = campaigns;
      const questions = values[1]
    
      this.yourCampaign[0].technologies.forEach(element => {
        this.techno.push(element)
      });
      const nameQuestionByTechno = [];
      campaigns[0].questions.forEach(element => {
        nameQuestionByTechno.push(element.name);
      });
      const questionByTechnoCampaing = [];
      const nameQuestionCampaignByTechno = [];
      for (let question of questions) {
       
        campaigns[0].technologies.forEach(element => {


          if (question.technologies && question.technologies.id === element.id && !nameQuestionByTechno.includes(question.name)) {

            questionByTechnoCampaing.push(question);

          }
          if (question.technologies && question.technologies.id === element.id && nameQuestionByTechno.includes(question.name)) {

            nameQuestionCampaignByTechno.push(question);
          }


        });
      
      }
      this.questionsByCampaign = nameQuestionCampaignByTechno;
      this.allQuestionsCampaign = questionByTechnoCampaing;

    });
  }

  chargeYourCampagn(event){
    console.log('on vien de recupere event',event)
    // this.yourCampaign = event
  }

  loadCampaign(): Promise<any> {
    return this.apiClientService.get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .toPromise()
      .then(response => {
        
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
      duration: 6000,
    });
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


  filtreTechno(element) {

    const valueChecked = [];

    element.value.forEach(valueCheck => {
      if (valueChecked.includes(valueCheck)) {

        for (let value of valueChecked) {
          let newFilter = this.allQuestionsCampaign.filter(element => element.technologies.name == value);
          this.allQuestionsCampaign = newFilter
        }


      } else {
        valueChecked.push(valueCheck);
      }
    });


    console.log('allquestion---------->', this.allQuestionsCampaign)

  }


}