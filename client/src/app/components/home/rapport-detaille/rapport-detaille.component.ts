import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rapport-detaille-home',
  templateUrl: './rapport-detaille.component.html',
  styleUrls: ['./rapport-detaille.component.scss']
})
export class RapportDetailleHomeComponent implements OnInit {


  constructor( private router: Router) { }

  ngOnInit() {

  }

  rapportExemple() {
    window.open('/home/rapport_exemple', '_blank');

  }
}

@Component({
  selector: 'app-rapport-detaille-exemple',
  templateUrl: './rd-exemple.html',
  styleUrls: ['./rd-exemple.scss']
})

export class RapportDetailleExempleComponent {

constructor() {}

}

