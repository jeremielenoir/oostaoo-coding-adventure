import { Component, OnInit, Output, Input, EventEmitter, Inject } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router'


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

  @Input('') notifications = [];
  @Output() ContentViewDefault = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private bottomSheet: MatBottomSheet) { }
  // openBottomSheet(): void {
  //   this.bottomSheet.open(PopupMonOffre);
  // }
  ngOnInit() {

    console.log(this.notifications);
    let textMenu = document.querySelectorAll('.text-menu');

    textMenu.forEach(element => {

      element.addEventListener('click', function (e) {

        e.preventDefault();

      })

    })

  }

  public disConnection(event) {

    event.preventDefault();

    console.log('Hello WORD !!!');

    const dialogRef = this.dialog.open(DistConnecTed, {

    })

  }




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

    this.isShow = !this.isShow;

  }
}


@Component({
  selector: 'distConnected',
  templateUrl: 'distConnected.html',
})
export class DistConnecTed {

  constructor(
    public dialogRef: MatDialogRef<DistConnecTed>,
    public route: Router,
  ) { }

  hideDialog(): void {
    this.dialogRef.close();
  }

  public confirmDisConnection() {

    localStorage.removeItem('currentUser');

    this.dialogRef.close();
    this.route.navigate(['/home/register']);


  }

}

// @Component({
//   selector: "popup-mon-offre",
//   templateUrl: "./popup-mon-offre.html",
//   styleUrls: ["./popup-mon-offre.scss"]
// })
// export class PopupMonOffre {
//   constructor(private bottomSheetRef: MatBottomSheetRef<PopupMonOffre>) { }

//   openLink(event: MouseEvent): void {
//     this.bottomSheetRef.dismiss();
//     event.preventDefault();
//   }
// }
