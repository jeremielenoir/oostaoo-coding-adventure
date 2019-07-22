import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  ApiClientService,
  API_URI_QUESTIONS
} from "../../../../api-client/api-client.service";
@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.css"]
})
export class TestComponent implements OnInit {
  public questions: any;
  public index = 0;
  public question: any;
  public timedefault = 0;
  public stopTimeInterval: any;
  public Activetime: boolean;
  public timeDanger: number;
  public type:string;
  public free = 'free';
  public multiple = 'multiple';
  public one = 'one'


  constructor(private apiClientService: ApiClientService) { }

  ngOnInit() {
    this.apiClientService.get(API_URI_QUESTIONS).subscribe(datas => {
      this.questions = datas;
      this.question = datas[0];
      this.timeDanger = datas[0].time - 5;
      this.type =  datas[0];
      console.log('type: ', this.type)
      this.Countertime();
    });
  }

  // }

  Countertime() {
    this.stopTimeInterval = setInterval(() => {
      if (this.timedefault < this.questions[this.index].time) {
        this.timedefault++;
      } else {
        this.Activetime = !this.Activetime;
        clearInterval(this.stopTimeInterval);
      }
    }, 1000);
  }

  public QuestNext() {

    this.Activetime = false;

    if (this.index < this.questions.length - 1) {
      this.index++;
      this.timedefault = 0;
      clearInterval(this.stopTimeInterval);
      this.Countertime();

    } else {

      if (this.index === this.questions.length - 1) {

        clearInterval(this.stopTimeInterval);

        console.log('question terminé');

      }

    }

    this.question = this.questions[this.index];

    this.timeDanger = this.questions[this.index].time - 5;
   
    console.log('type ',this.question.type)
  
  }

  public fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  }

   
}


