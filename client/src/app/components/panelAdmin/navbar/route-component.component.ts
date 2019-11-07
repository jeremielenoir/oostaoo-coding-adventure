import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";

@Component({
  selector: "app-route-component",
  templateUrl: "./route-component.component.html",
  styleUrls: ["./route-component.component.scss"]
})
export class RouteComponentComponent implements OnInit {
  isShowNavCompte = false;
  isShowNavTesting = false;
  isShow = false;
  isShow2 = false;
  public viewcontentDefaults: boolean;

  @Output() ContentViewDefault = new EventEmitter<any>();

  constructor(private bottomSheet: MatBottomSheet) { }
  openBottomSheet(): void {
    this.bottomSheet.open(PopupMonOffre);
  }
  ngOnInit() { }

  // public active_menu() {
  //   const totalLeft = document.getElementById("totalLeft");
  //   const btnArrow = document.getElementById("btn-arrow");

  //   // totalLeft.classList.toggle("new-totalLeft");

  //   btnArrow.classList.add("fa-arrow-left");
  //   btnArrow.classList.toggle("fa-arrow-right");

  //   this.ContentViewDefault.emit(
  //     (this.viewcontentDefaults = !this.viewcontentDefaults)
  //   );
  // }

  public Activet_isShow() {
    setTimeout(() => {
      this.isShow = !this.isShow;
    }, 1000);
  }
}

@Component({
  selector: "popup-mon-offre",
  templateUrl: "./popup-mon-offre.html",
  styleUrls: ["./popup-mon-offre.scss"]
})
export class PopupMonOffre {
  constructor(private bottomSheetRef: MatBottomSheetRef<PopupMonOffre>) { }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
