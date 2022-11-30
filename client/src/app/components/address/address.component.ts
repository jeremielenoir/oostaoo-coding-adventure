import { Component, OnInit, Input, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  ApiClientService,
  API_URI_ADDRESS,
} from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  account: any;
  @Input() address: any;
  @Input() mode = 'show';
  @ViewChild('adForm') adForm: NgForm;

  inProgress = false;
  addressForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiClientService: ApiClientService,
    private dialogRef: MatDialogRef<AddressComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    if (dialogData) {
      this.mode = 'edit';
      this.account = dialogData;
      this.address = this.account.billing_address;
    }

    this.addressForm = this.formBuilder.group({
      line1: [this.address ? this.address.line1 : null, Validators.required],
      line2: [this.address ? this.address.line2 : null],
      postal_code: [
        this.address ? this.address.postal_code : null,
        Validators.required,
      ],
      city: [this.address ? this.address.city : null, Validators.required],
      state: [this.address ? this.address.state : null, Validators.required],
      country: [
        this.address ? this.address.country : null,
        Validators.required,
      ],
    });
  }
  /**
   *
   */
  ngOnInit() {}
  /**
   *
   */
  onCloseModal() {
    this.dialogRef.close(this.account.billing_address);
  }
  /**
   *
   */
  onSubmit(addressData) {
    this.inProgress = true;

    if (this.address) {
      addressData.id = this.address.id;
      this.apiClientService
        .put(API_URI_ADDRESS + '/' + addressData.id, addressData)
        .subscribe(
          (data) => {
            this.dialogRef.close(data);
          },
          (err) => {
            this.inProgress = true;
            // TODO Handle error
          },
        );
    } else {
      this.apiClientService.post(API_URI_ADDRESS, addressData).subscribe(
        (data) => {
          this.dialogRef.close(data);
        },
        (err) => {
          this.inProgress = true;
          // TODO Handle error
        },
      );
    }
  }

  send() {
    this.adForm.ngSubmit.emit();
  }
}
