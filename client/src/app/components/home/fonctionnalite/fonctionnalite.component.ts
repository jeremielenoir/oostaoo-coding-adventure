import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {CarouselComponent } from '../carousel/carousel.component';
@Component({
  selector: 'app-fonctionnalite',
  templateUrl: './fonctionnalite.component.html',
  styleUrls: ['./fonctionnalite.component.scss']
})
export class FonctionnaliteComponent implements OnInit {
  @ViewChild('carousel') private carousel: CarouselComponent;
  intervalId: any;
  items = [
    { title: 'Slide 1', img_url: 'slide_1.png' },
    { title: 'Slide 2', img_url: 'slide_2.png' },
    { title: 'Slide 3', img_url: 'slide_3.png' }
  ];

  constructor() { }

  ngOnInit() {
    // console.log('CAROUSEL', this.carousel);
    this.intervalId = setInterval( () => {
      this.carousel.next();
    }, 5000);
  }

  ngOnDestroy() {
    console.log('DESTROY', this.intervalId);
    clearInterval(this.intervalId);
  }

}
