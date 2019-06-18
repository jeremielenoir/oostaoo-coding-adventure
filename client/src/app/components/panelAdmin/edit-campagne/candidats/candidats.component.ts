import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { InviteCandidat } from './invite-candidat.component';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})
export class CandidatsComponent implements OnInit {
  public globalId: string;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
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

  ngOnInit() { }
}
