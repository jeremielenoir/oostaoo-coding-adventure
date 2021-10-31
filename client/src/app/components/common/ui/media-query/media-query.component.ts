import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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

  ngOnInit(): void {
    /*this.mediaService = new MediaQueryService(this.query);
    this.subscription = this.mediaService.match$.subscribe(value => this.show = value);*/
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
