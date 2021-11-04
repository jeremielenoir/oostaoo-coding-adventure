import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_NOTIFICATIONS,
  ApiClientService,
  QUESTION_SEPARATOR,
} from '../../../../api-client/api-client.service';
import { SelectedLanguageService } from '../../../../services/selected-language.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogOverviewTestComponent } from '../../dragndrop/dragndrop.component';
import { AlgoComponent } from '../../questions-type/algo-type/algo.component';

export interface IDialogData {
  preview: boolean;
}

@Component({
  selector: 'app-dialog-timeout',
  templateUrl: 'dialog-timeout.html',
})

export class DialogTimeoutComponent implements OnInit {
  @Output("nextQuestion") public nextQuestion = new EventEmitter<void>();
  dataPopup: any;
  public prev: boolean = false;
  
  
  constructor(public dialogRef: MatDialogRef<DialogTimeoutComponent>, @Inject(MAT_DIALOG_DATA) public data: IDialogData) {

    if (data) {
      this.dataPopup = data;
      this.prev = true;
    }
  }


  ngOnInit() {
    console.log('this.dataPopup : ', this.dataPopup);
  }

  refreshComponent($event): void {
    console.log('REFRESH COMPONENT');
  }

  public next() {
    this.nextQuestion.emit();
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-test',
  styleUrls: ['./test.component.scss'],
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit, OnDestroy {
  @Input() public candidat: Record<string, any>;
  @Input() public questions: Record<string, any>[];
  @Input() public technologies: Record<string, any>[];
  @Input() public durationMaxTest: number;
  @Input() public preview: boolean;
  @Output() public refresh = new EventEmitter();
  public question: Record<string, any>; // done
  public currentIdxQuestions: number = 0; // done
  public stopwatch: number = 0; // done
  private stopwatchId: NodeJS.Timer; // done

  public activetime: boolean;
  public fewSecondsLeft: number = 0; // done

  private totalElapsedTime: number = 0; // done
  public language: string; // done
  private testFinishedAt: string; // done
  
  public choiceOfAnswers: string[]; // done
  public candidatAnswer: string = ''; // done

  public correctAnswerCounter: number = 0; // done
  public totalAnswerCounter: number = 0; // done
  
  private candidatAnswers: string[] = []; // done
  private correctAnswers: string[] = []; // done

  public isDisabled: boolean; // done

  public dataForParent: string;
  public checkTimeDefault: boolean = false;
  private jsonRapport = { rapport: [] };
  
  public sumPointsbyTechno = [];
  public SumPointsCandidat = [];
  
  public allPointsTechnos;
  public allPointsCandidat;
  public totalPoints;

  public totalPointsCampaign;
  public totalPointsCandidat;
  
  public dataInfoLanguageName: string = 'name'; // done
  public dataInfoLanguageContent: string = 'content'; // done
  private readonly separator: string = QUESTION_SEPARATOR; // done

  // Input algo
  public filetype: string;
  public filename: string;
  public options: Record<string, string>;

  constructor(private apiClientService: ApiClientService, public languageStorage: SelectedLanguageService, public dialog: MatDialog) { }

  ngOnInit() {

    switch (this.languageStorage.getLanguageCountry()) {
      case 'es-ES':
        this.dataInfoLanguageName = 'name_es';
        this.dataInfoLanguageContent = 'content_es';
        break;
      case 'en-US':
        this.dataInfoLanguageName = 'name_en';
        this.dataInfoLanguageContent = 'content_en';
        break;
      case 'jp-JP':
        this.dataInfoLanguageName = 'name_jp';
        this.dataInfoLanguageContent = 'content_jp';
        break;
      // case 'fr-FR':
      //   this.dataInfoLanguageName = 'name';
      //   this.dataInfoLanguageContent = 'content';
      //   break;
      default:
        this.dataInfoLanguageContent = 'content';
        this.dataInfoLanguageName = 'name';
    }

    this.sumPointsbyTechno = this.sumPointsByTechnologyId(this.questions);

    this.allPointsTechnos = this.sumPointsbyTechno;

    this.totalPoints = this.calculTotalPoints(this.allPointsTechnos);

    if (this.totalPoints) this.totalPointsCampaign = this.totalPoints;

    if (this.candidat) {
      if (this.candidat.index_question) this.currentIdxQuestions = this.candidat.index_question;

      if (this.candidat.test_pause) this.stopwatch = this.candidat.test_pause;
    } else {
      this.candidat = { campaign: { copy_paste: false } };
    }

    this.question = this.questions[this.currentIdxQuestions];


    this.fewSecondsLeft = this.questions[0].time - 5;


    if (!this.preview) {
      this.Countertime();
      this.controleTimeTest();
    }


    this.choiceOfAnswers = this.question[this.dataInfoLanguageContent].split(this.separator);

    for (const techno of this.technologies) {
      if (this.question.technologies.id === techno.id) {
        this.language = techno.name.toLowerCase();
        
        if (this.language === 'java' || this.language === 'java/j2ee' || this.language === 'spring' || this.language === 'android') {

          this.filetype = `application/java`;
          this.filename = `Main.java`;
          this.options = { theme: 'vs-white', language: 'java' };

        } else if (this.language === 'kotlin') {
          this.filetype = `application/kotlin`;
          this.filename = `Main.kt`;
          this.options = { theme: 'vs-white', language: 'kotlin' };

        } else if (this.language === 'c') {
          this.filetype = `application/c`;
          this.filename = `Main.c`;
          this.options = { theme: 'vs-white', language: 'c' };

        } else if (this.language === 'c++') {
          this.filetype = `application/cpp`;
          this.filename = `Main.cpp`;
          this.options = { theme: 'vs-white', language: 'cpp' };

        } else if (this.language === 'python') {
          this.filetype = `application/python`;
          this.filename = `Main.py`;
          this.options = { theme: 'vs-white', language: 'python' };


        } else if (this.language === 'go') {
          this.filetype = `application/go`;
          this.filename = `Main.go`;
          this.options = { theme: 'vs-white', language: 'go' };

        } else if (this.language === 'javascript' || this.language === 'angular 2+' || this.language === 'angularjs' || this.language === 'react' || this.language === 'vuejs') {

          this.filetype = `application/javascript`;
          this.filename = `Main.js`;
          this.options = { theme: 'vs-white', language: 'javascript' };
        }
      }
    }

    this.correctAnswers = this.question.answer_value.split(this.separator).sort();
  }

  ngOnDestroy() {
    clearInterval(this.stopwatchId);
  }

  public openDialogTimeout(preview: boolean = true): void {
    const dialogRef = this.dialog.open(DialogTimeoutComponent, {
      data: { preview: preview },
      height: 'auto',
      width: '50%',
      autoFocus: false,
    });

    
    dialogRef.componentInstance.nextQuestion.subscribe(() => this.nextQuestion());
    

    dialogRef.afterClosed().subscribe();
  }

  public checkboxAnswers(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.candidatAnswers.push(checkbox.value);
    } else {

      const element: string = this.candidatAnswers.find(item => item === checkbox.value);
      
      if (element) {
        this.candidatAnswers.splice(this.candidatAnswers.indexOf(element), 1);
      }
    }
  }

  public Countertime() {
    this.stopwatchId = setInterval(() => {
      if (this.stopwatch < this.questions[this.currentIdxQuestions].time) {
        this.stopwatch++;
      } else {
        this.checkTimeDefault = true;
        
        this.disableRep(this.questions[this.currentIdxQuestions].time);
        this.verifyAnswer();
        
        this.activetime = !this.activetime;

        if (this.activetime) {
          this.openDialogTimeout(this.preview);
        }

        clearInterval(this.stopwatchId);
      }
    }, 1000);
  }

  public showTextResult() {
    console.log('VIEW RESULT');
  }

  public nextQuestion() {
    this.totalAnswerCounter++;

    if (this.checkTimeDefault === false) {
      this.correctAnswers = this.question.answer_value.split(this.separator).sort();
      this.verifyAnswer();
    }

    this.totalElapsedTime += this.stopwatch;
    

    this.activetime = false;

    if (this.currentIdxQuestions < this.questions.length - 1) {
      this.currentIdxQuestions++;
      this.stopwatch = 0;
      
      clearInterval(this.stopwatchId);
      
      this.Countertime();


    } else if (this.currentIdxQuestions === this.questions.length - 1) {
      this.testFinishedAt = new Date().toISOString();
      
      clearInterval(this.stopwatchId);

      this.postTimeTest(this.totalElapsedTime);

    }

    this.question = this.questions[this.currentIdxQuestions];

    this.choiceOfAnswers = this.question[this.dataInfoLanguageContent].split(this.separator);

    this.correctAnswers = this.question.answer_value.split(this.separator).sort();
    
    for (const techno of this.technologies) {
      if (this.question.technologies === techno.id) {
        this.language = techno.name;
      }
    }

    this.fewSecondsLeft = this.questions[this.currentIdxQuestions].time - 5;
    this.candidatAnswer = '';
    this.candidatAnswers = [];
    this.isDisabled = false;
    this.checkTimeDefault = false;
  }


  private verifyAnswer() {
    if (this.questions[this.currentIdxQuestions].type === 'one') {
      this.candidatAnswers.push(this.candidatAnswer);

      if (this.correctAnswers.sort().toString() === this.candidatAnswers.sort().toString()) {
        this.correctAnswerCounter++;
        this.sumPointsByRepCandidat(this.questions[this.currentIdxQuestions].technologies, this.questions[this.currentIdxQuestions].points);
      } else {
        this.sumPointsByRepCandidat(this.questions[this.currentIdxQuestions].technologies, 0);
      }
    }

    if (this.questions[this.currentIdxQuestions].type === 'free') {
      this.candidatAnswers.push(this.candidatAnswer.toLowerCase().trim());

      if (this.candidatAnswers.every((reps) => this.correctAnswers.includes(reps))) {
        this.correctAnswerCounter++;
        this.sumPointsByRepCandidat(this.questions[this.currentIdxQuestions].technologies, this.questions[this.currentIdxQuestions].points);
      } else {
        this.sumPointsByRepCandidat(this.questions[this.currentIdxQuestions].technologies, 0);
      }
    }

    if (this.questions[this.currentIdxQuestions].type === 'multiple') {
      if (this.correctAnswers.sort().toString() === this.candidatAnswers.sort().toString()) {
        this.correctAnswerCounter++;
        this.sumPointsByRepCandidat(this.questions[this.currentIdxQuestions].technologies, this.questions[this.currentIdxQuestions].points);
      } else {
        this.sumPointsByRepCandidat(this.questions[this.currentIdxQuestions].technologies, 0);
      }

    }

    this.postRapportCandidat();

    // console.log(' this.candidatAnwsers : ', this.candidatAnwsers);

  }

  public disableRep(timeQuestion: number) {
    this.isDisabled = timeQuestion === this.stopwatch ? true : this.isDisabled;
  }

  public fmtMSS(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    return (
      ('0' + h).slice(-2) +
      ':' +
      ('0' + m).slice(-2) +
      ':' +
      ('0' + s).slice(-2)
    );
  }

  public onReady() {
  }


  public postTimeTest(totalElapsedTime: number) {
    
    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      duree: totalElapsedTime,
      test_terminer: this.testFinishedAt,
    })
    .toPromise()
    .then((res) => {

      this.apiClientService.get(API_URI_CAMPAIGNS + '/' + res.campaign.id).subscribe((res1) => {
        const nbCandidats: number = res1.NbCandidatFinish ? res1.NbCandidatFinish + 1 : 1

        this.apiClientService.put(API_URI_CAMPAIGNS + '/' + res.campaign.id, {
          NbCandidatFinish: nbCandidats,
        }).subscribe((res2) => {
          this.refreshComponent();
          
          this.allPointsCandidat = this.sumPointsByTechnologyId(this.SumPointsCandidat);
          
          this.totalPoints = this.calculTotalPoints(this.allPointsCandidat);
          
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
                  percentage: getPourcent,
                  techno: pointsTechno.technologies,
                });
              }
            }
          }

          const getPourcentTest = Math.round((this.totalPointsCandidat.total_points ||
            this.totalPointsCandidat.points) / (this.totalPointsCampaign.total_points ||
              this.totalPointsCampaign.points) * 100);
          console.log('test SUM TOTAL OF THE TEST', getPourcentTest);

          const newOBjectToPostCandidat = [
            { allPointsTechnos: this.allPointsTechnos },
            { allPointsCandidat: this.allPointsCandidat },
            { getpourcentByCandidat: objectGetpourcent },
            { totalPointsCandidat: this.totalPointsCandidat.total_points || this.totalPointsCandidat.points },
            { totalPointsCampaign: this.totalPointsCampaign.total_points || this.totalPointsCampaign.points },
            { PourcentTest: getPourcentTest },
          ];

          this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
            points_candidat: newOBjectToPostCandidat,
          }).toPromise();

          this.apiClientService.post(API_URI_NOTIFICATIONS, {
            idCampaign: res.campaign.id,
            message: `Le rapport d'évalution de '${this.candidat.Nom}' est disponible.`,
            status: false,
            title: `Un candidat viens de finir le test '${res.campaign.Name}'.`,
            user: res.campaign.user,
          })
          .toPromise()
          .then((resolve) => console.log('SUCCESS POST NOTIF ', resolve))
          .catch((reject) => console.log('ERROR POST NOTIF ', reject));
        });

      });
  });
}


  public controleTimeTest() {
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

        this.nextQuestion();

      } else {
        this.stopwatch = timePauseDiff;
      }
    }
  }

  public postPauseTest() {

    this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
      date_pause: new Date().toISOString(),
      index_question: this.currentIdxQuestions,
      test_pause: this.stopwatch,
    }).toPromise().then();
  }

  public postRapportCandidat() {
    // const myReps = this.candidatAnswers;
    // const myQuestion = this.question;
    // const myTime = this.stopwatch;
    
    this.apiClientService.get(API_URI_CANDIDATS + '/' + this.candidat.id)
      .toPromise()
      .then(res => {
        if (res.raport_candidat) this.jsonRapport = res.raport_candidat;

        this.jsonRapport.rapport.push({
          array_rep_candidat: this.candidatAnswers,
          index_question: this.question, // JSON to PDF and rapport candidat
          timeRep: this.stopwatch,
        });

        // console.log('this.jsonRapport : ', this.jsonRapport);
        this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
          raport_candidat: this.jsonRapport,
        }).toPromise().then((res1) => {
          // console.log(res1);
        });
      });
  }

  public sumPointsByTechnologyId(questions: Record<string, any>[]): Record<string, any>[] {
    let sumPointsByTechno = {};
    
    questions.forEach((element: Record<string, any>) => {
      sumPointsByTechno[element.technologies] = sumPointsByTechno[element.technologies] ? sumPointsByTechno[element.technologies] + element.points : element.points;

      // if (sumPoints.hasOwnProperty(element.technologies)) {
      //   sumPoints[element.technologies] = sumPoints[element.technologies] + element.points;
      //   // console.log('sumPoints[element.technologies]: ', sumPoints[element.technologies]);
      // } else {
      //   sumPoints[element.technologies] = element.points;
      //   // console.log('sumPoints[element.technologies] = element.points: ', sumPoints[element.technologies]);
      // }

    });
    console.log(sumPointsByTechno);

    let arraySumPoints: Record<string, any>[] = [];
    // console.log('sumPoints : ', sumPoints);
    
    for (const [key, value] of Object.entries(sumPointsByTechno)) {
      arraySumPoints.push({ technologies: key, points: value });
    }


    // console.log('arraySumPoints : ', arraySumPoints);
    // console.log('this.technoCampaign : ', this.technologies);
    for (const techno of this.technologies) {

      for (const technoArray of arraySumPoints) {
        if (techno.id === Number(technoArray.technologies)) {
          technoArray.technologies = techno.name;
        }
      }
    }

    return arraySumPoints;
  }

  private sumPointsByRepCandidat(techno, point) {
    // console.log('techno : ', techno);
    // console.log('point : ', point);
    this.apiClientService.get(API_URI_CANDIDATS + '/' + this.candidat.id)
      .toPromise()
      .then((res) => {
        if (res.points_candidat) this.SumPointsCandidat = res.points_candidat;
      
        this.SumPointsCandidat.push({ technologies: techno, points: point });

        this.apiClientService.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
          points_candidat: this.SumPointsCandidat,
        }).toPromise().then();
      });
  }

  private calculTotalPoints(statistics: Record<string, any>[]): Record<string, any> {
    // console.log('CALCUL TOTAL POINTS : ', array);
    // if (typeof stats !== 'undefined' && stats.length > 0) {
    //   this.totalPoints = statistics.reduce((a, b) => ({ total_points: a.points + b.points }));
    // }
    return statistics.reduce((a, b) => ({ total_points: a.points + b.points }));

  }

  public refreshComponent() {
    this.refresh.emit((this.dataForParent = 'fin'));
  }

  // work only if Press F5 or cancel close window
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    $event.returnValue = 'Are you sure?';
    this.postPauseTest();
    this.controleTimeTest();
  }

  @HostListener('window:unload', ['$event'])
  public sendData() {
    this.postPauseTest();
  }
}
