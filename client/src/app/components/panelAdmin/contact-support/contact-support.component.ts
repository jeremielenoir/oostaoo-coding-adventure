import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiClientService, API_URI_ISSUE } from 'src/app/api-client/api-client.service';
import { FormControl, Validators } from '@angular/forms';
import { DecryptTokenService } from '../../home/register/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
