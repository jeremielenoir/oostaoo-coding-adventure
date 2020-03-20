import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-mot-de-passe-oublie',
  templateUrl: './mot-de-passe-oublie.component.html',
  styleUrls: ['./mot-de-passe-oublie.component.scss']
})
export class MotDePasseOublieComponent implements OnInit {


  public newPassword = new FormControl('', Validators.required);
  public confirmPassword = new FormControl('', Validators.required);
  private secretCode = this.route.snapshot.queryParams.code;
  public submittedPassword: string;

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              ) { }

  ngOnInit() {
    console.log('params', this.route.snapshot.queryParams.code);
  }

  // Request API.
  resetPassword() {
    console.log('click click');
    axios
      .post('http://localhost:8080/auth/reset-password', {
        code: this.secretCode,
        password: 'testtest',
        passwordConfirmation: 'testtest'
      })
      .then(response => {
        // Handle success.
        console.log('Your user\'s password has been changed.');
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
    }

// Request API.

  // resetPassword() {
  //   return this.http.post<any>(`http://${window.location.host}/auth/reset-password`, {
  //     code: this.secretCode,
  //     password: 'test',
  //     passwordConfirmation: 'test'
  //   })
  //     .pipe(
  //       map(user => {

  //         console.log('FORGOT PASSWORD user: ', user);
  //         return user;
  //       })
  //     );
  // }
}

