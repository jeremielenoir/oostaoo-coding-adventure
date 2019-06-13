import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-route-component',
  templateUrl: './route-component.component.html',
  styleUrls: ['./route-component.component.css']
})
export class RouteComponentComponent implements OnInit {
  isShow = false;
  isShowNavCompte = false;
  isShowNavTesting = false;
  isShow2 = false;

  constructor(private bottomSheet: MatBottomSheet) { }
  openBottomSheet(): void {
    this.bottomSheet.open(PopupMonOffre);
  }
  ngOnInit() {
  }

  public active_menu(){

    let totalLeft = document.getElementById('totalLeft');
    let btn_arrow = document.getElementById('btn-arrow');

    totalLeft.classList.toggle('new-totalLeft')

    btn_arrow.classList.toggle('fa-arrow-right')
 
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