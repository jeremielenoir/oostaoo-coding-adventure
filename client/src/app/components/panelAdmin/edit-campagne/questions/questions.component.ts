import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_QUESTIONS
} from '../../../../api-client/api-client.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  public globalId;
  public campaing;
  public yourCampaign;
  public allQuestions;
  public allQuestionsCampaign;
  public questionsByCampaign;
  public updateQuestionsCampaign = [];

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

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
    });
  }

  ngOnInit() {
    Promise.all([this.loadCampaign(), this.loadAllQuestion()]).then(values => {
      const campaigns = values[0];
      console.log('this.loadCampaign', values[0]);
      console.log('this.loadCampaign', values[1]);
      const nameQuestionByTechno = [];
      campaigns[0].questions.forEach(element => {
        console.log(element);
        nameQuestionByTechno.push(element.name);
      });
      const questionByTechnoCampaing = [];
      const nameQuestionCampaignByTechno = [];
      for (const iterator of this.allQuestions) {
        // console.log('iterator from all questions: ', iterator);
        campaigns[0].technologies.forEach(element => {
          if (iterator.technologies.id === element.id && !nameQuestionByTechno.includes(iterator.name)) {
            // console.log(iterator);
            questionByTechnoCampaing.push(iterator);
          }
          if (iterator.technologies.id === element.id && nameQuestionByTechno.includes(iterator.name)) {
            // console.log(iterator);
            nameQuestionCampaignByTechno.push(iterator);
          }
        });
        // console.log('nameQuestionCampaignByTechno: ', nameQuestionCampaignByTechno);
        // console.log(this.yourCampaign[0].questions);
        // console.log('iteName: ', iterator.name);
      }
      this.questionsByCampaign = nameQuestionCampaignByTechno;
      console.log('this.questionsByCampaign: ', this.questionsByCampaign);
      this.allQuestionsCampaign = questionByTechnoCampaing;
    });
  }

  loadCampaign(): Promise<any> {
    return this.apiClientService.get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .toPromise()
      .then(response => {
        // console.log('questionsByCampaign : ', this.questionsByCampaign);
        this.yourCampaign = [response];
        // console.log('this.yourCampaign: ', this.yourCampaign);
        return this.yourCampaign;
      })
      .catch(err => err);
  }

  loadAllQuestion(): Promise<any> {
    return this.apiClientService.get(API_URI_QUESTIONS)
      .toPromise()
      .then(response => {
        // console.log('all questions: ', response);
        return this.allQuestions = response;
      })
      .catch(err => err);
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
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
