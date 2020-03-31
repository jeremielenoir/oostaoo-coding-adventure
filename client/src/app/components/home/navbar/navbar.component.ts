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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document, @Inject(LOCALE_ID) private locale: string, private router: Router) { }

  public shouldShow = true;
  public Removeshould = true;
  public IsheaderTrue = false;
  public AddIndex = false;
  public lang = 'en-US';

  public currentLanguage;
  public otherLanguage = [
   {codelang: 'fr-FR',  img: '../../../../assets/drapeau/france-flag-round-icon-32.png', url: '/fr/'},
   {codelang: 'en-US', img: '../../../../assets/drapeau/united-kingdom-flag-round-icon-32.png', url: '/en/'},
   {codelang: 'es-ES', img: '../../../../assets/drapeau/spain-flag-round-icon-32.png', url: '/es/'},
   {codelang: 'jp-JP', img: '../../../../assets/drapeau/japan-flag-round-icon-32.png', url: '/jp/'}
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
    if(localStorage.getItem('lang') != null){
      this.lang = localStorage.getItem('lang');
    }

    this.onWindowScroll();

    let linkMenu = document.querySelectorAll('#all-list-menu .link-menu');

    linkMenu.forEach(element => {

      element.addEventListener('click', function(evt) {

        evt.preventDefault();

      });

    });

    this.otherLanguage.forEach( element => {
      if ( element.codelang === this.lang) {
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
    localStorage.setItem('lang', langage.codelang);
    this.currentLanguage = langage.img;
    window.parent.location.href = langage.url;
  }
}
