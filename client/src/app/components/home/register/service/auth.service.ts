import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const newRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer' + ' ' + localStorage.getItem('token')),
    });
    return next.handle(newRequest);
  }

  login(loginForm: any) {
    console.log('Tentative de connexion');

    // this.setUser({ login: loginForm.username });

    // On récupère l'url de redirection
    const redirectUrl = this.route.snapshot.queryParams.redirectUrl || '/home';

    // On accède à la page souhaitée
    this.router.navigate([redirectUrl]);
  }

  logout() {
    console.log('Tentative de déconnexion');

    this.clearUser();
    this.router.navigate(['/home/register']);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('token'));
  }

  // setUser(user: any) {
  //   localStorage.setItem('token', JSON.stringify(user));
  // }

  clearUser() {
    localStorage.removeItem('token');
  }

}
