import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document, @Inject(LOCALE_ID) private locale: string, private cookieService: CookieService, private router: Router) { }

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
  public onWindowScroll() {
    if (window.pageYOffset > 100) {

      this.IsheaderTrue = true;


    } else {
      this.IsheaderTrue = false;

    }

  }


  ngOnInit() {

    console.log('locale', this.locale, window.parent.location.href);
    
    this.lang = this.locale;

    if(this.cookieService.check('currentlanguage')){
      //this.lang = this.cookieService.get('currentlanguage');
    }

    this.onWindowScroll();

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
    console.log('LANG', langage.codelang);
    this.cookieService.set('currentlanguage', langage.codelang, 30, '/', 'roodeo.com', true, "Lax");
    this.currentLanguage = langage.img;
    window.parent.location.href = '/';
  }
}
