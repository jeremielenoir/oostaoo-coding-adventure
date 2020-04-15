import { Component, OnInit, Input, HostListener, Output, EventEmitter, Inject } from '@angular/core';
import { ApiClientService, API_URI_CANDIDATS, API_URI_CAMPAIGNS, API_URI_NOTIFICATIONS } from '../../../../api-client/api-client.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {SelectedLanguageService} from '../../../../services/selected-language.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
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
  @Input() public durationMaxTest: number;
  @Input() public prev: boolean;
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
  public checkTimeDefault = false;
  public jsonRapport = {
    rapport: []
  };
  public sumPointsbyTechno = [];
  public SumPointsCandidat = [];
  public allPointsTechnos;
  public allPointsCandidat;
  public totalPoints;
  public totalPointsCampaign;
  public totalPointsCandidat;
  public dataInfoLanguageName:any = '';
  public dataInfoLanguageContent:any = ''


  // Input algo
  public langLower: string;
  public  filetype: any;
  public filename: any;
  public options: any;

  constructor(private apiClientService: ApiClientService,public languageStorage:SelectedLanguageService) {}

  ngOnInit() {

    switch(this.languageStorage.getLanguageCountry()){
      case 'es-ES':
        this.dataInfoLanguageName =  'name_es';
        this.dataInfoLanguageContent = 'content_es';
      break;
      case 'fr-FR':
        this.dataInfoLanguageName =  'name';
        this.dataInfoLanguageContent = 'content';
      break;
      case 'en-US':
        this.dataInfoLanguageName =  'name_en';
        this.dataInfoLanguageContent = 'content_en';
      break;
      case 'jp-JP':
        this.dataInfoLanguageName =  'name_jp';
        this.dataInfoLanguageContent = 'content_jp';
      break;
    }

    if(this.prev){
      this.prev = true;
    }else{
      this.prev = false;
    }
      this.sumPointsByNumTechno(this.questionCampaign);
    if (this.sumPointsbyTechno) {
      this.allPointsTechnos = this.sumPointsbyTechno;
    }
    this.calculTotalPoints(this.allPointsTechnos);
    if (this.totalPoints) {
      this.totalPointsCampaign = this.totalPoints;
    }
    if(this.candidat){
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
    }else{
      this.candidat = {
        campaign : {
          copy_paste : false
        }
      }
      this.index = 0;
    }

    this.questions = this.questionCampaign;
    this.question = this.questionCampaign[this.index];
    console.log('this.question : ', this.question);
    this.timeDanger = this.questionCampaign[0].time - 5;
    this.type = this.questionCampaign[0];
    this.Countertime();
    if(!this.prev){
      this.controleTimeTest();
    }
    if (this.question[this.dataInfoLanguageContent] === null) {
      this.responses = [];
      console.log(' tu est null ')
    } else {
      console.log(' tu est pas null ',this.dataInfoLanguageContent)
      this.responses = this.question[this.dataInfoLanguageContent].split(', ');
    }
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
        this.langLower = this.language.toLowerCase();

        if(this.langLower === 'java' || this.langLower === 'java/j2ee' || this.langLower === 'spring' || this.langLower === 'android') {
        this.filetype = `application/java`;
        this.filename = `Main.java`;
        this.options = { theme: 'vs-white', language: 'java' };
        }

        if(this.langLower === 'kotlin') {
          this.filetype = `application/kotlin`;
          this.filename = `Main.kt`;
          this.options = { theme: 'vs-white', language: 'kotlin' };
          }

        if(this.langLower === 'c') {
          this.filetype = `application/c`;
          this.filename = `Main.c`;
          this.options = { theme: 'vs-white', language: 'c' };
        }

        if(this.langLower === 'c++') {
          this.filetype = `application/cpp`;
          this.filename = `Main.cpp`;
          this.options = { theme: 'vs-white', language: 'cpp' };
        }

        if(this.langLower === 'python') {
          this.filetype = `application/python`;
          this.filename = `Main.py`;
          this.options = { theme: 'vs-white', language: 'python' };
        }

        if(this.langLower === 'javascript' || this.langLower === 'angular 2+' || this.langLower === 'angularjs' || this.langLower === 'react' || this.langLower === 'vuejs') {
          this.filetype = `application/javascript`;
          this.filename = `Main.js`;
          this.options = { theme: 'vs-white', language: 'javascript' };
        }

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
    this.stopTimeInterval = setInterval(() => {
      if (this.timedefault < this.questions[this.index].time) {
        this.timedefault++;
      } else {
        this.checkTimeDefault = true;
        this.disableRep(this.questions[this.index].time);
        this.checkRep();
        this.Activetime = !this.Activetime;
        clearInterval(this.stopTimeInterval);
      }
    }, 1000);
  }

  public QuestNext() {
    this.counterTotal++; // counter total questions
    if (this.checkTimeDefault === false) {
      this.arrayGoodRep = this.question.answer_value.split(', ').sort();
      this.checkRep();
    }
  
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
        clearInterval(this.stopTimeInterval);
        for (const nbrtime of this.Alltime) {
          this.CalculTimeTotal += nbrtime;
        }
        this.postTimeTest(this.CalculTimeTotal);
      }
    }

    this.question = this.questions[this.index];
    if (this.question[this.dataInfoLanguageContent] !== null) {
      this.responses = this.question[this.dataInfoLanguageContent].split(', ');
    } else {
      this.responses = this.question;
    }
    this.arrayGoodRep = this.question.answer_value.split(', ').sort();
    for (const techno of this.technoCampaign) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }
    this.timeDanger = this.questions[this.index].time - 5;
    this.responseUser = null;
    this.arrayReponseUser = [];
    this.isDisabled = false;
    this.checkTimeDefault = false;
  }

  checkRep() {
    if (this.questions[this.index].type === 'one') {
      this.arrayReponseUser.push(this.responseUser);
      console.log(this.arrayReponseUser);
      if (this.arrayGoodRep.sort().toString() === this.arrayReponseUser.sort().toString()) {
        console.log('ITS OK !!');
        this.counterCheck++;
        this.sumPointsByRepCandidat(this.questions[this.index].technologies, this.questions[this.index].points);
      } else {
        this.sumPointsByRepCandidat(this.questions[this.index].technologies, 0);
        console.log('NOT OK !!');
      }
    }
    if (this.questions[this.index].type === 'free') {
      // console.log('typeFREE');
      if (this.responseUser === null || this.responseUser === undefined) {
        this.arrayReponseUser.push(this.responseUser);
      } else {
        this.arrayReponseUser.push(this.responseUser.toLowerCase().trim());
      }
      // console.log('this.arrayReponseUser IN FREE: ', this.arrayReponseUser);
      if (this.arrayReponseUser.every(reps => this.arrayGoodRep.includes(reps))) {
        console.log('item ok !');
        this.counterCheck++;
        this.sumPointsByRepCandidat(this.questions[this.index].technologies, this.questions[this.index].points);
      } else {
        this.sumPointsByRepCandidat(this.questions[this.index].technologies, 0);
        console.log('item not ok !');
      }
    }
    if (this.questions[this.index].type === 'multiple') {
      // console.log('typeMULTIPLE');
      if (this.arrayGoodRep.sort().toString() === this.arrayReponseUser.sort().toString()) {
        console.log('ITS OK !!');
        this.counterCheck++;
        this.sumPointsByRepCandidat(this.questions[this.index].technologies, this.questions[this.index].points);
      } else {
        this.sumPointsByRepCandidat(this.questions[this.index].technologies, 0);
        console.log('NOT OK !!');
      }
    }
    this.postRapportCandidat();
    // console.log(' this.arrayReponseUser : ', this.arrayReponseUser);
  }


  disableRep(timeQuestion) {
    if (timeQuestion === this.timedefault) {
      this.isDisabled = true;
    }
  }

  public fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d/3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }

  onReady(){
    console.log("onReady mark-down")
  }
  postTimeTest(dureeTest) {
    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      duree: dureeTest,
      test_terminer: this.dateFinishTest
    }).toPromise().then(res => {
      this.apiClientService.get(API_URI_CAMPAIGNS + '/' + res.campaign.id).subscribe(res1 => {
        let nbCandidats = res1.NbCandidatFinish;
        if (nbCandidats == null) {
          nbCandidats = 1
        } else {
          nbCandidats = nbCandidats + 1
        }
        this.apiClientService.put(API_URI_CAMPAIGNS + '/' + res.campaign.id, {
          NbCandidatFinish: nbCandidats
        }).subscribe(res2 => {
          this.refreshComponent();
          this.sumPointsByNumTechno(this.SumPointsCandidat);
          this.allPointsCandidat = this.sumPointsbyTechno;
          this.calculTotalPoints(this.allPointsCandidat);
          if (this.totalPoints) {
            this.totalPointsCandidat = this.totalPoints;
          }
          console.log('this.totalPointsCandidat: ', this.totalPointsCandidat);
          let getPourcent;
          const objectGetpourcent = [];
          for (const pointsTechno of this.allPointsTechnos) {
            for (const pointsCandidat of this.allPointsCandidat) {
              if (pointsTechno.technologies === pointsCandidat.technologies) {
                if (pointsCandidat.points === null) {
                  getPourcent = 0;
                } else {
                  getPourcent = Math.round(pointsCandidat.points / pointsTechno.points * 100);
                }
                objectGetpourcent.push({
                  techno: pointsTechno.technologies,
                  percentage: getPourcent
                });
              }
            }
          }
         
          const getPourcentTest = Math.round((this.totalPointsCandidat.total_points
            || this.totalPointsCandidat.points) / (this.totalPointsCampaign.total_points || this.totalPointsCampaign.points) * 100);
          console.log('test SUM TOTAL OF THE TEST', getPourcentTest);
        
          const newOBjectToPostCandidat = [
            { allPointsTechnos: this.allPointsTechnos },
            { allPointsCandidat: this.allPointsCandidat },
            { getpourcentByCandidat: objectGetpourcent },
            { totalPointsCandidat: this.totalPointsCandidat.total_points || this.totalPointsCandidat.points },
            { totalPointsCampaign: this.totalPointsCampaign.total_points || this.totalPointsCampaign.points },
            { PourcentTest: getPourcentTest }
          ];
          this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
            points_candidat: newOBjectToPostCandidat
          }).toPromise();
          this.apiClientService.post(API_URI_NOTIFICATIONS, {
            title: "Un candidat viens de finir le test \"" + res.campaign.Name + "\"",
            message: "Le rapport d'évaluation de \"" + this.candidat.Nom + "\" est disponible.",
            status: false,
            user: res.campaign.user,
            idCampaign: res.campaign.id
          }).toPromise().then(resolve => {
            console.log("SUCCESS POST NOTIF ", resolve);
          }).catch(reject => {
            console.log("ERROR POST NOTIF ", reject);
          });
        });
      });
    });
  }

  controleTimeTest() {
    let dateNow;
    let dateServeur;
    let dateDiff;
    let diffSeconds;
    let timePauseDiff;

    if (this.candidat.date_pause !== this.candidat.invitation_date) {
      dateNow = new Date();
      dateServeur = new Date(this.candidat.date_pause);
      dateDiff = dateNow - dateServeur;
      diffSeconds = Math.floor(dateDiff / 1e3); // diff date by seconds
      timePauseDiff = this.candidat.test_pause + diffSeconds;
      if (this.question.time < timePauseDiff) {
        this.checkTimeDefault = true;
        this.QuestNext();
      } else {
        this.timedefault = timePauseDiff;
      }
    }
  }

  postPauseTest() {
    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      index_question: this.index,
      test_pause: this.timedefault,
      date_pause: new Date().toISOString()
    }).toPromise().then(res => {
     
    });
  }


  postRapportCandidat() {
    const myReps = this.arrayReponseUser;
    const myTime = this.timedefault;
    const myQuestion = this.question;
    this.apiClientService.get(API_URI_CANDIDATS + '/' + this.candidat.id).toPromise().then(res => {
      if (res.raport_candidat !== null) {
        this.jsonRapport = res.raport_candidat;
      }
      this.jsonRapport.rapport.push({
        index_question: myQuestion, // JSON to PDF and rapport candidat
        array_rep_candidat: myReps,
        timeRep: myTime
      });
      // console.log('this.jsonRapport : ', this.jsonRapport);
      this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
        raport_candidat: this.jsonRapport
      }).toPromise().then(res1 => {
        // console.log(res1);
      });
    });
  }

  sumPointsByNumTechno(array) {
    console.log('array : ', array);
    const sumPoints = {};
    array.forEach(element => {
      // console.log( 'element from ARRAY SUMPOINTS : ', element);
      if (sumPoints.hasOwnProperty(element.technologies)) {
        sumPoints[element.technologies] = sumPoints[element.technologies] + element.points;
        // console.log('sumPoints[element.technologies]: ', sumPoints[element.technologies]);
      } else {
        sumPoints[element.technologies] = element.points;
        // console.log('sumPoints[element.technologies] = element.points: ', sumPoints[element.technologies]);
      }
    });
    const arraySumPoints = [];
    console.log('sumPoints : ', sumPoints);
    for (const [key, value] of Object.entries(sumPoints)) {
      arraySumPoints.push({
        technologies: key,
        points: value
      });
    }
    // console.log('arraySumPoints : ', arraySumPoints);
    console.log('this.technoCampaign : ', this.technoCampaign);
    for (const techno of this.technoCampaign) {
      for (const technoArray of arraySumPoints) {
        if (techno.id === Number(technoArray.technologies)) {
          technoArray.technologies = techno.name;
        }
      }
    }
    return this.sumPointsbyTechno = arraySumPoints;
  }

  sumPointsByRepCandidat(techno, point) {
    // console.log('techno : ', techno);
    // console.log('point : ', point);
    this.apiClientService.get(API_URI_CANDIDATS + '/' + this.candidat.id).toPromise().then(res => {
      if (res.points_candidat !== null) {
        this.SumPointsCandidat = res.points_candidat;
      }
      this.SumPointsCandidat.push({
        technologies: techno,
        points: point
      });
      this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
        points_candidat: this.SumPointsCandidat
      }).toPromise().then(res1 => {

      });
    });
  }

  calculTotalPoints(array) {
    // console.log('CALCUL TOTAL POINTS : ', array);
    if (typeof array !== 'undefined' && array.length > 0) {
      this.totalPoints = array.reduce((a, b) => ({ total_points: a.points + b.points }));
    }
  }

  refreshComponent() {
    this.refresh.emit(this.dataForParent = 'fin');
  }

  @HostListener('window:beforeunload', ['$event'])
  // work only if Press F5 or cancel close window
  beforeunloadHandler($event) {
    $event.returnValue = 'Are you sure?';
    this.postPauseTest();
    this.controleTimeTest();
  }
  @HostListener('window:unload', ['$event'])
  sendData() {
    this.postPauseTest();
  }
}
