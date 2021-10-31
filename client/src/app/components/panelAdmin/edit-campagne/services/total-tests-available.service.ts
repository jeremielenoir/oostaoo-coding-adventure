import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class TotalTestsAvailableService {
  private totalTestsAvailableSubject = new BehaviorSubject<number>(0);
  total$ = this.totalTestsAvailableSubject.asObservable();
  
  constructor() { }

  public updateValue(value: number): void {
    this.totalTestsAvailableSubject.next(value);
  }
}
