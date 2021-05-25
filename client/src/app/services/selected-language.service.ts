import { Injectable } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {

  constructor() { }

  getLanguageCountry() {
    const cookies: any = localStorage.getItem('currentlanguage');
    return cookies;
  }

  checkLanguageCountry() {
     return localStorage.getItem('currentlanguage');
  }

  updtateLanguageCountry(langage) {
    localStorage.setItem('currentlanguage', langage.codelang);
    console.log('LANG', langage.codelang);
  }
}
