import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TooltipPosition } from '@angular/material';


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

  public PrenomValue = 'Jérémie';
  public NomValue = 'lenoir';
  public MailValue = 'lenoir.jeremie@oostaoo.com';

  public nomIsactive = false;
  public prenomIsactive = false;
  public emailIsactive;
  public Textmail: string;
  public shadowcog1 = false;
  public shadowcog2 = false;


  public nomIsactiveUpdate = false;
  public prenomIsactiveUpdate = false;
  public emailIsactiveUpdate = false;


  constructor() { }

  @ViewChild('form') formulaire;

  ngOnInit() {

  }

  ngAfterViewInit() {


  }

  public param_cog() {

    this.shadowcog1 = !this.shadowcog1;

  }

  public param_cog_non_active() {

   this.shadowcog1 = false;

   this.nomIsactive = false;
   this.prenomIsactive = false;
   this.emailIsactive = false;

  }

  public param_cog_deux() {

    this.shadowcog2 = true;
  }

  public param_cog_non_active_deux() {

   this.shadowcog2 = false;

   this.NomValue = 'Lenoir';
   this.PrenomValue = 'Jéremie';
   this.MailValue = 'lenoir.jeremie@oostaoo.com';

   this.nomIsactiveUpdate = false;
   this.emailIsactiveUpdate = false;
   this.prenomIsactiveUpdate = false;

  }


  public Hundelesubmit(event){
    let prenom = this.formulaire.nativeElement.prenom.value;
    let nom = this.formulaire.nativeElement.nom.value;
    let email = this.formulaire.nativeElement.email.value;

    if(prenom === '') {
      this.prenomIsactive;
    }

    if(nom === ''){
      this.nomIsactive = true;
    }

    if(email === ''){
      this.emailIsactive = true;
    }

  }

  public is_valid_prenom(event) {

    const champValue = event.target.value;

    if(champValue.length < 1)
    {

      this.prenomIsactive = true;

    } else {

      this.prenomIsactive = false;

    }
  }

  public is_valid_nom(event) {

    let champValue = event.target.value;

    if(champValue.length < 1)
    {

      this.nomIsactive = true;

    } else {

      this.nomIsactive = false;

    }
  }

  public is_valid_emaill(event){

    let verify_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let champValue = event.target.value;

    if(champValue.length < 1)
    {
      this.emailIsactive = true;
      this.Textmail = 'Obligatoire';
    } else
    {

        if(verify_mail.test(champValue))
        {

          this.Textmail = 'Obligatoire';
          this.emailIsactive = false;

        } else
        {
          this.emailIsactive = true;
          this.Textmail = 'Email invalide';
        }

    }

  }


  // update form
  public is_valid_prenom_update(event) {

    const champValue = event.target.value;

    this.PrenomValue = '';

    console.log(champValue)

    if(champValue.length < 1)
    {

      this.prenomIsactiveUpdate = true;

    } else {

      this.prenomIsactiveUpdate = false;

    }
  }

  public is_valid_nom_update(event) {

    const champValue = event.target.value;

    this.NomValue = '';

    if(champValue.length < 1)
    {

      this.nomIsactiveUpdate = true;

    } else {

      this.nomIsactiveUpdate = false;

    }
  }

  public is_valid_email_update(event) {

    const verify_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const champValue = event.target.value;

    this.MailValue = event.target.value;


    if(champValue.length < 1)
    {
      this.emailIsactiveUpdate = true;
      this.Textmail = 'Obligatoire';
    } else
    {

        if(verify_mail.test(champValue))
        {

          this.Textmail = 'Obligatoire';
          this.emailIsactiveUpdate = false;

        } else
        {
          this.emailIsactiveUpdate = true;
          this.Textmail = 'Email invalide';
        }

    }

  }

  public displayedColumns: string[] = ['name' , 'mail' , 'gestion' , 'symbol'];
  public dataSource = ELEMENT_DATA;



  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[3]);



  emailFormControl = new FormControl('' , [Validators.required]);

  matcher = new MyErrorStateMatcher();

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}



