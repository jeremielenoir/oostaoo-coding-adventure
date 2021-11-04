import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'use-media',
  templateUrl: './media-query.component.html',
  styleUrls: ['./media-query.component.css']
})
export class MediaQueryComponent implements OnInit, OnDestroy {
  @Input() query: string;
  private subscription: Subscription = new Subscription();
  public show: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.subscription = this.breakpointObserver
      .observe([this.query])
      .subscribe((state: BreakpointState) => this.show = state.matches);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
