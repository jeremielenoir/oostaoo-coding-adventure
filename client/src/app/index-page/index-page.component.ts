import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "app-index-page",
  templateUrl: "./index-page.component.html",
  styleUrls: ["./index-page.component.css"],
  animations: [
    trigger("move", [
      state("in", style({ top: 50 })),
      state("out", style({ top: 90 })),
      transition("in => out", animate("1s linear")),
      transition("out => in", animate("1s linear"))
    ])
  ]
})

/** Error when invalid control is dirty, touched, or submitted. */
export class IndexPageComponent implements OnInit {
  title = "materialApp";
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  state = "in";
  ngAfterViewInit() {
    setTimeout(() => {
      this.state = "out";
    }, 0);
  }
  onEnd(event) {
    this.state = "in";
    if (event.toState === "in") {
      setTimeout(() => {
        this.state = "out";
      }, 0);
    }
  }
  constructor() {}

  ngOnInit() {}
}
