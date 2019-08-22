import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  constructor() { }

  public DefaultViewContent(event) {

    console.log('breadcrumb', event)

  }

  ngOnInit() {
  }

}
