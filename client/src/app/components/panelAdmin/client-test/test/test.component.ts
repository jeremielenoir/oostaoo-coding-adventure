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


  constructor(private apiClientService: ApiClientService) { }

  ngOnInit() {
    this.questions = this.questionCampaign;
    this.question = this.questionCampaign[this.index];
    this.timeDanger = this.questionCampaign[0].time - 5;
    this.type = this.questionCampaign[0];
    this.Countertime();
    console.log('question id', this.technoCampaign);
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
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
        console.log('testdate: ', this.dateFinishTest);
        clearInterval(this.stopTimeInterval);
        for (const nbrtime of this.Alltime) {
          console.log('chaque temp passe sur chaque question', nbrtime);
          this.CalculTimeTotal += nbrtime;
        }
        console.log('this.CalculTimeTotal: ', this.CalculTimeTotal);
        this.postTimeTest(this.CalculTimeTotal);
      }
    }
    this.question = this.questions[this.index];
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
    this.timeDanger = this.questions[this.index].time - 5;
    console.log('type ', this.question.type);
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


