import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-testanim',
  animations: [
    trigger('move', [
      state('in', style({top:50})),
      state('out', style({top:100})),
      transition('in => out', animate('3s linear')),
      transition('out => in', animate('3s linear'))
    ]),
    ],
  templateUrl: './testanim.component.html',
  styleUrls: ['./testanim.component.css']
})
export class TestanimComponent implements OnInit {

  state = 'in';
  ngAfterViewInit() {
    setTimeout(() => {
      this.state = 'out';
    }, 0);
  }
  onEnd(event) {
    this.state = 'in';
    if (event.toState === 'in') {
      setTimeout(() => {
        this.state = 'out';
      }, 0);
    }
  }
  constructor() { }

  ngOnInit() {
  }

};
