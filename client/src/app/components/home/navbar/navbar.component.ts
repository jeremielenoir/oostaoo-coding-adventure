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
  @ViewChild('header') header;

  public showOrHideManually() {
    this.shouldShow = !this.shouldShow;
    if (this.shouldShow) {
      this.header.nativeElement.classList.add('remove-index');
      this.header.nativeElement.classList.remove('add-index');
    } else {
      this.header.nativeElement.classList.add('add-index');
      this.header.nativeElement.classList.remove('remove-index');
    }
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    if (window.pageYOffset > 100) {
      const element = document.getElementById('navbar');
      element.classList.add('style-nav-scroll');

      console.log(element)
    } else {
      const element = document.getElementById('navbar');
      element.classList.remove('style-nav-scroll');
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

    this.onWindowScroll()
   }




}
