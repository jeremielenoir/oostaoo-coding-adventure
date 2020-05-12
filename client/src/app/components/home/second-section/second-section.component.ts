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
  duration: any = 3000;

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
    const duration = this.duration;
    const firstStyler = styler(this.first.nativeElement);
    tween({
      to: { x: 900 },
      from: { x: 0 },
      duration,
      ease: easing.backOut,
      flip: Infinity,
      // elapsed: 500,
      // loop: 5,
      // yoyo: 5
    }).start(firstStyler.set);
    const secondStyler = styler(this.second.nativeElement);
    tween({
      to: { x: -200 },
      from: { x: 200 },
      duration,
      ease: easing.backOut,
      flip: Infinity,
      // elapsed: 500,
      // loop: 5,
      // yoyo: 5
    }).start(secondStyler.set);
    const thirdStyler = styler(this.third.nativeElement);
    tween({
      to: { x: -200 },
      from: { x: 200 },
      duration,
      ease: easing.backOut,
      flip: Infinity,
      // elapsed: 500,
      // loop: 5,
      // yoyo: 5
    }).start(thirdStyler.set);
  }
}
