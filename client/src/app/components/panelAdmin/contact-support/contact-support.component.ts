import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(public apiClientService: ApiClientService,
    private toastr: ToastrService,
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

  showSuccess(message) {
    this.toastr.success(message);
  }
  showError(message) {
    this.toastr.info(message);
  }

  sendFormular() {
    this.submittedForm = true;
    if (this.nom.value === '' || this.email.value === '' || this.email.invalid || this.subject.value === '' || this.message.value === '' || this.captchaSuccess !== true) {
      this.showError('Erreur veuillez correctement remplir tous les champs requis');
      return console.log('Erreur veuillez remplir tout les champs requis');
    } else {
    this.apiClientService.post(API_URI_ISSUE, {
      Nom: this.nom.value,
      email: this.email.value,
      Subject: this.subject.value,
      Message: this.message.value
    }).subscribe(
      (res) => {
        this.showSuccess("Le formulaire a correctement été envoyé à l'équipe de support");
        this.router.navigate(['/dashboard']);
       // console.log('res', res);
      },
      err => console.log(err)
    );
    
 }
}
}
