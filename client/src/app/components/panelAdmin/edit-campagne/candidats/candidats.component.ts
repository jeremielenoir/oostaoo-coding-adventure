import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs/internal/Subscription';
import { DecryptTokenService } from '../../../home/register/register.service';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_CANDIDATS_PDF_REPORT,
  API_URI_USER,
} from '../../../../api-client/api-client.service';
import { TotalTestsAvailableService } from '../services/total-tests-available.service';
import { InviteCandidat } from './invite-candidat.component';
import { InterviewDialogComponent } from './interview-dialog/interview-dialog.component';
import { saveAs } from 'file-saver';
import { getResultsDefinition } from './getResultsDefinition';
import * as moment from 'moment';
// import pdfMake from "pdfmake/build/pdfmake";
// font build has to be committed otherwise each developers has to build font locally.
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// import pdfFonts from '../../../../../assets/pdfmake-font-builds/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

/*pdfMake.fonts = {
  FontAwesome: {
    normal: "fontawesome-webfont.ttf",
    bold: "fontawesome-webfont.ttf",
    italics: "fontawesome-webfont.ttf",
    bolditalics: "fontawesome-webfont.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};*/

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.scss'],
})
export class CandidatsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private globalId: number;
  public tests_available = 0;
  private technologies: Record<string, any>[] = [];
  public campaign: Record<string, any>;
  public candidats: Record<string, any>[];
  public currentCandidat = { Candidats: '' };
  public infosCandidats: Record<string, any>;
  public infosCandidatsPdf: Record<string, any>[];
  public anonymizing: boolean;
  public deletingCandidats: boolean;
  public allCandidatsSelected = false;
  public candidatsAvailable: boolean = null;
  public isLoading = true;
  private choiceList: boolean;
  public opened: boolean;
  public displayedColumns: string[];
  public readonly defaultMatTableColumns: string[] = ['Checked', 'Rapport', 'Interview', 'Candidats', 'Dernière activité', 'Score'];
  public readonly compactMatTableColumns: string[] = ['Checked', 'Rapport', 'Interview', 'Candidats'];
  private readonly compactTableWidth: string = '(max-width: 650px)';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('check') check: ElementRef;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    public apiClientService: ApiClientService,
    private decryptTokenService: DecryptTokenService,
    private router: Router,
    private http: HttpClient,
    private testsAvailable: TotalTestsAvailableService,
  ) {
    this.route.parent.params.subscribe((params) => this.globalId = params.id);
    this.dialog.afterAllClosed.subscribe(() => this.getCampaign());
  }

  ngOnInit() {
    this.loadTestsAvailable();
    this.getCampaign().then((datas) => {
      this.campaign = datas;
      // console.log('CAMPAIGN', this.campaign, datas);
    });

    this.subscription = this.breakpointObserver
      .observe([this.compactTableWidth])
      .subscribe((state: BreakpointState) => {
        this.displayedColumns = state.matches ? this.compactMatTableColumns : this.defaultMatTableColumns.concat(this.getTechnoNames(), ['Durée']);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadTestsAvailable(): void {
    this.subscription = this.apiClientService
      .get(API_URI_USER + '/' + this.decryptTokenService.userId)
      .subscribe((user) => {
        this.tests_available = user.tests_available;
        this.testsAvailable.updateValue(this.tests_available);
      });
  }

  openDialog() {
    if (this.tests_available === 0) {
      console.log('ZERO');
    }


    const dialogRef = this.dialog.open(InviteCandidat, {
      data: {
        globalId: this.globalId,
        tests_available: this.tests_available,
      },
      // height: '580px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) { this.tests_available = data; }

      this.getCampaign();
    });
  }

  openInterviewDialog(data: Record<string, any>): void {
    this.dialog.open(InterviewDialogComponent, {
      data,
      height: 'auto',
      minWidth: 550,
    });
  }

  menuChoice(event: MouseEvent) {
    if (event) { event.stopPropagation(); }

    this.choiceList = false;
  }

  selectAllCandidats(checked: boolean) {
    this.allCandidatsSelected = checked;
    if (!this.infosCandidats) {
      return;
    }
    this.infosCandidats.data.forEach((c) => {
      c.selected = checked;
    });
  }

  someCandidatsSelected(): boolean {
    return !this.infosCandidats
      ? false
      : this.getCandidatsSelected().length > 0 && !this.allCandidatsSelected;
  }

  updateAllCandidatsSelected() {
    this.allCandidatsSelected = this.infosCandidats.data.every(
      (c) => c.selected,
    );
  }

  public getCandidatsSelected(): Record<string, any>[] {
    return this.infosCandidats.data.filter((c) => c.selected);
  }

  getCandidatStatusSelected(id: number) {
    if (!this.infosCandidats) { return false; }

    const found = this.infosCandidats.data.find((c) => c.candidat_id === id);
    return found ? found.selected : false;
  }

  public exported(): void {
    const selectedCandidats: Record<string, any>[] = this.getCandidatsSelected();

    for (const candidat of selectedCandidats) {
      // only selected candidat with score, points or rapport can get PDF file
      if (
        candidat.Score &&
        candidat.points && candidat.points.length > 0 &&
        candidat.rapport && candidat.rapport.length > 0
      ) {
        this.viewResultsPdf(candidat);
      }
    }
  }

  public setAnonymizing(status: boolean) {
    this.anonymizing = status;
  }

  public anonymize(): void {
    this.getCandidatsSelected().forEach((elementId) => {
      const urlApi = API_URI_CANDIDATS + '/' + elementId;
      this.apiClientService
        .put(urlApi, {
          Nom: '-',
          email: '-',
        })
        .subscribe(() => {
          this.setAnonymizing(false);
          this.ngOnInit();
        });
    });
  }

  private setDeletingCandidats(status: boolean): void {
    this.deletingCandidats = status;
  }

  public deleteCandidats(): void {
    this.getCandidatsSelected().forEach((candidat) => {
      const urlApi = API_URI_CANDIDATS + '/' + candidat.candidat_id;
      this.apiClientService.delete(urlApi).subscribe((response) => {
        this.setDeletingCandidats(false);
        this.selectAllCandidats(false);
        this.ngOnInit();
      });
    });
  }

  private getCampaign(): Promise<any> {
    return this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.globalId)
      .toPromise()
      .then(
        (campaign: Record<string, any>) => {
          const userId: number = campaign.user.id;
          const jwtUserId: number = this.decryptTokenService.userIdExporte['userId'];

          if (userId !== jwtUserId) {
            this.router.navigate(['/dashboard/campaigns']);
            return;
          }

          this.technologies = campaign.technologies;

          this.candidatsAvailable = campaign.candidats.length > 0 ? true : false;

          for (let i = 0; i < campaign.candidats.length; i++) {
            if (campaign.candidats[i].points_candidat) {
              let getpourcentByCandidat = [];
              const scoreByTechObject = {};

              campaign.candidats[i].points_candidat.forEach(point => {
                if (point['getpourcentByCandidat']) { getpourcentByCandidat = point['getpourcentByCandidat']; }
              });

              getpourcentByCandidat.forEach((score) => scoreByTechObject[score.techno] = score.percentage.toFixed(2) + '%');

              let percentArray: any[] = [];
              if (
                campaign.candidats[i].points_candidat && campaign.candidats[i].points_candidat.length &&
                campaign.candidats[i].points_candidat[2] && campaign.candidats[i].points_candidat[2]['getpourcentByCandidat']
              ) {
                percentArray = campaign.candidats[i].points_candidat[2]['getpourcentByCandidat'].map((a) => a.percentage);
              }

              const sumPercent: number = percentArray.length > 0 ? percentArray.reduce((a, b) => parseFloat(a + b)) : 0;

              const score: string = (sumPercent / percentArray.length).toFixed(2) + '%';

              campaign.candidats[i].Score = score;
              campaign.candidats[i].getpourcentByCandidat = scoreByTechObject;
              campaign.candidats[i].status = false;
            }

            campaign.candidats[i].status = false;
          }
          this.campaign = campaign;
          return this.campaign;
        },
        (err) => {
          this.router.navigate(['/dashboard/campaigns']);
        },
      )
      .then((campaign: Record<string, any>) => {
        // INFOS FOR CANDIDATS TO PUSH IN DATA TABLE
        const getInfoCandidats: Record<string, any>[] = [];
        for (let i = 0; i < campaign.candidats.length; i++) {
          let duree: any;
          let dateInvite: any;
          let percentCandidat: any;

          duree = campaign.candidats[i].duree !== null ? this.secondsToHms(campaign.candidats[i].duree) : 0;

          if (campaign.candidats[i].test_terminer === '0000-00-00 00:00:00') {
            dateInvite = new Date(campaign.candidats[i].invitation_date);
            percentCandidat = 0 + '%';
          } else {
            dateInvite = new Date(campaign.candidats[i].test_terminer);
            if (
              !campaign.candidats[i].points_candidat || !campaign.candidats[i].points_candidat[5] ||
              !campaign.candidats[i].points_candidat[5].PourcentTest || campaign.candidats[i].points_candidat[5].PourcentTest === null
            ) {
              percentCandidat = 0 + '%';
            } else {
              percentCandidat = campaign.candidats[i].points_candidat[5].PourcentTest + '%';
            }
          }

          const datetime: string = dateInvite.toLocaleString();

          const getInfoCandidat: Record<string, any> = {
            candidat_id: campaign.candidats[i].id,
            Candidats: campaign.candidats[i].Nom,
            Email: campaign.candidats[i].email,
            status: campaign.candidats[i].status,
            selected: this.getCandidatStatusSelected(campaign.candidats[i].id),
            'Dernière activité': datetime.substring(0, datetime.length - 6) + ' ' + datetime.substring(datetime.length - 2, datetime.length),
            Score: campaign.candidats[i].Score,
            Durée: duree,
            rapport: campaign.candidats[i].raport_candidat ? campaign.candidats[i].raport_candidat.rapport : null,
            points: campaign.candidats[i].points_candidat,
            Interview: {
              ...campaign.candidats[i].interview,
              interview_date: campaign.candidats[i] && campaign.candidats[i].interview && campaign.candidats[i].interview.interview_date
                  ? moment(campaign.candidats[i].interview.interview_date).locale('fr').format('dddd, MMMM Do YYYY, HH:mm')
                  : null,
              date: campaign.candidats[i].opened_link,
              ...campaign.candidats[i].getpourcentByCandidat
            }
          };

          getInfoCandidats.push(getInfoCandidat);
        }
        this.infosCandidats = new MatTableDataSource(getInfoCandidats);
        this.infosCandidats.sort = this.sort;

        this.infosCandidatsPdf = getInfoCandidats;

        this.isLoading = false;

        return campaign;
      })
      .catch((error) => {
        console.log('ERROR', error);
      });
  }

  // private collectCandidateResults(candidat_id: number): Record<string, any> {
  //   // console.log('%c counterId', 'font-size:24px;color:blue', candidat_id)

  //   const selectedCandidate = this.candidats.find(
  //     (unit) => unit.id == candidat_id,
  //   );
  //   const name = selectedCandidate.Nom;
  //   const email = selectedCandidate.email;
  //   const duration = selectedCandidate.duree;
  //   const rapport = selectedCandidate.raport_candidat.rapport;
  //   const date = this.datePipe.transform(
  //     selectedCandidate.opened_link,
  //     'dd-MM-yy',
  //   );
  //   const points = selectedCandidate.points_candidat;

  //   let resultsByLanguage = {};
  //   let totalPointsCandidat = 0;
  //   let totalPointsMax = 0;
  //   points[1].allPointsCandidat.forEach((techno) => {
  //     totalPointsCandidat += techno.points;
  //     const pointsMaxTechno = points[0].allPointsTechnos.find(
  //       (tech) => tech.technologies === techno.technologies,
  //     ).points;
  //     totalPointsMax += pointsMaxTechno;
  //     const percentage_techno = (techno.points / pointsMaxTechno) * 100 + ' %';
  //     resultsByLanguage[techno.technologies] = {
  //       note: techno.points,
  //       max: pointsMaxTechno,
  //       percentage_techno,
  //     };
  //   });

  //   const score = (totalPointsCandidat / totalPointsMax) * 100 + '%';
  //   let languages = '';
  //   Object.keys(resultsByLanguage).map((language) => {
  //     languages = `${languages} ${language}`;
  //   });
  //   let questionsRapport = [];
  //   let totalTestDuration = 0;
  //   let totalCandidateDuration = 0;

  //   Object.values(rapport).map((question: any) => {
  //     const candidate_answer = question.array_rep_candidat[0];
  //     totalTestDuration += question.index_question.time;
  //     totalCandidateDuration += question.timeRep;
  //     const correct_answer = question.index_question.answer_value;
  //     const question_max_score = question.index_question.points;
  //     const question_candidate_score =
  //       candidate_answer === correct_answer ? question_max_score : 0;
  //     const content = question.index_question.content
  //       ? question.index_question.content.split(', ')
  //       : [];
  //     if (content && content[3] === 'Aucune') {
  //       content.splice(3, 4, 'Aucune des solutions précédentes');
  //     }

  //     function convertToMin(time) {
  //       let mind = time % (60 * 60);
  //       let minutes = Math.floor(mind / 60);
  //       let minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  //       let secd = mind % 60;
  //       let seconds = Math.ceil(secd);
  //       let secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();
  //       return `${minutesString}:${secondsString}`;
  //     }

  //     let question_time: string = convertToMin(question.index_question.time);
  //     let question_timeRep: string = convertToMin(question.timeRep);

  //     const questionsRapportUnit = {
  //       question_id: question.index_question.id,
  //       name: question.index_question.name,
  //       content,
  //       candidate_answer,
  //       correct_answer,
  //       question_max_score,
  //       question_candidate_score,
  //       question_time,
  //       question_timeRep,
  //     };
  //     questionsRapport.push(questionsRapportUnit);
  //   });

  //   let heures = Math.floor(totalTestDuration / 60);
  //   let minutes = totalTestDuration % 60;
  //   let minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  //   const totalTestTime = `${heures} h ${minutesString}`;
  //   heures = Math.floor(totalCandidateDuration / 60);
  //   minutes = totalCandidateDuration % 60;
  //   minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  //   const totalCandidateTime = `${heures}h${minutesString}`;

  //   return {
  //     name,
  //     email,
  //     duration,
  //     score,
  //     totalPointsMax,
  //     totalPointsCandidat,
  //     date,
  //     resultsByLanguage,
  //     languages,
  //     questionsRapport,
  //     totalTestTime,
  //     totalCandidateTime,
  //   };
  // }

  public viewResultsPdf(candidat: Record<string, any>): void {
    console.log(candidat);
    this.http
      .get(API_URI_CANDIDATS_PDF_REPORT + candidat.candidat_id, {
        responseType: 'blob',
      })
      .toPromise()
      .then((blob) => {
        saveAs(blob, `${candidat.Candidats}-tests-result.pdf`);
      })
      .catch((err) => console.error('download error = ', err));
  }

  private secondsToHms(duree: any): string {
    const h = Math.floor(duree / 3600);
    const m = Math.floor((duree % 3600) / 60);
    const s = Math.floor((duree % 3600) % 60);

    const hour = h > 0 ? h + (h === 1 ? ' heure ' : ' heures, ') : '';
    const minute = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
    const secondes = s > 0 ? s + (s === 1 ? ' seconde' : ' secondes') : '';
    return hour + minute + secondes;
  }

  public applyFilter(filterValue: string) {
    this.selectAllCandidats(false);
    this.infosCandidats.filter = filterValue.trim().toLowerCase();
  }

  public menuSidenav(sidenav: any, candidat: any) {
    this.currentCandidat = candidat;
    sidenav.toggle();
  }

  public sidnavClose(sidenav: any) {
    sidenav.close();
  }

  private getTechnoNames(): string[] {
    return this.technologies.map(techno => techno.name);
  }
}
