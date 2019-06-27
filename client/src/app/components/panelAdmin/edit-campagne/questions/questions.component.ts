import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_QUESTIONS
} from '../../../../api-client/api-client.service';

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

  constructor(private route: ActivatedRoute,  public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      console.log('data', this.globalId);
    });
   }

  ngOnInit() {
    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .subscribe(datas => {
        this.campaing = datas;
        this.questions = datas.questions;
        console.log('campaign', this.campaing);
        console.log('question of campaign: ', this.questions);
        // for (const  question of this.campaing[0]) {
        //   console.log(question);
        // }
        for (const idTechno of this.campaing.technologies) {
        console.log('idTechno from campaign: ', idTechno.id);
        }
      });
    this.apiClientService.get(API_URI_QUESTIONS).subscribe(datas => {
        this.allQuestions = datas;
        for (const data of datas) {
          console.log('id techno from question: ', data.technologies);
        }
      });
  }
}
