import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { TooltipPosition, MatSnackBar } from "@angular/material";
import {} from "@angular/material/snack-bar";
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import {
  ApiClientService,
  API_URI_USER_ADMIN,
  API_URI_USER
} from "src/app/api-client/api-client.service";
import { AuthenticationService } from './../../home/register/service/auth.service';


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

const CHECKBOX_DATA = [{
  id: 1,
  name: "LEVEL 2 ACCOUNTING",
  checked: false,
  matTooltip: "bblabla",
  isChecked: false,
  roleId: 8
},{
  id: 2,
  name: "LEVEL 3 - SALES",
  checked: false,
  matTooltip: "bblabla",
  isChecked: false,
  roleId: 5
},{
  id: 3,
  name: "LEVEL 4 - RH",
  checked: false,
  matTooltip: "bblabla",
  isChecked: false,
  roleId: 6
}, {
  id: 4,
  name: "LEVEL 5 - CTO",
  checked: false,
  matTooltip: "bblabla",
  isChecked: false,
  roleId: 7
}, {
  id: 5,
  name: "LEVEL 6 - ADMINISTRATEUR",
  checked: false,
  matTooltip: "bblabla",
  isChecked: false,
  roleId: 2
}]

@Component({
  selector: "app-utilisateurs",
  templateUrl: "./utilisateurs.component.html",
  styleUrls: ["./utilisateurs.component.scss"]
})
export class UtilisateursComponent implements OnInit {
  constructor(
    public apiClientService: ApiClientService,
    public authenticationService: AuthenticationService,
    public decryptTokenService: DecryptTokenService,
    private _snackBar: MatSnackBar
    ) {
    this.checkbox_list = CHECKBOX_DATA;
  }

  public checkbox_list :any[];
  public adminId: number;
  public selectedRoleId;
  public selectedRoleName;
  public PrenomValue = "";
  public NomValue = "";
  public UserName = "";
  public EmailValue = "";
  public PasswordValue = "1234";

  public users:any[];
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

    this.adminId = this.decryptTokenService.adminId || this.decryptTokenService.userId;
    this.authenticationService
    .getUsers(this.adminId)
    .then(users => {
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

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public deleteUser(id){
    const token = localStorage.getItem('currentUser');
    this.apiClientService
      .delete(`${API_URI_USER}/${id}`)
      .toPromise()
      .then(res=>{
        console.log(res);
        this.users = this.users.filter(user=>user.id !== id);
        this.openSnackBar('Utilisateur supprimé avec succès', 'Fermer');
      })
      .then(res=>console.log(res))
      .catch((e)=>console.log('error : ', e))
  }

  public list_change(id) {
    for (let value of Object.values(this.checkbox_list)) {
      if(value.id === id) {
        this.selectedRoleName = value.name;
        value.isChecked = !value.isChecked;
        this.selectedRoleId = value.roleId;
      } else {
        value.isChecked = false;
      }
    }
  }

  public addUser(){
    this.PrenomValue = this.formulaire.nativeElement.prenom.value;
    this.NomValue = this.formulaire.nativeElement.nom.value;
    this.EmailValue = this.formulaire.nativeElement.email.value;
    this.UserName = `${this.PrenomValue}-${this.NomValue}`;
    if(!this.PrenomValue || !this.NomValue || !this.EmailValue){
      return;
    };
    const userPayload = ({
      prenom: this.PrenomValue,
      nom: this.NomValue,
      email: this.EmailValue,
      username: this.UserName,
      password: 'oostaoo',
      role: this.selectedRoleId,
      adminId: this.adminId
    });

    this.apiClientService
      .post(API_URI_USER, userPayload)
      .toPromise()
      .then(async(res)=>{
        console.log(res);
        this.users = [...this.users, {
                            id: res.id,
                            prenom: this.PrenomValue,
                            nom: this.NomValue,
                            email: this.EmailValue,
                            username: this.UserName,
                            password: '1234',
                            role: {name: this.selectedRoleName}
                          }];
                          this.param_cog_non_active();
                          this.PrenomValue = "";
                          this.NomValue = "";
                          this.EmailValue = "";
                          this.UserName = "";
                          this.selectedRoleName = "";
        this.openSnackBar('Utilisateur ajouté avec succès', 'Fermer');
      })
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
