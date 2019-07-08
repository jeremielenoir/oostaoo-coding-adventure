import {
Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document) { }

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
    // if (window.pageYOffset < 100) {
    //   const element = document.getElementById('navbar');
    //   element.classList.add('style-nav-scroll2');
    // } else {
    //   const element = document.getElementById('navbar');
    //   element.classList.remove('style-nav-scroll2');
    // }
  }


  ngOnInit() {

    this.onWindowScroll();

   }




}
