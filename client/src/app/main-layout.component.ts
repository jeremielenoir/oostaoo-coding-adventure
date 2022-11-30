import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  public currentPage: string;

  constructor(private router: Router) {
    router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          this.currentPage = val.url.replace(/\//, '').replace(/\//gi, '-');
        }
    });
  }
}
