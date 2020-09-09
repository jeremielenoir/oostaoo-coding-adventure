import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-base-button",
    styleUrls: ["./base-button.component.scss"],
    templateUrl: "./base-button.component.html",
})
export class BaseButton implements OnInit {
    @Input() public color: string = "primary";
    @Input() public iconName: string = "info";
    @Input() public iconPosition: string = "right";
    @Input() public title: string = "";
    @Input() public disabled: boolean = false;
    @Input() public fullWidth: boolean = false;
    @Output() public clickEvent = new EventEmitter<null>();
    @Input() public hoverClass = "hvr-grow";

    constructor() { }

    ngOnInit() { }

    click() {
        this.clickEvent.emit(null);
    }
}
