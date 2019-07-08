import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { InviteCandidat } from './invite-candidat.component';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css'],
})
export class CandidatsComponent implements OnInit {
  public globalId: string;
  public campaigns;
  public candidats;
  public technologies;
  public displayedColumns;
  public infosCandidats;
  ViewCandidats;

  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
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
    this.dialog.open(InviteCandidat, {
      data: this.globalId,
      height: '80vh'
    });
  }

  ngOnInit() {
    this.getCampaign();
  }

  getCampaign() {
    const promise = new Promise((resolve, reject) => {
      const apiURL = API_URI_CAMPAIGNS + '/' + this.globalId;
      this.apiClientService
        .get(apiURL)
        .toPromise()
        .then(res => { // Success
          this.campaigns = res;
          // console.log('this.campaign: ', this.campaigns);
          this.candidats = res.candidats;
          // console.log('this.candidats: ', this.candidats);
          this.technologies = res.technologies;
          // console.log('this.technologies: ', this.technologies);
          if (this.campaigns.candidats.length > 0) {
            this.ViewCandidats = 'CandidatTrue';
          } else {
            this.ViewCandidats = 'CandidatFalse';
          }
          resolve(this.campaigns);
        }, msg => reject(msg));
      return promise;
    }).then((data) => {
      console.log('data: ', data);
      // INFOS FOR CANDIDATS TO PUSH IN DATA TABLE
      const defaultColumns = ['Checked', 'Candidats', 'Dernière activité', 'Score'];
      const getInfoCandidat = [];
      for (const candidat of this.candidats) {
        getInfoCandidat.push({
          Candidats: candidat.Nom,
          Email: candidat.email,
          Checked: false
        });
      }
      // INFOS FOR ADD COLUMN
      const getTechnos = [];
      for (const technos of this.technologies) {
        getTechnos.push(technos.name);
      }
      this.displayedColumns = defaultColumns.concat(getTechnos, ['Durée']);
      console.log('candidats campaign: ', getInfoCandidat);
      setTimeout(() => {
        this.infosCandidats = new MatTableDataSource(getInfoCandidat);
        this.infosCandidats.sort = this.sort;
      }, 1000);
    });
  }

  applyFilter(filterValue: string) {
    this.infosCandidats.filter = filterValue.trim().toLowerCase();
  }
}
