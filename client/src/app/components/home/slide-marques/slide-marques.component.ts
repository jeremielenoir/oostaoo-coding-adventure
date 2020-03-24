import { Component, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'app-slide-marques',
  templateUrl: './slide-marques.component.html',
  styleUrls: ['./slide-marques.component.scss']
})
export class SlideMarquesComponent implements OnInit {
  @ViewChild('slideMarques', { read: DragScrollComponent })
  ds: DragScrollComponent;
  index = 0;
  constructor() {}

  srcImages = [
    {
      name: 'EA',
      srcImg: 'EA.png'
    },
    {
      name: 'SG',
      srcImg: 'SG.PNG'
    },
    {
      name: 'EA',
      srcImg: 'EA.png'
    },
    {
      name: 'SG',
      srcImg: 'SG.PNG'
    },
    {
      name: 'EA',
      srcImg: 'EA.png'
    },
    {
      name: 'SG',
      srcImg: 'SG.PNG'
    },
    {
      name: 'EA',
      srcImg: 'EA.png'
    },
    {
      name: 'SG',
      srcImg: 'SG.PNG'
    },
    {
      name: 'EA',
      srcImg: 'EA.png'
    },
    {
      name: 'SG',
      srcImg: 'SG.PNG'
    },
    {
      name: 'EA',
      srcImg: 'EA.png'
    },
    {
      name: 'SG',
      srcImg: 'SG.PNG'
    }
  ];

  ngOnInit() {
    this.loopScroll();
  }

  // moveLeft() {
  //   console.log('this.ds LEFT : ', this.ds.currIndex);
  //   this.ds.moveLeft();
  //   console.log('this.srcImages.length - 5 : ', this.srcImages.length - 5);
  // }
  // moveRight() {
  //   console.log('this.ds RIGTH : ', this.ds.currIndex);
  //   this.ds.moveRight();
  //   console.log('this.srcImages.length - 5 :', this.srcImages.length - 5);
  // }
  loopScroll() {
    if (this.ds.currIndex === this.srcImages.length - 5) {
      console.log(this.ds.currIndex);
      setTimeout(() => {
        this.ds.moveTo(0);
      }, 1000);
    } else {
      setTimeout(() => {
        this.ds.moveRight();
      }, 3000);
    }
    setTimeout(() => this.loopScroll(), 3000);
  }
}
