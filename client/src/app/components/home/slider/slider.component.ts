import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(800 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(0, style({opacity: 0})))
    ])
]
})
export class SliderComponent implements OnInit {

  currentIndex = 1;

  constructor() { }

  ngOnInit() {
  }

  onClickNav() {
    console.log('CURRENT INDEX', this.currentIndex);
    this.currentIndex = this.currentIndex === 1 ? 2 : 1;
  }

}
