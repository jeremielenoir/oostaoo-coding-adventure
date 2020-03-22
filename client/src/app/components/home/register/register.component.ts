import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiClientService, API_URI_USER } from 'src/app/api-client/api-client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthenticationService } from './service/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


@Injectable()

export class RegisterComponent implements OnInit {

  public switchPanel = true;


  registerForm: FormGroup;
  loginForm: FormGroup;
  submittedLogin = false;
  submittedRegister = false;
  loading = false;
  returnUrl: string;
  error = '';
  errorRegister = '';
  jwt: any;
  errorProvider = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
        this.route.queryParams.subscribe(params => {
        // this.jwt = params['jwt'];
        this.errorProvider = params['error'];
        setTimeout(() => {
          this.errorProvider = null;
        }, 2000)
    })
   }

   public readonly siteKey = '6LdAf-AUAAAAACX5tqKig64A4zgc-Q7EA44fxE-9';
   public theme: 'light' | 'dark' = 'light';
   public size: 'compact' | 'normal' = 'normal';
   public lang = 'fr';
   public type: 'image' | 'audio';
   public useGlobalDomain: boolean = false;
   public captchaSuccess = false;

  ngOnInit() {
    this.jwt = this.route.snapshot.queryParams.jwt;
    if (this.jwt && this.jwt.length > 0) {
      localStorage.setItem('currentUser', this.jwt);
      this.router.navigate(['/dashboard/campaigns']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }),

    this.registerForm = this.formBuilder.group({
      usernameregister: ['', Validators.required],
      emailregister: ['', [Validators.required,Validators.email]],
      passwordregister: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });

    // logout the person when he opens the app for the first time
    // this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.cdr.detectChanges();
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get fr() {
    return this.registerForm.controls;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogForgetPassword, {
       width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // on submit
  onSubmit() {
    this.submittedLogin = true;

    // stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('data : ', data);
          this.router.navigate(['/dashboard/campaigns'])
        },
        error => {
          this.error = error;
        }
      );
  }

  switch() {
    this.switchPanel = !this.switchPanel;
  }

  openSnackBar(message: string, action) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  showSuccess(message) {
    this.toastr.success(message);
  }
  showError(message) {
    this.toastr.info(message);
  }

  register() {
    
    this.submittedRegister = true;

    // stop if form is invalid
    if (this.fr.emailregister.value === '' || this.fr.emailregister.invalid || this.fr.passwordregister.value === '' || this.fr.confirmpassword.value === '' || this.fr.passwordregister.value !== this.fr.confirmpassword.value || this.fr.recaptcha.value === '') {
      this.showError("Une erreur est survenue");;
    } else {

      this.loading = true;

      this.authenticationService.register(this.fr.usernameregister.value, this.fr.emailregister.value, this.fr.passwordregister.value)
        .pipe(first())
        .subscribe(
          data => {
            this.showSuccess('Le compte a bien été créé');
            this.router.navigate(['/dashboard/campaigns']);
          },
          error => {
            console.log('ERROR', error);
            this.errorRegister = error;
          }
        );

    }

  }

    forgetPassword(email) {
    this.authenticationService.forgotPassword(email)
      .pipe(first())
      .subscribe(
        data => {
          this.showSuccess('Le compte a bien été créé');
        },
        error => {
          this.errorRegister = error;
        }
      );
  }
}



@Component({
  selector: 'dialog-forget-password',
  templateUrl: 'dialog-forget-password.html',
  styleUrls: ['./dialog-forget-password.scss']
})

export class DialogForgetPassword {

  errorRegister = '';
  submitted = false;
  public emailAdress = new FormControl('', [Validators.required, Validators.email]);
  public forgotPassword: string;

  constructor(
    public dialogRef: MatDialogRef<DialogForgetPassword>,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService
    ) {}

    openSnackBar(message: string, action) {
      this._snackBar.open(message, action, {
        duration: 3000,
      });
    }

    showSuccess(message) {
      this.toastr.success(message);
    }

    forgetPassword(email) {
      this.authenticationService.forgotPassword(email)
        .pipe(first())
        .subscribe(
          data => {
            this.dialogRef.close();
            this.showSuccess('L\'email de réinitialisation à bien été envoyé');
          },
          error => {
            this.errorRegister = error;
          }
        );
    }

    onNoClick(): void {
    this.dialogRef.close();
  }
}
