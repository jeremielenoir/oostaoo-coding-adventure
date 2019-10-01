import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNull } from 'util';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Récupération de l'utilisateur connecté
    const isLoggedIn = !isNull(localStorage.getItem('token'));
    console.log('isLoggedIn: ', isLoggedIn);

    if (!isLoggedIn) {
      // Si pas d'utilisateur connecté : redirection vers la page de login
      console.log('Vous n\'êtes pas connectés');
      this.router.navigate(['/home/register']);
    }
    return isLoggedIn;
  }
}