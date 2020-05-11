import { Component, OnInit, Renderer2, ElementRef, ViewChild,} from '@angular/core';
import { tween, styler, everyFrame, spring, stagger } from 'popmotion';

@Component({
  selector: 'app-second-section',
  templateUrl: './second-section.component.html',
  styleUrls: ['./second-section.component.scss']
})
export class SecondSectionComponent implements OnInit {
  
  @ViewChild('second') second: ElementRef;
  @ViewChild('third') third: ElementRef;

  constructor(private el: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    
    const ballStylers = Array
    .from([this.second.nativeElement, this.third.nativeElement])
    .map((element: string) => {
      return styler(element);
    });

    /*const distance = 50;
    const stagger = 0.5;
    const speed = 0.01;

    everyFrame()
  .start((timestamp) => ballStylers.map((thisStyler: any, i) => {
        thisStyler.set('y', distance * Math.sin(0.004 * timestamp + (i * 0.5)));
    }));*/

    const animations = Array(ballStylers.length)
    .fill(spring({ to: '200px' }));

    setInterval(() => {
      stagger(animations, 2000)
      .start((v) => v.forEach((x, i) => ballStylers[i].set('x', x)));
    }, 5000);   
      
    
    

  }

}
