import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating-feedback',
  templateUrl: './rating-feedback.component.html',
  styleUrls: ['./rating-feedback.component.scss']
})
export class RatingFeedbackComponent {
  @Output() ratingClick: EventEmitter<number> = new EventEmitter<number>();
  public rating = 0;

  public setRating(rating: number): void {
    this.rating = rating;
    this.ratingClick.emit(this.rating);
  }
}
