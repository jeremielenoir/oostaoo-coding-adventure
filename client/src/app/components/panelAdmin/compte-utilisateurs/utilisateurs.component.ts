import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { TooltipPosition, MatSnackBar, MatDialog } from '@angular/material';
import {} from '@angular/material/snack-bar';
import { DecryptTokenService } from 'src/app/components/home/register/register.service';
import {
  ApiClientService,
  API_URI_USER,
  API_URI_ACCOUNT,
  API_URI_ROLE
} from 'src/app/api-client/api-client.service';
import { AuthenticationService } from './../../home/register/service/auth.service';
import { ConfirmModel, ConfirmComponent } from '../../home/confirm/confirm.component';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {

  currentUser: any;
  isCurrentUserIsAccountAdmin = false;

  rolesRef: any[];
  selectedRole: any;

  constructor(
    private router: Router,
    public apiClientService: ApiClientService,
    public authenticationService: AuthenticationService,
    public decryptTokenService: DecryptTokenService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  public submittedUser = false;
  public modifiedUser = false;
  public checkbox_list: any[];
  public adminId: number;
  public tests_available: any;
  public selectedRoleId;
  public selectedRoleName;
  // public PrenomValue = '';
  // public NomValue = '';
  // public UserName = '';
  // public EmailValue = '';
  // public PasswordValue = '';

  public users: any[];
  prenom = new FormControl('', Validators.required);
  addPrenom = new FormControl('', Validators.required);
  editPrenom = new FormControl('', Validators.required);
  nom = new FormControl('', Validators.required);
  addNom = new FormControl('', Validators.required);
  editNom = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  addEmail = new FormControl('', [Validators.required, Validators.email]);
  editEmail = new FormControl('', [Validators.required, Validators.email]);
  privileges = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  addPassword = new FormControl('', Validators.required);
  editPassword = new FormControl('', Validators.required);
  confirmPassword = new FormControl('', Validators.required);
  addUsername = new FormControl('', Validators.required);
  editUsername = new FormControl('', Validators.required);
  editUserrole = new FormControl('', Validators.required);

  public nomIsactive = false;
  public prenomIsactive = false;
  public emailIsactive;
  public Textmail = 'salut';
  public shadowcog1 = false;
  public shadowcog2 = false;
  public searchText = '';
  public nomIsactiveUpdate = false;
  public prenomIsactiveUpdate = false;
  public emailIsactiveUpdate = false;
  public editingId = null;
  public editingUser = null;

  public displayedColumns: string[] = ['name', 'mail', 'gestion', 'symbol'];
  // public dataSource = ELEMENT_DATA;

  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right'
  ];
  position = new FormControl(this.positionOptions[3]);

  emailFormControl = new FormControl('', [Validators.required]);

  @ViewChild('form') formulaire;

  ngOnInit() {
    console.log('this.formulaire', this.formulaire.nativeElement);

    this.apiClientService.get(API_URI_ROLE + '?startwith=account_')
      .subscribe(
        (items) => this.rolesRef = items.roles,
        (err) => {
          this._snackBar.open('Ajout d\'utilisateurs non disponible pour le moment', 'Ok', {duration: 3000});
        }
      );

    this.getUser().then(datas => {
      this.currentUser = datas;
      this.tests_available = datas.tests_available;
      if (this.currentUser.role.type === 'account_admin') {
        this.isCurrentUserIsAccountAdmin = true;
      }
      this.apiClientService.get(API_URI_ACCOUNT + '/' + datas.id + '/users')
        .subscribe(
          (data) => this.users = data,
          (err) => console.error(err)
        );
    });

    // this.adminId =
    //  this.decryptTokenService.adminId || this.decryptTokenService.userId;

    // this.authenticationService.getUsers(this.adminId).then(users => {
    //   this.users = users;
    // });
  }

  public param_cog() {
    this.shadowcog1 = !this.shadowcog1;
  }

  public param_cog_non_active() {
    this.formulaire.nativeElement.prenom.value = '';
    this.formulaire.nativeElement.nom.value = '';
    this.formulaire.nativeElement.email.value = '';
    this.formulaire.nativeElement.username.value = '';
    this.formulaire.nativeElement.password.value = '';
    this.formulaire.nativeElement.confirmPassword.value = '';
    this.formulaire.nativeElement.confirmPassword.value = '';
    this.formulaire.nativeElement.userrole.value = '';
    this.selectedRole = undefined;

    this.shadowcog1 = false;

    this.nomIsactive = false;
    this.prenomIsactive = false;
    this.emailIsactive = false;
  }

  // public param_cog_deux() {
  //   this.shadowcog2 = true;
  // }

  public openForm(user) {

    if (user.id === this.currentUser.id) {
      return;
    }

    this.editingUser = user;
    this.editPrenom = new FormControl(
      this.editingUser.prenom,
      Validators.required
    );
    this.editNom = new FormControl(this.editingUser.nom, Validators.required);
    this.editEmail = new FormControl(
      this.editingUser.email,
      Validators.required
    );
    this.editUsername = new FormControl(
      this.editingUser.username,
      Validators.required
    );
    this.editUserrole = new FormControl(
      this.editingUser.role.id,
      Validators.required
    );
    this.editingId = user.id;
    console.log('userdfezijhfelf', this.editingUser);
    this.shadowcog2 = true;

    // this.formulaire.nativeElement.prenom.value = user.prenom;
    // this.formulaire.nativeElement.nom.value = user.nom;
    // this.formulaire.nativeElement.email.value = user.email;

    //this.list_change(user.role.id);
  }

  public param_cog_non_active_deux() {
    this.shadowcog2 = false;

    // this.NomValue = 'Lenoir';
    // this.PrenomValue = 'Jéremie';
    // this.EmailValue = 'lenoir.jeremie@oostaoo.com';

    this.nomIsactiveUpdate = true;
    this.emailIsactiveUpdate = true;
    this.prenomIsactiveUpdate = true;
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
  /**
   *
   */
  async enableUser(userToEnable) {

    const message = `Souhaitez vous réactiver l'utilisateur <strong>${userToEnable.username}</strong> ?`;
    const dialogData = new ConfirmModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    const doAction = await dialogRef.afterClosed().toPromise();

    if (doAction) {
      this.apiClientService
      .put(
        API_URI_ACCOUNT + '/' + this.currentUser.customeraccount.id + '/users/' + userToEnable.id,
        {blocked: false}
      )
      .toPromise()
      .then(res => {
        console.log(res);
        userToEnable.blocked = false;
        this.openSnackBar('L\'utilisateur a correctement été réactivé', 'Fermer');
      })
      .catch(e => {
        this.openSnackBar('Oops ! la réactivation d\'utilisateur est indisponible', 'Fermer')
      });
    }

  }
  /**
   *
   * @param userToDelete
   */
  async deleteUser(userToDelete) {

    const message = `Souhaitez vous désactiver l'utilisateur <strong>${userToDelete.username}</strong> ?`;
    const dialogData = new ConfirmModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    const doAction = await dialogRef.afterClosed().toPromise();

    if (doAction) {
      this.apiClientService
      .delete(API_URI_ACCOUNT + '/' + this.currentUser.customeraccount.id + '/users/' + userToDelete.id)
      .toPromise()
      .then(res => {
        console.log(res);
        userToDelete.blocked = true;
        this.openSnackBar('L\'utilisateur a correctement été supprimé', 'Fermer');
      })
      .catch(e => {
        this.openSnackBar('Oops ! la désactivation d\'utilisateur est indisponible', 'Fermer')
      });
    }

  }

  public list_change(id) {
    for (let value of Object.values(this.checkbox_list)) {
      if (value.id === id) {
        this.selectedRoleName = value.name;
        value.isChecked = !value.isChecked;
        this.selectedRoleId = value.roleId;
      } else {
        value.isChecked = false;
      }
    }
  }

  /**
   *
   * @param event
   */
  roleSetted(event): void {
    this.selectedRole = event.target.value;
  }

  public addUser() {
    this.submittedUser = true;
    if (
      this.addPrenom.value === '' ||
      this.addNom.value === '' ||
      this.addEmail.value === '' ||
      this.addEmail.invalid ||
      this.addPassword.value === '' ||
      this.confirmPassword.value === '' ||
      this.addPassword.value === null ||
      this.addPassword.value !== this.confirmPassword.value ||
      isNaN(this.selectedRole) ||
      this.addUsername.value === ''
    ) {
      this.openSnackBar('Une erreur est survenue, veuillez correctement remplir les champs requis', 'Fermer');
      return;
    }

    // if (this.tests_available !== -1) {
    //   setTimeout(() => {
    //     this.router.navigate(['/subscription']);
    //   }, 1500);
    // }

    const userPayload = {
      prenom: this.addPrenom.value,
      nom: this.addNom.value,
      email: this.addEmail.value,
      username: this.addUsername.value,
      password: this.addPassword.value,
      role: this.selectedRole,
      adminId: this.adminId
    };


    this.apiClientService
      .post(API_URI_ACCOUNT + '/' + this.currentUser.customeraccount.id + '/users', userPayload)
      .toPromise()
      .then(async res => {
        console.log(res);
        this.ngOnInit();
        this.param_cog_non_active();
        this.openSnackBar('L\'utilisateur a correctement été ajouté', 'Fermer');
      })
      .catch((err) => {
        this._snackBar.open(err, undefined, {duration: 3000});
      });
  }

  async getUser(): Promise<any> {
    try {
      const datas = await this.apiClientService
        .get(API_URI_USER + '/' + this.decryptTokenService.userId)
        .toPromise();
      return datas;
    } catch (err) {
      return err;
    }
  }

  public updateUser() {
    this.modifiedUser = true;
    if (
      this.editPrenom.value === '' ||
      this.editNom.value === '' ||
      this.editEmail.value === '' ||
      this.editEmail.invalid ||
      this.editPassword.value === '' ||
      this.confirmPassword.value === '' ||
      this.editPassword.value === null ||
      this.editPassword.value !== this.confirmPassword.value ||
      isNaN(this.selectedRole) ||
      this.editUsername.value === ''
    ) {
      return console.log('Erreur, veuillez remplir tout les champs requis');
    } else {
      this.apiClientService
        .put(`${API_URI_USER}/${this.editingId}`, {
          prenom: this.editPrenom.value,
          nom: this.editNom.value,
          email: this.editEmail.value,
          username: this.editUsername.value,
          password: this.editPassword.value,
          role: this.selectedRole
        })
        .toPromise()
        .then(async res => {
          this.ngOnInit();
          this.param_cog_non_active_deux();
          this.editPrenom = new FormControl('', Validators.required);
          this.editNom = new FormControl('', Validators.required);
          this.editEmail = new FormControl('', Validators.required);
          this.editUsername = new FormControl('', Validators.required);
          this.editUserrole = new FormControl('', Validators.required);
        })
        .catch((err) => {
          console.log(err);
        });
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
