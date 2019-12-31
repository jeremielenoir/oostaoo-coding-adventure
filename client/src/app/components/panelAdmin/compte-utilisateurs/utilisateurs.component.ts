import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { TooltipPosition } from "@angular/material";
import {
  ApiClientService,
  API_URI_USER_ADMIN,
  API_URI_USER
} from "src/app/api-client/api-client.service";

export interface PeriodicElement {
  name: string;
  mail: string;
  gestion: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: "Jérémie Lenoir",
    mail: "Hydrogen",
    gestion: "Privileges",
    symbol: ""
  },
  { name: "Jérémie Lenoir", mail: "Helium", gestion: "Privileges", symbol: "" },
  {
    name: "Jérémie Lenoir",
    mail: "Lithium",
    gestion: "Privileges",
    symbol: ""
  },
  {
    name: "Jérémie Lenoir",
    mail: "Beryllium",
    gestion: "Privileges",
    symbol: ""
  },
  { name: "Jérémie Lenoir", mail: "Boron", gestion: "Privileges", symbol: "" },
  { name: "Jérémie Lenoir", mail: "Carbon", gestion: "Privileges", symbol: "" },
  {
    name: "Jérémie Lenoir",
    mail: "Nitrogen",
    gestion: "Privileges",
    symbol: ""
  },
  { name: "Jérémie Lenoir", mail: "Oxygen", gestion: "Privileges", symbol: "" },
  {
    name: "Jérémie Lenoir",
    mail: "Fluorine",
    gestion: "Privileges",
    symbol: ""
  },
  { name: "Jérémie Lenoir", mail: "Neon", gestion: "Privileges", symbol: "" }
];

@Component({
  selector: "app-utilisateurs",
  templateUrl: "./utilisateurs.component.html",
  styleUrls: ["./utilisateurs.component.scss"]
})
export class UtilisateursComponent implements OnInit {
  constructor(public apiClientService: ApiClientService) {}

  public PrenomValue = "";
  public NomValue = "";
  public UserName = "";
  public EmailValue = "";
  public PasswordValue = "1234";

  public users:[];
  prenom = new FormControl("", Validators.required);
  nom = new FormControl("", Validators.required);
  email = new FormControl("", Validators.required);
  privileges = new FormControl("", Validators.required);
  password = new FormControl("", Validators.required);

  public nomIsactive = false;
  public prenomIsactive = false;
  public emailIsactive;
  public Textmail = "salut";
  public shadowcog1 = false;
  public shadowcog2 = false;
  public searchText = "";
  public nomIsactiveUpdate = false;
  public prenomIsactiveUpdate = false;
  public emailIsactiveUpdate = false;

  public displayedColumns: string[] = ["name", "mail", "gestion", "symbol"];
  public dataSource = ELEMENT_DATA;

  positionOptions: TooltipPosition[] = [
    "after",
    "before",
    "above",
    "below",
    "left",
    "right"
  ];
  position = new FormControl(this.positionOptions[3]);

  emailFormControl = new FormControl("", [Validators.required]);

  @ViewChild("form") formulaire;

  ngOnInit() {
    this.getUsers().then(users => {
      this.users = users;

      /**
      this.prenom = new FormControl(user[0].utilsateurentreprises.prenom);
      this.nom = new FormControl(user[0].utilsateurentreprises.nom);
      this.email = new FormControl(user[0].utilsateurentreprises.email);
      this.privileges = new FormControl(
        user[0].utilsateurentreprises.privileges
      );
      this.password = new FormControl(user[0].utilsateurentreprises.password);
      */

      // console.log('form before =', this.name.value, this.lang.value, this.copypasteControl.value, this.rapportControl.value);
    });
  }

  public param_cog() {
    this.shadowcog1 = !this.shadowcog1;
  }

  public param_cog_non_active() {
    this.formulaire.nativeElement.prenom.value = "";
    this.formulaire.nativeElement.nom.value = "";
    this.formulaire.nativeElement.email.value = "";

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

    this.NomValue = "Lenoir";
    this.PrenomValue = "Jéremie";
    this.EmailValue = "lenoir.jeremie@oostaoo.com";

    this.nomIsactiveUpdate = false;
    this.emailIsactiveUpdate = false;
    this.prenomIsactiveUpdate = false;
  }

  public addUser(){

    this.PrenomValue = this.formulaire.nativeElement.prenom.value;
    this.NomValue = this.formulaire.nativeElement.nom.value;
    this.EmailValue = this.formulaire.nativeElement.email.value;
    this.UserName = `${this.PrenomValue}-${this.NomValue}`;
    if(!this.PrenomValue || !this.NomValue || !this.EmailValue){
      return;
    };
    fetch('/users',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({prenom: this.PrenomValue,
                              nom: this.NomValue,
                              email: this.EmailValue,
                              username: this.UserName,
                              password: '1234'
                            })
    })
    .then(function(res){
      console.log(res) })
    .catch(function(res){ console.log(res) })
  }

  public Hundelesubmit() {
    const prenom = this.formulaire.nativeElement.prenom.value;
    const nom = this.formulaire.nativeElement.nom.value;
    const email = this.formulaire.nativeElement.email.value;

    if (prenom === "") {
      return this.prenomIsactive;
    }

    if (nom === "") {
      this.nomIsactive = true;
    }

    if (email === "") {
      this.emailIsactive = true;
    }
  }

  public is_valid_prenom(event) {
    const champValue = event.target.value;

    if (champValue.length < 1) {
      this.prenomIsactive = true;
    } else {
      this.prenomIsactive = false;
    }
  }

  public is_valid_nom(event) {
    const champValue = event.target.value;

    if (champValue.length < 1) {
      this.nomIsactive = true;
    } else {
      this.nomIsactive = false;
    }
  }

  public is_valid_emaill(event) {
    const verifyMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const champValue = event.target.value;

    if (champValue.length < 1) {
      this.emailIsactive = true;
      this.Textmail = "Obligatoire";
    } else {
      if (verifyMail.test(champValue)) {
        this.Textmail = "Obligatoire";
        this.emailIsactive = false;
      } else {
        this.emailIsactive = true;
        this.Textmail = "Email invalide";
      }
    }
  }

  // update form
  public is_valid_prenom_update(event) {
    const champValue = event.target.value;

    this.PrenomValue = "";

    console.log(champValue);

    if (champValue.length < 1) {
      this.prenomIsactiveUpdate = true;
    } else {
      this.prenomIsactiveUpdate = false;
    }
  }

  public is_valid_nom_update(event) {
    const champValue = event.target.value;

    this.NomValue = "";

    if (champValue.length < 1) {
      this.nomIsactiveUpdate = true;
    } else {
      this.nomIsactiveUpdate = false;
    }
  }

  public is_valid_email_update(event) {
    const verifyMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const champValue = event.target.value;

    this.EmailValue = event.target.value;

    if (champValue.length < 1) {
      this.emailIsactiveUpdate = true;
      this.Textmail = "Obligatoire";
    } else {
      if (verifyMail.test(champValue)) {
        this.Textmail = "Obligatoire";
        this.emailIsactiveUpdate = false;
      } else {
        this.emailIsactiveUpdate = true;
        this.Textmail = "Email invalide";
      }
    }
  }

/**
  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER_ADMIN + "/" + 1)
        .toPromise();
      return (this.user = [datas]);
    } catch (err) {
      return err;
    }
  }
*/

  async getUsers(): Promise<any> {
    try {
      const users = await this.apiClientService
        .get(API_URI_USER)
        .toPromise();
      return users;
    } catch (err) {
      return err;
    }
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  matcher = new MyErrorStateMatcher();
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
