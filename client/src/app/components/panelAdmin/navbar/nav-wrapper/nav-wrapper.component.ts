import { Component, OnInit, Input } from '@angular/core';

export interface RouteData {
  routerLink: string;
  condition: boolean;
  classAnimParent: string;
  classAnimIcone: string;
  icon: string;
  name: string;
}

@Component({
  selector: 'nav-wrapper-component',
  templateUrl: './nav-wrapper.component.html',
  styleUrls: ['./nav-wrapper.component.scss']
})

/**
 * Entries in array dataRoute.
 * @routerLink : route required *
 * @name : name route required *
 * @condition : Show route or not by condition (set true if not condition)
 * @classAnimParent : if animation by hover css (optional)
 * @classAnimIcone : if animation with emoticone (optional)
 * @icon : name icon for mat-icon (optional)
 * @return {Array object}
 * @exemple : dataRoute = [
      {
        routerLink : "/home", condition: this.currentUser.customeraccount.type === 'profesional',
        classAnimParent: "hvr-icon-bounce", classAnimIcone: "hvr-icon", icon: "domain", name: "Home"
      }
    ];
 */

export class NavWrapperComponent implements OnInit {

  @Input() dataRoute: RouteData[];

  constructor() { }

  ngOnInit() {
    if (this.dataRoute) {
      // console.log('data Route : ', this.dataRoute);
    }
  }
}
