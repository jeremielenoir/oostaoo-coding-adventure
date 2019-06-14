import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ApiClientService, API_URI_CAMPAIGNS, API_URI_CANDIDATS } from '../../../../api-client/api-client.service';
import { InviteCandidat } from './invite-candidat.component';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})


export class CandidatsComponent implements OnInit {

  globalId: string;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {

    this.route.parent.params.subscribe((params) => {
      this.globalId = params.id;
      console.log('data', this.globalId);
    });
  }

  openDialog() {
    this.dialog.open(InviteCandidat, {
      data: this.globalId
    });
  }

  ngOnInit() {

  }
}