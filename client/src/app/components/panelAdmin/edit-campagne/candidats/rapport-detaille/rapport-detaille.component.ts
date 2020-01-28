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
  public candidat: object = null;
  public rapport;
  public rapportTechno = [];
  public uniquetechno;
  public techno = [];

  constructor(route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.idCandidat = route.snapshot.params.idCandidat;

  }

  ngOnInit() {
    this.getCandidat();
  }

  removeDuplicates(rapportTechno) {
    const unique = {};
    rapportTechno.forEach( i => {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

 getCandidat() {
  this.apiClientService.get(API_URI_CANDIDATS + '/' + this.idCandidat).subscribe( data => {
    this.candidat = data;
    console.log('this candid', this.candidat);
    this.rapport = data.raport_candidat.rapport;
    console.log('this rap', this.rapport);
    this.rapport.forEach(element => {
     this.rapportTechno.push(element.index_question.technologies);


    });
    this.uniquetechno = this.removeDuplicates(this.rapportTechno);
    this.uniquetechno.forEach(idTechno => {
      this.getTechno(idTechno);
    });
  });
}

 getTechno(id) {
  this.apiClientService.get(API_URI_TECHNO + '/' + id).subscribe( data => {
    this.techno.push(data);
    console.log('this techno', this.techno);
  });
 }
}
