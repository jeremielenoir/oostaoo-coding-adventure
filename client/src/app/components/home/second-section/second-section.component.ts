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

  @ViewChild("image1") image1: ElementRef;
  @ViewChild("image2") image2: ElementRef;
  @ViewChild("image3") image3: ElementRef;

  public image1Style:any ="display:none";
  public image2Style:any ="display:none";
  public image3Style:any ="display:none";
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
    
    const image1Styler = styler(this.image1.nativeElement);
    const image2Styler = styler(this.image2.nativeElement);
    const image3Styler = styler(this.image3.nativeElement);
    

    const setStylers = (v) => {
      //console.log(v);
      if (v.first !== undefined){
        firstStyler.set(v.first);
       // this.imgSrc = "../../assets/slide_3.png"
      }
      if (v.second !== undefined){
        secondStyler.set(v.second);
       // this.imgSrc = "../../assets/contrat_roodeo.png"
      }
      if (v.third !== undefined){
        thirdStyler.set(v.third);
       // this.imgSrc = "../../assets/devsite.png"
      }

       
      if (v.image1 !== undefined){
        image1Styler.set(v.image1);
      }
      if (v.image2 !== undefined){
        image2Styler.set(v.image2);
      }
      if (v.image3 !== undefined){
        image3Styler.set(v.image3);
      }
    };

    timeline([
     [ {
        track: 'first',
      duration: 5000,
        from: { x: -430 },
        to: { x: 0 },
        
      }, 

      {
        track:"image1",
        duration:5000,
        from:{
         // x:0,
          opacity:0},
        to:{x:600,opacity:1}
      },

      {
        track:"image2",
        duration:5000,
        from:{x:0,opacity:0},
        to:{x:0,opacity:0}
      },
      {
        track:"image3",
        duration:5000,
        from:{x:0,opacity:0},
        to:{x:0,opacity:0}
      }

      ],
    
      [
        {
          track: 'second',
          duration: 5000,
          from: { x: -430 },
          to: { x: 0 }
        },
        {
          track:"image2",
          duration:5000,
          from:{
          //  x:0,
            opacity:0},
          to:{x:600,opacity:1}
        },


        {
          track:"image1",
        duration:5000,
          from:{x:0,opacity:0},
          to:{x:0,opacity:0}
        },
        {
          track:"image3",
         duration:5000,
          from:{x:0,opacity:0},
          to:{x:0,opacity:0}
        }
      ],[
        {
          track: 'third',
          duration: 5000,
          from: { x: -430 },
          to: { x: 0 }
        },
        {
          track:"image3",
          duration:5000,
          from:{
           // x:0,
            opacity:0},
          to:{x:600,opacity:1}
        },

        {
          track:"image2",
        duration:5000,
          from:{x:0,opacity:0},
          to:{x:0,opacity:0}
        },
        {
          track:"image1",
          duration:5000,
          from:{x:0,opacity:0},
          to:{x:0,opacity:0}
        }
      ]
    

     
     
   

     
   
       
    ],{
      loop: Infinity
    }).start(setStylers);


    

   

    

    
  }
}
