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


  public PrenomValue = 'Jérémie';
  public NomValue = 'lenoir';
  public MailValue = 'lenoir.jeremie@oostaoo.com';

  public nomIsactive: boolean = false;
  public prenomIsactive: boolean = false;
  public emailIsactive:boolean;
  public Text_mail: string;
  public shadow_cog1:boolean = false;
  public shadow_cog2:boolean = false;


  public nomIsactiveUpdate: boolean = false;
  public prenomIsactiveUpdate: boolean = false;
  public emailIsactiveUpdate:boolean = false;


  public text_label_update;
  public title_champ_default_update;
  public update_email;

  constructor() { }

  ngOnInit() {

  }


  public param_cog() {

    this.shadow_cog1 = !this.shadow_cog1;

  }

  public param_cog_non_active() {

   this.shadow_cog1 = false;

   this.nomIsactive = false;
   this.prenomIsactive = false;
   this.emailIsactive = false;

  }

  public param_cog_deux() {

    this.shadow_cog2 = true;
  }

  public param_cog_non_active_deux() {

   this.shadow_cog2 = false;

   this.NomValue = 'Lenoir';
   this.PrenomValue = 'Jéremie';
   this.MailValue = 'lenoir.jeremie@oostaoo.com';

   this.nomIsactiveUpdate = false;
   this.emailIsactiveUpdate = false;
   this.prenomIsactiveUpdate = false;

  }

  // public Hundelesubmit(){


  //   if(this.nom.value == "")
  //   {
  //     this.nom.classList.add('errorChamp');
  //     this.text_label[1].classList.add('new-label')
  //     this.title_champ_default[1].classList.add('title-champ-default-visible')

  //   }

  //   if(this.prenom.value == ""){

  //     this.prenom.classList.add('errorChamp');
  //     this.text_label[0].classList.add('new-label');
  //     this.title_champ_default[0].classList.add('title-champ-default-visible')

  //   }
  //   if(this.email.value == ""){

  //     this.email.classList.add('errorChamp');
  //     this.text_label[2].classList.add('new-label');
  //     this.title_champ_default[2].classList.add('title-champ-default-visible')

  //   }

  // }

  public is_valid_prenom(event) {

    let champValue = event.target.value;

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
      this.Text_mail = "Obligatoire";
    } else
    {

        if(verify_mail.test(champValue))
        {

          this.Text_mail = "Obligatoire"; 
          this.emailIsactive = false;

        } else
        {
          this.emailIsactive = true;
          this.Text_mail = "Email invalide";
        }

    }

  }


  // update form
  public is_valid_prenom_update(event) {

    let champValue = event.target.value;

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

    let champValue = event.target.value;

    this.NomValue = '';

    if(champValue.length < 1)
    {

      this.nomIsactiveUpdate = true;

    } else {

      this.nomIsactiveUpdate = false;

    }
  }

  public is_valid_email_update(event) {

    let verify_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let champValue = event.target.value;

    this.MailValue = event.target.value;


    if(champValue.length < 1)
    {
      this.emailIsactiveUpdate = true;
      this.Text_mail = 'Obligatoire';
    } else
    {

        if(verify_mail.test(champValue))
        {

          this.Text_mail = 'Obligatoire';
          this.emailIsactiveUpdate = false;

        } else
        {
          this.emailIsactiveUpdate = true;
          this.Text_mail = 'Email invalide';
        }

    }

  }




  public displayedColumns: string[] = ['name' , 'mail' , 'gestion' , 'symbol'];
  public dataSource = ELEMENT_DATA;

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



