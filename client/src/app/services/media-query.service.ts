import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  private matches: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public match$: Observable<boolean>;

  constructor() {
    //this.match$ = this.matches.asObservable();
    /*if (window) {
      const mediaQueryList = window.matchMedia(this.query);
      const listener = (event: any) => this.matches.next(event.matches);
      listener(mediaQueryList);
      mediaQueryList.addEventListener('change', listener);
    }*/
  }
}
