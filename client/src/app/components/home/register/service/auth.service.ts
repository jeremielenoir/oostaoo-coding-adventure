import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  login(loginForm: any) {
    console.log('Tentative de connexion');

    this.setUser({ login: loginForm.username });

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
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem('user');
  }

}
