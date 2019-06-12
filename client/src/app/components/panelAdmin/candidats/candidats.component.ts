import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})


export class Candidats implements OnInit {
  constructor(public dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(InviteCandidat);
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'invite-candidat',
  templateUrl: './invite-candidat.html',
  styleUrls: ['./invite-candidat.css']
})

export class InviteCandidat {
  constructor(public dialogRef: MatDialogRef<InviteCandidat>, ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
