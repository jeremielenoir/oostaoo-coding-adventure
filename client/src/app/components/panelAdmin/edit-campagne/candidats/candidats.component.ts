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
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
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
      console.log('INIT DATAS', datas);
    });
  }

  getCampaign(): Promise<any> {

    const apiURL = API_URI_CAMPAIGNS + '/' + this.globalId;

    return this.apiClientService
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
        return this.campaigns;
      })
      .then((data) => {
        // INFOS FOR CANDIDATS TO PUSH IN DATA TABLE
        const defaultColumns = ['Checked', 'Candidats', 'Dernière activité', 'Score'];
        const getInfoCandidat = [];
        let dateInvite;
        for (const candidat of this.candidats) {
          console.log('candidat.invitation_date: ', candidat.invitation_date);
          dateInvite = new Date(candidat.invitation_date);
          getInfoCandidat.push({
            Candidats: candidat.Nom,
            Email: candidat.email,
            Checked: false,
            'Dernière activité': dateInvite.toLocaleString()
          });
        }
        // INFOS FOR ADD COLUMN
        const getTechnos = [];
        for (const technos of this.technologies) {
          getTechnos.push(technos.name);
        }
        this.displayedColumns = defaultColumns.concat(getTechnos, ['Durée']);
        return getInfoCandidat;
      }).then((getInfoCandidat) => {
        console.log('INFOS CANDIDATS', getInfoCandidat);
        this.infosCandidats = new MatTableDataSource(getInfoCandidat);
        this.infosCandidats.sort = this.sort;
        this.isLoading = false;
        return this.campaigns;
      })
      .catch(error => {
        console.log('ERROR', error);
      });
  }

  applyFilter(filterValue: string) {
    this.infosCandidats.filter = filterValue.trim().toLowerCase();
  }

}
