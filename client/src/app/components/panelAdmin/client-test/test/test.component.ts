import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_NOTIFICATIONS,
  QUESTION_SEPARATOR,
} from '../../../../api-client/api-client.service';
import { SelectedLanguageService } from '../../../../services/selected-language.service';
import { MatCheckbox, MatDialog, MatCheckboxChange } from '@angular/material';
import { DialogTimeoutComponent } from './dialog-timeout.component';
import {
  Subscription,
  timer,
  interval,
  Observable,
  concat,
  EMPTY,
  Subject,
} from 'rxjs';
import { takeUntil, map, tap, concatMap } from 'rxjs/operators';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER } from '@angular/cdk/overlay/typings/keyboard/overlay-keyboard-dispatcher';
import { JsonService } from 'src/app/services/json/json.service';
import { CodeLanguages } from 'src/app/models/code-languages.model';

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
  @Input() public mode = 'testing'; // prevent unnecessary api call when candidat is doing tutorial
  @Output() public refresh = new EventEmitter<string>();
  @Output() public answerQuestion = new EventEmitter<string>();

  public question: Record<string, any>; // done
  public currentIdxQuestions = 0; // done
  public chronometerCurrentTime = 0; // done

  private startChronometerSubscription: Subscription;
  private answerQuestionSubscription: Subscription;

  public activetime: boolean;
  public fewSecondsLeft = 0; // done

  private totalElapsedTime = 0; // done
  public language: string; // done

  public choiceOfAnswers: string[]; // done
  public candidatAnswer = ''; // done

  public correctAnswerCounter = 0; // done

  private candidatAnswers: string[] = []; // done
  private correctAnswers: string[] = []; // done

  public isDisabled = false; // done

  public checkTimeDefault = false;
  private jsonRapport = { rapport: [] };

  public sumPointsbyTechno = [];
  public SumPointsCandidat = [];

  public allPointsTechnos;
  public allPointsCandidat;
  public totalPoints;

  public totalPointsCampaign;
  public totalPointsCandidat;

  public dataInfoLanguageName = 'name'; // done
  public dataInfoLanguageContent = 'content'; // done
  private readonly separator: string = QUESTION_SEPARATOR; // done

  // Input algo
  public filetype: string;
  public filename: string;
  public options: Record<string, string>;
  codeLanguages: CodeLanguages[];

  constructor(
    private apiClientService: ApiClientService,
    private httpClient: HttpClient,
    private jsonService: JsonService,
    public languageStorage: SelectedLanguageService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.setCurrentLanguage();

    // set points
    this.allPointsTechnos = this.sumPointsByTechnologyId(this.questions);

    this.totalPoints = this.calculTotalPoints(this.allPointsTechnos);

    if (this.totalPoints) { this.totalPointsCampaign = this.totalPoints; }

    // get candidat info and go to good question
    if (this.candidat) {
      if (this.candidat.index_question) {
        this.currentIdxQuestions = this.candidat.index_question;
      }

      if (this.candidat.test_pause) {
        this.chronometerCurrentTime = this.candidat.test_pause;
      }
    } else {
      this.candidat = { campaign: { copy_paste: false } };
    }

    const answerQuestionObserver = {
      next: (n: string) => {
        this.totalElapsedTime += this.chronometerCurrentTime;
        this.startChronometerSubscription.unsubscribe();

        this.validateAnswer().subscribe((observer) => {
          this.currentIdxQuestions++;
          if (this.currentIdxQuestions === this.questions.length) {
            // test is finish post test
            console.log('Test is finish need to post it');
            this.postTimeTest(this.totalElapsedTime).subscribe({
              next: ((res) => console.log(res)),
              complete: () => {
                this.refreshComponent();
                console.log('Test is finish and posted');
              }
            });
          } else {
            this.startChronometerSubscription = this.startQuestion(
              this.currentIdxQuestions,
            ).subscribe(chronometerObserver);
          }
        });
      },
      error: (err) =>
        console.error('answer Question Observer got an error: ' + err),
    };

    this.answerQuestionSubscription = this.answerQuestion.subscribe(
      answerQuestionObserver,
    );

    const chronometerObserver = {
      next: (n: number) => {
        this.chronometerCurrentTime++;
      },
      error: (err) =>
        console.error('Chronometer Observer got an error: ' + err),
      complete: () =>
        this.answerQuestion.emit('answer_question from chronometer'),
    };

    this.startChronometerSubscription = this.startQuestion(
      this.currentIdxQuestions,
    ).subscribe(chronometerObserver);
  }

  ngOnDestroy(): void {
    this.startChronometerSubscription.unsubscribe();
    this.answerQuestionSubscription.unsubscribe();
  }

  public startQuestion(questionIndex: number): Observable<number | string> {
    console.log('QUESTION INDEX', questionIndex);
    this.question = this.questions[questionIndex];
    this.chronometerCurrentTime = 0;
    this.setCurrentQuestionTechnology();

    this.fewSecondsLeft = this.questions[this.currentIdxQuestions].time - 5;

    this.choiceOfAnswers = this.question[this.dataInfoLanguageContent].split(
      this.separator,
    );

    this.correctAnswers = this.question.answer_value
      .split(this.separator)
      .sort();

    this.candidatAnswer = '';
    this.candidatAnswers = [];
    this.isDisabled = false;

    const chronometer = interval(1000).pipe(
      takeUntil(timer(this.question.time * 1000)),
    );

    const showTimeoutDialog = new Observable<string>((observer) => {
      this.openDialogTimeout(true);
      this.isDisabled = true;
      observer.next('dialog timeout opened');

      const delayDialog = timer(3000).subscribe(() => {
        this.dialog.closeAll();
        observer.complete();
        delayDialog.unsubscribe();
      });
    });

    return concat(chronometer, showTimeoutDialog);
  }

  public setCurrentQuestionTechnology(): void {
    this.jsonService
      .getJSON('./assets/json/languages.json')
      .subscribe((json) => {
        for (const techno of this.technologies) {
          const arrayName = [];
          arrayName.push(techno.name.toLowerCase());
          json.map((lg) => {
            if (
              (this.question.technologies ||
                this.question.technologies.id === techno.id) &&
              lg.languages.some((l) => arrayName.includes(l))
            ) {
              this.filetype = lg.config.filetype;
              this.filename = lg.config.filename;
              this.options = lg.config.options;
            }
          });
        }
      });
  }

  public setCurrentLanguage(): void {
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
      default:
        this.dataInfoLanguageContent = 'content';
        this.dataInfoLanguageName = 'name';
    }
  }

  public checkboxAnswers(event: MatCheckboxChange) {
    const checkbox: MatCheckbox = event.source;

    if (checkbox.checked) {
      this.candidatAnswers.push(checkbox.value);
    } else {
      const element: string = this.candidatAnswers.find(
        (item) => item === checkbox.value,
      );

      if (element) {
        this.candidatAnswers.splice(this.candidatAnswers.indexOf(element), 1);
      }
    }
  }

  private validateAnswer(): Observable<any> {

    let points: number;
    // get correct answers of current question
    this.correctAnswers = this.question.answer_value.split(this.separator).sort();


    if (this.questions[this.currentIdxQuestions].type === 'one' ||
        this.questions[this.currentIdxQuestions].type === 'multiple' ) {
      // determines if candidat answer is good and get associated points
      this.candidatAnswers.push(this.candidatAnswer);
      points =
        this.correctAnswers.sort().toString().toLowerCase() ===
        this.candidatAnswers.sort().toString().toLowerCase()
          ? this.questions[this.currentIdxQuestions].points
          : 0;
      // maybe use nullish coalescing operator ?
    }

    if (this.questions[this.currentIdxQuestions].type === 'free') {
      this.candidatAnswers.push(this.candidatAnswer.toLowerCase().trim());
      points = this.candidatAnswers.every((reps) =>
        this.correctAnswers.includes(reps),
      )
        ? this.questions[this.currentIdxQuestions].points
        : 0;
      // maybe use nullish coalescing operator ?
    }

    this.correctAnswerCounter += points ? 1 : 0;

    if (this.mode === 'testing') {
      return this.putAnswerResult(
        this.questions[this.currentIdxQuestions].technologies,
        points,
      );
    } else {
      return EMPTY;
    }
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

  public postTimeTest(totalElapsedTime: number): Observable<any> {

    // if we are not in testing mode
    if (this.mode !== 'testing') {
      this.refreshComponent();
      return EMPTY;
    }


    this.allPointsCandidat = this.sumPointsByTechnologyId(
      this.SumPointsCandidat,
    );

    this.totalPoints = this.calculTotalPoints(
      this.allPointsCandidat,
    );

    if (this.totalPoints) {
      this.totalPointsCandidat = this.totalPoints;
    }


    let getPourcent;
    const objectGetpourcent = [];

    for (const pointsTechno of this.allPointsTechnos) {
      for (const pointsCandidat of this.allPointsCandidat) {
        if (
          pointsTechno.technologies === pointsCandidat.technologies
        ) {
          if (pointsCandidat.points === null) {
            getPourcent = 0;
          } else {
            getPourcent = Math.round(
              (pointsCandidat.points / pointsTechno.points) * 100,
            );
          }

          objectGetpourcent.push({
            percentage: getPourcent,
            techno: pointsTechno.technologies,
          });
        }
      }
    }

    const getPourcentTest = Math.round(
      ((this.totalPointsCandidat.total_points ||
        this.totalPointsCandidat.points) /
        (this.totalPointsCampaign.total_points ||
          this.totalPointsCampaign.points)) *
        100,
    );
    console.log('test SUM TOTAL OF THE TEST', getPourcentTest);

    const newOBjectToPostCandidat = [
      { allPointsTechnos: this.allPointsTechnos },
      { allPointsCandidat: this.allPointsCandidat },
      { getpourcentByCandidat: objectGetpourcent },
      {
        totalPointsCandidat:
          this.totalPointsCandidat.total_points ||
          this.totalPointsCandidat.points,
      },
      {
        totalPointsCampaign:
          this.totalPointsCampaign.total_points ||
          this.totalPointsCampaign.points,
      },
      { PourcentTest: getPourcentTest },
    ];

    return this.httpClient.put(API_URI_CANDIDATS + '/' + this.candidat.id, {
              duree: totalElapsedTime,
              test_terminer: new Date(),
              points_candidat: newOBjectToPostCandidat
            }).pipe(
              concatMap(
                (res: any) => this.httpClient.get(API_URI_CAMPAIGNS + '/' + this.candidat.campaign.id)
              ),
              concatMap(
                (res: any) => this.httpClient.put(API_URI_CAMPAIGNS + '/' + this.candidat.campaign.id, {
                  NbCandidatFinish: res.NbCandidatFinish ? res.NbCandidatFinish + 1 : 1
                })
              ),
              concatMap((res: any) => this.httpClient.post(API_URI_NOTIFICATIONS, {
                  idCampaign: this.candidat.campaign.id,
                  message: `Le rapport d'évalution de '${this.candidat.Nom}' est disponible.`,
                  status: false,
                  title: `Un candidat viens de finir le test '${this.candidat.campaign.Name}'.`,
                  user: this.candidat.campaign.user,
                })
              )
            );
  }

  public postPauseTest(): Observable<any> {
    return this.httpClient
      .put(API_URI_CANDIDATS + '/' + this.candidat.id, {
        date_pause: new Date().toISOString(),
        index_question: this.currentIdxQuestions,
        test_pause: this.chronometerCurrentTime,
      });
  }

  public sumPointsByTechnologyId(
    questions: Record<string, any>[],
  ): Record<string, any>[] {
    const sumPointsByTechno = {};

    questions.forEach((element: Record<string, any>) => {
      sumPointsByTechno[element.technologies] = sumPointsByTechno[
        element.technologies
      ]
        ? sumPointsByTechno[element.technologies] + element.points
        : element.points;
    });

    const arraySumPoints: Record<string, any>[] = [];

    for (const [key, value] of Object.entries(sumPointsByTechno)) {
      arraySumPoints.push({ technologies: key, points: value });
    }

    for (const techno of this.technologies) {
      for (const technoArray of arraySumPoints) {
        if (techno.id === Number(technoArray.technologies)) {
          technoArray.technologies = techno.name;
        }
      }
    }

    return arraySumPoints;
  }

  private putAnswerResult(techno, point): Observable<Record<string, any>> {
    return this.httpClient
      .get<Record<string, any>>(API_URI_CANDIDATS + '/' + this.candidat.id)
      .pipe(
        tap((res) => {
          if (res.points_candidat) { this.SumPointsCandidat = res.points_candidat; }
          this.SumPointsCandidat.push({ technologies: techno, points: point });

          if (res.raport_candidat) { this.jsonRapport = res.raport_candidat; }

          this.jsonRapport.rapport.push({
            array_rep_candidat: this.candidatAnswers,
            index_question: this.question, // JSON to PDF and rapport candidat
            timeRep: this.chronometerCurrentTime,
          });

          return this.SumPointsCandidat;
        }),
        concatMap((res) =>
          this.httpClient.put<Record<string, any>>(
            API_URI_CANDIDATS + '/' + this.candidat.id,
            {
              points_candidat: this.SumPointsCandidat,
              raport_candidat: this.jsonRapport,
            },
          ),
        ),
        tap((res) => console.log(res)),
      );
  }

  private calculTotalPoints(
    statistics: Record<string, any>[],
  ): Record<string, any> {
    // if (typeof stats !== 'undefined' && stats.length > 0) {
    //   this.totalPoints = statistics.reduce((a, b) => ({ total_points: a.points + b.points }));
    // }
    return statistics.reduce((a, b) => ({ total_points: a.points + b.points }));
  }

  public refreshComponent() {
    this.refresh.emit('fin-testing');
  }

  public openDialogTimeout(preview: boolean = true): void {
    const dialogRef = this.dialog.open(DialogTimeoutComponent, {
      data: { preview: preview },
      height: 'auto',
      width: '50%',
      autoFocus: false,
      disableClose: true,
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe();
  }

  // work only if Press F5 or cancel close window
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    $event.returnValue = 'Are you sure?';
    console.log('before unload');
    // on tutorial mode, prevent backend api calls
    if (this.mode !== 'testing') { return; }

    this.postPauseTest().subscribe();

  }

  @HostListener('window:unload', ['$event'])
  public sendData() {
    // alert('works');
    // on tutorial mode, prevent backend api calls
    // console.log('unload');
    if (this.mode !== 'testing') { return; }

    // this.postPauseTest();
  }
}
