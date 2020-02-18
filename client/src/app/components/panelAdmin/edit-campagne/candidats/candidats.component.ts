import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InviteCandidat } from './invite-candidat.component';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS
} from '../../../../api-client/api-client.service';
import { getResultsDefinition } from './getResultsDefinition';
import pdfMake from 'pdfmake/build/pdfmake';
// font build has to be committed otherwise each developers has to build font locally.
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfFonts from '../../../../../assets/pdfmake-font-builds/vfs_fonts';



pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  FontAwesome: {
    normal: 'fontawesome-webfont.ttf',
    bold: 'fontawesome-webfont.ttf',
    italics: 'fontawesome-webfont.ttf',
    bolditalics: 'fontawesome-webfont.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.scss'],
})
export class CandidatsComponent implements OnInit {
  public globalId: string;
  public campaigns;
  public campaign;
  public candidats;
  public currentCandidat = { Candidats: '' };
  public technologies;
  public displayedColumns;
  public infosCandidats;
  public infosCandidatsPdf;
  public questions;
  public idElementExported: string;
  public bolleanAnonymiser: boolean;
  public bolleanDeleteCandidat: boolean;
  datePipe = new DatePipe('fr');
  ViewCandidats;
  isLoading = true;
  choinceList: boolean
  checkedActionBoolean = true
  nbrSelectedElementChecked: any[] = [];
  opened: boolean;
  public checkedBox: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('allChecked') allChecked: ElementRef



  constructor(public dialog: MatDialog, private route: ActivatedRoute, public apiClientService: ApiClientService, private router: Router) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.getCampaign();
    });
  }

  choices = [
    { value: 'exporter', viewValue: 'Exporter' },
    { value: 'anonymiser', viewValue: 'Anonymiser' },
    { value: 'supprimer', viewValue: 'Supprimer' }
  ];
  choicesTimeTest = [
    { value: 'attente', viewValue: 'En attente' },
    { value: 'terminer', viewValue: 'Terminés' },
    { value: 'expirer', viewValue: 'Expirés' }
  ];



  openDialog() {
    const inviteCandidatDialog = this.dialog.open(InviteCandidat, {
      data: this.globalId,
      height: '80vh'
    });

    inviteCandidatDialog.afterClosed().subscribe((data) => {
      this.getCampaign().then(datas => {
        console.log('AFTER CLOSE ALL DATAS', datas);
      });
    });

  }

  ngOnInit() {
    this.getCampaign().then(datas => {
      this.campaign = datas;
      console.log('depuis candidat', this.candidats)
    });
  }

  showChoinceList(e) {
    if (e) {
      e.stopPropagation();
    }
    this.choinceList = !this.choinceList;
  }

  menuChoince(event) {
    this.choinceList = false;
  }


  checkedAction(e, check) {

    e.stopPropagation();

    if (!check.checked) {
      if (!this.nbrSelectedElementChecked.includes(check.value)) {

        this.nbrSelectedElementChecked.push(check.value);
      }
      this.idElementExported = check.value;
      if (this.candidats.length == this.nbrSelectedElementChecked.length) {
        this.allChecked['checked'] = true;
      } else {

      }

    } else {

      let index = this.nbrSelectedElementChecked.indexOf(check.value);
      this.nbrSelectedElementChecked.splice(index, 1);
      if (this.candidats.length != this.nbrSelectedElementChecked.length) {
        this.allChecked['checked'] = false;
      }
      // this.allChecked['checked'] = false;

    }


  }

  allcheckedActiveted(allChecked, ) {
    this.nbrSelectedElementChecked = []
    this.candidats.forEach(element => {

      if (!allChecked.checked) {
        this.ngOnInit();
        this.checkedBox = true
        this.nbrSelectedElementChecked.push(String(element.id));
      } else {
        let index = this.nbrSelectedElementChecked.indexOf(element.id);
        this.nbrSelectedElementChecked.splice(index, 1);
        this.checkedBox = false;
        this.ngOnInit()
      }
    })


  }
  checkSeveralIdDelete() {
    if (this.nbrSelectedElementChecked.length > 1) {
      this.nbrSelectedElementChecked.forEach(idDelete => {
        const urlApi = API_URI_CANDIDATS + '/' + idDelete;
        this.apiClientService.delete(urlApi).subscribe(response => {

          this.bolleanDeleteCandidat = false;
          this.nbrSelectedElementChecked = [];
          this.checkedBox = false;
          this.allChecked['checked'] = false;
          this.ngOnInit();

        })

      })
      return;
    }
  }
  checkSeveralIdAnonymiser() {
    if (this.nbrSelectedElementChecked.length > 1) {

      this.nbrSelectedElementChecked.forEach(elementid => {
        const urlApi = API_URI_CANDIDATS + '/' + elementid;
        this.apiClientService.put(urlApi, {
          Nom: '-',
          email: '-'
        }).subscribe(response => {

          this.bolleanDeleteCandidat = false;
          this.nbrSelectedElementChecked = [];
          this.checkedBox = false;
          this.allChecked['checked'] = false;
          this.ngOnInit()
        })

      })
      return;
    }
  }

  exported() {

    this.viewResultsPdf(this.nbrSelectedElementChecked)
  }

  Anonymiser() {
    this.bolleanAnonymiser = true;
  }
  removeAnonymiser() {
    this.bolleanAnonymiser = false;
  }
  deleteCandidat() {
    this.bolleanDeleteCandidat = true
  }
  removeDeleteCandidat() {
    this.bolleanDeleteCandidat = false
  }
  AnonymiserFinal() {
    this.checkSeveralIdAnonymiser();
    const urlApi = API_URI_CANDIDATS + '/' + this.idElementExported
    this.apiClientService.put(urlApi, {
      Nom: '-',
      email: '-'
    }).subscribe(response => {
      this.bolleanAnonymiser = false;
      this.nbrSelectedElementChecked = [];
      this.ngOnInit();

    })
  }

  delteCandidat() {
    this.checkSeveralIdDelete()
    const urlApi = API_URI_CANDIDATS + '/' + this.idElementExported
    this.apiClientService.delete(urlApi).subscribe(response => {
      this.bolleanDeleteCandidat = false;
      this.nbrSelectedElementChecked = [];
      this.ngOnInit()
    })
  }

  getCampaign(): Promise<any> {
    const apiURL = API_URI_CAMPAIGNS + '/' + this.globalId;
    return this.apiClientService
      .get(apiURL)
      .toPromise()
      .then(res => { // Success
        this.campaigns = res;
        console.log('this.campaign: ', this.campaigns);
        this.candidats = res.candidats;

        // console.log('this.candidats: ', this.candidats);
        this.technologies = res.technologies;
        // console.log('this.technologies: ', this.technologies);
        if (this.campaigns.candidats.length > 0) {
          this.ViewCandidats = 'CandidatTrue';
        } else {
          this.ViewCandidats = 'CandidatFalse';
        }
        return this.campaigns;
      })
      .then((data) => {
        // INFOS FOR CANDIDATS TO PUSH IN DATA TABLE
        const defaultColumns = ['Checked', 'Candidats', 'Dernière activité', 'Score'];
        const getInfoCandidat = [];
        let dateInvite;
        let percentCandidat;
        let duree;
        // INFOS FOR ADD COLUMN
        const getTechnos = [];
        for (const technos of this.technologies) {
          getTechnos.push(technos.name);
        }
        this.displayedColumns = defaultColumns.concat(getTechnos, ['Duree']);

        console.log('this.displayedColumns', this.displayedColumns);

        for (const candidat of this.candidats) {
          // console.log('candidat : ', candidat.points_candidat[2].getpourcentByCandidat);

          if (candidat.duree !== null) {
            // console.log('candidat : ', candidat);
            duree = this.secondsToHms(candidat.duree);
          } else {
            duree = 0;
          }
          if (candidat.invitation_date === candidat.test_terminer) {
            dateInvite = new Date(candidat.invitation_date);
            percentCandidat = 0 + '%';
          } else {
            dateInvite = new Date(candidat.test_terminer);
            // console.log('candidat.points_candidat[5].PourcentTest: ', candidat.points_candidat[5].PourcentTest);
            percentCandidat = candidat.points_candidat[5].PourcentTest + '%';
            if (candidat.points_candidat[5].PourcentTest === null) {
              percentCandidat = 0 + '%';
            }
          }
          getInfoCandidat.push({
            candidat_id: candidat.id,
            Candidats: candidat.Nom,
            Email: candidat.email,
            Checked: false,
            'Dernière activité': dateInvite.toLocaleString(),
            Score: percentCandidat,
            Duree: duree,
            rapport: (candidat.raport_candidat ? candidat.raport_candidat.rapport : null),
            points: candidat.points_candidat,
            date: candidat.test_ouvert
          });
          // console.log('candidat.points_candidat[2].getpourcentByCandidat: ', candidat.points_candidat[2].getpourcentByCandidat);
          if (candidat.invitation_date !== candidat.test_terminer) {
            // console.log('candidat.points_candidat[2].getpourcentByCandidat: ', candidat);
            for (const percentTechno of candidat.points_candidat[2].getpourcentByCandidat) {
              // console.log('percentTechno: ', percentTechno);
              for (const techno of getTechnos) {
                for (const iterator of getInfoCandidat) {
                  if (percentTechno.techno === techno && candidat.Nom === iterator.Candidats) {
                    iterator[techno] = percentTechno.percentage + '%';
                  }
                }
              }
            }
          } else {
            for (const techno of getTechnos) {
              for (const iterator of getInfoCandidat) {
                if (candidat.Nom === iterator.Candidats) {
                  iterator[techno] = 0 + '%';
                }
              }
            }
          }
        }
        return getInfoCandidat;
      }).then((getInfoCandidat) => {
        this.infosCandidats = new MatTableDataSource(getInfoCandidat);
        this.infosCandidatsPdf = getInfoCandidat;
        this.infosCandidats.sort = this.sort;
        this.isLoading = false;
        return this.campaigns;
      })
      .catch(error => {
        console.log('ERROR', error);
      });
  }



  collectCandidateResults(candidat_id) {

    // console.log('%c counterId', 'font-size:24px;color:blue', candidat_id)

    const selectedCandidate = this.candidats.find(unit => unit.id == candidat_id);
    const name = selectedCandidate.Nom;
    const email = selectedCandidate.email;
    const duration = selectedCandidate.duree;
    const rapport = selectedCandidate.raport_candidat.rapport;
    const date = this.datePipe.transform(selectedCandidate.test_ouvert, 'dd-MM-yy');
    const points = selectedCandidate.points_candidat;

    let resultsByLanguage = {};
    let totalPointsCandidat = 0;
    let totalPointsMax = 0;
    points[1].allPointsCandidat.forEach(techno => {
      totalPointsCandidat += techno.points;
      const pointsMaxTechno = points[0].allPointsTechnos
        .find(tech => tech.technologies === techno.technologies).points;
      totalPointsMax += pointsMaxTechno;
      const percentage_techno = techno.points / pointsMaxTechno * 100 + ' %';
      resultsByLanguage[techno.technologies] = {
        note: techno.points,
        max: pointsMaxTechno, percentage_techno
      };
    })

    const score = totalPointsCandidat / totalPointsMax * 100 + '%';
    let languages = '';
    Object.keys(resultsByLanguage).map(language => { languages = `${languages} ${language}` });
    let questionsRapport = [];
    let totalTestDuration = 0;
    let totalCandidateDuration = 0;
    Object.values(rapport).map((question: any) => {
      const candidate_answer = question.array_rep_candidat[0];
      totalTestDuration += question.index_question.time;
      totalCandidateDuration += question.timeRep;
      const correct_answer = question.index_question.answer_value;
      const question_max_score = question.index_question.points;
      const question_candidate_score = candidate_answer ===
        correct_answer ? question_max_score : 0;
      const content = question.index_question.content ?
        question.index_question.content.split(', ') : [];
      if (content && content[3] === 'Aucune') {
        content.splice(3, 4, "Aucune des solutions précédentes");
      }

      function convertToMin(time) {
        let mind = time % (60 * 60);
        let minutes = Math.floor(mind / 60);
        let minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
        let secd = mind % 60;
        let seconds = Math.ceil(secd);
        let secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${minutesString}:${secondsString}`
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
        question_timeRep
      };
      questionsRapport.push(questionsRapportUnit);
    })

    let hours = Math.floor(totalTestDuration / 60);
    let minutes = totalTestDuration % 60;
    let minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
    const totalTestTime = `${hours} h ${minutesString}`;
    hours = Math.floor(totalCandidateDuration / 60);
    minutes = totalCandidateDuration % 60;
    minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
    const totalCandidateTime = `${hours}h${minutesString}`;

    return {
      name, email, duration, score, totalPointsMax,
      totalPointsCandidat, date, resultsByLanguage,
      languages, questionsRapport, totalTestTime, totalCandidateTime
    }


  }

  viewResultsPdf(candidat_id) {

    const candidateResults = this.collectCandidateResults(candidat_id);
    pdfMake.createPdf(getResultsDefinition(candidateResults)).open();
  }


  secondsToHms(duree) {
    const h = Math.floor(duree / 3600);
    const m = Math.floor(duree % 3600 / 60);
    const s = Math.floor(duree % 3600 % 60);

    const hour = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
    const minute = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
    const second = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
    return hour + minute + second;
  }

  applyFilter(filterValue: string) {
    this.infosCandidats.filter = filterValue.trim().toLowerCase();
  }

  menuSidenav(sidenav, candidat) {
    this.currentCandidat = candidat;
    sidenav.toggle();

  }

  sidnavClose(sidenav) {
    sidenav.close()

  }

}


