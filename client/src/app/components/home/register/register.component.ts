import { Component, OnInit, Injectable } from '@angular/core';
import axios from 'axios';
import { FormControl, Validators } from '@angular/forms';
import {  ApiClientService} from 'src/app/api-client/api-client.service';
import {Router} from '@angular/router';
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

  username = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  token: string;

    constructor( public apiClientService: ApiClientService, private router: Router) { }

    intercept(
      request: HttpRequest<any>,
      next: HttpHandler,
    ): Observable<HttpEvent<any>> {

    const newRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer' + ' ' + localStorage.getItem('token')),
    });
    return next.handle(newRequest);
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
    localStorage.setItem ('token', response.data.jwt);
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
      Authorization:  `Bearer ${this.token}`
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

   translateRight() {
     if (document.getElementById('left-panel').style.display === 'none') {
      document.getElementById('left-panel').style.display = 'block';
      } else {
      document.getElementById('left-panel').animate ([
        // keyframes
        { transform: 'translateX(-3000px)' },
        { transform: 'translateX(0px)' }
      ], {
        // timing options
        duration: 500,
        fill: 'forwards'
      }),
      document.getElementById('left-panel').style.display = 'block' ;

      document.getElementById('right-panel').animate ([
        // keyframes
        { transform: 'translateX(0px)' },
        { transform: 'translateX(3000px)'},
      ], {
        // timing options
        duration: 500,
        fill: 'forwards'
      });
    }
     setTimeout(this.disappear, 500);
   }

   disappear() {
    document.getElementById('right-panel').style.display = 'none' ;
   }

   translateLeft() {
    if (document.getElementById('left-panel').style.display === 'none') {
     document.getElementById('left-panel').style.display = 'block';
     } else {
     document.getElementById('left-panel').animate ([
       // keyframes
       { transform: 'translateX(0px)' },
       { transform: 'translateX(-3000px)' }
     ], {
       // timing options
       duration: 500,
       delay: 500,
       fill: 'forwards'
     }),

     document.getElementById('right-panel').style.display = 'block';
     document.getElementById('right-panel').animate ([
       // keyframes
       { transform: 'translateX(3000px)' },
       { transform: 'translateX(0px)' },
     ], {
       // timing options
       duration: 500,

       fill: 'forwards'
     });
     document.getElementById('right-panel').style.display = 'block';
   }
  }
}
