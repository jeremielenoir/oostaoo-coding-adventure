import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  query,
  stagger,
  
  style,
  animate,
  transition,
} from '@angular/animations';


@Component({
  selector: 'app-counter-anim',
  templateUrl: './counter-anim.component.html',
  styleUrls: ['./counter-anim.component.css'],
  animations: [
    trigger('increment', [
      state('start', style({})),
      state('finish',style({})),
      
        
      
    ]),
    ],
})
export class CounterAnimComponent implements OnInit {

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

}
