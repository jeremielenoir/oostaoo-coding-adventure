import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective implements OnInit {
  @Input() appActive: boolean;
  ngOnInit() {
    // console.log('appActive  : ', this.appActive);
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    if (!this.appActive) {
    e.preventDefault();
    }
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    if (!this.appActive) {
    e.preventDefault();
    }
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    if (!this.appActive) {
    e.preventDefault();
    }
  }
}
