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

  }


  getLogin() {
    return JSON.parse(localStorage.getItem('token'));
  }

  logout() {
    console.log('Tentative de déconnexion');

    localStorage.removeItem('token');
    this.router.navigate(['/home/register']);
  }

}
