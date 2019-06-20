import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { InviteCandidat } from './invite-candidat.component';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})
export class CandidatsComponent implements OnInit {
  public globalId: string;
  public campaigns;
  ViewCandidats = 'CandidatTrue';
  choices = [
    {value: 'exporter', viewValue: 'Exporter'},
    {value: 'anonymiser', viewValue: 'Anonymiser'},
    {value: 'supprimer', viewValue: 'Supprimer'}
  ];
  choicesTimeTest = [
    {value: 'attente', viewValue: 'En attente'},
    {value: 'terminer', viewValue: 'Terminés'},
    {value: 'expirer', viewValue: 'Expirés'}
  ];

  constructor(public dialog: MatDialog, private route: ActivatedRoute, public apiClientService: ApiClientService) {
    this.route.parent.params.subscribe(params => {
      this.globalId = params.id;
      // console.log('data', this.globalId);
    });
  }

  openDialog() {
    this.dialog.open(InviteCandidat, {
      data: this.globalId,
      height: '80vh'
    });
  }

  ngOnInit() {
    this.apiClientService
    .get(API_URI_CAMPAIGNS + '/' + this.globalId)
    .subscribe(datas => {
      this.campaigns = [datas];
      console.log('id campaign', this.campaigns);
    });
  }

  displayedColumns: string[] = ['select', 'candidats', 'email', 'derniere_activite', 'score', 'technos'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}

export interface PeriodicElement {
  position: number;
  candidats: string;
  email: string;
  derniere_activite: string;
  score: number;
  technos: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position : 1, candidats: 'test', email: 'test@test', derniere_activite: 'Hydrogen', score: 1.0079, technos: 'H'},
  {position: 2, candidats: 'test2', email: 'test2@test', derniere_activite: 'Helium', score: 4.0026, technos: 'He'},
];
