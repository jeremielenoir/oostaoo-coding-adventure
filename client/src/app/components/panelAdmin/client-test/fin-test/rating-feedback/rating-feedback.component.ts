import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating-feedback',
  templateUrl: './rating-feedback.component.html',
  styleUrls: ['./rating-feedback.component.scss']
})
export class RatingFeedbackComponent implements OnInit {

  constructor() { }

  @Input() rating: number;
  @Output() ratingClick: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
   
  }
  onClick(rating: number): void {
    this.rating = rating;
    this.ratingClick.emit(
      this.rating
    );
  }

}
