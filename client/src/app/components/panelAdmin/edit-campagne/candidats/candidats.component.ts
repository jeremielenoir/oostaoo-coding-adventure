import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatSidenav,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { InviteCandidat } from "./invite-candidat.component";
import { DecryptTokenService } from "../../../home/register/register.service";
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS,
  API_URI_CANDIDATS_PDF_REPORT,
} from "../../../../api-client/api-client.service";
import { HttpClient } from "@angular/common/http";
import { saveAs } from "file-saver";
import { getResultsDefinition } from "./getResultsDefinition";
import { InterviewDialogComponent } from "./interview-dialog/interview-dialog.component";
import * as moment from "moment";
//import pdfMake from "pdfmake/build/pdfmake";
// font build has to be committed otherwise each developers has to build font locally.
// import pdfFonts from 'pdfmake/build/vfs_fonts';
//import pdfFonts from '../../../../../assets/pdfmake-font-builds/vfs_fonts';

//pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  selector: "app-candidats",
  templateUrl: "./candidats.component.html",
  styleUrls: ["./candidats.component.scss"],
})
export class CandidatsComponent implements OnInit {
  public globalId: string;
  public tests_available;
  public campaigns;
  public campaign;
  public candidats;
  public currentCandidat = { Candidats: "" };
  public technologies;
  public displayedColumns;
  public infosCandidats;
  public infosCandidatsPdf;
  public questions;
  public idElementExported: any;
  public anonymizing: boolean;
  public deletingCandidats: boolean;
  public allCandidatsSelected = false;
  datePipe = new DatePipe("fr");
  ViewCandidats;
  isLoading = true;
  choiceList: boolean;
  checkedActionBoolean = true;
  opened: boolean;
  public DecryptTokenService = new DecryptTokenService();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("check") check: ElementRef;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public apiClientService: ApiClientService,
    private router: Router,
    private http: HttpClient
  ) {
    this.route.parent.params.subscribe((params) => {
      this.globalId = params.id;
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.getCampaign();
    });
  }

  choices = [
    { value: "exporter", viewValue: "Exporter" },
    { value: "anonymiser", viewValue: "Anonymiser" },
    { value: "supprimer", viewValue: "Supprimer" },
  ];
  choicesTimeTest = [
    { value: "attente", viewValue: "En attente" },
    { value: "terminer", viewValue: "Terminés" },
    { value: "expirer", viewValue: "Expirés" },
  ];

  openDialog() {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: this.globalId,
      height: "580px",
    });

    inviteCandidatDialog.afterClosed().subscribe((data) => {
      this.getCampaign().then((datas) => {
        console.log("AFTER CLOSE ALL DATAS", datas);
      });
    });
  }

  openInterviewDialog(data) {
    this.dialog.open(InterviewDialogComponent, {
      data,
      height: "580px",
    });
  }

  ngOnInit() {
    this.tests_available = this.DecryptTokenService.tests_available;
    if (this.tests_available == -1) {
      this.tests_available = "";
    }
    this.getCampaign().then((datas) => {
      this.campaign = datas;
    });
  }

  showChoiceList(e) {
    if (e) {
      e.stopPropagation();
    }
    this.choiceList = !this.choiceList;
  }

  menuChoice(event) {
    this.choiceList = false;
  }


  selectAllCandidats(checked: boolean) {
    this.allCandidatsSelected = checked;
    if (!this.infosCandidats) {
      return;
    }
    this.infosCandidats.data.forEach(c => {
      c.selected = checked;
    });
  }
  someCandidatsSelected(): boolean {
    return !this.infosCandidats ? false : this.getCandidatsSelected().length > 0 && !this.allCandidatsSelected;
  }
  updateAllCandidatsSelected() {
    this.allCandidatsSelected = this.infosCandidats.data.every(c => c.selected);
  }
  getCandidatsSelected() {
    return this.infosCandidats.data.filter(c => c.selected).map(c => c.candidat_id.toString());
  }
  getCandidatStatusSelected(id: number) {
    if (!this.infosCandidats) {
      return false;
    }
    const found = this.infosCandidats.data.find(c => c.candidat_id === id);
    return found ? found.selected : false;
  }


  exported() {
    this.viewResultsPdf(this.getCandidatsSelected());
  }

  setAnonymizing(bool) {
    this.anonymizing = bool;
  }
  anonymize() {
    this.getCandidatsSelected().forEach((elementid) => {
      const urlApi = API_URI_CANDIDATS + "/" + elementid;
      this.apiClientService
        .put(urlApi, {
          Nom: "-",
          email: "-",
        })
        .subscribe((response) => {
          this.setAnonymizing(false);
          this.ngOnInit();
        });
    });
  }

  setDeletingCandidats(bool) {
    this.deletingCandidats = bool;
  }
  deleteCandidats() {
    this.getCandidatsSelected().forEach((idDelete) => {
      const urlApi = API_URI_CANDIDATS + "/" + idDelete;
      this.apiClientService.delete(urlApi).subscribe((response) => {
        this.setDeletingCandidats(false);
        this.selectAllCandidats(false);
        this.ngOnInit();
      });
    });
  }

  getCampaign(): Promise<any> {
    // setTimeout(() => {
    //   this.selectAllCandidats(false);
    // }, 100);

    const apiURL = API_URI_CAMPAIGNS + "/" + this.globalId;
    return this.apiClientService
      .get(apiURL)
      .toPromise()
      .then(
        (res) => {
          let userId = res.user.id;
          let userIdConnect = this.DecryptTokenService.userIdExporte["userId"];
          if (userId !== userIdConnect) {
            this.router.navigate(["/dashboard/campaigns"]);
            return;
          }

          this.campaigns = res;
          let candidats = res.candidats;
          this.candidats = candidats.map((candidat) => {
            if (candidat.points_candidat) {
              let getpourcentByCandidat = [];
              let points_candidat = candidat.points_candidat;
              let scoreByTechObject = {};
              points_candidat.forEach((point) => {
                if (point["getpourcentByCandidat"]) {
                  getpourcentByCandidat = point["getpourcentByCandidat"];
                }
              });
              getpourcentByCandidat.forEach((score) => {
                scoreByTechObject[score.techno] = score.percentage + "%";
              });

              const percentArray =
                points_candidat &&
                  points_candidat.length &&
                  points_candidat[2] &&
                  points_candidat[2]["getpourcentByCandidat"]
                  ? points_candidat[2]["getpourcentByCandidat"].map(
                    (a) => a.percentage
                  )
                  : [];

              const sumPercent =
                percentArray && percentArray.length
                  ? percentArray.reduce((a, b) => parseFloat(a + b))
                  : 0;

              const Score = (sumPercent / percentArray.length).toFixed(2) + "%";
              return {
                ...candidat,
                Score,
                getpourcentByCandidat: scoreByTechObject,
                status: false,
              };
            }
            return { ...candidat, status: false };
          });

          this.technologies = res.technologies;

          if (this.campaigns.candidats.length > 0) {
            this.ViewCandidats = "CandidatTrue";
          } else {
            this.ViewCandidats = "CandidatFalse";
          }
          return this.campaigns;
        },
        (err) => {
          this.router.navigate(["/dashboard/campaigns"]);
        }
      )
      .then((data) => {
        // INFOS FOR CANDIDATS TO PUSH IN DATA TABLE
        const defaultColumns = [
          "Checked",
          "Details",
          "Interview",

          "Candidats",
          "Dernière activité",
          "Score",
        ];
        const getInfoCandidat = [];
        let dateInvite;
        let percentCandidat;
        let duree;

        // INFOS FOR ADD COLUMN
        const getTechnos = [];
        for (const technos of this.technologies) {
          getTechnos.push(technos.name);
        }

        this.displayedColumns = defaultColumns.concat(getTechnos, ["Durée"]);

        for (const candidat of this.candidats) {
          if (candidat.duree !== null) {
            // console.log('candidat : ', candidat);
            duree = this.secondsToHms(candidat.duree);
          } else {
            duree = 0;
          }
          // console.log('CANDIDAT TERMINER', candidat.test_terminer);
          if (candidat.test_terminer === "0000-00-00 00:00:00") {
            dateInvite = new Date(candidat.invitation_date);
            percentCandidat = 0 + "%";
          } else {
            dateInvite = new Date(candidat.test_terminer);
            // console.log('candidat.points_candidat[5].PourcentTest: ', candidat.points_candidat[5].PourcentTest);

            if (
              !candidat.points_candidat ||
              !candidat.points_candidat[5] ||
              !candidat.points_candidat[5].PourcentTest ||
              candidat.points_candidat[5].PourcentTest === null
            ) {
              percentCandidat = 0 + "%";
            } else {
              percentCandidat = candidat.points_candidat[5].PourcentTest + "%";
            }
          }
          //console.log("candidat ===============",candidat)
          getInfoCandidat.push({
            candidat_id: candidat.id,
            Candidats: candidat.Nom,
            Email: candidat.email,
            status: candidat.status,
            selected: this.getCandidatStatusSelected(candidat.id),
            "Dernière activité": dateInvite.toLocaleString(),
            // Score: percentCandidat,
            Score: candidat.Score,
            Durée: duree,
            rapport: candidat.raport_candidat
              ? candidat.raport_candidat.rapport
              : null,
            points: candidat.points_candidat,
            Interview: {
              ...candidat.interview,
              interview_date:
                candidat &&
                  candidat.interview &&
                  candidat.interview.interview_date
                  ? moment(candidat.interview.interview_date)
                    .lang("fr")
                    .format("dddd, MMMM Do YYYY, HH:mm")
                  : null,
            },
            date: candidat.test_ouvert,
            ...candidat.getpourcentByCandidat,
          });
        }
        return getInfoCandidat;
      })
      .then((getInfoCandidat) => {
        // console.log("getInfoCandidat", getInfoCandidat);
        this.infosCandidats = new MatTableDataSource(getInfoCandidat);
        this.infosCandidatsPdf = getInfoCandidat;
        this.infosCandidats.sort = this.sort;
        this.isLoading = false;
        return this.campaigns;
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  collectCandidateResults(candidat_id) {
    // console.log('%c counterId', 'font-size:24px;color:blue', candidat_id)

    const selectedCandidate = this.candidats.find(
      (unit) => unit.id == candidat_id
    );
    const name = selectedCandidate.Nom;
    const email = selectedCandidate.email;
    const duration = selectedCandidate.duree;
    const rapport = selectedCandidate.raport_candidat.rapport;
    const date = this.datePipe.transform(
      selectedCandidate.test_ouvert,
      "dd-MM-yy"
    );
    const points = selectedCandidate.points_candidat;

    let resultsByLanguage = {};
    let totalPointsCandidat = 0;
    let totalPointsMax = 0;
    points[1].allPointsCandidat.forEach((techno) => {
      totalPointsCandidat += techno.points;
      const pointsMaxTechno = points[0].allPointsTechnos.find(
        (tech) => tech.technologies === techno.technologies
      ).points;
      totalPointsMax += pointsMaxTechno;
      const percentage_techno = (techno.points / pointsMaxTechno) * 100 + " %";
      resultsByLanguage[techno.technologies] = {
        note: techno.points,
        max: pointsMaxTechno,
        percentage_techno,
      };
    });

    const score = (totalPointsCandidat / totalPointsMax) * 100 + "%";
    let languages = "";
    Object.keys(resultsByLanguage).map((language) => {
      languages = `${languages} ${language}`;
    });
    let questionsRapport = [];
    let totalTestDuration = 0;
    let totalCandidateDuration = 0;
    Object.values(rapport).map((question: any) => {
      const candidate_answer = question.array_rep_candidat[0];
      totalTestDuration += question.index_question.time;
      totalCandidateDuration += question.timeRep;
      const correct_answer = question.index_question.answer_value;
      const question_max_score = question.index_question.points;
      const question_candidate_score =
        candidate_answer === correct_answer ? question_max_score : 0;
      const content = question.index_question.content
        ? question.index_question.content.split(", ")
        : [];
      if (content && content[3] === "Aucune") {
        content.splice(3, 4, "Aucune des solutions précédentes");
      }

      function convertToMin(time) {
        let mind = time % (60 * 60);
        let minutes = Math.floor(mind / 60);
        let minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
        let secd = mind % 60;
        let seconds = Math.ceil(secd);
        let secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${minutesString}:${secondsString}`;
      }

      let question_time: string = convertToMin(question.index_question.time);
      let question_timeRep: string = convertToMin(question.timeRep);

      const questionsRapportUnit = {
        question_id: question.index_question.id,
        name: question.index_question.name,
        content,
        candidate_answer,
        correct_answer,
        question_max_score,
        question_candidate_score,
        question_time,
        question_timeRep,
      };
      questionsRapport.push(questionsRapportUnit);
    });

    let heures = Math.floor(totalTestDuration / 60);
    let minutes = totalTestDuration % 60;
    let minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
    const totalTestTime = `${heures} h ${minutesString}`;
    heures = Math.floor(totalCandidateDuration / 60);
    minutes = totalCandidateDuration % 60;
    minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
    const totalCandidateTime = `${heures}h${minutesString}`;

    return {
      name,
      email,
      duration,
      score,
      totalPointsMax,
      totalPointsCandidat,
      date,
      resultsByLanguage,
      languages,
      questionsRapport,
      totalTestTime,
      totalCandidateTime,
    };
  }

  viewResultsPdf(candidat) {
    this.http
      .get(API_URI_CANDIDATS_PDF_REPORT + candidat.candidat_id, {
        responseType: "blob",
      })
      .toPromise()
      .then((blob) => {
        saveAs(blob, `${candidat.Candidats}-tests-result.pdf`);
      })
      .catch((err) => console.error("download error = ", err));
  }

  secondsToHms(duree) {
    const h = Math.floor(duree / 3600);
    const m = Math.floor((duree % 3600) / 60);
    const s = Math.floor((duree % 3600) % 60);

    const hour = h > 0 ? h + (h === 1 ? " heure " : " heures, ") : "";
    const minute = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    const secondes = s > 0 ? s + (s === 1 ? " seconde" : " secondes") : "";
    return hour + minute + secondes;
  }

  applyFilter(filterValue: string) {
    this.selectAllCandidats(false);
    this.infosCandidats.filter = filterValue.trim().toLowerCase();
  }

  menuSidenav(sidenav, candidat) {
    this.currentCandidat = candidat;
    sidenav.toggle();
  }

  sidnavClose(sidenav) {
    sidenav.close();
  }
}
