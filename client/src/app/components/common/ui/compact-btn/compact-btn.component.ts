import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'compact-btn',
  templateUrl: './compact-btn.component.html',
  styleUrls: ['./compact-btn.component.scss']
})
export class CompactBtnComponent implements OnInit {
  @Input() public color: string = "primary";
  @Input() public iconName: string = "info";
  @Input() public disabled: boolean = false;
  @Output() public clickEvent = new EventEmitter<any>();
  @Input() public hoverClass = "hvr-grow";

  constructor() { }

  ngOnInit() {
  }

  click() {
    this.clickEvent.emit("click");
  }
}
