import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent implements OnInit {

  dataRoute: any;
  constructor() { }

  ngOnInit() {
    // declaration nav route
    this.dataRoute = [
      {
        routerLink: '/dashboard/faq', condition: true, classAnimParent: 'hvr-icon-bounce',
        classAnimIcone: 'hvr-icon', icon: 'contact_support', name: 'FAQ'
      },
      {
        routerLink: '/dashboard/contact-support', condition: true, classAnimParent: 'hvr-icon-bounce',
        classAnimIcone: 'hvr-icon', icon: 'place', name: 'Contact'
      }
    ];
  }

}
