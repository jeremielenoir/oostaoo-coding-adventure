import { Component, OnInit, Injectable } from '@angular/core';
import axios from 'axios';
import { FormControl, Validators } from '@angular/forms';
import { ApiClientService } from 'src/app/api-client/api-client.service';
import { Router } from '@angular/router';
import { debug } from 'util';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


@Injectable()

export class RegisterComponent implements HttpInterceptor, OnInit {

  public switchPanel = true;
  username = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  token: string;

  constructor(public apiClientService: ApiClientService, private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const re = /evaluate/ ;
    if ( request.url.search(re) < 0 ) {
      const newRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer' + ' ' + localStorage.getItem('token')),
     });
      return next.handle(newRequest);
    }
  }

  ngOnInit() {
    // axios
    // .post('http://localhost:1337/auth/local', {
    //     identifier: 'user@strapi.io',
    //     password: 'strapiPassword',
    // })
    // .then(response => {
    //   // Handle success.
    //   console.log('data !', response);
    //   console.log('Well done!', response.data);
    //   console.log('User profile', response.data.user);
    //   console.log('User token', response.data.jwt);
    //   localStorage.setItem ('yolo', response.data.jwt);
    //   this.token = response.data.jwt;
    //   console.log('token', this.token);
    //   // this.router.navigate(['/dashboard/campaigns']);
    // })
    // .catch(error => {
    //   // Handle error.
    //   console.log('An error occurred:', error);
    // });
  }

  switch() {
      this.switchPanel = ! this.switchPanel;
  }


  register() {
    axios
      .post('http://localhost:1337/auth/local/register', {
        username: this.username.value,
        email: this.email.value,
        password: this.password.value,
      })
      .then(response => {
        // Handle success.
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
  }

  login() {
    axios
      .post('http://localhost:1337/auth/local', {
        identifier: this.email.value,
        password: this.password.value,
      })
      .then(response => {
        // Handle success.
        console.log('data !', response);

        console.log('Well done!', response.data);
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
        localStorage.setItem('token', response.data.jwt);
        this.token = response.data.jwt;
        console.log('token', this.token);
        this.router.navigate(['/dashboard/campaigns']);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
  }

  tryget() {
    axios
      .get('http://localhost:1337/api/technologies', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .then(response => {
        // Handle success.
        console.log('Data: ', response);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
  }
}
