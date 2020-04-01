import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {

  constructor() { }

  recupLanguageCountry(){
    let language = localStorage.getItem('lang');
    return language;
  }
}
