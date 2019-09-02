import { Component, OnInit, Input } from '@angular/core';
import { ApiClientService, API_URI_CANDIDATS, API_URI_CAMPAIGNS } from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public questions: any;
  public index = 0;
  public question: any;
  public timedefault = 0;
  public stopTimeInterval: any;
  public Activetime: boolean;
  public timeDanger: number;
  public type: string;
  public Alltime: number[] = [];
  public CalculTimeTotal = 0;
  @Input() public questionCampaign: any;
  @Input() public technoCampaign: any;
  @Input() public candidat: any;
  public language: string;
  public dateFinishTest: any;
  public responses: Array<string>;
  public responseUser: string;
  public counterCheck = 0; // counter good response
  public counterTotal = 0;
  public arrayReponseUser: Array<string> = [];
  public arrayGoodRep: Array<string> = [];


  constructor(private apiClientService: ApiClientService) { }

  ngOnInit() {
    this.questions = this.questionCampaign;
    this.question = this.questionCampaign[this.index];
    this.timeDanger = this.questionCampaign[0].time - 5;
    this.type = this.questionCampaign[0];
    console.log('this.type: ', this.type);
    this.Countertime();
    // console.log('techno id', this.technoCampaign);
    // FIRST QUESTIONS
    if (this.question.content !== null) {
      this.responses = this.question.content.split(', ');
    }
    // console.log('this.responses: ', this.responses);
    // console.log('this.question: ', this.question);
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
    this.arrayGoodRep = this.question.answer_value.split(', ').sort();
    console.log('arrayGoodRep: ', this.arrayGoodRep);
  }

  checkCheckBoxvalue(event) {
    if (event.source.checked) {
      this.arrayReponseUser.push(event.source.value);
    } else {
      const element = this.arrayReponseUser.find(item => item === event.source.value);
      if (element) {
        this.arrayReponseUser.splice(this.arrayReponseUser.indexOf(element), 1);
      }
    }
  }

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
    this.counterTotal++; // counter total questions
    if (this.questions[this.index].type === 'one') {
      console.log('typeONE');
      this.arrayReponseUser.push(this.responseUser);
      if (this.arrayGoodRep.sort().toString() === this.arrayReponseUser.sort().toString()) {
        console.log('ITS OK !!');
        this.counterCheck++;
      } else {
        console.log('NOT OK !!');
      }
    }
    if (this.questions[this.index].type === 'free') {
      console.log('typeFREE');
      if (this.responseUser !== null) {
        this.arrayReponseUser.push(this.responseUser.toLowerCase().trim());
      } else {
        this.arrayReponseUser.push(this.responseUser);
      }
      console.log('this.arrayReponseUser IN FREE: ', this.arrayReponseUser);
      if (this.arrayReponseUser.every(reps => this.arrayGoodRep.includes(reps))) {
        console.log('item ok !');
        this.counterCheck++;
      }
    }
    if (this.questions[this.index].type === 'multiple') {
      console.log('typeMULTIPLE');
      if (this.arrayGoodRep.sort().toString() === this.arrayReponseUser.sort().toString()) {
        console.log('ITS OK !!');
        this.counterCheck++;
      } else {
        console.log('NOT OK !!');
      }
    }
    // this.arrayReponseUser.push(this.responseUser);
    // console.log('this.arrayReponseUser IN QUESTNEXT: ', this.arrayReponseUser);


    this.Alltime.push(this.timedefault);
    this.Activetime = false;
    if (this.index < this.questions.length - 1) {
      this.index++;
      this.timedefault = 0;
      clearInterval(this.stopTimeInterval);
      this.Countertime();
    } else {
      if (this.index === this.questions.length - 1) {
        this.dateFinishTest = new Date().toISOString();
        // console.log('testdate: ', this.dateFinishTest);
        clearInterval(this.stopTimeInterval);
        for (const nbrtime of this.Alltime) {
          // console.log('chaque temp passe sur chaque question', nbrtime);
          this.CalculTimeTotal += nbrtime;
        }
        // console.log('this.CalculTimeTotal: ', this.CalculTimeTotal);
        // this.postTimeTest(this.CalculTimeTotal);
      }
    }
    this.question = this.questions[this.index];
    console.log('this.question: ', this.question);
    // NEXT QUESTIONS
    if (this.question.content !== null) {
      this.responses = this.question.content.split(', ');
    } else {
      this.responses = this.question;
    }
    this.arrayGoodRep = this.question.answer_value.split(', ').sort();
    console.log('this.arrayGoodRep: ', this.arrayGoodRep);
    // console.log('this.responses in QUESTNEXT: ', this.responses);
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
    // this.arrayGoodRep = this.question.answer_value.split(', ').sort();
    // console.log('arrayGoodRep: ', this.arrayGoodRep);
    this.timeDanger = this.questions[this.index].time - 5;
    // console.log('type ', this.question.type);
    // console.log('COUNTER CHECK: ', this.counterCheck);
    this.responseUser = null;
    this.arrayReponseUser = [];
    console.log('Ton score est de: ' + this.counterCheck + ' / ' + this.counterTotal);
  }

  public fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  }

  postTimeTest(dureeTest) {
    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      duree: dureeTest,
      test_terminer: this.dateFinishTest
    }).toPromise().then(res => {
      console.log('succes time send');
      this.apiClientService.get(API_URI_CAMPAIGNS + '/' + res.campaign.id).subscribe(res1 => {
        console.log('campaign : ', res1);
        const nbCandidats = res1.NbCandidatFinish;
        console.log(nbCandidats);
        this.apiClientService.put(API_URI_CAMPAIGNS + '/' + res.campaign.id, {
          NbCandidatFinish: nbCandidats + 1
        }).subscribe(res2 => {
          console.log('campaign : ', res2);
        });
      });
    });
  }
}
