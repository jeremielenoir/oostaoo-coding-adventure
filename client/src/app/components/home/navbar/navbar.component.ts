import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  ViewChild,
  HostListener,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {SelectedLanguageService} from '../../../services/selected-language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  @Input() currentSection: string;

  constructor(@Inject(DOCUMENT) document, @Inject(LOCALE_ID) private locale: string,
   private cookieService: CookieService, private _el: ElementRef, private router: Router,public SelectedLanguageService:SelectedLanguageService) { 

   }

  public currentMenuId = "menuRoodeo";

  public shouldShow = true;
  public Removeshould = true;
  public IsheaderTrue = false;
  public AddIndex = false;
  public lang = 'en-US';

  public currentLanguage;
  public otherLanguage = [
   {codelang: 'fr-FR', shortlang:'fr', img: '../../../../assets/drapeau/france-flag-round-icon-32.png', url: '/fr/'},
   {codelang: 'en-US', shortlang:'en', img: '../../../../assets/drapeau/united-kingdom-flag-round-icon-32.png', url: '/en/'},
   {codelang: 'es-ES', shortlang:'es', img: '../../../../assets/drapeau/spain-flag-round-icon-32.png', url: '/es/'},
   {codelang: 'jp-JP', shortlang:'jp', img: '../../../../assets/drapeau/japan-flag-round-icon-32.png', url: '/jp/'}
  ];

  @ViewChild('header') header;
  

  public showOrHideManually() {
    this.shouldShow = !this.shouldShow;
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll(event: any) {
    if (window.pageYOffset > 100) {

      this.IsheaderTrue = true;


    } else {
      this.IsheaderTrue = false;

    }
    

  }


  ngOnInit() {

    console.log('locale', this.locale, window.parent.location.href);
    
    this.lang = this.locale;

    if(this.SelectedLanguageService.checkLanguageCountry()){
      this.lang = this.SelectedLanguageService.getLanguageCountry();
    }

    this.onWindowScroll(null);

    let linkMenu = document.querySelectorAll('#all-list-menu .link-menu');

    linkMenu.forEach(element => {

      element.addEventListener('click', function(evt) {

        evt.preventDefault();

      });

    });

    this.otherLanguage.forEach( element => {
      if ( element.codelang === this.lang || element.shortlang === this.lang) {
        this.currentLanguage = element.img;
      }
    });
  }


  gotToLoginPage(){
    this.router.navigate(['/home/register']);
  }

  logout() {
    console.log('Tentative de déconnexion');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home/register']);
  }


  setCurrentLanguage(langage) {

    this.SelectedLanguageService.updtateLanguageCountry(langage)
    
    this.currentLanguage = langage.img;
    window.parent.location.href = langage.url;
  }
}
