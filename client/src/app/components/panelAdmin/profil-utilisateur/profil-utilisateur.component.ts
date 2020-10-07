import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import {
  ApiClientService,
  API_URI_USER,
  API_URI_ACCOUNT,
} from "src/app/api-client/api-client.service";
import { DecryptTokenService } from "src/app/components/home/register/register.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { MustMatch } from "./must-match.validator";
// import { Snapper } from 'igniteui-angular-charts';

@Component({
  selector: "app-profil-utilisateur",
  templateUrl: "./profil-utilisateur.component.html",
  styleUrls: ["./profil-utilisateur.component.scss"],
})
export class ProfilUtilisateurComponent implements OnInit {
  formUtilisateurProfil: FormGroup;
  formUtilisateurSignature: FormGroup;
  formUtilisateurEmail: FormGroup;
  formUtilisateurPassword: FormGroup;

  constructor(
    public apiClientService: ApiClientService,
    public decryptTokenService: DecryptTokenService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}
  hide = true;
  isOwnerOfPersonalAccount = false;
  accountConvertInProgress = false;

  public globalId: any;
  public user: any;

  dateExp: string | number | Date;
  NewDateExp: Date;

  ngOnInit() {
    this.formUtilisateurProfil = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      country: ["", Validators.required],
      language: ["", Validators.required],
      phone: [""],
      telephone: [""],
      office: [""],
    });
    this.formUtilisateurSignature = this.formBuilder.group({
      signature: [""],
    });
    this.formUtilisateurEmail = this.formBuilder.group({
      email: [{ value: null, disabled: true }],
      newEmail: ["", [Validators.required, Validators.email]],
    });
    this.formUtilisateurPassword = this.formBuilder.group(
      {
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("newPassword", "confirmPassword"),
      }
    );
    // this.formUtilisateur.controls['email'].disable()

    this.getUser().then((user) => {
      if (user.length > 0) {
        this.user = user[0];
        console.log("THIS USER : ", this.user);
        this.isOwnerOfPersonalAccount =
        this.user.customeraccount.type === "personal";
        this.formUtilisateurProfil.controls["firstName"].setValue(this.user.prenom);
        this.formUtilisateurProfil.controls["lastName"].setValue(this.user.nom);
        this.formUtilisateurProfil.controls["country"].setValue(this.user.pays);
        this.formUtilisateurProfil.controls["language"].setValue(this.user.langue);
        this.formUtilisateurProfil.controls["phone"].setValue(this.user.tel);
        this.formUtilisateurProfil.controls["telephone"].setValue(this.user.mobile);
        this.formUtilisateurProfil.controls["office"].setValue(this.user.function);
        this.formUtilisateurSignature.controls["signature"].setValue(this.user.signature);
        this.formUtilisateurEmail.controls["email"].setValue(this.user.email);
      }
    });
  }

  /**
   *
   */
  async convertToPro() {
    try {
      this.accountConvertInProgress = true;
      await this.apiClientService.put(API_URI_ACCOUNT + "/" + this.user.customeraccount.id, {
          type: "profesional",
        }).toPromise();
        this.router.navigate(["/dashboard/profil-entreprise"]);
    } catch (e) {
      this.accountConvertInProgress = false;
      this._snackBar.open("Oops ! cette fonctionnalité est indisponible pour le moment","OK",
        { duration: 3000 }
      );
    }
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  updateprofil() {
    if (this.formUtilisateurProfil.invalid) {
      this.openSnackBar( "Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
    } else {
      this.apiClientService.put(API_URI_USER + "/" + this.decryptTokenService.userId, {
          Prenom: this.formUtilisateurProfil.controls["firstName"].value,
          Nom: this.formUtilisateurProfil.controls["lastName"].value,
          Pays: this.formUtilisateurProfil.controls["country"].value,
          Langue: this.formUtilisateurProfil.controls["language"].value,
          Tel: this.formUtilisateurProfil.controls["phone"].value,
          mobile: this.formUtilisateurProfil.controls["telephone"].value,
          function: this.formUtilisateurProfil.controls["office"].value,
        })
        .subscribe((res) => {
            this.openSnackBar("Le profil a correctement été mis à jour", "Fermer");
          },
          (err) => console.log(err));
    }
  }

  updatesignature() {
    if (this.formUtilisateurSignature.invalid) {
      this.openSnackBar( "Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
    } else{
      this.apiClientService.put(API_URI_USER + "/" + this.decryptTokenService.userId, {
          Signature: this.formUtilisateurSignature.controls["signature"].value,
        }).subscribe((res) => {
            this.openSnackBar("La signature a correctement été modifiée", "Fermer");
            // console.log('res', res);
          },
          (err) => console.log(err));
    }
  }

  updateemail() {
    if (this.formUtilisateurEmail.invalid) {
      this.openSnackBar( "Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
    } else {
      this.apiClientService.put(API_URI_USER + "/" + this.decryptTokenService.userId, {
          Email: this.formUtilisateurEmail.controls["newEmail"].value,
        }).subscribe(
          (res) => {
            this.openSnackBar("L'email a correctement été modifié", "Fermer");
            // console.log('res', res);
            this.formUtilisateurEmail.controls["email"].setValue(res.email);
            this.formUtilisateurEmail.get("newEmail").reset();
          },
          (err) => console.log(err)
        );
    }
  }

  updatepassword() {
    if (this.formUtilisateurPassword.invalid) {
      this.openSnackBar("Une erreur est survenue, veuillez correctement remplir les champs requis", "Fermer");
    } else {
      this.apiClientService.put(API_URI_USER + "/" + this.decryptTokenService.userId, {
          password: this.formUtilisateurPassword.controls["confirmPassword"].value,
        })
        .subscribe(
          (res) => {
            this.openSnackBar("Le mot de passe a correctement été modifié","Fermer");
            // console.log('res', res);
            this.formUtilisateurPassword.get("newPassword").reset();
            this.formUtilisateurPassword.get("confirmPassword").reset();
          },
          (err) => console.log(err)
        );
    }
  }

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService.get(API_URI_USER + "/" + this.decryptTokenService.userId).toPromise();
      console.log("profil-utilisateur/ get User / datas : ", datas);
      console.log("profil-utilisateur/ localStorage currentUser : ",localStorage.getItem("currentUser"));
      return (this.user = [datas]);
    } catch (err) {
      return err;
    }
  }
}
