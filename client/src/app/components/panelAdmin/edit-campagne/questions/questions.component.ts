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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('all question: ', this.allQuestions);
      console.log('this Question: ', this.questionsByCampaign);
    }
  }

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
    });
  }

  ngOnInit() {
    this.loadCampaign();
    this.loadAllQuestion();
    setTimeout(() => {
      const questionByTechnoCampaing = [];
      // console.log('questionsByCampaign: ', this.questionsByCampaign);
      // console.log('idtechno: ', this.yourCampaign[0].technologies);
      // console.log('allquestion: ', this.allQuestions);
      for (const iterator of this.allQuestions) {
        // console.log('ite: ', iterator);
        // console.log('iterator', iterator);
        this.yourCampaign[0].technologies.forEach(element => {
          // console.log('element: ', element);
          if (iterator.technologies.id === element.id) {
            // console.log('element.id: ', element.id);
            // console.log('iterator.technologies.id: ', iterator.technologies.id);
            // console.log('iterator.name: ', iterator.name);
            // console.log('this.yourCampaign[0].questions: ', this.yourCampaign[0].questions);
            questionByTechnoCampaing.push(iterator);
          }
        });
        // console.log(this.yourCampaign[0].questions);
        // console.log('iteName: ', iterator.name);
      }
      console.log(questionByTechnoCampaing)
      this.yourCampaign[0].questions.forEach(element => {
        console.log(element);
        const index = questionByTechnoCampaing.indexOf(element);
        if (index > -1) {
          questionByTechnoCampaing.splice(index, 1);
        }
      });
      this.allQuestionsCampaign = questionByTechnoCampaing;
    }, 1000);
  }

  loadCampaign(): Promise<any> {
    return this.apiClientService.get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .toPromise()
      .then(response => {
        // console.log('response: ', response);
        this.questionsByCampaign = response.questions;
        this.yourCampaign = [response];
      })
      .catch(err => err);
  }

  loadAllQuestion(): Promise<any> {
    return this.apiClientService.get(API_URI_QUESTIONS)
      .toPromise()
      .then(response => {
        return this.allQuestions = response;
      })
      .catch(err => err);
  }
}
