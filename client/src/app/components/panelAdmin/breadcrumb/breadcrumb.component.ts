import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  showNavigation : boolean;
  constructor() { }

  @Input('') namePage: string = "";
  @Input('') listNavigation: Array<String>;


  ngOnInit() {
    if(this.listNavigation){
      this.showNavigation = false;
    }
    this.namePage = this.namePage != "" ? " > "+ this.namePage : "";
  }

  showHiddenNavigation(){
    this.showNavigation = !this.showNavigation;
  }

}
