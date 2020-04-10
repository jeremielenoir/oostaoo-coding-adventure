import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {

  constructor(private cookieService: CookieService) { }

  getLanguageCountry(){

    const cookies: any = this.cookieService.get('currentlanguage');

    return cookies;
  }

  checkLanguageCountry(){
    return this.cookieService.check('currentlanguage')
  }

  updtateLanguageCountry(langage){
  
   
    // if(this.cookieService.check('currentlanguage')){
    //   this.cookieService.delete('currentlanguage');
    // }

    this.cookieService.set('currentlanguage', langage.codelang);
    console.log('LANG', langage.codelang);
    // this.cookieService.set('currentlanguage', langage.codelang, 30, '/', 'roodeo.com', true, "Lax");
  }


}
