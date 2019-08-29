import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-route-component',
  templateUrl: './route-component.component.html',
  styleUrls: ['./route-component.component.css']
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
  ngOnInit() {

  }

  public active_menu() {

    const totalLeft = document.getElementById('totalLeft');
    const btnArrow = document.getElementById('btn-arrow');

    totalLeft.classList.toggle('new-totalLeft');

    btnArrow.classList.toggle('fa-arrow-right');

    this.ContentViewDefault.emit(this.viewcontentDefaults = !this.viewcontentDefaults);
  }

  public Activet_isShow() {
    this.isShow = !this.isShow;
  }

}

@Component({
  selector: 'popup-mon-offre',
  templateUrl: './popup-mon-offre.html',
  styleUrls: ['./popup-mon-offre.css'],
})

export class PopupMonOffre {
  constructor(private bottomSheetRef: MatBottomSheetRef<PopupMonOffre>) { }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}