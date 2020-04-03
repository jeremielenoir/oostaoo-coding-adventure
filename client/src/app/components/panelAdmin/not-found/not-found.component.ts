import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  nameUrl: string;
  constructor(private router: Router) {
    this.nameUrl = this.router.url
  }

  ngOnInit() {
    console.log('name url', this.nameUrl)
  }

}
