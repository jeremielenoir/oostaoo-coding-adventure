import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {  ApiClientService, API_URI_USER, API_URI_USER_ADMIN} from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';

@Component({
  selector: 'app-profil-utilisateur',
  templateUrl: './profil-utilisateur.component.html',
  styleUrls: ['./profil-utilisateur.component.scss']
})
export class ProfilUtilisateurComponent implements OnInit {

  constructor(public apiClientService: ApiClientService,  public decryptTokenService: DecryptTokenService) {
  }

  public globalId: any;
  public user: any;

  dateExp: string | number | Date;
  NewDateExp: Date;

  prenom = new FormControl('', Validators.required);
  nom = new FormControl('', Validators.required);
  pays = new FormControl('', Validators.required);
  langue = new FormControl('', Validators.required);
  tel = new FormControl('', Validators.required);
  mobile = new FormControl('', Validators.required);
  fonction = new FormControl('', Validators.required);
  signature = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  newpassword = new FormControl('', Validators.required);

  ngOnInit() {
    this.getUser().then(user => {
      console.log(user);
      this.prenom = new FormControl(user[0].prenom);
      this.nom = new FormControl(user[0].nom);
      this.pays = new FormControl(user[0].pays);
      this.langue = new FormControl(user[0].langue);
      this.tel = new FormControl(user[0].tel);
      this.mobile = new FormControl(user[0].mobile);
      this.fonction = new FormControl(user[0].function);
      this.signature = new FormControl(user[0].signature);
      this.email = new FormControl(user[0].email);
      this.password = new FormControl(user[0].password);
     // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
    });
  }

  updateprofil() {

    this.apiClientService.put(API_URI_USER_ADMIN + '/' + 1, {
      Prenom: this.prenom.value,
      Nom: this.nom.value,
      Pays: this.pays.value,
      Langue: this.langue.value,
      Tel: this.tel.value,
      mobile: this.mobile.value,
      function: this.fonction.value,
    }).subscribe(
      (res) => {
        alert('Profil mis à jour');
       // console.log('res', res);
      },
      err => console.log(err)
    );
    console.log( 'form profil =', this.prenom.value,
                 this.nom.value, this.pays.value,
                 this.langue.value, this.tel.value, this.mobile.value, this.fonction.value );
 }

 updatesignature() {
  this.apiClientService.put(API_URI_USER_ADMIN + '/' + 1, {
    Signature: this.signature.value,
  }).subscribe(
    (res) => {
      alert('Profil mis à jour');
     // console.log('res', res);
    },
    err => console.log(err)
  );
  console.log( 'form signature =', this.signature.value );
}

updateemail() {
  this.apiClientService.put(API_URI_USER_ADMIN + '/' + 1, {
    Email: this.email.value,
  }).subscribe(
    (res) => {
      alert('Profil mis à jour');
     // console.log('res', res);
    },
    err => console.log(err)
  );
  console.log( 'form email =', this.email.value );
}

updatepassword() {
  this.apiClientService.put(API_URI_USER_ADMIN + '/' + 1, {
    password: this.newpassword.value,
  }).subscribe(
    (res) => {
      alert('Profil mis à jour');
     // console.log('res', res);
    },
    err => console.log(err)
  );
  console.log( 'form password =', this.newpassword.value);
}

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER + '/' + this.decryptTokenService.userId)
        .toPromise();
      return this.user = [datas];
    } catch (err) {
      return err;
    }
  }

}
