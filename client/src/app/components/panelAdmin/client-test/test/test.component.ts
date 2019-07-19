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
  public timeClearInterval: any;
  public Activetime: boolean;


  constructor(private apiClientService: ApiClientService) { }

  ngOnInit() {
    console.log(this.index);
    this.apiClientService.get(API_URI_QUESTIONS).subscribe(datas => {
      this.questions = datas;
      this.question = datas[0];
      this.Countertime();
    });



  }

  // ngAfterContentInit() {

  // }

  Countertime() {
    this.timeClearInterval = setInterval(() => {
      if (this.timedefault < this.questions[this.index].time) {
        this.timedefault++;
        // console.log(this.fmtMSS(this.timedefault));
      } else {
        this.Activetime = !this.Activetime;
        clearInterval(this.timeClearInterval);
      }
    }, 1000);
  }

  public QuestNext() {
    this.Activetime = false;

    if (this.index < this.questions.length - 1) {
      this.index++;

      this.timedefault = 0;
      clearInterval(this.timeClearInterval);
      this.Countertime();
    }
    this.question = this.questions[this.index];

    //  console.log(this.this.questions[this.index].time)
  }

  public fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
  }

}


