import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {  ApiClientService, API_URI_USER_ADMIN} from 'src/app/api-client/api-client.service';

@Component({
  selector: 'app-profil-utilisateur',
  templateUrl: './profil-utilisateur.component.html',
  styleUrls: ['./profil-utilisateur.component.css']
})
export class ProfilUtilisateurComponent implements OnInit {

  constructor(public apiClientService: ApiClientService) {
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
    console.log( 'form profil =', this.prenom.value,
                 this.nom.value, this.pays.value,
                 this.langue.value, this.tel.value, this.mobile.value, this.fonction.value );
 }

 updatesignature() {
  console.log( 'form signature =', this.signature.value );
}

updateemail() {
  console.log( 'form email =', this.email.value );
}

updatepassword() {
  console.log( 'form password =', this.newpassword.value);
}

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER_ADMIN + '/' +  1)
        .toPromise();
      return this.user = [datas];
    } catch (err) {
      return err;
    }
  }

}
