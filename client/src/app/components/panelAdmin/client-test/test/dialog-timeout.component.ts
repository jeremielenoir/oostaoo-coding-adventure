import { Component, OnInit, Output, EventEmitter, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

export interface IDialogData {
  preview: boolean;
}

@Component({
  selector: 'app-dialog-timeout',
  templateUrl: 'dialog-timeout.html',
  styleUrls: ['dialog-timeout.scss']
})

export class DialogTimeoutComponent implements OnInit {
  @Output('nextQuestion') public nextQuestion = new EventEmitter<void>();
  dataPopup: IDialogData;
  public prev = false;

  constructor(public dialogRef: MatDialogRef<DialogTimeoutComponent>, @Inject(MAT_DIALOG_DATA) public data: IDialogData) {
    if (data) {
      this.dataPopup = data;
      this.prev = true;
    }
  }

  ngOnInit() {
    console.log('this.dataPopup : ', this.dataPopup);
  }

  refreshComponent($event): void {
    console.log('REFRESH COMPONENT');
  }

  public next() {
    console.log('toto');
    this.nextQuestion.emit();
    this.dialogRef.close();
  }
}
