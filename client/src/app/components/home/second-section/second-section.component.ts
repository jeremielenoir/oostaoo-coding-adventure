import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { tween, styler, everyFrame, spring, stagger, easing } from "popmotion";

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
    tween({
      to: { x: -430 },
      from: { x: 0 },
      duration:3000,
      ease: easing.backOut,
      flip: Infinity,
      elapsed: 5000,
      // loop: 5,
      // yoyo: 5
    }).start(firstStyler.set);
    const secondStyler = styler(this.second.nativeElement);
    tween({
      to: { x: -430 },
      from: { x: 0 },
      duration:3000,
      ease: easing.backOut,
      flip: Infinity,
      elapsed: 9000,
      // loop: 5,
      // yoyo: 5
    }).start(secondStyler.set);
    const thirdStyler = styler(this.third.nativeElement);
    tween({
      to: { x: -430 },
      from: { x: 0 },
      duration:3000,
      ease: easing.backOut,
      flip: Infinity,
      elapsed: 12000,
      // loop: 5,
      // yoyo: 5
    }).start(thirdStyler.set);
  }
}
