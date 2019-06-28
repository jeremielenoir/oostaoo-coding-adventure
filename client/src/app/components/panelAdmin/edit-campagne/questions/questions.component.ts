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
  public questions;
  public allQuestions;

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

  constructor(private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
    });
  }

  ngOnInit() {
    const questionTechnoAllData = [];
    const questionTechnoCampaign = [];
    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .subscribe(datas => {
        this.campaing = datas;
        this.questions = datas.questions;
        console.log('campaign', this.campaing);
        // console.log('question of campaign: ', this.questions);
        // for (const  question of this.campaing[0]) {
        //   console.log(question);
        // }
        for (const idTechno of this.campaing.technologies) {
          // console.log('idTechno from campaign: ', idTechno.id);
          // console.log('Techno from campaign: ', idTechno); 
          questionTechnoCampaign.push(idTechno);
        }
      });
    this.apiClientService.get(API_URI_QUESTIONS).subscribe(datas => {
      this.allQuestions = datas;
      for (const data of datas) {
        questionTechnoAllData.push(data);
      }
    });
    setTimeout(()=>{
      console.log('question Techno all Data: ', questionTechnoAllData);
    }, 1000)
    // setTimeout(() => {
    //   // console.log('question Techno Campaing: ', questionTechnoCampaign);
    //   console.log('question Techno all Data: ', questionTechnoAllData);
    //   for (const technoCampaing of questionTechnoCampaign) {
    //     console.log('techno id: ', technoCampaing.id);
    //   }
    //   // if (questionTechnoCampaign[0].id === 3) {
    //   //   console.log('check idquestion in campaigns: ', true);
    //   //   console.log('question :', questionTechnoCampaign);
    //   // }
    //   // for (const questionTechno of questionTechnoCampaign) {
    //   //   console.log('quesstiontechno : ', questionTechno);
    //   // console.log(questionTechnoAllData.includes(questionTechno));
    //   // }
    // }, 1000);
  }
}
