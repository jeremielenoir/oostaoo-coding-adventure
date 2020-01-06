import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  constructor() { }

  @Input('') namePage: string = "";

  public DefaultViewContent(event) {

  }

  ngOnInit() {
    this.namePage = this.namePage != "" ? " > "+ this.namePage : "";

  }

}
