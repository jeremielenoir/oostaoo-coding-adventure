import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document, private router: Router) { }

  public shouldShow = true;
  public Removeshould = true;
  public IsheaderTrue = false;
  public AddIndex = false;
  public lang = window.navigator.language ;

  public currentLanguage;
  public otherLanguage = [
   {codelang: 'fr-FR',  img: '../../../../assets/drapeau/france-flag-round-icon-32.png', url: '/FR'},
   {codelang: 'en-US', img: '../../../../assets/drapeau/united-kingdom-flag-round-icon-32.png', url: '/EN'},
   {codelang: 'es-ES', img: '../../../../assets/drapeau/spain-flag-round-icon-32.png', url: '/ES'},
   {codelang: 'ja-JA', img: '../../../../assets/drapeau/japan-flag-round-icon-32.png', url: '/JP'}
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

  getLogin() {
    return JSON.parse(localStorage.getItem('token'));
  }

  gotToLoginPage(){
    this.router.navigate(['/home/register']);
  }

  logout() {
    console.log('Tentative de déconnexion');

    localStorage.removeItem('token');
    this.router.navigate(['/home/register']);
  }


  setCurrentLanguage(img) {
    this.currentLanguage = img;
  }
}
