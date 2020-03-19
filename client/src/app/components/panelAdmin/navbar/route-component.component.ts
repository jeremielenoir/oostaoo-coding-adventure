import { Component, OnInit, Output, Input, EventEmitter, Inject, ViewChild } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_NOTIFICATIONS, API_URI_USER } from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from '../../home/register/register.service';



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
  public offer_id: any;
  public viewcontentDefaults: boolean;
  public notifications =  [];
  public notifUnread = 0;
  public activeMenuB:boolean = false;


  @Output() ContentViewDefault = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private bottomSheet: MatBottomSheet,
    public apiClientService: ApiClientService,public route: Router,
    public decryptTokenService: DecryptTokenService) { }
  // openBottomSheet(): void {
  //   this.bottomSheet.open(PopupMonOffre);
  // }



  ngOnInit() {

    this.apiClientService.get(API_URI_USER + '/' + this.decryptTokenService.userId)
    .subscribe(user => {
      this.offer_id = user.offer_id.id;
      switch(this.offer_id){
        case 14 :
        this.offer_id = 'Gratuit';
        break;
        case 15 :
        this.offer_id = '1 TEST';
        break;
        case 16 :
        this.offer_id = '50 TESTS';
        break;
        case 17 :
        this.offer_id = '100 TESTS';
        break;
        case 18 :
        this.offer_id = 'ENTREPRISE';
        break;
        case 19 :
        this.offer_id = 'ENTREPRISE++';
        break;
        default:
        this.offer_id = 'Gratuit';
      }
    });



    let textMenu = document.querySelectorAll('.text-menu');

    textMenu.forEach(element => {

      element.addEventListener('click', function (e) {

        e.preventDefault();

      });

    });
    this.getNotifications().then(notifications => {
      this.notifications = [];
      notifications.forEach(element => {
        if (element.user.adminId === this.decryptTokenService.userId && element.status === false) {
          this.notifications.push(element);
        }
      });
      this.notifications.reverse();
      this.notifications.sort((a, b) => a.status - b.status);
      // console.log(this.notifications);
      this.initNotifNotRead(this.notifications);
      console.log("les notif", this.notifications);
    });

    // setInterval(() => this.getNotifications().then(notifications => {
    //   this.notifications = [];
    //   notifications.forEach(element => {
    //     if (element.user.adminId === this.decryptTokenService.userId) {
    //       this.notifications.push(element);
    //     }
    //   });
    //   this.notifications.reverse();
    //   this.notifications.sort((a, b) => a.status - b.status);
    //   // console.log(this.notifications);
    //   this.initNotifNotRead(this.notifications);
    // }), 5000);

  }

  public disConnection(event) {

    event.preventDefault();

    console.log('Hello WORD !!!');

    const dialogRef = this.dialog.open(DistConnecTed, {

    })

  }

  initNotifNotRead(array){
    this.notifUnread = 0;
    array.forEach(element => {
      if(!element.status){
        this.notifUnread += 1;
      }
    });
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
      this.initNotifNotRead(this.notifications);
    }).catch(error=>{
      alert(error);
    });
  }

  navigateTo(idCampaign, idNotif, value){
    const updateUrl = API_URI_NOTIFICATIONS+"/"+idNotif;
    if(!value){
      this.apiClientService.put(updateUrl, {
        status: !value
      }).toPromise().then( _=>{
        this.notifications = this.notifications.filter(notification =>  {
          notification.id == idNotif ? notification.status = !value : value
          return notification;
        });
        this.initNotifNotRead(this.notifications);
        this.route.navigate(["/dashboard/campaigns/"+idCampaign+"/candidats"]);
      }).catch(err=>{
        console.log(err);
      });
    }else{
      this.route.navigate(["/dashboard/campaigns/"+idCampaign+"/candidats"]);
    }
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

  public activeMenuBurgeur(){
   
    this.activeMenuB = !this.activeMenuB; 
    console.log('hellow')
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
