import { Directive, Renderer2, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNavMobileAbsolute]'
})
export class NavMobileAbsoluteDirective {

  @Input('appNavMobileAbsolute') testclass: string;


  constructor(private _el: ElementRef, private _renderer: Renderer2) {
  }


  @HostListener('mouseenter') onMouseEnter() {
    this._renderer.addClass(this._el.nativeElement, this.testclass);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this._renderer.removeClass(this._el.nativeElement, this.testclass);
  }

}
