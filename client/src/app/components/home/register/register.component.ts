import { Component, OnInit, Injectable } from '@angular/core';
import axios from 'axios';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiClientService, API_URI_USER } from 'src/app/api-client/api-client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthenticationService } from './service/auth.service';


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
  submitted = false;
  loading = false;
  returnUrl: string;
  error = '';
  errorRegister = '';



  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    }),

    this.registerForm = this.formBuilder.group({
        usernameregister: ['', Validators.required],
        emailregister: ['', Validators.required],
        passwordregister: ['', Validators.required]
    });

    // logout the person when he opens the app for the first time
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get fr() {
    return this.registerForm.controls;
  }

  // on submit
  onSubmit() {
    this.submitted = true;

    // stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/dashboard/campaigns']);
        },
        error => {
          this.error = error;
        }
      );
  }

  switch() {
    this.switchPanel = !this.switchPanel;
  }


  register() {
    this.submitted = true;

    // stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.register(this.fr.usernameregister.value, this.fr.emailregister.value, this.fr.passwordregister.value)
      .pipe(first())
      .subscribe(
        data => {
        },
        error => {
          this.errorRegister = error;
        }
      );
  }
}
