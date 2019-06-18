import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
  API_URI_CANDIDATS
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats-mail',
  templateUrl: './candidats-mail.component.html',
  styleUrls: ['./candidats-mail.component.css']
})
export class CandidatsMailComponent implements OnInit {
  public campaigns: any;
  public candidats: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public apiClientService: ApiClientService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<CandidatsMailComponent>) { }

  ngOnInit() {
      // console.log('data campaign id', this.data.globalId);
      // console.log('all data: ' + this.data);
      // console.log('data candidat id: ', this.data.candidatId);
      this.apiClientService
        .get(API_URI_CAMPAIGNS + '/' + this.data.globalId)
          .subscribe(datas => {
          this.campaigns = [datas];
          console.log(this.campaigns);
      });

      for (let index = 0; index < this.data.candidatId.length; index++) {
      console.log('id :' + this.data.candidatId[index]);
      this.apiClientService
            .get(API_URI_CANDIDATS + '/' + this.data.candidatId[index])
              .subscribe(datas => {
            this.candidats = [datas];
          });
    }
  }
  updateCampaign() {
    this.apiClientService.put(API_URI_CAMPAIGNS + '/' + this.data.globalId, {
      candidats: this.candidats
    }).subscribe(
      (res) => {
        console.log(res);
      },
      err => console.log(err)
    );
  }

  onClose(): void {
    this.dialog.closeAll();
  }
  retourCandidat() {
    this.dialogRef.close();
  }

  showCandidats(){
    console.log(this.candidats);
  }
}
