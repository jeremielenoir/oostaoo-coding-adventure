import { Component, OnInit, Inject } from '@angular/core';
import { ApiClientService } from 'src/app/api-client/api-client.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-interview-dialog',
  templateUrl: './interview-dialog.component.html',
  styleUrls: ['./interview-dialog.component.scss']
})
export class InterviewDialogComponent implements OnInit {

  candidatID: any[];
  public campaigns: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<InterviewDialogComponent>,
    public apiClientService: ApiClientService
  ) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  name_candidat = new FormControl('', [Validators.required]);

  close(){
    this.dialogRef.close()
  }

  ngOnInit() {
  }

}
