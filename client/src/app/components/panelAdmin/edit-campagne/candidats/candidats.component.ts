import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { InviteCandidat } from './invite-candidat.component';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
} from '../../../../api-client/api-client.service';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class CandidatsComponent implements OnInit {

  constructor(public dialog: MatDialog, private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);

      // Create 100 users
      const users = Array.from({ length: 5 }, (_, k) => createNewUser(k + 1));

      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(users);
    });
  }
  public globalId: string;
  public campaigns;
  public candidats;
  public technologies;
  ViewCandidats;
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
    this.dataSource.sort = this.sort;
  }
  getCampaign() {
    const promise = new Promise((resolve, reject) => {
      const apiURL = API_URI_CAMPAIGNS + '/' + this.globalId;
      this.apiClientService
        .get(apiURL)
        .toPromise()
        .then(res => { // Success
          this.campaigns = res;
          console.log('this.campaign: ', this.campaigns);
          this.candidats = res.candidats;
          console.log('this.candidats: ', this.candidats);
          this.technologies = res.technologies;
          console.log('this.technologies: ', this.technologies);
          if (this.campaigns.candidats.length > 0) {
            this.ViewCandidats = 'CandidatTrue';
          } else {
            this.ViewCandidats = 'CandidatFalse';
          }
          resolve(this.campaigns);
        }, msg => reject(msg));
      return promise;
    });
  }

  getCandidats() {
    for (let index = 0; index < this.candidats.length; index++) {
      const element = this.candidats[index];
      console.log(element);
    }
  }

  displayedColumns: string[] = this.technologies.map(column => column.name);
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

// export interface UserData {
//   id: string;
//   name: string;
//   progress: string;
//   color: string;
// }

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
