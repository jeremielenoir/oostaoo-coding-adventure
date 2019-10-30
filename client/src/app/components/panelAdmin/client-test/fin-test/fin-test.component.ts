import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fin-test',
  templateUrl: './fin-test.component.html',
  styleUrls: ['./fin-test.component.scss']
})
export class FinTestComponent implements OnInit {
  public myStars = ['Très mauvaise', 'Mauvaise', 'Moyenne', 'Bonne', 'Très bonne'];
  isSelected: boolean;
  index: number;
  constructor() { }

  ngOnInit() {
  }

  checkStarSelected(index) {
    this.index = index + 1;
    console.log('this.index: ', this.index);
  }

}
