import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService, API_URI_CANDIDATS, API_URI_TECHNO } from 'src/app/api-client/api-client.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-rapport-detaille',
  templateUrl: './rapport-detaille.component.html',
  styleUrls: ['./rapport-detaille.component.scss']
})
export class RapportDetailleComponent implements OnInit {

  public idCandidat;
  public candidat: any = null;
  public rapport;
  public rapportTechno = [];
  public uniquetechno;
  public techno = [];
  public totalTime = 0;

  public listereponse;
  public bonnereponse;

  constructor(route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.idCandidat = route.snapshot.params.idCandidat;
    // console.log('id candidat')
  }

  ngOnInit() {
    this.getCandidat();
  }

  removeDuplicates(rapportTechno) {
    const unique = {};
    rapportTechno.forEach(i => {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

  getCandidat() {
    this.apiClientService.get(API_URI_CANDIDATS + '/' + this.idCandidat).subscribe(data => {
      this.candidat = data;
      // console.log('this candid', this.candidat);
      this.rapport = data.raport_candidat.rapport;
      // console.log('this rapport', this.rapport);


      this.rapport.forEach(element => {
        this.rapportTechno.push(element.index_question.technologies);
        this.totalTime = this.totalTime + element.index_question.time;
        this.listereponse = element.index_question.content.split(', ');
        element.index_question.content = this.listereponse;
        // console.log('choix question =', this.listereponse);
        this.bonnereponse = element.index_question.answer_value.split(', ');
        element.index_question.answer_value = this.bonnereponse;
        // console.log('choix bonne reponse =', element.index_question.content);

      });
      console.log('this rapport ======>', this.rapport);

      this.uniquetechno = this.removeDuplicates(this.rapportTechno);
      this.uniquetechno.forEach(idTechno => {
        this.getTechno(idTechno);
      });
    });
  }

  getTechno(id) {
    this.apiClientService.get(API_URI_TECHNO + '/' + id).subscribe(data => {
      this.techno.push(data);
      // console.log('this techno', this.techno);
    });
  }

  fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    // return (m - (m %= 60)) / 60 + (9 < m ? ':' : ':0') + m;
  }
}
