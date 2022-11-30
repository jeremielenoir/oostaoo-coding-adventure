import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-base-button',
  styleUrls: ['./base-button.component.scss'],
  templateUrl: './base-button.component.html',
})
export class BaseButton implements OnInit {
  @Input() public color = 'primary';
  @Input() public iconName = 'info';
  @Input() public iconPosition = 'right';
  @Input() public title = '';
  @Input() public disabled = false;
  @Input() public fullWidth = false;
  @Output() public clickEvent = new EventEmitter<any>();
  @Input() public hoverClass = 'hvr-grow';

  constructor() { }

  ngOnInit() { }

  click() {
    this.clickEvent.emit('click');
  }
}
