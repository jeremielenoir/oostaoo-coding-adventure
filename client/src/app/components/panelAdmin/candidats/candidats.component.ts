import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ApiClientService, API_URI_CAMPAIGNS, API_URI_CANDIDATS } from '../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats',
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})


export class Candidats implements OnInit {

  globalID: any;
  
  // constructor() { }

  constructor(public dialog: MatDialog, r: ActivatedRoute) {
    r.url.subscribe((u) => {
      this.globalID = r.snapshot.params.id;
    });
  }

  openDialog() {
    this.dialog.open(InviteCandidat, {
      data: this.globalID
    });
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
  candidatID: any[];
  public campaigns: any;
  constructor(public dialogRef: MatDialogRef<InviteCandidat>, @Inject(MAT_DIALOG_DATA) public data: any, public apiClientService: ApiClientService) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  name_candidat = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit() {
    // will log the entire data object
    console.log("params id",this.data) //show id pass in params router
    this.apiClientService
      .get(API_URI_CAMPAIGNS + "/" + this.data)
      .subscribe((datas) => {
        this.campaigns = [datas];
        console.log("id campaign", this.campaigns);
      });
  }
  postCandidat() {
    this.apiClientService.post(API_URI_CANDIDATS, {
      "Nom": this.name_candidat.value,
      "email": this.emailFormControl.value,
    }).subscribe(
      (res) => {
        this.candidatID = res.id
        console.log("id candidats", this.candidatID);
      },
      err => console.log(err)
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.name_candidat.value)
  }
}
