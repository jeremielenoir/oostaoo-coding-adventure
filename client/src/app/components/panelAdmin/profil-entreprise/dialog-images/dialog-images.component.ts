import { ApiClientService, UPLOAD_TO_STRAPI } from 'src/app/api-client/api-client.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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

  constructor(public dialogRef: MatDialogRef<DialogImagesComponent>, private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public apiClientService: ApiClientService) {
    this.imageForm = this.formBuilder.group({
      image: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.disabled = true;
    // console.log('data : ', this.data);
    this.limit = this.data['limit'];
    this.limit_size = this.data['limit_size'];
    this.type_size = this.data['type_size'];
    this.dataFormFile = { refId: this.data['refId'], ref: this.data['ref'], field: this.data['field'] };
  }

  uploadFile(event) {
    if (event.length <= this.limit) {
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        // console.log('element : ', element);
        if (this.formatBytes(element.size) && element.type === 'image/png' ||
          this.formatBytes(element.size) && element.type === 'image/gif' ||
          this.formatBytes(element.size) && element.type === 'image/jpeg') {
          this.files.push({
            name: element.name, url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(element)),
            properties: element
          });
        } else {
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
    const formData = new FormData();
    for (const file of this.files) {
      formData.append('files', file.properties);
      formData.append('refId', this.dataFormFile['refId']); // id of content type
      formData.append('ref', this.dataFormFile['ref']); // name of content type
      formData.append('field', this.dataFormFile['field']); // name of key for the content type
    }
    this.closeDialog({ formData: formData, field: this.dataFormFile['field'], files: this.files });
  }
}
