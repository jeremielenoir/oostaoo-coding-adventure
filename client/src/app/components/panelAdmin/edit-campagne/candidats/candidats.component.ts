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
  styleUrls: ['./candidats.component.scss'],
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
        // console.log('AFTER CLOSE ALL DATAS', datas);
      });
    });

  }

  ngOnInit() {
    this.getCampaign().then(datas => {
      // console.log('INIT DATAS', datas);
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
        let percentCandidat;
        let duree;
        // INFOS FOR ADD COLUMN
        const getTechnos = [];
        const getPercentCandidat = [];
        for (const technos of this.technologies) {
          getTechnos.push(technos.name);
        }
        this.displayedColumns = defaultColumns.concat(getTechnos, ['Durée']);
        // console.log('getTechnos: ', getTechnos);
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
            percentCandidat = candidat.points_candidat[5].PourcentTest + '%';
          }
          getInfoCandidat.push({
            Candidats: candidat.Nom,
            Email: candidat.email,
            Checked: false,
            'Dernière activité': dateInvite.toLocaleString(),
            Score: percentCandidat,
            Durée: duree
          });
          // console.log('candidat.points_candidat[2].getpourcentByCandidat: ', candidat.points_candidat[2].getpourcentByCandidat);
          if (candidat.invitation_date !== candidat.test_terminer) {
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

          console.log('candidat: ', candidat);
        }
        console.log('getTechnos: ', getTechnos);
        console.log('this.displayedColumns : ', this.displayedColumns);
        console.log('getInfoCandidat : ', getInfoCandidat);
        console.log('getPercentCandidat: ', getPercentCandidat);
        return getInfoCandidat;
      }).then((getInfoCandidat) => {
        // console.log('INFOS CANDIDATS', getInfoCandidat);
        this.infosCandidats = new MatTableDataSource(getInfoCandidat);
        this.infosCandidats.sort = this.sort;
        this.isLoading = false;
        return this.campaigns;
      })
      .catch(error => {
        console.log('ERROR', error);
      });
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

}
