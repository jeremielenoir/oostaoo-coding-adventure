import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiClientService, API_URI_ISSUE } from 'src/app/api-client/api-client.service';
import { FormControl, Validators } from '@angular/forms';
import { DecryptTokenService } from '../../../home/register/register.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from 'src/app/components/home/register/service/auth.service';

@Component({
  selector: 'app-contact-formular',
  templateUrl: './contact-formular.component.html',
  styleUrls: ['./contact-formular.component.scss']
})
export class ContactFormularComponent implements OnInit {

  constructor(public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { }

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
  public useGlobalDomain = false;
  public captchaSuccess = false;

  ngOnInit() {
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['mat-snack-bar-container']
    });
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.cdr.detectChanges();
  }

  sendFormular() {
    this.submittedForm = true;
    if (this.nom.value === '' || this.email.value === '' || this.email.invalid || this.subject.value === '' || this.message.value === '' || this.captchaSuccess !== true) {
      this.openSnackBar('Une erreur a été recontrée, veuillez remplir tous les champs requis', 'Fermer');
      return console.log('Erreur veuillez remplir tout les champs requis');
    } else {
      this.apiClientService.post(API_URI_ISSUE, {
        Nom: this.nom.value,
        email: this.email.value,
        Subject: this.subject.value,
        Message: this.message.value
      }).subscribe(
        (res) => {
          this.openSnackBar('Le formulaire a bien été envoyé à l\'équipe support', 'Fermer');
          const currentUser = this.authenticationService.currentUserValue;
          if (currentUser) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/home']);
            window.scrollTo(0, 0);
          }

          // console.log('res', res);
        },
        err => console.log(err)
      );

    }
  }

}
