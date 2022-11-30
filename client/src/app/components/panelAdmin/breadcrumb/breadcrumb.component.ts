import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  showNavigation: boolean;
  constructor() { }

  @Input('') namePage = '';
  @Input('') listNavigation: Array<String>;

  public DefaultViewContent(event) {

  }

  ngOnInit() {
    if (this.listNavigation) {
      this.showNavigation = false;
    }
    this.namePage = this.namePage != '' ? ' > ' + this.namePage : '';
    // console.log('this.listNavigation : ', this.listNavigation);
  }

  showHiddenNavigation() {
    this.showNavigation = !this.showNavigation;
  }

}
