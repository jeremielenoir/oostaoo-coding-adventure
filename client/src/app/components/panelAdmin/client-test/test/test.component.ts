import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
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
  isDisabled: boolean;
  @Output() refresh = new EventEmitter();
  dataForParent: string;


  constructor(private apiClientService: ApiClientService) {
  }

  ngOnInit() {
    if (this.candidat.index_question === null) {
      this.index = 0;
    } else {
      this.index = this.candidat.index_question;
    }
    if (this.candidat.test_pause === null) {
      this.timedefault = 0;
    } else {
      this.timedefault = this.candidat.test_pause;
    }

    this.questions = this.questionCampaign;
    this.question = this.questionCampaign[this.index];
    this.timeDanger = this.questionCampaign[0].time - 5;
    this.Countertime();

    this.controleTimeTest();

    // console.log('techno id', this.technoCampaign);
    // FIRST QUESTIONS
    if (this.question.content === null) {
      this.responses = [];
    } else {
      this.responses = this.question.content.split(', ');
    }
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
    this.arrayGoodRep = this.question.answer_value.split(', ').sort();
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
    console.log('this.questions[this.index] : ', this.questions[this.index]);
    this.stopTimeInterval = setInterval(() => {
      if (this.timedefault < this.questions[this.index].time) {
        this.timedefault++;
      } else {
        this.disableRep(this.questions[this.index].time);
        console.log('temps FINI');
        console.log(this.responseUser);
        this.Activetime = !this.Activetime;
        clearInterval(this.stopTimeInterval);
      }
    }, 1000);
  }

  public QuestNext() {
    this.counterTotal++; // counter total questions

    this.checkRep();
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
        console.log('this.CalculTimeTotal: ', this.CalculTimeTotal);
        this.postTimeTest(this.CalculTimeTotal);
      }
    }
    this.question = this.questions[this.index];
    // console.log('this.question: ', this.question); // afficher
    // NEXT QUESTIONS
    if (this.question.content !== null) {
      this.responses = this.question.content.split(', ');
    } else {
      this.responses = this.question;
    }
    this.arrayGoodRep = this.question.answer_value.split(', ').sort();
    // console.log('this.arrayGoodRep: ', this.arrayGoodRep);
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
    this.isDisabled = false;
    console.log('Ton score est de: ' + this.counterCheck + ' / ' + this.counterTotal);
    console.log('this.questions[this.index].time: ', this.questions[this.index].time);
  }

  checkRep() {
    const dateEndQuestion = new Date();
    console.log('dateEndQuestion: ', dateEndQuestion);
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
      if (this.responseUser === null || this.responseUser === undefined) {
        this.arrayReponseUser.push(this.responseUser);
      } else {
        this.arrayReponseUser.push(this.responseUser.toLowerCase().trim());
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
  }

  disableRep(timeQuestion) {
    if (timeQuestion === this.timedefault) {
      this.isDisabled = true;
    }
  }

  controleTimeTest() {
    let dateNow;
    let dateServeur;
    let dateDiff;
    let diffSeconds;
    let timePuaseDiff;

    if (this.candidat.date_pause !== this.candidat.invitation_date) {
      dateNow = new Date();
      dateServeur = new Date(this.candidat.date_pause);
      dateDiff = dateNow - dateServeur;
      diffSeconds = Math.floor(dateDiff / 1e3); // diff date by seconds
      timePuaseDiff = this.candidat.test_pause + diffSeconds;
      if (this.question.time < timePuaseDiff) {
        this.QuestNext();
      } else {
        this.timedefault = timePuaseDiff;
      }
    }
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
          this.refreshComponent();
        });
      });
    });
  }

  postPauseTest() {
    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      index_question: this.index,
      test_pause: this.timedefault,
      date_pause: new Date().toISOString()
    }).toPromise().then(res => {
      console.log('pause: ', res);
    });
  }

  refreshComponent() {
    this.refresh.emit(this.dataForParent = 'fin');
  }

  @HostListener('window:beforeunload', ['$event'])
  // work only if Press F5 or cancel close window
  beforeunloadHandler($event) {
    // console.log(this.timedefault);
    console.log($event.isTrusted);
    $event.returnValue = 'Are you sure?';
    this.postPauseTest();
  }
  @HostListener('window:unload', ['$event'])
  sendData() {
    this.postPauseTest();
  }
}
