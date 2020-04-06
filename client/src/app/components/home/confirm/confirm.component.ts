import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `
    <h1 mat-dialog-title>
      {{title}}
    </h1>
    <div mat-dialog-content>
      <p [innerHTML]="message"></p>
    </div>

    <div mat-dialog-actions style="text-align: right; margin-bottom: 3px; margin-top: 5px;">
      <button mat-button (click)="onDismiss()">Non</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">Oui</button>
    </div>
  `,
  styleUrls: []
})
export class ConfirmComponent implements OnInit {

  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmModel {

  constructor(public title: string, public message: string) {
  }
}
