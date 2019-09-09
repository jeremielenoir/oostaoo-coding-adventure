import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fin-test',
  templateUrl: './fin-test.component.html',
  styleUrls: ['./fin-test.component.css']
})
export class FinTestComponent implements OnInit {
  public myStars = [1, 2, 3, 4, 5];
  isSelected: boolean;
  constructor() { }

  ngOnInit() {
  }

}
