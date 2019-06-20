import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TooltipPosition } from '@angular/material';
// import { DataSource } from '@angular/cdk/table';



export interface PeriodicElement {
  name: string;
  mail: string;
  gestion: string;
  symbol: string;

}



const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Jérémie Lenoir', mail: 'Hydrogen', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Helium', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Lithium', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Beryllium', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Boron', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Carbon', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Nitrogen', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Oxygen', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Fluorine', gestion: 'Privileges', symbol: '' },
  { name: 'Jérémie Lenoir', mail: 'Neon', gestion: 'Privileges', symbol: '' },

];

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})

export class UtilisateursComponent implements OnInit {

  // public dataSource = new MatTableDataSource<Owner>();

  nom = null;
  prenom = null;
  email = null;
  text_label = null;
  title_champ_default = null;

  // update form

  update_nom = null;
  update_prenom = null;
  update_email = null;
  text_label_update = null;
  title_champ_default_update = null;

  constructor() { }

  ngOnInit() {

    this.nom = document.getElementById('nom');
    this.prenom = document.getElementById('prenom');
    this.email = document.getElementById('email');
    this.text_label = document.querySelectorAll('.libele');
    this.title_champ_default = document.querySelectorAll('.title-champ-default');

    // update infféctation

    this.update_nom = document.getElementById('update_nom');
    this.update_prenom = document.getElementById('update_prenom');
    this.update_email = document.getElementById('update_email');
    this.text_label_update = document.querySelectorAll('.update_libele');
    this.title_champ_default_update = document.querySelectorAll('.title-champ-default-update');

  }


  public param_cog() {

    const element = document.getElementById('shadow-cog');
    element.classList.add('shadow-cog-active')

  }

  public param_cog_non_active() {

    const element = document.getElementById('shadow-cog');

    element.classList.remove('shadow-cog-active')

  }

  public param_cog_deux() {

    const element = document.getElementById('shadow-cog-2');
    element.classList.add('shadow-cog-active')

    console.log('salut cog 2')

  }

  public param_cog_non_active_deux() {

    const element = document.getElementById('shadow-cog-2');

    element.classList.remove('shadow-cog-active')

  }

  public Hundelesubmit() {


    if (this.nom.value === '') {
      this.nom.classList.add('errorChamp');
      this.text_label[1].classList.add('new-label')
      this.title_champ_default[1].classList.add('title-champ-default-visible')

    }

    if (this.prenom.value === '') {

      this.prenom.classList.add('errorChamp');
      this.text_label[0].classList.add('new-label');
      this.title_champ_default[0].classList.add('title-champ-default-visible')

    }

    if (this.email.value === '') {

      this.email.classList.add('errorChamp');
      this.text_label[2].classList.add('new-label');
      this.title_champ_default[2].classList.add('title-champ-default-visible')

    }

  }

  public is_valid_prenom(event) {

    if (this.prenom.value.length < 1) {

      this.prenom.classList.add('errorChamp');
      this.text_label[0].classList.add('new-label')
      this.title_champ_default[0].classList.add('title-champ-default-visible')

    } else {

      this.prenom.classList.remove('errorChamp');
      this.text_label[0].classList.remove('new-label')
      this.title_champ_default[0].classList.remove('title-champ-default-visible')
    }



  }

  public is_valid_nom(event) {

    if (this.nom.value.length < 1) {

      this.nom.classList.add('errorChamp');
      this.text_label[1].classList.add('new-label');
      this.title_champ_default[1].classList.add('title-champ-default-visible')


    } else {

      this.nom.classList.remove('errorChamp');
      this.text_label[1].classList.remove('new-label');
      this.title_champ_default[1].classList.remove('title-champ-default-visible')

    }

  }

  public is_valid_email(event) {

    const verify_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(email);

    if (this.email.value.length < 1) {

      this.email.classList.add('errorChamp');
      this.text_label[2].classList.add('new-label');
      this.title_champ_default[2].classList.add('title-champ-default-visible');

      this.title_champ_default[2].innerHTML = 'Obligatoire';


    } else {

      if (verify_mail.test(this.email.value)) {

        this.email.classList.remove('errorChamp');
        this.text_label[2].classList.remove('new-label');
        this.title_champ_default[2].classList.remove('title-champ-default-visible');

      } else {
        this.title_champ_default[2].innerHTML = 'Email invalide';

        this.email.classList.add('errorChamp');
        this.text_label[2].classList.add('new-label');
        this.title_champ_default[2].classList.add('title-champ-default-visible');
      }

    }

  }

  public Hundelesubmit_modif() {


    if (this.update_nom.value === '') {
      this.update_nom.classList.add('errorChamp');
      this.text_label_update[1].classList.add('new-label')
      this.title_champ_default_update[1].classList.add('title-champ-default-visible')

    }

    if (this.update_prenom.value === '') {

      this.update_prenom.classList.add('errorChamp');
      this.text_label_update[0].classList.add('new-label');
      this.title_champ_default_update[0].classList.add('title-champ-default-visible')

    }

    if (this.update_email.value === '') {

      this.update_email.classList.add('errorChamp');
      this.text_label_update[2].classList.add('new-label');
      this.title_champ_default_update[2].classList.add('title-champ-default-visible')

    }

  }


  public is_valid_prenom_update(event) {

    if (this.update_prenom.value.length < 1) {

      this.update_prenom.classList.add('errorChamp');
      this.text_label_update[0].classList.add('new-label');
      this.title_champ_default_update[0].classList.add('title-champ-default-visible');

    } else {

      this.update_prenom.classList.remove('errorChamp');
      this.text_label_update[0].classList.remove('new-label');
      this.title_champ_default_update[0].classList.remove('title-champ-default-visible');
    }



  }

  public is_valid_nom_update(event) {

    if (this.update_nom.value.length < 1) {

      this.update_nom.classList.add('errorChamp');
      this.text_label_update[1].classList.add('new-label');
      this.title_champ_default_update[1].classList.add('title-champ-default-visible');

    } else {

      this.update_nom.classList.remove('errorChamp');
      this.text_label_update[1].classList.remove('new-label');
      this.title_champ_default_update[1].classList.remove('title-champ-default-visible');
    }



  }

  public is_valid_email_update(event) {

    if (this.update_email.value.length < 1) {

      this.update_email.classList.add('errorChamp');
      this.text_label_update[2].classList.add('new-label');
      this.title_champ_default_update[2].classList.add('title-champ-default-visible');

    } else {

      this.update_email.classList.remove('errorChamp');
      this.text_label_update[2].classList.remove('new-label');
      this.title_champ_default_update[2].classList.remove('title-champ-default-visible');
    }

  }

  // function filter table utilisateurs 


  displayedColumns: string[] = ['name', 'mail', 'gestion', 'symbol'];

  dataSource = ELEMENT_DATA;

  // doFilter = (value: string) => {

  //   this.dataSource.filter = value.trim().toLocaleLowerCase();

  // }

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[3]);



  emailFormControl = new FormControl('', [
    Validators.required,

  ]);

  matcher = new MyErrorStateMatcher();

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}



