import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {  ApiClientService, API_URI_USER, API_URI_USER_ADMIN} from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profil-utilisateur',
  templateUrl: './profil-utilisateur.component.html',
  styleUrls: ['./profil-utilisateur.component.scss']
})
export class ProfilUtilisateurComponent implements OnInit {

  constructor(public apiClientService: ApiClientService,  public decryptTokenService: DecryptTokenService, private _snackBar: MatSnackBar) {
  }

  public globalId: any;
  public user: any;

  dateExp: string | number | Date;
  NewDateExp: Date;

  submittedPassword = false;
  submittedProfil = false;
  submittedEmail = false;
  prenom = new FormControl('', Validators.required);
  nom = new FormControl('', Validators.required);
  pays = new FormControl('', Validators.required);
  langue = new FormControl('', Validators.required);
  tel = new FormControl('', Validators.required);
  mobile = new FormControl('', Validators.required);
  fonction = new FormControl('', Validators.required);
  signature = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  newEmail = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  newpassword = new FormControl('', Validators.required);
  confirmpassword = new FormControl('', Validators.required);

  ngOnInit() {
    this.getUser().then(user => {
      console.log(user);
      this.prenom = new FormControl(user[0].prenom, Validators.required);
      this.nom = new FormControl(user[0].nom, Validators.required);
      this.pays = new FormControl(user[0].pays, Validators.required);
      this.langue = new FormControl(user[0].langue);
      this.tel = new FormControl(user[0].tel);
      this.mobile = new FormControl(user[0].mobile);
      this.fonction = new FormControl(user[0].function, Validators.required);
      this.signature = new FormControl(user[0].signature);
      this.email = new FormControl(user[0].email, [Validators.required, Validators.email]);
      this.password = new FormControl(user[0].password, Validators.required);
     // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
    });
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  updateprofil() {
    this.submittedProfil = true;
    if (this.prenom.value === '' || this.nom.value === '' || this.pays.value === '' || this.langue.value === 'value') {
      this.openSnackBar("Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
    } else {
    this.apiClientService.put(API_URI_USER + '/' + this.decryptTokenService.userId, {
      Prenom: this.prenom.value,
      Nom: this.nom.value,
      Pays: this.pays.value,
      Langue: this.langue.value,
      Tel: this.tel.value,
      mobile: this.mobile.value,
      function: this.fonction.value,
    }).subscribe(
      (res) => {
        this.openSnackBar("Le profil a correctement été mis à jour", "Fermer")
       // console.log('res', res);
      },
      err => console.log(err)
    );
    console.log( 'form profil =', this.prenom.value,
                 this.nom.value, this.pays.value,
                 this.langue.value, this.tel.value, this.mobile.value, this.fonction.value );
 }
}

 updatesignature() {
  this.apiClientService.put(API_URI_USER + '/' + this.decryptTokenService.userId, {
    Signature: this.signature.value,
  }).subscribe(
    (res) => {
      this.openSnackBar("La signature a correctement été modifiée", "Fermer")
     // console.log('res', res);
    },
    err => this.openSnackBar("Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer")
  );
  console.log( 'form signature =', this.signature.value );
}

updateemail() {
  this.submittedEmail = true;
  if (this.email.value === '' || this.newEmail.value === '' || this.email.invalid || this.newEmail.invalid) {
    this.openSnackBar("Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
  } else {
  this.apiClientService.put(API_URI_USER + '/' + this.decryptTokenService.userId, {
    Email: this.newEmail.value,
  }).subscribe(
    (res) => {
      this.openSnackBar("L'email a correctement été modifié", "Fermer")
     // console.log('res', res);
    },
    err => console.log(err)
  );
  console.log( 'form email =', this.newEmail.value );
  }
}

updatepassword() {

  this.submittedPassword = true;
  if (this.newpassword.value === null || this.newpassword.value === '' || this.newpassword.value !== this.confirmpassword.value) {
    this.openSnackBar("Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
  } else {
  this.apiClientService.put(API_URI_USER + '/' + this.decryptTokenService.userId, {
    password: this.newpassword.value,
  }).subscribe(
    (res) => {
      this.openSnackBar("Le mot de passe a correctement été modifié", "Fermer")
     // console.log('res', res);
    },
    err => console.log(err)
  );
  console.log( 'form password =', this.newpassword.value);
  }
}

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER + '/' + this.decryptTokenService.userId)
        .toPromise();
        console.log('profil-utilisateur/ get User / datas : ', datas);
        console.log('profil-utilisateur/ localStorage currentUser : ', localStorage.getItem('currentUser'));
      return this.user = [datas];
    } catch (err) {
      return err;
    }
  }

}
