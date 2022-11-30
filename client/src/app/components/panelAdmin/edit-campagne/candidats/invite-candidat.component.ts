import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import {
  ApiClientService,
  API_URI_CAMPAIGNS,
} from '../../../../api-client/api-client.service';

@Component({
  selector: 'invite-candidat',
  templateUrl: './invite-candidat.html',
  styleUrls: ['./invite-candidat.scss']
})
export class InviteCandidat implements OnInit, OnDestroy {
  private subscription: Subscription;
  candidatID: any[];
  public campaigns: any;
  tests_available: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, any>,
    public dialogRef: MatDialogRef<InviteCandidat>,
    public apiClientService: ApiClientService
  ) {}

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  name_candidat = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.subscription = this.apiClientService
      .get(API_URI_CAMPAIGNS + '/' + this.data.globalId)
      .subscribe(datas => this.campaigns = [datas]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.dialogRef.close(this.tests_available);
  }
}
