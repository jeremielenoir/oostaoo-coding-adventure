import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
  styles: [
    `
      .remove-index {
        z-index: 0;
        height: 0vh;
      }

      .add-index {
        z-index: 1000;
        height: 100vh;
      }
    `
  ]
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document) { }

  public shouldShow = true;
  @ViewChild("myLabel") lab;

  showOrHideManually() {
    this.shouldShow = !this.shouldShow;
    if (this.shouldShow) {
      this.lab.nativeElement.classList.add("remove-index");
      this.lab.nativeElement.classList.remove("add-index");
    } else {
      this.lab.nativeElement.classList.add("add-index");
      this.lab.nativeElement.classList.remove("remove-index");
    }
  }

  ngOnInit() { }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 100) {
      let element = document.getElementById("navbar");
      element.classList.add("style-nav-scroll");
    } else {
      let element = document.getElementById("navbar");
      element.classList.remove("style-nav-scroll");
    }
    if (window.pageYOffset < 100) {
      let element = document.getElementById("navbar");
      element.classList.add("style-nav-scroll2");
    } else {
      let element = document.getElementById("navbar");
      element.classList.remove("style-nav-scroll2");
    }
  }
}
