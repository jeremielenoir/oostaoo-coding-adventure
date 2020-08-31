import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-base-button',
    templateUrl: "./base-button.component.html",
    styleUrls: ["./base-button.component.scss"],
})
export class BaseButton implements OnInit {
    @Input() iconName: string = 'info';
    @Input() iconPosition: string = 'right';

    constructor() { }

    ngOnInit() { }
}
