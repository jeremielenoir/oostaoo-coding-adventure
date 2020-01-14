import { Component, OnInit, Output, Input, EventEmitter, Inject, ViewChild } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_NOTIFICATIONS } from 'src/app/api-client/api-client.service';


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
  public notifications =  [];
  @Output() ContentViewDefault = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private bottomSheet: MatBottomSheet, public apiClientService: ApiClientService) { }
  // openBottomSheet(): void {
  //   this.bottomSheet.open(PopupMonOffre);
  // }
  ngOnInit() {

    let textMenu = document.querySelectorAll('.text-menu');

    textMenu.forEach(element => {

      element.addEventListener('click', function (e) {

        e.preventDefault();

      })

    })

    this.getNotifications().then(notifications => {
      this.notifications = notifications;
    });
  }

  public disConnection(event) {

    event.preventDefault();

    console.log('Hello WORD !!!');

    const dialogRef = this.dialog.open(DistConnecTed, {

    })

  }

  async getNotifications(): Promise<any> {
    try {
      return await this.apiClientService.get(API_URI_NOTIFICATIONS).toPromise();
    } catch (err) {
      return err;
    }
  }

  deleteNotification(notificationID){
    const deleteUrl = API_URI_NOTIFICATIONS+"/"+notificationID;
    //alert(API_URI_NOTIFICATIONS+"/"+notificationID);
    this.apiClientService.delete(deleteUrl).toPromise().then(_=>{
      this.notifications = this.notifications.filter(notification => notification.id !== notificationID);
    }).catch(error=>{
      alert(error);
    });
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
