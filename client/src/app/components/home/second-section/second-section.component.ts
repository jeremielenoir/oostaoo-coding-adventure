import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { tween, styler, everyFrame, spring, stagger, easing, chain, timeline } from "popmotion";

@Component({
  selector: "app-second-section",
  templateUrl: "./second-section.component.html",
  styleUrls: ["./second-section.component.scss"],
})
export class SecondSectionComponent implements OnInit {
  @ViewChild("first") first: ElementRef;
  @ViewChild("second") second: ElementRef;
  @ViewChild("third") third: ElementRef;
  durationFirst: any = 3000;
  durationSecond: any = 10000;
  durationThird: any = 15000;

  constructor(private el: Renderer2, private elementRef: ElementRef) {}

  ngOnInit() {
    // const ballStylers = Array
    // .from([this.second.nativeElement, this.third.nativeElement])
    // .map((element: string) => {
    //   return styler(element);
    // });

    // const animations = Array(ballStylers.length)
    // .fill(spring({ to: '200px' }));

    // setInterval(() => {
    //   stagger(animations, 2000)
    //   .start((v) => v.forEach((x, i) => ballStylers[i].set('x', x)));
    // }, 5000);
    const duration = this.durationFirst;
    const durationSecond = this.durationSecond;
    const durationThird = this.durationThird;
    const firstStyler = styler(this.first.nativeElement);
    const secondStyler = styler(this.second.nativeElement);
    const thirdStyler = styler(this.third.nativeElement);
    
    

    const setStylers = (v) => {
      //console.log(v);
      if (v.first !== undefined){
        firstStyler.set(v.first);
      }
      if (v.second !== undefined){
        secondStyler.set(v.second);
      }
      if (v.third !== undefined){
        thirdStyler.set(v.third);
      }
    };

    timeline([
      {
        track: 'first',
        duration: 5000,
        from: { x: -430 },
        to: { x: 0 }
      },
      {
        track: 'second',
        duration: 5000,
        from: { x: -430 },
        to: { x: 0 }
      },
      {
        track: 'third',
        duration: 5000,
        from: { x: -430 },
        to: { x: 0 }
      }
    ],{
      loop: Infinity
    }).start(setStylers);


    

   

    

    
  }
}
