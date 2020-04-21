import { Directive, Renderer, ElementRef, HostListener, Input, Output, Inject, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {Observable, fromEvent, interval} from 'rxjs';
import { throttle } from 'rxjs/operators';

@Directive({
    selector: '[scrollPoint]'
   })
   export class ScrollPointDirective {
      @Input() scrollPoint: string;
      @Output() currentSection = new EventEmitter<String>();
      isInViewport: Observable<Event>;
      offset = 100;
      constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private el: ElementRef
      ) { 
        this.isInViewport= fromEvent(window, 'scroll')
          .pipe(throttle(val => interval(250)));

        this.isInViewport.subscribe((ev) => {
          const {x, y, height} = el.nativeElement.getBoundingClientRect();
          
          if(window.scrollY > el.nativeElement.offsetTop - this.offset && window.scrollY < el.nativeElement.offsetTop + (height- this.offset)){
            //console.log('WORKS', el.nativeElement);
            this.currentSection.emit(this.scrollPoint);
          }
          

        });
          
    }

    ngOnDestroy() {
      console.log('ON DESTROY');
    }


    
    }