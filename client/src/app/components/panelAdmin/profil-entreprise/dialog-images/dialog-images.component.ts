import { ApiClientService, UPLOAD_TO_STRAPI } from 'src/app/api-client/api-client.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogData } from '../../campagne/campagne.component';

@Component({
  selector: 'app-dialog-images',
  templateUrl: './dialog-images.component.html',
  styleUrls: ['./dialog-images.component.scss']
})
export class DialogImagesComponent implements OnInit {
  imageForm: FormGroup;
  disabled: boolean;
  files: any = [];
  show = true;
  limit = 0;
  limit_size = 0;
  type_size = '';
  dataFormFile = {};
  submit: boolean;

  constructor(public dialogRef: MatDialogRef<DialogImagesComponent>, private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public apiClientService: ApiClientService, private _snackBar: MatSnackBar) {
    this.imageForm = this.formBuilder.group({
      image: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.submit = false;
    this.limit = this.data['limit'];
    this.limit_size = this.data['limit_size'];
    this.type_size = this.data['type_size'];
    this.dataFormFile = { refId: this.data['refId'], ref: this.data['ref'], field: this.data['field'] };
    this.files = this.data['images'] ? this.data['images'] : [];
    if (this.files.length < 1) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    console.log('this.files : ', this.files);
  }

  uploadFile(event) {
    if (this.files.length + event.length <= this.limit) {
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        if (this.formatBytes(element.size) && element.type === 'image/png' ||
          this.formatBytes(element.size) && element.type === 'image/gif' ||
          this.formatBytes(element.size) && element.type === 'image/jpeg') {
          this.files.push({
            name: element.name, url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(element)),
            properties: element
          });
          console.log('this.files : ', this.files);
        } else {
          this.openSnackBar('Fichier trop volumineux ou type du fichier non accepté', 'Fermer');
          console.log('return "show popup" type unknown, limit size depassed'); // show limits? and type of files
        }
      }
      if (this.files.length > 0) {
        if (this.files.length === this.limit) {
          this.show = false;
        }
        this.disabled = false;
      } else {
        this.show = true;
        this.disabled = true;
      }
    } else {
      this.openSnackBar('Limite des fichiers dépassés', 'Fermer');
      console.log('return "show popup" limit files depassed'); // show limit files?
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
    if (this.files.length > 0) {
      if (this.files.length === this.limit) {
        this.show = false;
      }
      this.disabled = false;
    } else {
      this.show = true;
      this.disabled = true;
    }
  }

  closeDialog(data) {
    this.dialogRef.close(data);
  }

  formatBytes(bytes) {
    const kb = 1024;
    const ndx = Math.floor(Math.log(bytes) / Math.log(kb));
    const fileSizeTypes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
    // console.log('description Files : ', {
    //   size: +(bytes / kb / kb).toFixed(2),
    //   type: fileSizeTypes[ndx],
    //   file_limit_size: this.limit_size
    // });
    if (+(bytes / kb / kb).toFixed(2) <= this.limit_size) {
      return true;
    } else {
      console.log('ERROR : file to big');
      return false;
    }
  }

  onSubmit() {
    this.submit = true;

    if (this.submit) {
      this.closeDialog({ properties: this.dataFormFile, files: this.files, submit: this.submit });
    }
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['mat-snack-bar-container']
    });
  }
}
