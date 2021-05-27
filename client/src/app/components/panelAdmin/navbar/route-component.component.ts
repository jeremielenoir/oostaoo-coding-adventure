import { Component, OnInit, OnDestroy, Output, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_NOTIFICATIONS, API_URI_USER, API_URI_ACCOUNT } from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from '../../home/register/register.service';
import {SelectedLanguageService} from '../../../services/selected-language.service';

@Component({
  selector: 'app-route-component',
  templateUrl: './route-component.component.html',
  styleUrls: ['./route-component.component.scss']
})
export class RouteComponentComponent implements OnInit, OnDestroy {

  user: any;
  account: any;
  paymentCard: any;
  isProfesionalAccount = false;

  isShowNavCompte = false;
  isShowNavTesting = false;
  isShow = false;
  isShow2 = false;
  public offer_id: any;
  public viewcontentDefaults: boolean;
  public notifications = [];
  public notifUnread = 0;
  public activeMenuB = false;
  public currentLanguage;
  public stopTimeInterval: any;
  public lang = 'en';
  public otherLanguage = [
    {codelang: 'fr', shortlang: 'fr', img: '../../../../assets/drapeau/france-flag-round-icon-32.png', url: '/fr'},
    {codelang: 'en', shortlang: 'en', img: '../../../../assets/drapeau/united-kingdom-flag-round-icon-32.png', url: '/en'},
    {codelang: 'es', shortlang: 'es', img: '../../../../assets/drapeau/spain-flag-round-icon-32.png', url: '/es'},
    {codelang: 'jp', shortlang: 'jp', img: '../../../../assets/drapeau/japan-flag-round-icon-32.png', url: '/jp'}
   ];

  @Output() ContentViewDefault = new EventEmitter<any>();

  constructor( public dialog: MatDialog, public apiClientService: ApiClientService,
    public route: Router, @Inject(LOCALE_ID) private locale: string, private router: Router,
    public decryptTokenService: DecryptTokenService, public selectedLanguageService: SelectedLanguageService ) {}

  ngOnDestroy(): void {
    clearInterval(this.stopTimeInterval);
    console.log('DESTROY');
    //throw new Error("Method not implemented.");
  }
  ngOnInit() {
    this.lang = this.locale;
    if (this.selectedLanguageService.checkLanguageCountry()) {
      this.lang = this.selectedLanguageService.getLanguageCountry();
    }

    this.otherLanguage.forEach( element => {
      if ( element.codelang === this.lang || element.shortlang === this.lang) {
        this.currentLanguage = element.img;
      }
    });

    this.apiClientService
      .get(API_URI_USER + '/' + this.decryptTokenService.userId)
      .subscribe(user => {
        this.user = user;
        this.account = user.customeraccount;
        if (user.customeraccount) {
          this.isProfesionalAccount = user.customeraccount.type === 'profesional';
        }
        this.offer_id = user.offer_id.id;
        switch (this.offer_id) {
          case 14:
            this.offer_id = 'Gratuit';
            break;
          case 15:
            this.offer_id = '1 TEST';
            break;
          case 16:
            this.offer_id = '50 TESTS';
            break;
          case 17:
            this.offer_id = '100 TESTS';
            break;
          case 18:
            this.offer_id = 'ENTREPRISE';
            break;
          case 19:
            this.offer_id = 'ENTREPRISE++';
            break;
          default:
            this.offer_id = 'Gratuit';
        }
      }, (err) => {
        console.error(err);
      });

    this.menuBurgeurDropdown();

    const textMenu = document.querySelectorAll('.text-menu');

    textMenu.forEach(element => {
      element.addEventListener('click', function(e) {
        e.preventDefault();
      });
    });
    
    this.getNotifications().then(notifications => {
      this.notifications = [];
      notifications.forEach(element => {
        if (
          element.user.adminId === this.decryptTokenService.userId &&
          element.status === false
        ) {
          this.notifications.push(element);
        }
      });
      this.notifications.reverse();
      this.notifications.sort((a, b) => a.status - b.status);
      // console.log(this.notifications);
      this.initNotifNotRead(this.notifications);
    });

    this.stopTimeInterval = setInterval(() => this.getNotifications().then(notifications => {
       this.notifications = [];
       notifications.forEach(element => {
         if (element.user.adminId === this.decryptTokenService.userId) {
           this.notifications.push(element);
         }
       });
       this.notifications.reverse();
       this.notifications.sort((a, b) => a.status - b.status);
       // console.log(this.notifications);
       this.initNotifNotRead(this.notifications);
     }), 15000);
  }

  getCurrentRoute() {
    return this.router.url;
  }

  /**
   *
   * @param langage
   */
  setCurrentLanguage(langage) {
    this.selectedLanguageService.updtateLanguageCountry(langage);
    this.currentLanguage = langage.img;
    // window.parent.location.href = window.parent.location.origin + langage.url + window.parent.location.pathname;
    window.parent.location.href = langage.url + this.getCurrentRoute();
    // window.location.reload();
    console.log('window.parent.location : ', window.parent.location.origin + langage.url + window.parent.location.pathname);
    console.log('window.parent.location.href : ', langage.url + this.getCurrentRoute());
  }

  public disConnection(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DistConnecTed, {});
  }

  initNotifNotRead(array) {
    this.notifUnread = 0;
    array.forEach(element => {
      if (!element.status) {
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

  deleteNotification(notificationID) {
    const deleteUrl = API_URI_NOTIFICATIONS + '/' + notificationID;
    // alert(API_URI_NOTIFICATIONS+'/'+notificationID);
    this.apiClientService
      .delete(deleteUrl)
      .toPromise()
      .then(_ => {
        this.notifications = this.notifications.filter(
          notification => notification.id !== notificationID
        );
        this.initNotifNotRead(this.notifications);
      })
      .catch(error => {
        console.log(error);
      });
  }

  navigateTo(idCampaign, idNotif, value) {
    const updateUrl = API_URI_NOTIFICATIONS + '/' + idNotif;
    if (!value) {
      this.apiClientService
        .put(updateUrl, {
          status: !value
        })
        .toPromise()
        .then(_ => {
          this.notifications = this.notifications.filter(notification => {
            notification.id == idNotif ? (notification.status = !value) : value;
            return notification;
          });
          this.initNotifNotRead(this.notifications);
          this.route.navigate([
            '/dashboard/campaigns/' + idCampaign + '/candidats'
          ]);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.route.navigate([
        '/dashboard/campaigns/' + idCampaign + '/candidats'
      ]);
    }
  }

  // public active_menu() {
  //   const totalLeft = document.getElementById('totalLeft');
  //   const btnArrow = document.getElementById('btn-arrow');

  //   // totalLeft.classList.toggle('new-totalLeft');

  //   btnArrow.classList.add('fa-arrow-left');
  //   btnArrow.classList.toggle('fa-arrow-right');

  //   this.ContentViewDefault.emit(
  //     (this.viewcontentDefaults = !this.viewcontentDefaults)
  //   );
  // }

  public Activet_isShow() {
    this.isShow = !this.isShow;
  }

  public activeMenuBurgeur() {
    this.activeMenuB = !this.activeMenuB;
  }

  menuBurgeurDropdown() {
    const list = document.querySelectorAll('.list-menu li');
    list.forEach(element => {});
  }
}

@Component({
  selector: 'distConnected',
  templateUrl: 'distConnected.html'
})
export class DistConnecTed {
  constructor(
    public dialogRef: MatDialogRef<DistConnecTed>,
    public route: Router
  ) {}

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
//   selector: 'popup-mon-offre',
//   templateUrl: './popup-mon-offre.html',
//   styleUrls: ['./popup-mon-offre.scss']
// })
// export class PopupMonOffre {
//   constructor(private bottomSheetRef: MatBottomSheetRef<PopupMonOffre>) { }

//   openLink(event: MouseEvent): void {
//     this.bottomSheetRef.dismiss();
//     event.preventDefault();
//   }
// }
