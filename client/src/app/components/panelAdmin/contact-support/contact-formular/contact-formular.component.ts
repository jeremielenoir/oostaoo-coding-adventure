import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiClientService, API_URI_ISSUE } from 'src/app/api-client/api-client.service';
import { FormControl, Validators } from '@angular/forms';
import { DecryptTokenService } from '../../../home/register/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-formular',
  templateUrl: './contact-formular.component.html',
  styleUrls: ['./contact-formular.component.scss']
})
export class ContactFormularComponent implements OnInit {

  constructor(public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    private cdr: ChangeDetectorRef,
    private router: Router) { }

  submittedForm = false;
  nom = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  subject = new FormControl('', Validators.required);
  message = new FormControl('', Validators.required);
  recaptcha = new FormControl('', Validators.required);

  public readonly siteKey = '6LdAf-AUAAAAACX5tqKig64A4zgc-Q7EA44fxE-9';
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'fr';
  public type: 'image' | 'audio';
  public useGlobalDomain: boolean = false;
  public captchaSuccess = false;

  ngOnInit() {
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.cdr.detectChanges();
  }

  sendFormular() {
    this.submittedForm = true;
    if (this.nom.value === '' || this.email.value === '' || this.email.invalid || this.subject.value === '' || this.message.value === '' || this.captchaSuccess !== true) {
      return console.log('Erreur veuillez remplir tout les champs requis');
    } else {
      this.apiClientService.post(API_URI_ISSUE, {
        Nom: this.nom.value,
        email: this.email.value,
        Subject: this.subject.value,
        Message: this.message.value
      }).subscribe(
        (res) => {
          this.router.navigate(['/dashboard']);
          // console.log('res', res);
        },
        err => console.log(err)
      );

    }
  }

}
