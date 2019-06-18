import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import {
  ApiClientService,
  API_URI_CAMPAIGNS
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'app-candidats-mail',
  templateUrl: './candidats-mail.component.html',
  styleUrls: ['./candidats-mail.component.css']
})
export class CandidatsMailComponent implements OnInit {
  public campaigns: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
    public apiClientService: ApiClientService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CandidatsMailComponent>) { }

  ngOnInit() {
    console.log('data', this.data.globalId);
    console.log('data', this.data.candidatId);
    this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.data.globalId)
      .subscribe(datas => {
        this.campaigns = [datas];
      });
    setTimeout(() => {
      console.log(this.campaigns)
    }, 2000);
  }
  onClose(): void {
    this.dialog.closeAll();
  }
  retourCandidat() {
    this.dialogRef.close();
  }
}
